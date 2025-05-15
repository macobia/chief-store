import Coupon from "../models/coupon.model.js";
import { flw } from "../lib/flutterwave.js";
import Order from '../models/order.model.js';
import dotenv from "dotenv";
import { transport } from '../lib/nodemailer.js';

dotenv.config();



export const createCheckoutSession = async (req, res) => {
    try {
        const {products, couponCode} = req.body;
        if (!Array.isArray(products) || products.length === 0) {
            return res.status(400).json({error: "Invalid or empty products array"})
        }
        let totalAmount = 0;
       
        products.forEach((product) => {
            const price = Math.round(product.price); // Convert to integer
            const quantity = product.quantity || 1;
            totalAmount += price * quantity;
        });
    
        let coupon = null;
        if (couponCode){
            coupon = await Coupon.findOne({code: couponCode, userId: req.user._id, isActive: true});
            if (coupon) {
                totalAmount -= Math.round((totalAmount * coupon.discountPercentage) / 100)
            }
        }

        const tx_ref = `${Date.now()}${Math.floor(Math.random()* 10)}`;
        const  redirect_url =  `${process.env.CLIENT_URL}/purchase-success?transaction_id=${tx_ref}`;
        const logo = 'vite.svg';
        const flutterwavePublicKey = process.env.FLW_PUBLIC_KEY;
        if (totalAmount >= 2000) {
            await createNewCoupon(req.user._id)
        }
        res.status(200).json({ tx_ref, totalAmount, redirect_url,logo, flutterwavePublicKey });
    } catch (error) {
        console.error("Error processing Checkout", error.message);
        res.status(500).json({message: "Server Error while processing checkout", error: error.message})
    }
}
// export const checkOutSuccess = async (req, res) => {
//   try {
//     const { transaction_id } = req.body;

//     if (!transaction_id) {
//       return res.status(400).json({ message: "Transaction ID is required." });
//     }

    

//     if (verifyResponse.status !== "success" || verifyResponse.data.status !== "successful") {
//       return res.status(400).json({ message: "Payment not successful." });
//     }

//     // Proceed with order creation etc...
//   } catch (error) {
//     console.error("Error processing successful checkout:", error.message);
//     return res.status(500).json({ message: "Error processing successful checkout.", error: error.message });
//   }
// };

export const checkOutSuccess = async (req, res) => {
    try {
      const { transaction_id } = req.body;
  
      if (!transaction_id) {
        return res.status(400).json({ message: "Transaction ID is required." });
      }

//       console.log("Received transaction_id:", transaction_id);

// const transactionId = extractTransactionId(transaction_id);
console.log("Received transaction_id:", transaction_id);
console.log("Type of transaction_id:", typeof transaction_id);
console.log("Converted to number:", Number(transaction_id));
      
  
      // Verify transaction with Flutterwave
      const verifyResponse = await flw.Transaction.verify({ tx_ref: transaction_id  });
      // const verifyResponse = await flw.Transaction.verify({ id: 174728532086909275602 });
      console.log("Verify Response:", verifyResponse);
  
      const isTransactionSuccessful =
        verifyResponse.status === "success" &&
        verifyResponse.data.status === "successful";
  
      if (!isTransactionSuccessful) {
        return res.status(400).json({ message: "Payment not successful." });
      }
  
      const { data } = verifyResponse;
      const { meta, amount, tx_ref, customer } = data;
  
      // Deactivate coupon if used
      if (meta?.couponCode) {
        await Coupon.findOneAndUpdate(
          { code: meta.couponCode, userId: meta.userId },
          { isActive: false }
        );
      }
  
      // Create order
      const products = JSON.parse(meta.products || "[]");
  
      const newOrder = new Order({
        user: meta.userId,
        products: products.map((product) => ({
          product: product.id,
          quantity: product.quantity,
          price: product.price,
        })),
        totalAmount: amount,
        flutterwaveSessionId: 12234, // using Flutterwave's transaction ID
      });
  
      await newOrder.save();
  
      //  Send confirmation email
      await sendOrderConfirmationEmail({
        email: customer.email,
        name: customer.name,
        tx_ref,
        amount,
        billingInfo: meta.shipping_address,
        products,
        couponCode: meta.couponCode,
      });
  
      // Return success response
      return res.status(200).json({
        success: true,
        message: " Payment successful, order created, and coupon (if used) deactivated.",
        orderId: newOrder._id,
      });
  
    } catch (error) {
      console.error(" Error processing successful checkout:", error.message);
      return res.status(500).json({
        message: "Error processing successful checkout.",
        error: error.message,
      });
    }
  };
  

const createNewCoupon = async (userId) => {
    try {
      await Coupon.findOneAndDelete({userId});

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
   
    
}  
const sendOrderConfirmationEmail = async ({
    name,
    email,
    tx_ref,
    amount,
    billingInfo,
    products,
    couponCode,
  }) => {
    const html = `
  <div style="font-family: Arial, sans-serif; color: #333;">
    <h2>🛒 Thank you for your purchase, ${name}!</h2>
    <p>Your order from <strong>Chief-Store</strong> has been successfully placed.</p>

    <h3>🧾 Order Summary</h3>
    <ul>
      ${products
        .map(
          (p, i) =>
            `<li>
              <strong>Product ${i + 1}</strong>:<br/>
              ID: ${p.id} <br/>
              Quantity: ${p.quantity} <br/>
              Price: ₦${Number(p.price).toLocaleString()}
            </li>`
        )
        .join("")}
    </ul>

    <p><strong>Total Paid:</strong> ₦${Number(amount).toLocaleString()}</p>
    ${couponCode ? `<p><strong>Coupon Applied:</strong> ${couponCode}</p>` : ""}

    <h3>📍 Billing Address</h3>
    <p>
      ${billingInfo.street}<br/>
      ${billingInfo.city}, ${billingInfo.state}<br/>
      ${billingInfo.country} - ${billingInfo.postal_code}
    </p>

    <h3>🔁 Transaction Reference</h3>
    <p><strong>${tx_ref}</strong></p>

    <hr/>
    <p>Need help? Contact us at <a href="mailto:support@chief-store.com">support@chief-store.com</a></p>
    <p style="color: #888;">Chief-Store | Powered by Flutterwave</p>
  </div>
`;

  
    await transport.sendMail({
      to: email,
      subject: '🎉 Your Order Receipt from Chief-Store',
      html,
    });
  };
  function extractTransactionId(txRef) {
    // Match the last group of digits in the string
    // const match = txRef.match(/(\d+)$/);
    // if (match) {
    //   return Number(match[1]);
    // } else {
    //   throw new Error("No numeric transaction ID found in tx_ref.");
    const numbers = txRef.match(/\d+/g);
    return numbers ? Number(numbers.join("")) : null;
    // }
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
