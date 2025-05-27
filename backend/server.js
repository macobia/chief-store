
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { createServer } from "http";
import { Server } from "socket.io";
// import path from "path";
// import fs from 'fs';


import authRoutes from "./routes/auth.route.js";
import productRoutes from "./routes/product.route.js";
import cartRoutes from "./routes/cart.route.js";
import couponRoutes from "./routes/coupon.route.js";
import paymentRoutes from "./routes/payment.route.js";
import analyticsRoutes from "./routes/analytics.route.js"
import orderRoutes from "./routes/order.routes.js";
import cors from "cors";

import { connectDB } from "./lib/db.js";

dotenv.config();

const app = express();

app.use(express.json({ limit: '50mb' }));  // allows you to parse the body of the request
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173', // frontend URL
    credentials: true 
  }));


const port = process.env.PORT || 3000



// app.use(express.urlencoded({ extended: true })); //used during api testing instead of json 
app.use(express.json());
app.use(cookieParser());



app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/coupons", couponRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/analytics", analyticsRoutes);


// const __dirname = path.resolve();


//use this method if you want to deploy the backend and frontend in one server making the frontend to be a static website, you will have to move env and package.json, node_modules and package-lock.json to the main repo and use this as your build command npm ci && npm ci --prefix frontend && npm run build --prefix frontend and this as your start command node backend/server.js
// if (process.env.NODE_ENV === "production") {
// app.use(express.static(path.join(__dirname, "/frontend/dist")));

// 	app.get("*", (req, res) => {
// 		res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
//     console.log("Index.html exists?", fs.existsSync(indexPath));
// 	});

// }

// Initialize HTTP server with the Express app
const server = createServer(app);


// Initialize Socket.io
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  }
});

app.set('io', io);

// Event listener to handle new socket connections
io.on("connection", (socket) => {
  console.log("⚡ Admin connected via socket:", socket.id);

  // Event listener to handle disconnection
  socket.on("disconnect", () => {
    console.log("Socket disconnected");
  });
});

// Export io to use elsewhere if needed
export { io };

// Start the server
server.listen(port, () => {
  console.log("🚀 Server is running on http://localhost:" + port);
  connectDB();
});

