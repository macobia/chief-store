import { redis } from "../lib/redis.js";
import cloudinary from "../lib/cloudinary.js";
import Product from "../models/product.model.js";
import { v4 as uuidv4 } from 'uuid';


export const getAllProducts = async (req, res) => {
	try {
		const products = await Product.find({}); // find all products
		res.json({ products });
	} catch (error) {
		console.log("Error in getAllProducts controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

export const getAllProductsByFilters = async (req, res) => {
	try {
		const {
			page = 1,			limit = 10,
			sort = 'newest',
			search = '',
			category,
			color,
			size,
			priceMin,
			priceMax,
		} = req.query;

		const filters = {};

		if (search) {
			filters.name = { $regex: search, $options: 'i' };
		}
		if (category) filters.category = category;
		if (color) filters.color = color;
		if (size) filters.size = size;
		if (priceMin || priceMax) {
			filters.price = {};
			if (priceMin) filters.price.$gte = parseFloat(priceMin);
			if (priceMax) filters.price.$lte = parseFloat(priceMax);
		}

		let sortOption = {};
		if (sort === 'newest') sortOption = { createdAt: -1 };
		else if (sort === 'oldest') sortOption = { createdAt: 1 };
		else if (sort === 'price-asc') sortOption = { price: 1 };
		else if (sort === 'price-desc') sortOption = { price: -1 };

		const total = await Product.countDocuments(filters);
		const products = await Product.find(filters)
			.sort(sortOption)
			.skip((page - 1) * limit)
			.limit(Number(limit));

		res.json({
			products,
			total,
			page: Number(page),
			pages: Math.ceil(total / limit),
		});
	} catch (error) {
		console.error("Error in getAllProducts controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

export const getFeaturedProducts = async (req, res) => {
	try {
		let featuredProducts = await redis.get("featured_products");
		if (featuredProducts) {
			return res.json(JSON.parse(featuredProducts));
		}

		// if not in redis, fetch from mongodb
		// .lean() is gonna return a plain javascript object instead of a mongodb document
		// which is good for performance
		featuredProducts = await Product.find({ isFeatured: true }).lean();

		if (!featuredProducts) {
			return res.status(404).json({ message: "No featured products found" });
		}

		// store in redis for future quick access

		await redis.set("featured_products", JSON.stringify(featuredProducts));

		res.json(featuredProducts);
	} catch (error) {
		console.log("Error in getFeaturedProducts controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

export const createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      image,
      category,
      sizes,
      stock,
      discountPrice,
      tags,
      variants,
      status,
      isFeatured,
    } = req.body;

    // Validate required fields
    if (
      !name ||
      !description ||
      !price ||
      !image ||
      !category ||
      !sizes ||
      !Array.isArray(sizes) ||
      sizes.length === 0 ||
      stock === undefined
    ) {
      return res.status(400).json({ message: "Missing or invalid required fields" });
    }

    // Validate size values
    const validSizes = ['s', 'm', 'l', 'xl', 'xxl', 'xxxl'];
    for (const size of sizes) {
      if (!validSizes.includes(size)) {
        return res.status(400).json({ message: `${size} is not a valid size` });
      }
    }

    // Upload image to Cloudinary
    let cloudinaryResponse = null;
    if (image) {
      cloudinaryResponse = await cloudinary.uploader.upload(image, {
        folder: 'products',
      });
    }

    // Parse variants (optional)
    const parsedVariants = Array.isArray(variants)
      ? variants.map((v) => ({
          size: v.size,
          color: v.color,
          stock: v.stock || 0,
          image: v.image || '',
        }))
      : [];

    // Create product
    const product = await Product.create({
      name,
      description,
      price,
      image: cloudinaryResponse?.secure_url || '',
      category,
      sizes,
      stock,
      discountPrice: discountPrice || 0,
      tags: Array.isArray(tags) ? tags : [],
      variants: parsedVariants,
      status: status || 'active',
      isFeatured: isFeatured || false,
      sku: uuidv4(), // auto-generate SKU
    });

    res.status(201).json(product);
  } catch (error) {
    console.error("Error in createProduct controller:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
export const getSingleProduct = async (req, res) => {
	try {
		const product = await Product.findById(req.params.id);

		if (!product) {
			return res.status(404).json({ message: "Product not found" });
		}

		res.json(product);
	} catch (error) {
		console.error("Error fetching single product:", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

// to update product 
export const updateProduct = async (req, res) => {
	try {
		const { image } = req.body;
		const updates = { ...req.body };

		// If image is provided, upload to Cloudinary
		if (image) {
			const cloudinaryResponse = await cloudinary.uploader.upload(image, {
				folder: "products",
			});
			updates.image = cloudinaryResponse.secure_url;
		}

		// Remove image from updates if not provided
		if (!image) delete updates.image;

		const product = await Product.findByIdAndUpdate(req.params.id, updates, {
			new: true,
		});

		if (!product) {
			return res.status(404).json({ message: "Product not found" });
		}

		res.json(product);
	} catch (error) {
		console.error("Error in updateProduct controller:", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};


export const deleteProduct = async (req, res) => {
	try {
		const product = await Product.findById(req.params.id);

		if (!product) {
			return res.status(404).json({ message: "Product not found" });
		}

		if (product.image) {
			const publicId = product.image.split("/").pop().split(".")[0];
			try {
				await cloudinary.uploader.destroy(`products/${publicId}`);
				console.log("deleted image from cloduinary");
			} catch (error) {
				console.log("error deleting image from cloduinary", error);
			}
		}

		await Product.findByIdAndDelete(req.params.id);

		res.json({ message: "Product deleted successfully" });
	} catch (error) {
		console.log("Error in deleteProduct controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

export const getRecommendedProducts = async (req, res) => {
	try {
		const products = await Product.aggregate([
			{
				$sample: { size: 4 },
			},
			{
				$project: {
					_id: 1,
					name: 1,
					description: 1,
					image: 1,
					price: 1,
				},
			},
		]);

		res.json(products);
	} catch (error) {
		console.log("Error in getRecommendedProducts controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

export const getProductsByCategory = async (req, res) => {
	const { category } = req.params;
	try {
		const products = await Product.find({ category });
		res.json({ products });
	} catch (error) {
		console.log("Error in getProductsByCategory controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

export const toggleFeaturedProduct = async (req, res) => {
	try {
		const product = await Product.findById(req.params.id);
		if (product) {
			product.isFeatured = !product.isFeatured;
			const updatedProduct = await product.save();
			await updateFeaturedProductsCache();
			res.json(updatedProduct);
		} else {
			res.status(404).json({ message: "Product not found" });
		}
	} catch (error) {
		console.log("Error in toggleFeaturedProduct controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};
export const getProductsByCategory1 = async (req, res) => {
  try {
    const { category } = req.params;
    const excludeId = req.query.exclude;

    const filter = { category };
    if (excludeId) filter._id = { $ne: excludeId };

    const products = await Product.find(filter).limit(6);
    res.json(products);
  } catch (error) {
    console.error("Error fetching related products:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

async function updateFeaturedProductsCache() {
	try {
		// The lean() method  is used to return plain JavaScript objects instead of full Mongoose documents. This can significantly improve performance

		const featuredProducts = await Product.find({ isFeatured: true }).lean();
		await redis.set("featured_products", JSON.stringify(featuredProducts));
	} catch (error) {
		console.log("error in update cache function");
	}
}