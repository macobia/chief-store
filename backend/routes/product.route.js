
import  express  from 'express';
import {createProduct, deleteProduct, getAllProducts, getFeaturedProducts, getProductsByCategory, getRecommendedProducts, getSingleProduct, toggleFeaturedProduct, updateProduct} from '../controllers/product.controller.js'; 
import { adminRoute, protectRoute } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get("/",protectRoute, adminRoute, getAllProducts) 
router.get("/single/:id",protectRoute, adminRoute, getSingleProduct) 
router.get("/featured", getFeaturedProducts)
router.get("/category/:category", getProductsByCategory)
router.get("/recommendations", getRecommendedProducts)
router.post("/", protectRoute, adminRoute, createProduct )
router.patch("/toggle/:id", protectRoute, adminRoute, toggleFeaturedProduct)
router.patch("/:id", protectRoute, adminRoute, updateProduct)
router.delete("/:id", protectRoute, adminRoute, deleteProduct ) 

export default router;
