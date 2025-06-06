import mongoose from "mongoose";


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "please add a name"],
        trim: true,
        maxLength: [30, "name cannot be more than 30 characters"]
    },
    email: {
        type: String,
        required: [true, "please add an Email"],
        unique: true,
        match: [
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            "Please enter a valid email",
        ],
        trim: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: [true, "please add a password"],
        minLength: [6, "password must be up to 6 characters long"],
        select: false,

    },
    isEmailVerified: {
        type: Boolean,
        default: false, 
    },
    verificationCode: {
        type: String,
        required: false,
    },
    verificationCodeExpiry: {
        type: Date,
    },
    resetPasswordToken: {
        type:String,
    },
    resetPasswordExpires: {
        type:Date,
    },

    cartItems: [
        {
        quantity: {
            type: Number,
            default: 1,

        },
        product: {
            type: mongoose.Schema.ObjectId,
            ref: "Product",
            required: true,
        },
    },
    ],

    role: {
        type: String,
        enum: ["customer", "admin", "superAdmin"],
        default: "customer",
    },
    phone: {
    type: String,
    },
    billingAddress: {
        street: { type: String },
        city: { type: String },
        state: { type: String },
        country: { type: String },
        postal_code: { type: String }
    },
    sex: {
        type: String,
        enum: ["male", "female", "non-binary"]
    },
    image: {
        type: String
    },
    dob: {
         type: Date,
    },
},

{
timestamps: true,
}

);

const User = mongoose.model("User", userSchema);


export default User;

