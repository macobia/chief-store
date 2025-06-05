![Vercel](https://img.shields.io/badge/Hosted%20on-Vercel-black?logo=vercel)
![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)
![Node.js](https://img.shields.io/badge/Backend-Node.js-green)
![React](https://img.shields.io/badge/Frontend-React-blue)

# 💼 Chief-store

A modern full-stack e-commerce application built with **React.js** (frontend) and **Node.js + Express.js** (backend). Chief-store delivers a seamless shopping experience featuring dynamic product listings, powerful search & & filtering, secure **Flutterwave** payment, real-time admin notifications, and a robust admin dashboard for full control.

## 🚀 Live Demo

[https://chief-store.vercel.app/](https://chief-store.vercel.app/)

---

## 🖼️ Preview

### 🏠 Home Page

### 👒 Products Page

### 🛠️ Admin Dashboard
![Home](https://res.cloudinary.com/dxrykhupk/image/upload/v1748768703/screenshot_3_dtkb9f.jpg)

![Shop](https://res.cloudinary.com/dxrykhupk/image/upload/v1748768703/screenshot_11_pp1jne.jpg)

![Admin](https://res.cloudinary.com/dxrykhupk/image/upload/v1748768703/screenshot_12_g7azwy.jpg)
---

## 🪰 Features

* 🔐 Secure JWT Authentication (Access & Refresh Tokens)
* 📦 Product Management (Create, Edit, Delete)
* 👞 Product Filtering & Sorting
* 👚 Shopping Cart & Checkout Flow
* 🎟️ Coupon Discount Integration
* 💳 Flutterwave Payment Integration
* 📤 Cloudinary for Image Uploads
* 📬 Nodemailer for Email Notifications
* 📊 Admin Dashboard with Analytics & Product Control
* 🔔 Real-time Admin Notifications (with Redis Pub/Sub)

---

## 🗂️ Project Structure

```
chief-store/
│
├── client/        # React frontend
├── server/        # Express backend
├── README.md
└── .env           # Environment variables
```

---

## ⚙️ Tech Stack

**Frontend**

* React.js (Vite)
* Zustand (state management)
* Axios
* Tailwind CSS

**Backend**

* Node.js
* Express.js
* MongoDB (with Mongoose)
* Redis (Uptash)
* Cloudinary
* Nodemailer
* Flutterwave

---

## 🔧 Installation

### 1. Clone the repository

```bash
git clone https://github.com/macobia/chief-store.git
cd chief-store
```

---

### 2. Setup Environment Variables

#### 📁 `.env` in `server/`

```env
PORT=5000
MONGO_URL=your_mongo_connection_string

JWT_SECRET_ACCESS_TOKEN=your_access_token_secret
JWT_SECRET_REFRESH_TOKEN=your_refresh_token_secret

UPTASH_REDIS_URL=redis://username:password@host:port

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

FLW_PUBLIC_KEY=your_flutterwave_public_key
FLW_SECRET_KEY=your_flutterwave_secret_key
FLW_ENCRYPTION_KEY=your_flutterwave_encryption_key

CLIENT_URL=http://localhost:5173

GOOGLE_CLIENT_ID=your_GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET=your_GOOGLE_CLIENT_SECRET
GOOGLE_CALLBACK_URL=your_GOOGLE_CALLBACK_URL

RECAPTCHA_SECRET_KEY=your_RECAPTCHA_SECRET_KEY

SESSION_SECRET=your_SESSION_SECRET

MAIL_USER=your_email@example.com
MAIL_PASS=your_email_password

NODE_ENV=development
```

#### 📁 `.env` in `client/`

```env
VITE_API_URL=http://localhost:5000/api
VITE_RECAPTCHA_SITE_KEY=your_RECAPTCHA_SITE_KEY
```

---

### 3. Install Dependencies

#### 🖥️ Backend

```bash
cd backend
npm install
```

#### 🌐 Frontend

```bash
cd ../frontend
npm install
```

---

### 4. Run the App

#### 🔙 Start Backend

```bash
npm run dev
```

#### 🖼️ Start Frontend

```bash
cd ../frontend
npm run dev
```

---

## ✅ Scripts

### Frontend

```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run preview    # Preview production build
```

### Backend

```bash
npm run dev        # Start dev server using nodemon
```

---

## ✨ Upcoming Features

* 📦 Inventory Stock Management
* 🧲 Order History Page for Users
* 📊 Detailed Analytics Dashboard for Admins
* 🛠️ Role-Based Access Control

---

## 🤝 Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

---

## 📄 License

This project is licensed under the MIT License.
See the [LICENSE](LICENSE) file for details.

---

## 🔗 Connect

Built with ❤️ by [Macben Obiakor](https://www.linkedin.com/in/macben-obiakor-787b44331)
