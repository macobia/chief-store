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
