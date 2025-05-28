
import Order from '../models/order.model.js';
import { io } from '../server.js';

// To get all orders
export const getAllOrders = async (req, res) => {
  try {
  
    const orders = await Order.find()
      .populate("user", "email name")
      .populate("products.product", "name price")
      .sort({ createdAt: -1 });
   


    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// To get order status
export const getOrderStatus = async (req, res) => {
  const { orderId } = req.params;


  try {
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    return res.status(200).json({ status:  order.orderStatus});
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

//  To create order 



// To update order status
export const updateOrderStatus = async (req, res) => {
    const { orderStatus} = req.body; // expected: 'success' or 'decline'
    const { orderId } = req.params;

    if (!["success", "decline"].includes(orderStatus)) {
        return res.status(400).json({ message: "Invalid status" });
    }

    try {
        const updatedOrder = await Order.findByIdAndUpdate(
            orderId,
            { orderStatus },
            { new: true }
        );


         // Emit to admin when new order is placed
         io.emit("new_order", updatedOrder);
        res.json(updatedOrder);
    } catch (error) {
      console.error("Error updating order status:", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

