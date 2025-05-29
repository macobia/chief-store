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
        min: 0,
        required: true,
    },
    discountPrice: {
    type: Number,
    min: 0,
    default: 0
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
  type: [String],
  required: [true, "Sizes are required"],
  enum: {
    values: ['s', 'm', 'l', 'xl', 'xxl', 'xxxl'],
    message: '{VALUE} is not a valid size',
  },
},
    isFeatured: {
        type: Boolean,
        default: false,

    },
    stock: {
        type: Number,
        min: 0,
        required: [true, "stock is required"]
    },
sku: {
    type: String,
    unique: true,
    required: [true, "SKU is required"],
    index: true
},

tags: {
    type: [String],
    default: []
},
variants: [{
    size: String,
    color: String,
    stock: {
        type: Number,
        min: 0,
        default: 0
    },
    image: String
}],
status: {
    type: String,
    enum: ['active', 'archived', 'draft'],
    default: 'active'
},



}, {timestamps: true});

const Product = mongoose.model("Product", productSchema)


export default Product