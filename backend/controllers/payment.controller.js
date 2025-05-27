import Coupon from "../models/coupon.model.js";
import { flw } from "../lib/flutterwave.js";
import Order from '../models/order.model.js';
import dotenv from "dotenv";
import { transport } from '../lib/nodemailer.js';
import { io } from '../server.js';


dotenv.config();



// create checkout session
export const createCheckoutSession = async (req, res) => {
    try {
        const {products, couponCode, billingInfo} = req.body;
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
      //   const  redirect_url =  `${process.env.CLIENT_URL}/purchase-success? billingInfo.street=${billingInfo.street}$
      // billingInfo.city=${billingInfo.city}&billingInfo.state=${billingInfo.state}&billingInfo.country= ${billingInfo.country}&billingInfo.postal_code= ${billingInfo.postal_code}`;
      const redirect_url = `${process.env.CLIENT_URL}/purchase-success?` +
        `street=${encodeURIComponent( billingInfo.street)}&` +
        `city=${encodeURIComponent(billingInfo.city)}&` +
        `state=${encodeURIComponent(billingInfo.state)}&` +
       `country=${encodeURIComponent(billingInfo.country)}&` +
       `postal_code=${encodeURIComponent(billingInfo.postal_code)}`;

        //transaction_id=${tx_ref}
        const logo = 'vite.svg';
        const flutterwavePublicKey = process.env.FLW_PUBLIC_KEY;

        if (totalAmount >= 200) {
            await createNewCoupon(req.user._id, req.user.email)
        }
        res.status(200).json({ tx_ref, totalAmount, redirect_url,logo, flutterwavePublicKey,coupon: coupon ? { code: coupon.code, discountPercentage: coupon.discountPercentage } : null, });
    } catch (error) {
        console.error("Error processing Checkout", error.message);
        res.status(500).json({message: "Server Error while processing checkout", error: error.message})
    }
}

// check out success

// export const checkOutSuccess = async (req, res) => {
//   try {
//       const { transaction_id, street, city, state, country, postal_code } = req.body;
  
//       if (!transaction_id) {
//         return res.status(400).json({ message: "Transaction ID is required." });
//       }
      
  
//       // Verify transaction with Flutterwave
//       const verifyResponse = await flw.Transaction.verify({ id: transaction_id });
//       const isTransactionSuccessful =
//         verifyResponse.status === "success" &&
//         verifyResponse.data.status === "successful";
  
//       if (!isTransactionSuccessful) {
//         return res.status(400).json({ message: "Payment not successful." });
//       }
  
//       const { data } = verifyResponse;
//       const { meta, amount, tx_ref, customer } = data;
  
//       // Deactivate coupon if used
//       if (meta?.couponCode) {
//         await Coupon.findOneAndUpdate(
//           { code: meta.couponCode, userId: meta.userId },
//           { isActive: false }
//         );
//       }

//       console.log(meta.userId)

//       // payment successful waiting for admin approval
//        return res.status(200).json({
//         success: true,
//         message: "Payment successful. Awaiting admin approval.",
//       });
      
  
//       // Create order
//       const products = JSON.parse(meta.products || "[]");

//       console.log(meta.userId)
//       const newOrder = new Order({
//         // user: customer.id,
//         user: meta.userId,
//         products: products.map((product) => ({
//           product: product.id,
//           quantity: product.quantity,
//           price: product.price,
//         })),
//         totalAmount: amount,
//         flutterwaveSessionId: transaction_id + Math.random(), // using Flutterwave's transaction ID
//         orderStatus: "success", // Confirmed paid order
        
//       });
  
//       await newOrder.save();

//       const input = customer.email;

//       // Step 1: Split the string by underscore _
//       const parts = input.split("_");
//       // Step 2: Get the part after the second underscore
//       const email = parts[2];



  
//       //  Send confirmation email
//       await sendOrderConfirmationEmail({
       
       
//         name: customer.name,
//         tx_ref,
//         amount,
//         street,
// 				city,
// 				state,
// 				country,
// 				postal_code,
//         products,
//         couponCode: meta.couponCode,
//         email : meta.email,
//       });
  
//       // Return success response
//       return res.status(200).json({
//         success: true,
//         message: " Payment successful, order created, Order confirmed and coupon (if used) deactivated.",
//         orderId: newOrder._id,
//       });
  
//     } catch (error) {
//       console.error(" Error processing successful checkout:", error.message);
//       return res.status(500).json({
//         message: "Error processing successful checkout.",
//         error: error.message,
//       });
//     }
// };

export const checkOutSuccess = async (req, res) => {
  try {
    const { transaction_id, street, city, state, country, postal_code } = req.body;

    if (!transaction_id) {
      return res.status(400).json({ message: "Transaction ID is required." });
    }

    const verifyResponse = await flw.Transaction.verify({ id: transaction_id });
    const isTransactionSuccessful =
      verifyResponse.status === "success" &&
      verifyResponse.data.status === "successful";

    if (!isTransactionSuccessful) {
      return res.status(400).json({ message: "Payment not successful." });
    }

    const { data } = verifyResponse;
    const { meta, amount, tx_ref, customer } = data;

    // check if an order with the same transaction_id already exists
    const existingOrder = await Order.findOne({ flutterwaveSessionId: transaction_id });
     if (existingOrder) {
      return res.status(200).json({
        success: true,
         message: "Order already exists. Skipping creation.",
        orderId: existingOrder._id,
      });
    }

    // Save a pending order (not finalized yet)
    const products = JSON.parse(meta.products || "[]");

    const pendingOrder = new Order({
      user: meta.userId,
      products: products.map((product) => ({
        product: product.id,
        quantity: product.quantity,
        price: product.price,
      })),
      totalAmount: amount,
      flutterwaveSessionId: transaction_id,
      billingAddress: { street, city, state, country, postal_code },
      orderStatus: "pending", // Admin still needs to approve
    });

    await pendingOrder.save();

      // Deactivate coupon if used
      if (meta?.couponCode) {
        await Coupon.findOneAndUpdate(
          { code: meta.couponCode, userId: meta.userId },
          { isActive: false }
        );
      }

    //  Emit socket event to notify admin
    io.emit("new_order", pendingOrder);

    return res.status(200).json({
      success: true,

      message: "Payment verified. Awaiting admin approval.",
      orderId: pendingOrder._id,
      userId: pendingOrder.user,
      products: pendingOrder.products
    });
  } catch (error) {
    console.error("Error processing checkout:", error.message);
    return res.status(500).json({
      message: "Error processing checkout.",
      error: error.message,
    });
  }
};

// After admin approves order, send confirmation email
export const afterApprovedOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
   

    // Find the order by ID
    const order = await Order.findById(orderId).populate("user");

  

    order.orderStatus = "success"; // Mark as completed
    await order.save();

   // Store order details
    const orderDetails = {
      name: order.user.name,
      email: order.user.email,
      tx_ref: order.flutterwaveSessionId,
      amount: order.totalAmount,
      street: order.billingAddress?.street,
      city: order.billingAddress?.city,
      state: order.billingAddress?.state,
      country: order.billingAddress?.country,
      postal_code: order.billingAddress?.postal_code,
      products: order.products,
    };

    await sendOrderConfirmationEmail(orderDetails);

    return res.status(200).json({ message: "Order approved and confirmation sent." });
  } catch (error) {
    console.error("Error approving order:", error.message);
    return res.status(500).json({ message: "Error approving order.", error: error.message });
  }
};
  
// function to create new coupon AND send email
const createNewCoupon = async (userId, email) => {
    try {
      // Delete existing coupon for the user
      await Coupon.findOneAndDelete({userId});

        // Generate coupon code
        const code = "GIFT" + Math.random().toString(36).substring(2, 8).toUpperCase();

        // Create new coupon
        const newCoupon = new Coupon({
            code: code,
            discountPercentage: 10,
            expirationDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // expires in 30 days
            userId: userId,
        });

        // Save the new coupon
        await newCoupon.save();


        // Send email with the coupon code
        await sendCouponEmail({ email, code });
    
        return newCoupon;
        
    } catch (error) {
        console.error("Error creating new coupon:", error.message);
    }
   
    
};

//function to send couponCode to users via email
const sendCouponEmail = async ({ email, code }) => {
  const html = `
    <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
      <h2 style="color: #2e7d32;">🎁 You've Earned a Coupon!</h2>
      <p>Thanks for shopping at Chief-Store. You've received a coupon for your next order.</p>
      <p><strong>Coupon Code:</strong> <span style="background: #eee; padding: 5px 10px; border-radius: 4px;">${code}</span></p>
      <p>This gives you <strong>10% off</strong> your next purchase and is valid for the next 30 days.</p>
      <p style="font-size: 14px;">Use this at checkout. Happy shopping!</p>
      <hr />
      <p style="font-size: 13px; color: #888;">Chief-Store | Powered by Flutterwave</p>
    </div>
  `;

  await transport.sendMail({
    to: email,
    subject: '🎉 Your Chief-Store Coupon Code!',
    html,
  });
};


// function to send order confirmation email
const sendOrderConfirmationEmail = async ({
    name,
    tx_ref,
    amount,
    street,
		city,
		state,
		country,
		postal_code,
    products,
    couponCode,
    email
   }) => {
    const html = `
  <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; background-color: #f9f9f9;">
    <h2 style="color: #2e7d32;">🛒 Thank you for your purchase, ${name}!</h2>
    <p style="font-size: 16px;">Your order from <strong>Chief-Store</strong> has been successfully placed.</p>

    <h3 style="margin-top: 30px; color: #1e88e5;">🧾 Order Summary</h3>
    <ul style="list-style: none; padding-left: 0;">
      ${products
        .map(
          (p, i) => `
          <li style="padding: 10px; margin-bottom: 10px; background: #ffffff; border: 1px solid #ccc; border-radius: 5px;">
            <strong>Product ${i + 1}</strong><br/>
            <span style="display: block; margin-top: 5px;">ID: ${p.id}</span>
            <span>Quantity: ${p.quantity}</span><br/>
            <span>Price: ₦${Number(p.price).toLocaleString()}</span>
          </li>`
        )
        .join("")}
    </ul>

    <p style="font-size: 16px; margin-top: 20px;"><strong>Total Paid:</strong> ₦${Number(amount).toLocaleString()}</p>
    ${couponCode ? `<p style="font-size: 16px;"><strong>Coupon Applied:</strong> ${couponCode}</p>` : ""}

    <h3 style="margin-top: 30px; color: #1e88e5;">📍 Billing Address</h3>
    <p style="line-height: 1.6;">
      ${street}<br/>
      ${city}, ${state}<br/>
      ${country} - ${postal_code}
    </p>

    <h3 style="margin-top: 30px; color: #1e88e5;">🔁 Transaction Reference</h3>
    <p style="font-size: 16px; font-weight: bold;">${tx_ref}</p>

    <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;"/>

    <p style="font-size: 14px;">Need help? Contact us at <a href="mailto:support@chief-store.com" style="color: #1e88e5;">support@chief-store.com</a></p>
    <p style="font-size: 13px; color: #888;">Chief-Store | Powered by Flutterwave</p>
  </div>`;


   await transport.sendMail({
      to: email,
      subject: '🎉 Your Order Receipt from Chief-Store',
      html,
    });
};
  
