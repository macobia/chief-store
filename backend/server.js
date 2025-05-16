
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import path from "path";
import fs from 'fs';


import authRoutes from "./routes/auth.route.js";
import productRoutes from "./routes/product.route.js";
import cartRoutes from "./routes/cart.route.js";
import couponRoutes from "./routes/coupon.route.js";
import paymentRoutes from "./routes/payment.route.js";
import analyticsRoutes from "./routes/analytics.route.js";
import cors from "cors";

import { connectDB } from "./lib/db.js";

dotenv.config();

const app = express();

app.use(express.json({ limit: '50mb' }));
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173', // frontend URL
    credentials: true 
  }));

const port = process.env.PORT || 3000



// app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

const __dirname = path.resolve();

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/coupons", couponRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/analytics", analyticsRoutes);

if (process.env.NODE_ENV === "production") {
app.use(express.static(path.join(__dirname, "/frontend/dist")));

	app.get("*", (req, res) => {
		res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
    console.log("Index.html exists?", fs.existsSync(indexPath));
	});

}

app.listen(port, () => {
    console.log("server is running on http://localhost:" + port);
    
    connectDB()
} )

