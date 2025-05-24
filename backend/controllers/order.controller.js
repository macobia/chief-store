import Order from "../models/order.model.js";
import Product from "../models/product.model.js";
import User from "../models/user.model.js";

export const getUserOrders = async (req, res) => {
	try {
		const { userId } = req.params;

		const orders = await Order.find({ userId })
			.populate("products.productId", "name price category") // populate product details
			.sort({ createdAt: -1 }); // recent orders first

		const response = orders.map((order) => ({
			orderId: order._id,
			userId: order.userId,
			totalAmount: order.totalAmount,
			date: order.createdAt,
			products: order.products.map((item) => ({
				name: item.productId.name,
				category: item.productId.category,
				price: item.price,
				quantity: item.quantity,
				subTotal: item.price * item.quantity,
			})),
		}));

		res.status(200).json(response);
	} catch (error) {
		console.error("Error fetching user orders:", error);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};
