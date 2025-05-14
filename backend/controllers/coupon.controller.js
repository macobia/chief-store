
import Coupon from '../models/coupon.model.js';
export const getCoupon = async (req, res) => {
    try {
        const coupon = await Coupon.findOne({ userId: req.user_id, isActive: true }); 
        res.json(coupon || null)
    } catch (error) {
        console.log("Error getCoupon controller", error.message);
        res.status(500).json({error: {message: "Server error", error:error.message}});
        
    }
}

export const validateCoupon = async (req, res) => {
    try {
        const {code} = req.body;
        const coupon = await Coupon.findOne({ code: code, userId:req.user_id, isActive: true });

        if(!coupon) {
            res.status(404).json({error: {message: "Coupon not found"}})
        }
        if (coupon.expirationDate < Date.now) {
            coupon.isActive = false;
            await coupon.save();
            return res.status(400).json({error: {message: "Coupon has expired"}})
        }
        res.json({
            message: "Coupon is valid",
            code: code,
            discountPercentage: coupon.discountPercentage,
        })
    } catch (error) {
        console.log("Error validateCoupon controller", error.message);
        res.status(500).json({error: {message: "Server error", error:error.message}});
        
    }
}