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
        enum: ["customer", "admin"],
        default: "customer",
    },

},

{
timestamps: true,
}

);

userSchema.methods.comparePassword = async function (password) {
	return bcrypt.compare(password, this.password);
};

const User = mongoose.model("User", userSchema);


export default User;

