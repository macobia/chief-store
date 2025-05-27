import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    user: {
        // type: Number,
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    }, 
    products: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product",
                required: true,
            },
            quantity: {
                type: Number,
                required: true,
                min:1,
            },
            price: {
                type: Number,
                required: true,
                min:0,
            },
            
        },
    ],
    totalAmount: {
        type: Number,
        required: true,
        min:0
    },
    flutterwaveSessionId:{
        type: String,
        // unique: true,
    },
     orderStatus: {
        type: String,
        enum: ["pending", "success", "decline"],
        default: "pending", // default is pending until admin acts
    },
    billingAddress: {
        street: String,
        city: String,
        state: String,
        country: String,
        postal_code: String
    }
    // OpaySessionId:{
    //     type: String,
    //     unique: true,
    // },
    // MoniepointSessionId:{
    //     type: String,
    //     unique: true,
    // },



},{timestamps: true})

const Order = mongoose.model("Order", orderSchema);

export default Order;