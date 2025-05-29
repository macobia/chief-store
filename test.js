//TODO: add test for payment in frontend flutterwave issues use this to resolve in the future

// . Create Payment Button
// components/CheckoutButton.jsx
// import axios from 'axios';

// export default function CheckoutButton({ user }) {
//     const handleCheckout = async () => {
//         const res = await axios.post('/api/payment/create-payment', {
//             amount: 5000,
//             email: user.email,
//             name: user.name,
//         });
//         window.location.href = res.data.link; // redirect to Flutterwave payment
//     };

//     return (
//         <button onClick={handleCheckout} className="btn btn-primary">
//             Pay ₦5000
//         </button>
//     );
// }


// Payment Status Page

// pages/PaymentStatus.jsx
// import { useEffect, useState } from 'react';
// import { useSearchParams } from 'react-router-dom';
// import axios from 'axios';

// export default function PaymentStatus() {
//     const [status, setStatus] = useState('loading');
//     const [searchParams] = useSearchParams();
//     const tx_ref = searchParams.get('tx_ref');

//     useEffect(() => {
//         const verifyPayment = async () => {
//             try {
//                 const res = await axios.post('/api/payment/verify-payment', { tx_ref });
//                 if (res.data.success) {
//                     setStatus('success');
//                 } else {
//                     setStatus('failed');
//                 }
//             } catch (err) {
//                 setStatus('error');
//             }
//         };
//         verifyPayment();
//     }, [tx_ref]);

//     if (status === 'loading') return <p>Verifying payment...</p>;
//     if (status === 'success') return <p>✅ Payment Successful!</p>;
//     if (status === 'failed') return <p>❌ Payment Failed or Cancelled.</p>;
//     return <p>⚠️ Error verifying payment.</p>;
// }


// function extractTransactionId(txRef) {
 
  //   const numbers = txRef.match(/\d+/g);
  //   return numbers ? Number(numbers.join("")) : null;
  //   // }
  // }
  
// import Coupon from "../models/coupon.model.js";
// import { flw } from "../lib/flutterwave.js";
// import Order from '../models/order.model.js';




// export const createCheckoutSession = async (req, res) => {
//     try {
//         const {products, couponCode} = req.body;
//         if (!Array.isArray(products) || products.length === 0) {
//             return res.status(400).json({error: "Invalid or empty products array"})
//         }
//         let totalAmount = 0;
//         const cartSummary = products.map((product) => {
//             const amount =  Math.round(product.price);
//             totalAmount += amount * (product.quantity || 1);

//             return {
//                 name: product.name,
//                 image: product.image,
//                 unit_amount: amount,
//                 quantity: product.quantity || 1,
//             };
//         });
//         let coupon = null;
//         if (couponCode){
//             coupon = await Coupon.findOne({code: couponCode, userId: req.user._id, isActive: true});
//             if (coupon) {
//                 totalAmount -= Math.round((totalAmount * coupon.discountPercentage) / 100)
//             }
//         }

//         const tx_ref = tx-${Date.now()}-${Math.floor(Math.random()* 10000)};
//        const  redirect_url =  ${process.env.CLIENT_URL}/purchase-success?session_id=${tx_ref}
        

//         //to create users response link on flutter wave
//         // const response = await flw.PaymentLinks.create()({
//         //     amount: totalAmount,
//         //     currency: "NGN", //This will depend on the currency you want to setup with like USD
//         //     tx_ref: tx_ref,
//         //     redirect_url: ${process.env.CLIENT_URL}/purchase-success?session_id=${tx_ref},
//         //     customer: {
//         //         email: req.user.email, 
//         //         name: req.user.name,
//         //     },
//         //     customizations: {
//         //         title: "Product Checkout",
//         //         description: "Purchase from Chief-Store",
//         //         logo: ${process.env.CLIENT_URL}/logo.png
//         //     },
//         //     meta: {
//         //         userId: req.user._id.toString(),
//         //         couponCode: couponCode || "",
//         //         products: JSON.stringify(
//         //             products.map((p) => ({
//         //                 id: p._id,
//         //                 quantity: p.quantity,
//         //                 price: p.price,
//         //             }))
//         //         ),

//         //     }
        
//         // })
//         if (totalAmount >= 2000) {
//             await createNewCoupon(req.user._id)
//         }
//         res.status(200).json({link: response.data.link, tx_ref, totalAmount: totalAmount, redirect_url, });
//     } catch (error) {
//         console.error("Error processing Checkout", error.message);
//         res.status(500).json({message: "Server Error while processing checkout", error: error.message})
//     }
// }

// export const checkOutSuccess = async (req, res) => {
//     try {
//         const {sessionId} = req.body;
//         const verifyResponse = await flw.Transaction.verify({id: sessionId});

//         if(verifyResponse.data.status === "success"){
//             // const meta = verifyResponse.data.meta;
//             const {meta} = verifyResponse.data;

//             if (meta && meta.couponCode) {
//                 await Coupon.findOneAndUpdate(
//                     {
//                         code: meta.couponCode,
//                         userId: meta.userId,
//                     },
//                     {
//                         isActive: false,
//                     }
//                 );
//             }
//             const products = JSON.parse(meta.products);

//             const newOrder = new Order({
//                 user: meta.userId,
//                 products: products.map((product) => ({
//                     product: product.id,
//                     quantity: product.quantity,
//                     price: product.price,
//                 })),
//                 totalAmount: verifyResponse.data.amount,   //Flutterwave amount is correct
//                 flutterwaveSessionId: sessionId,
//             });
//             await newOrder.save();

//             res.status(200).json({
//                 success: true,
//                 message: "Payment successful, order created, and coupon deactivated if used",
//                 orderId: newOrder._id,
//             });
//         }else {
//             res.status(400).json({message: "Payment not successful"})
//         }
//     } catch (error) {
//        console.log("Error processing successful checkout", error.message);
//        res.status(500).json({message: "Error processing successful checkout", error: error.message})
//     }
// };

// const createNewCoupon = async (userId) => {
//     await Coupon.findOneAndDelete({userId});

//     const newCoupon = new Coupon({
//         code: "GIFT" + Math.random().toString(36).substring(2, 8).toUpperCase(),
//         discountPercentage: 10,
//         expirationDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // expires in 30 days
//         userId: userId,
//     });

//     await newCoupon.save();

//     return newCoupon;
// }  

// const upload = multer({ 
//     dest: 'uploads/',
//     limits: { fileSize: 10 * 1024 * 1024 }, // max 10MB
//     fileFilter: (req, file, cb) => {
//       const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
//       if (allowedTypes.includes(file.mimetype)) {
//         cb(null, true);
//       } else {
//         cb(new Error("Only JPEG, JPG and PNG are allowed"));
//       }
//     }
//   });
  
//setup multer
// const cloudinaryUpload = multer({storage});
// const cloudinaryUploadPromisified = promisify(cloudinary.uploader.upload);
// const cloudinaryUpload = (req, res, next) => {
//     const singleUpload = upload.single('image');
  
//     singleUpload(req, res, async (err) => {
//       if (err) {
//         if (err instanceof multer.MulterError) {
//           if (err.code === "LIMIT_FILE_SIZE") {
//             return res.status(400).json({ error: "File too large. Max 5MB allowed." });
//           }
//         }
//         return res.status(400).json({ error: err.message });
//       }
  
//       if (!req.file) {
//         return res.status(400).json({ error: "No file uploaded" });
//       }
  
//       try {
//         const result =  await cloudinary.uploader.upload(req.file.path, {
//           folder: 'products',
//           resource_type: 'image',
          
//         });
  
//         req.file.cloudinaryUrl = result.secure_url;
//         req.file.publicId = result.public_id;
  
//         await fs.promises.unlink(req.file.path); // Delete temp file
  
//         next();
//       } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: 'Cloudinary upload failed' });
//       }
//     });
//   };


// // Dummy data for the process
// const dummyData = {
// 	country: 'NG',
// 	account_number: '0690000031',
// 	bank_name: 'Access Bank', // Bank code, e.g., GTBank for Nigeria
// 	amount: 10000,
// 	narration: 'Payment for services rendered',
// 	currency: 'NGN',
// 	reference: 'unique-transfer-ref-9p8',
// 	transfer_id: null, // This will store the transfer ID from the created transfer
// 	transaction_id: null, // This will store the transaction ID
// 	account_name: 'Forrest Green',
// };

// const runFullTransferFlow = async () => {
// 	try {
// 	} catch (error) {
// 		console.error(
// 			'Error during transfer flow:',
// 			error.response ? error.response.data : error
// 		);
// 	}
// };

// runFullTransferFlow();



// const runFullTransferFlow = async () => {
// 	try {
//     // Step 5 - Get bank code
// 		console.log('Fetching Bank List...');
// 		const bankCodeResponse = await flw.Bank.country({
// 			country: dummyData.country,
// 			account_bank: dummyData.bank_name,
// 		});
// 		console.log(bankCodeResponse);

// 		// Filter the bank list for the bank with the name "Access Bank"
// 		const selectedBank = bankCodeResponse.data.find(
// 			(bank) => bank.name === dummyData.bank_name
// 		);

// 		if (!selectedBank) {
// 			throw new Error(
// 				`Bank code with name ${dummyData.bank_name} not found`
// 			);
// 		}

// 		console.log(
// 			`Bank Found: ${selectedBank.name} with code ${selectedBank.code}`
// 		);
    
//     // Step 6 - Get account details and validate
//     console.log('Verifying Account Details...');
// 		const resolveAccountResponse = await flw.Misc.verify_Account({
// 			account_number: dummyData.account_number,
// 			account_bank: selectedBank.code,
// 		});
// 		console.log('Account Verified:', resolveAccountResponse);
    
//     //Step 7 - Initiate the transfer
//     console.log('Initiating Transfer...');
// 		const transferResponse = await flw.Transfer.initiate({
// 			account_bank: selectedBank.code,
// 			account_number: dummyData.account_number,
// 			amount: dummyData.amount,
// 			narration: dummyData.narration,
// 			currency: dummyData.currency,
// 			reference: dummyData.reference,
// 			callback_url: 'https://example.com/callback',
// 			debit_currency: 'NGN',
// 		});
// 		console.log('Transfer Initiated:', transferResponse);

// 		// Save the transfer ID for future steps
// 		dummyData.transfer_id = transferResponse.data.id;
    
// 		// Step 8 - Fetch the transfer data
//     console.log("Fetching Transfer Details...");
//     const fetchTransferResponse = await flw.Transfer.get_a_transfer({ id: dummyData.transfer_id });
//     console.log("Transfer Details:", fetchTransferResponse);
    
//     // Step 9 - Verify the transaction
//     console.log('Verifying Transaction Details...');

// 		// Compare important fields from the response to your dummy data
// 		const matches =
// 			fetchTransferResponse.data.account_number ===
// 				dummyData.account_number &&
// 			fetchTransferResponse.data.amount === dummyData.amount &&
// 			fetchTransferResponse.data.narration === dummyData.narration &&
// 			fetchTransferResponse.data.reference === dummyData.reference &&
// 			fetchTransferResponse.data.currency === dummyData.currency &&
// 			fetchTransferResponse.data.full_name === dummyData.account_name; // Add any other necessary fields

// 		// Output the result of the comparison
// 		console.log(matches);

// 		// Conditional logic to determine if the transaction details match
// 		if (matches) {
// 			console.log(
// 				'Transaction details match with dummy data. Verification successful.'
// 			);
// 		} else {
// 			console.log(
// 				'Transaction details do not match with dummy data. Verification failed.'
// 			);
// 		}
    
// 	} catch (error) {
// 		console.error(
// 			'Error during transfer flow:',
// 			error.response ? error.response.data : error
// 		);
// 	}
// };

// import express from "express";
// import dotenv from "dotenv";
// import cookieParser from "cookie-parser";
// import path from "path";

// import authRoutes from "./routes/auth.route.js";
// import productRoutes from "./routes/product.route.js";
// import cartRoutes from "./routes/cart.route.js";
// import couponRoutes from "./routes/coupon.route.js";
// import paymentRoutes from "./routes/payment.route.js";
// import analyticsRoutes from "./routes/analytics.route.js";
// import cors from "cors";

// import { connectDB } from "./lib/db.js";

// dotenv.config();

// const app = express();

// app.use(express.json({ limit: '50mb' }));
// app.use(cors({
//     origin: process.env.CLIENT_URL || 'http://localhost:5173', // frontend URL
//     credentials: true 
//   }));
// // app.use(cors())
// const port = process.env.PORT || 3000
// const __dirname = path.resolve(); // Get the current directory path as an absolute path 

// // serve frontend
// if (process.env.NODE_ENV === "production") {
// 	app.use(express.static(path.join(__dirname, "/frontend/dist")));

// 	app.get("/*", (req, res) => {
// 		res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
// 	});
// }

// // app.use(express.urlencoded({ extended: true }));
// app.use(express.json());
// app.use(cookieParser());


// app.use("/api/auth", authRoutes);
// app.use("/api/products", productRoutes);
// app.use("/api/cart", cartRoutes);
// app.use("/api/coupons", couponRoutes);
// app.use("/api/payments", paymentRoutes);
// app.use("/api/analytics", analyticsRoutes);


// app.listen(port, () => {
//     console.log("server is running on http://localhost:" + port);
    
//     connectDB()
// } )

const startDate = Math.random(new Date());
console.log(startDate);


const startDate1 = Date.now();
console.log(startDate1);


const startDate11 = Date();
console.log(startDate11);

const input = "ravesb_63eb1872885e6500d017_cmacobia@gmail.com";

// Step 1: Split the string by underscore _
const parts = input.split("_");

// Step 2: Get the part after the second underscore
const target = parts[2]; // 'cmacobia@gmail.com'

// Step 3 (Optional): Convert to array of letters, sort, and print
const letters = target.split(""); // split into individual characters
const sortedLetters = letters.sort();

console.log("After second underscore:", target);
console.log("Sorted letters:", sortedLetters);

// Polling for admin approval
  useEffect(() => {
    if (!orderId) return;

    const interval = setInterval(async () => {
      try {
        const res = await axios.get(`/orders/status/${orderId}`);
        if (res.data.status === "success") {
          setIsApproved(true);
          clearInterval(interval);
        }
      } catch (err) {
        console.error("Error checking order status:", err);
      }
    }, 5000); // Poll every 5 seconds

    return () => clearInterval(interval);
  }, [orderId]);

  if (isProcessing) return <div className="text-center mt-20">Processing your order...</div>;
  if (error) return <div className="text-center mt-20 text-red-400">{error}</div>;
  




   // Poll admin approval status every 5s
  useEffect(() => {
    if (!orderId) return;

    const interval = setInterval(async () => {
      try {
        const res = await axios.get(`/orders/status/${orderId}`);
        if (res.data.status === "success") {
          setIsApproved(true);
          clearInterval(interval);
        }
      } catch (err) {
        console.error(err);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [orderId]);

  if (!isApproved) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p className="text-white text-xl">Your payment was successful. Waiting for admin approval...</p>
      </div>
    );
  }
   if (error) return <div className="text-center mt-20 text-red-400">{error}</div>;


   
  // TO check if the frontend listener works, add this temporarily to your server.js
   app.get("/test-order", (req, res) => {
  const testOrder = {
    _id: Date.now().toString(),
    createdAt: new Date().toISOString(),
    orderStatus: "pending",
    user: { name: "Test User", email: "test@example.com" }
  };

  io.emit("new_order", testOrder);
  res.send("✅ Test order emitted");
});

// previous purchase success screen
	// return (
	// 	<div className='h-screen flex items-center justify-center px-4'>
	// 		<Confetti
	// 			width={window.innerWidth}
	// 			height={window.innerHeight}
	// 			gravity={0.1}
	// 			style={{ zIndex: 99 }}
	// 			numberOfPieces={700}
	// 			recycle={false}
	// 		/>

	// 		<div className='max-w-md w-full bg-gray-800 rounded-lg shadow-xl overflow-hidden relative z-10'>
	// 			<div className='p-6 sm:p-8'>
	// 				<div className='flex justify-center'>
	// 					<CheckCircle className='text-emerald-400 w-16 h-16 mb-4' />
	// 				</div>
	// 				<h1 className='text-2xl sm:text-3xl font-bold text-center text-emerald-400 mb-2'>
	// 					Purchase Successful!
	// 				</h1>

	// 				<p className='text-gray-300 text-center mb-2'>
	// 					Thank you for your order. {"We're"} processing it now.
	// 				</p>
	// 				<p className='text-emerald-400 text-center text-sm mb-6'>
	// 					Check your email for order details and updates.
	// 				</p>
	// 				<div className='bg-gray-700 rounded-lg p-4 mb-6'>
	// 					<div className='flex items-center justify-between mb-2'>
	// 						<span className='text-sm text-gray-400'>Order number</span>
	// 						<span className='text-sm font-semibold text-emerald-400'>#12345</span>
	// 					</div>
	// 					<div className='flex items-center justify-between'>
	// 						<span className='text-sm text-gray-400'>Estimated delivery</span>
	// 						<span className='text-sm font-semibold text-emerald-400'>3-5 business days</span>
	// 					</div>
	// 					<div className='mt-4'>
	// 						<h2 className='text-sm text-gray-400 mb-2'>Billing Address</h2>
	// 						<ul className='text-sm text-emerald-300 space-y-1'>
	// 							<li>{billingInfo.street}</li>
	// 							<li>{billingInfo.city}, {billingInfo.state}</li>
	// 							<li>{billingInfo.country} - {billingInfo.postal_code}</li>
	// 						</ul>
	// 					</div>
						
	// 				</div>

	// 				<div className='space-y-4'>
	// 					<button
	// 						className='w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300 flex items-center justify-center'
	// 					>
	// 						<HandHeart className='mr-2' size={18} />
	// 						Thanks for trusting us!
	// 					</button>
	// 					<Link
	// 						to={"/"}
	// 						className='w-full bg-gray-700 hover:bg-gray-600 text-emerald-400 font-bold py-2 px-4  rounded-lg transition duration-300 flex items-center justify-center'
	// 					>
	// 						Continue Shopping
	// 						<ArrowRight className='ml-2' size={18} />
	// 					</Link>
	// 				</div>
	// 			</div>
	// 		</div>
	// 	</div>
	// );



	import User from "../models/userModel.js";


import User from "../models/userModel.js";
import cloudinary from "../lib/cloudinary.js";

// GET user profile
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

// UPDATE user profile
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
      age,
      billingAddress,
      image, // 👈 Receive Cloudinary image URL directly from frontend
    } = req.body;

    // Update fields
    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (sex) user.sex = sex;
    if (age) user.age = age;
    if (billingAddress) user.billingAddress = billingAddress;
    let cloudinaryResponse = null;

    if (image) {
      // Upload image to Cloudinary (base64 or file path)
      cloudinaryResponse = await cloudinary.uploader.upload(image, {
        folder: "products",
      });
    }


    await user.save();

    res.status(200).json({ message: "Profile updated successfully", user });
  } catch (error) {
    console.error("Profile update error:", error);
    res.status(500).json({ message: "Server error", error });
  }
};


 import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { Mail } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from '../lib/axios';

const ForgotPassPage = () => {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post('/auth/forgot-password', { email });
      toast.success(res.data.message || 'Reset link sent to your email');
    } catch (error) {
      toast.error(error.response.data.message || 'Something went wrong');
    }
  };
  return (
    <div className="bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10">
      <div>
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-1 mb-3 bg-emerald-600 text-white rounded hover:bg-emerald-700"
        >
          Go back
        </button>
      </div>
      <form action="" onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-300"
          >
            Email address
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-gray-400" aria-hidden="true" />
            </div>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className=" block w-full px-3 py-2 pl-10 bg-gray-700 border border-gray-600 
									rounded-md shadow-sm
									 placeholder-gray-400 focus:outline-none focus:ring-emerald-500 
									 focus:border-emerald-500 sm:text-sm"
              placeholder="you@example.com"
            />
          </div>
        </div>
        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent 
							rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600
							 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2
							  focus:ring-emerald-500 transition duration-150 ease-in-out disabled:opacity-50 cursor-pointer"
        >
          Reset Password
        </button>
      </form>
    </div>
  );
};

export default ForgotPassPage;



   <nav className="flex flex-wrap items-center gap-4">
            <Link
              to={'/'}
              className="text-gray-300 hover:text-emerald-400 transition duration-300 ease-in-out"
            >
              Home
            </Link>

            {user && (
              //user profile name
              <>
                {/* <Link
                  to={'/user'}
                  className="relative group text-gray-300 transition duration-300 ease-in-out"
                >
                  <User size={24} className=" hidden mr-1" />
                  <span className="inline-block ">{userName}</span>
                </Link> */}

                <Link
                  to={'/cart'}
                  className="relative group text-gray-300 hover:text-emerald-400 transition duration-300 ease-in-out"
                >
                  <ShoppingCart
                    className="inline-block mr-1 group-hover:text-emerald-400 "
                    size={20}
                  />
                  <span className="hidden sm:inline ">Cart</span>
                  {cart.length > 0 && (
                    <span className="absolute -top-2 -left-2 bg-emerald-500 text-white rounded-full px-2 py-0.5 text-xs group-hover:bg-emerald-400 transition duration-300 ease-in-out">
                      {cart.length}
                    </span>
                  )}
                </Link>

                <Link
                  to={'/user'}
                  className="relative group flex items-center justify-center w-9 h-9 rounded-full bg-emerald-600 text-white text-sm font-semibold overflow-hidden hover:opacity-90 transition"
                  title="Profile"
                >
                  {user?.image ? (
                    <img
                      src={user.image}
                      alt="User avatar"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span>{user?.name?.charAt(0).toUpperCase()}</span>
                  )}
                </Link>
              </>
            )}
            {isAdmin && (
              <Link
                className="bg-emerald-700 hover:bg-emerald-600 text-white px-3 py-1 rounded-md font-medium transition duration-300 ease-in-out flex items-center "
                to={'/secret-dashboard'}
              >
                <Lock className="inline-block mr-1 " size={18} />
                <span className=" sm:inline ">Admin Dashboard</span>
              </Link>
            )}
            {user ? (
              <button
                className="bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-md flex items-center transition duration-300 ease-in-out cursor-pointer"
                onClick={() => {
                  logout();
                  setTimeout(() => navigate('/'), 100);
                }}
              >
                <LogOut size={18} />
                <span className="hidden sm:inline ml-2">Log Out</span>
              </button>
            ) : (
              <>
                <Link
                  to={'/signup'}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white py-2 px-4 rounded-md flex items-center transition duration-300 ease-in-out"
                >
                  <UserPlus className="mr-2 " />
                  Sign Up
                </Link>
                <Link
                  to={'/login'}
                  className="bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-md flex items-center transition duration-300 ease-in-out"
                >
                  <LogIn className="mr-2" size={18} />
                  Login
                </Link>
              </>
            )}
          </nav>

          // import { useEffect, useState } from 'react';
// import { useProductStore } from '../stores/useProductStore';
// import { Link } from 'react-router-dom';
// import categories from '../lib/categories'; 

// const ProductPage = () => {
//   const {
//     products,
//     fetchAllProductsForUsers,
//     totalPages,
//     currentPage,
//     setCurrentPage,
//   } = useProductStore();

//   const [sortBy, setSortBy] = useState('');
//   const [category, setCategory] = useState('');
//   const [searchQuery, setSearchQuery] = useState('');

//   useEffect(() => {
//    fetchAllProductsForUsers({ sortBy, category, page: currentPage, search: searchQuery });
//   }, [sortBy, category, currentPage, searchQuery]);

//   const handleSearch = (e) => {
//     e.preventDefault();
//     setCurrentPage(1); // Reset to first page when searching
//    fetchAllProductsForUsers({ sortBy, category, page: 1, search: searchQuery });
//   };

//   return (
//     <div className="min-h-screen bg-gray-900 text-white p-4 sm:p-8">
//       <h1 className="text-3xl sm:text-5xl font-bold text-center mb-8 text-emerald-400">
//         All Products
//       </h1>

//       {/* Controls */}
//       <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
//         {/* Search */}
//         <form onSubmit={handleSearch} className="flex gap-2">
//           <input
//             type="text"
//             placeholder="Search products..."
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//             className="px-4 py-2 rounded text-black"
//           />
//           <button
//             type="submit"
//             className="px-4 py-2 bg-emerald-500 rounded hover:bg-emerald-600"
//           >
//             Search
//           </button>
//         </form>

//         {/* Category filter */}
//         <select
//           onChange={(e) => {
//             setCategory(e.target.value);
//             setCurrentPage(1); // Reset to first page
//           }}
//           value={category}
//           className="px-4 py-2 rounded bg-gray-700 text-white"
//         >
//           <option value="">All Categories</option>
//           {categories.map((cat) => (
//             <option key={cat.name} value={cat.name.toLowerCase()}>
//               {cat.name}
//             </option>
//           ))}
//         </select>

//         {/* Sort by */}
//         <select
//           onChange={(e) => {
//             setSortBy(e.target.value);
//             setCurrentPage(1);
//           }}
//           value={sortBy}
//           className="px-4 py-2 rounded bg-gray-700 text-white"
//         >
//           <option value="">Sort By</option>
//           <option value="price-asc">Price: Low to High</option>
//           <option value="price-desc">Price: High to Low</option>
//           <option value="newest">Newest</option>
//         </select>
//       </div>

//       {/* Product Grid */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//   {products.length > 0 ? (
//   products.map((product) => (
//     <Link to={`/products/${product._id}`} key={product._id}>
//       <div
//         className="bg-gray-800 rounded-xl p-4 shadow hover:shadow-emerald-500"
//       >
//         <img
//           src={product.image || '/fallback-image.png'}
//           alt={product.name}
//           className="w-full h-48 object-cover rounded"
//         />
//         <h3 className="text-lg font-bold mt-2">{product.name}</h3>
//         <div className="text-emerald-400 text-sm flex items-center gap-2">
//           {product.discountPrice && product.discountPrice > 0 ? (
//             <>
//               <span className="line-through text-gray-400">
//                 ₦{product.price.toLocaleString()}
//               </span>
//               <span className="font-bold text-white">
//                 ₦{product.discountPrice.toLocaleString()}
//               </span>
//             </>
//           ) : (
//             <span className="font-bold">
//               ₦{product.price.toLocaleString()}
//             </span>
//           )}
//         </div>
//       </div>
//     </Link>
//   ))
// ) : (
//   <p className="col-span-full text-center text-gray-400">No products found.</p>
// )}
//  </div>

//       {/* Pagination */}
//       {totalPages > 1 && (
//         <div className="flex justify-center items-center gap-2 mt-8">
//           {Array.from({ length: totalPages }, (_, index) => (
//             <button
//               key={index}
//               onClick={() => setCurrentPage(index + 1)}
//               className={`px-4 py-2 rounded ${
//                 currentPage === index + 1
//                   ? 'bg-emerald-500 text-white'
//                   : 'bg-gray-700 text-gray-300'
//               }`}
//             >
//               {index + 1}
//             </button>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default ProductPage;