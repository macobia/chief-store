import User from "../models/user.model.js";
import Order from "../models/order.model.js";
import mongoose from "mongoose";
import cloudinary from "../lib/cloudinary.js";

// 1. Get All Users Info with Monthly and Net Stats
export const getAllUsersWithStats = async (req, res) => {

 
  try {
     if (req.user.role !== "admin" && req.user.role !== "superAdmin") {
    return res.status(403).json({ message: "Access denied" });
  }

    const users = await User.find().select("name email role dob");

    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

 const results = await Promise.all(users.map(async (user) => {
  const [monthlyOrders] = await Order.aggregate([
    { $match: { user: user._id, createdAt: { $gte: firstDayOfMonth }, orderStatus: "success" }},
    { $unwind: "$products" },
    { $group: {
      _id: null,
      totalSpent: { $sum: "$products.price" },
      totalProducts: { $sum: "$products.quantity" },
    }},
  ]);

  const [netOrders] = await Order.aggregate([
    { $match: { user: user._id, orderStatus: "success" }},
    { $unwind: "$products" },
    { $group: {
      _id: null,
      totalSpent: { $sum: "$products.price" },
      totalProducts: { $sum: "$products.quantity" },
    }},
  ]);

  //  Calculate age
  const calculateAge = (dob) => {
    if (!dob) return null;
    const diff = Date.now() - new Date(dob).getTime();
    const ageDt = new Date(diff);
    return Math.abs(ageDt.getUTCFullYear() - 1970);
  };

  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    age: calculateAge(user.dob),
    monthlyStats: monthlyOrders || { totalSpent: 0, totalProducts: 0 },
    netStats: netOrders || { totalSpent: 0, totalProducts: 0 },
  };
  }));

    res.status(200).json(results);
  } catch (err) {
    console.error("Error fetching user stats:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// 2. Delete User

export const deleteUser = async (req, res) => {
  const { userId } = req.params;

  if (req.user.role !== 'superAdmin') {
    return res.status(403).json({error:{ message: "Access denied. Super Admin only." }});
  }

  if (req.user.id === userId) {
    return res.status(400).json({error:{ message: "You cannot delete your own account." }});
  }

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({error:{ message: "Invalid user ID" }});
  }

  try {
    const user = await User.findById(userId);

    if (!user) return res.status(404).json({ message: "User not found" });

    // Delete user's Cloudinary image if it exists
    if (user.image) {
      const publicId = user.image.split("/").pop().split(".")[0];
      try {
        await cloudinary.uploader.destroy(`user_profiles/${publicId}`);
        console.log("Deleted user image from Cloudinary");
      } catch (error) {
        console.log("Error deleting image from Cloudinary:", error);
      }
    }

    // Delete user from DB
    await User.findByIdAndDelete(userId);

    res.status(200).json({ message: `User ${user.email} deleted successfully.` });
  } catch (err) {
    console.error("Error deleting user:", err);
    res.status(500).json({error:{ message: "Server error" }});
  }
};

// 3. Change User Role (Admin or Customer)
export const changeUserRole = async (req, res) => {
  const { userId } = req.params;
  const { role } = req.body;

  if ( req.user.role !== "superAdmin")  {
    return res.status(403).json({error:{message: "Access denied. Super Admin only." }});
  }

  if (req.user.id === userId) {
      return res.status(400).json({error:{ message: "You cannot change your own role." }});
  }

  if (!["admin", "customer"].includes(role)) {
    return res.status(400).json({error:{ message: "Invalid role provided" }});
  }

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({error:{ message: "Invalid user ID" }});
  }

  try {
    const user = await User.findByIdAndUpdate(userId, { role }, { new: true });

    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ message: `User role updated to ${role}`, user });
  } catch (err) {
    console.error("Error updating role:", err);
    res.status(500).json({error:{ message: "Server error" }});
  }
};

// 4. Order Tracking for a User
export const trackUserOrders = async (req, res) => {
  const userId = req.user.id; //  Use the authenticated user's ID

  try {
    const orders = await Order.find({ user: userId })
      .sort({ createdAt: -1 })
      .populate("products.product", "name")
      .select("flutterwaveSessionId products orderStatus totalAmount createdAt");

    if (!orders.length) {
      return res.status(404).json({ message: "No orders found for this user" });
    }

    const orderSummary = orders.map(order => ({
      orderId: order._id,
      flutterwaveSessionId: order.flutterwaveSessionId,
      orderStatus: order.orderStatus,
      totalAmount: order.totalAmount,
      createdAt: order.createdAt,
      products: order.products.map(p => ({
        name: p.product?.name || "Unknown",
        quantity: p.quantity,
        price: p.price,
      })),
    }));

    res.status(200).json({ userId, orders: orderSummary });
  } catch (err) {
    console.error("Error fetching user orders:", err);
    res.status(500).json({ message: "Server error" });
  }
};


// 5. Get User Purchase History
export const getUserPurchaseHistory = async (req, res) => {
  const userId = req.user.id;

  try {
    const orders = await Order.find({ user: userId, orderStatus: "success" });

    if (!orders.length) {
      return res.status(404).json({ message: "No successful purchases found for this user" });
    }

    let totalProductsBought = 0;
    let totalAmountSpent = 0;
    let totalQuantity = 0;

    // For chart: group by month
    const monthlyMap = {};

    for (const order of orders) {
      const orderMonth = new Date(order.createdAt).toLocaleString("default", { month: "short" });

      //  Update total amount spent
      totalAmountSpent += order.totalAmount;

      if (!monthlyMap[orderMonth]) {
        monthlyMap[orderMonth] = {
          amountSpent: 0,
          totalQuantity: 0,
        };
      }

      monthlyMap[orderMonth].amountSpent += order.totalAmount;

      for (const item of order.products) {
        totalProductsBought += 1;
        totalQuantity += item.quantity;
        monthlyMap[orderMonth].totalQuantity += item.quantity;
      }
    }

    // Format for chart: sorted by month (optional)
    const monthOrder = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    const monthlyChartData = monthOrder
      .filter(month => monthlyMap[month])
      .map(month => ({
        month,
        ...monthlyMap[month],
      }));

    res.status(200).json({
      userId,
      totalProductsBought,
      totalQuantity,
      totalAmountSpent,
      monthlyChartData,
    });

  } catch (err) {
    console.error("Error calculating purchase history:", err);
    res.status(500).json({ message: "Server error" });
  }
};


// 6 user profile
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

// 7: UPDATE user profile
export const updateUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    let user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Prevent email update
    if (req.body.email && req.body.email !== user.email) {
      return res.status(400).json({ message: "Email cannot be changed" });
    }

    const {
      name,
      phone,
      sex,
      dob,
      billingAddress,
      image, // Receive Cloudinary image URL or base64 string
    } = req.body;

    // Update fields
    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (sex) user.sex = sex;
    if (dob) user.dob = dob;
    if (billingAddress) user.billingAddress = billingAddress;

    if (image) { 
      // Upload image to Cloudinary and set to user
      const cloudinaryResponse = await cloudinary.uploader.upload(image, {
        folder: "user_profiles",
      });
      user.image = cloudinaryResponse.secure_url;
    }

    await user.save();

    res.status(200).json({ message: "Profile updated successfully", user });
  } catch (error) {
    console.error("Profile update error:", error);
    res.status(500).json({ message: "Server error", error });
  }
};
