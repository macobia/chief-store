import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    user: {
        type: Number,
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