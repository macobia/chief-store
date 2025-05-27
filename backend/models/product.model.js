import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description:{
        type: String,
        required: true,
    },
    price : {
        type: Number,
        minimum: 0,
        required: true,
    },
    image: {
        type: String,
        required: [true, "image is required"]
    },
    category: {
        type: String,
        required: true,
    },
    sizes: {
        type: String,
        required: [true, "sizes are required"],
    },
    isFeatured: {
        type: Boolean,
        default: false,

    },

}, {timestamps: true});

const Product = mongoose.model("Product", productSchema)


export default Product