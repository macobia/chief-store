

import Product from '../models/product.model.js';

export const getCartProducts = async (req, res) => {
    try {
        const productIds = req.user.cartItems.map(item => item.product);
        const products = await Product.find({ _id: { $in: productIds } });

        const cartItems = products.map(product => {
            const item = req.user.cartItems.find(
                i => i.product.toString() === product._id.toString()
            );
            return { ...product.toJSON(), quantity: item.quantity };
        });

        res.json(cartItems);
    } catch (error) {
        console.log("Error getCartProducts controller", error.message);
        res.status(500).json({ error: { message: "Server error", error: error.message } });
    }
};

export const addToCart = async (req, res) => {
    try {
        const { productId } = req.body;
        const user = req.user;

        if (!user.cartItems) user.cartItems = [];

        const existingItem = user.cartItems.find(
            item => item.product.toString() === productId
        );

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            user.cartItems.push({ product: productId, quantity: 1 });
        }

        await user.save();
        res.json(user.cartItems);
    } catch (error) {
        console.log("Error adding to cart", error.message);
        res.status(500).json({ error: { message: "Server error", error: error.message } });
    }
};

export const removeAllFromCart = async (req, res) => {
    try {
        const { productId } = req.body;
        const user = req.user;

        if (!productId) {
            user.cartItems = [];
        } else {
            user.cartItems = user.cartItems.filter(
                item => item.product.toString() !== productId
            );
        }

        await user.save();
        res.json(user.cartItems);
    } catch (error) {
        console.log("Error removing from cart", error.message);
        res.status(500).json({ error: { message: "Server error", error: error.message } });
    }
};

export const updateQuantity = async (req, res) => {
    try {
        const { id: productId } = req.params;
        const { quantity } = req.body;
        const user = req.user;

        const existingItem = user.cartItems.find(
            item => item.product.toString() === productId
        );

        if (existingItem) {
            if (quantity === 0) {
                user.cartItems = user.cartItems.filter(
                    item => item.product.toString() !== productId
                );
            } else {
                existingItem.quantity = quantity;
            }

            await user.save();
            res.json(user.cartItems);
        } else {
            res.status(404).json({ error: { message: "Product not found in cart" } });
        }
    } catch (error) {
        console.log("Error updating cart quantity", error.message);
        res.status(500).json({ error: { message: "Server error", error: error.message } });
    }
};


