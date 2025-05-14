import Coupon from "../models/coupon.model.js";
import { flw } from "../lib/flutterwave.js";
import Order from '../models/order.model.js';
import dotenv from "dotenv";

dotenv.config();



export const createCheckoutSession = async (req, res) => {
    try {
        const {products, couponCode} = req.body;
        if (!Array.isArray(products) || products.length === 0) {
            return res.status(400).json({error: "Invalid or empty products array"})
        }
        let totalAmount = 0;
       
        // const amount =  Math.round(products.price);
        //     totalAmount += amount * (products.quantity || 1);
        products.forEach((product) => {
            const price = Math.round(product.price); // Convert to integer
            const quantity = product.quantity || 1;
            totalAmount += price * quantity;
        });

            // return {
            //     name: products.name,
            //     image: products.image,f
            //     unit_amount: amount,
            //     quantity: products.quantity || 1,
            // };
    
        let coupon = null;
        if (couponCode){
            coupon = await Coupon.findOne({code: couponCode, userId: req.user._id, isActive: true});
            if (coupon) {
                totalAmount -= Math.round((totalAmount * coupon.discountPercentage) / 100)
            }
        }

        const tx_ref = `tx-${Date.now()}-${Math.floor(Math.random()* 10000)}`;
        const  redirect_url =  `${process.env.CLIENT_URL}/purchase-success?session_id=${tx_ref}`;
        const logo = 'vite.svg';
        const flutterwavePublicKey = process.env.FLW_PUBLIC_KEY;

        

        //to create users response link on flutter wave
        // const response = await flw.PaymentLinks.create()({
        //     amount: totalAmount,
        //     currency: "NGN", //This will depend on the currency you want to setup with like USD
        //     tx_ref: tx_ref,
        //     redirect_url: `${process.env.CLIENT_URL}/purchase-success?session_id=${tx_ref}`,
        //     customer: {
        //         email: req.user.email, 
        //         name: req.user.name,
        //     },
        //     customizations: {
        //         title: "Product Checkout",
        //         description: "Purchase from Chief-Store",
        //         logo: `${process.env.CLIENT_URL}/logo.png`
        //     },
        //     meta: {
        //         userId: req.user._id.toString(),
        //         couponCode: couponCode || "",
        //         products: JSON.stringify(
        //             products.map((p) => ({
        //                 id: p._id,
        //                 quantity: p.quantity,
        //                 price: p.price,
        //             }))
        //         ),

        //     }
        
        // })
        if (totalAmount >= 2000) {
            await createNewCoupon(req.user._id)
        }
        res.status(200).json({ tx_ref, totalAmount, redirect_url,logo, flutterwavePublicKey });
    } catch (error) {
        console.error("Error processing Checkout", error.message);
        res.status(500).json({message: "Server Error while processing checkout", error: error.message})
    }
}

export const checkOutSuccess = async (req, res) => {
    try {
        const {sessionId} = req.body;
        const verifyResponse = await flw.Transaction.verify({id: sessionId});

        if(verifyResponse.data.status === "success"){
            // const meta = verifyResponse.data.meta;
            const {meta} = verifyResponse.data;

            if (meta && meta.couponCode) {
                await Coupon.findOneAndUpdate(
                    {
                        code: meta.couponCode,
                        userId: meta.userId,
                    },
                    {
                        isActive: false,
                    }
                );
            }
            const products = JSON.parse(meta.products);

            const newOrder = new Order({
                user: meta.userId,
                products: products.map((product) => ({
                    product: product.id,
                    quantity: product.quantity,
                    price: product.price,
                })),
                totalAmount: verifyResponse.data.amount,   //Flutterwave amount is correct
                flutterwaveSessionId: sessionId,
            });
            await newOrder.save();

            res.status(200).json({
                success: true,
                message: "Payment successful, order created, and coupon deactivated if used",
                orderId: newOrder._id,
            });
        }else {
            res.status(400).json({message: "Payment not successful"})
        }
    } catch (error) {
       console.log("Error processing successful checkout", error.message);
       res.status(500).json({message: "Error processing successful checkout", error: error.message})
    }
};

const createNewCoupon = async (userId) => {
    try {
        const newCoupon = new Coupon({
            code: "GIFT" + Math.random().toString(36).substring(2, 8).toUpperCase(),
            discountPercentage: 10,
            expirationDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // expires in 30 days
            userId: userId,
        });
    
        await newCoupon.save();
        console.log("New coupon created:", newCoupon);
    
        return newCoupon;
        
    } catch (error) {
        console.error("Error creating new coupon:", error.message);
    }
    await Coupon.findOneAndDelete({userId});

    
}  

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

//         const tx_ref = `tx-${Date.now()}-${Math.floor(Math.random()* 10000)}`;
//        const  redirect_url =  `${process.env.CLIENT_URL}/purchase-success?session_id=${tx_ref}`
        

//         //to create users response link on flutter wave
//         // const response = await flw.PaymentLinks.create()({
//         //     amount: totalAmount,
//         //     currency: "NGN", //This will depend on the currency you want to setup with like USD
//         //     tx_ref: tx_ref,
//         //     redirect_url: `${process.env.CLIENT_URL}/purchase-success?session_id=${tx_ref}`,
//         //     customer: {
//         //         email: req.user.email, 
//         //         name: req.user.name,
//         //     },
//         //     customizations: {
//         //         title: "Product Checkout",
//         //         description: "Purchase from Chief-Store",
//         //         logo: `${process.env.CLIENT_URL}/logo.png`
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


