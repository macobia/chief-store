import User from "../models/user.model.js";
import jwt from "jsonwebtoken"

export const protectRoute = async (req, res, next) => {
    try {
        // const accessToken = req.cookies.accessToken;
  c
        if (!accessToken){
            return res.status(401).json({message: "Unauthorized, No access token provided"});
        }
        try {
            const decoded = jwt.verify(accessToken, process.env.JWT_SECRET_ACCESS_TOKEN);
           const user = await User.findById(decoded.userId).select('-password');

           if (!user) {
            return res.status(401).json({message: "Unauthorized, user not found"});
           }

           req.user = user;
           next();
        } catch (error) {
            if (error.name === "TokenExpiredError") {
                return res.status(401).json({message: "Unauthorized, access token expired"});
            }
            throw error;
        }
    } catch (error) {
        console.log("Error in protectedRoute middleware", error.message);
        return res.status(500).json({error: {message: "Server error in protectedRoute middleware"}});
        
    }

}

export const adminRoute = async (req, res, next) => {
    try {
        if (req.user && req.user.role === "admin"){
            next();
        } else {
            return res.status(401).json({error: {message: "Unauthorized, Admin only"}});

        }
    } catch (error) {
        res.status(500).json({error: {message: "Server error in adminRoute middleware"}});
    }
}