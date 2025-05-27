import { create } from "zustand";
import toast from "react-hot-toast";
import axios from "../lib/axios";

export const useProductStore = create((set) => ({
	products: [],
	// product: null,
	loading: false,

	setProducts: (products) => set({ products }),
	createProduct: async (productData) => {
		set({ loading: true });
		try {
			const res = await axios.post("/products", productData);
			set((prevState) => ({
				products: [...prevState.products, res.data],
				loading: false,
			}));
            toast.success( "Product created successfully");
		} catch (error) {
			toast.error(error.response.data.error);
			set({ loading: false });
		}
	},
	// New: Fetch a single product by ID 
	fetchSingleProduct: async (productId) => {
	set({ loading: true });
	try {
		const res = await axios.get(`/products/single/${productId}`);
		set({ product: res.data, loading: false });
	} catch (error) {
		toast.error(error.response?.data?.error || "Failed to fetch product");
		set({ loading: false });
	}
},
		// Updated: PATCH product update 
	updateProduct: async (productId, productData) => {
		set({ loading: true });
		try {
			const res = await axios.patch(`/products/${productId}`, productData);
			set((prevState) => ({
				products: prevState.products.map((product) =>
					product._id === productId ? { ...product, ...res.data } : product
				),
				product: res.data, // update current product if fetched
				loading: false,
			}));
			toast.success("Product updated successfully");
		} catch (error) {
			toast.error(error.response?.data?.error || "Failed to update product");
			set({ loading: false });
		}
	},

	fetchAllProducts: async () => {
		set({ loading: true });
		try {
			const response = await axios.get("/products");
			set({ products: response.data.products, loading: false });
		} catch (error) {
			set({ error: "Failed to fetch products", loading: false });
			toast.error(error.response.data.error || "Failed to fetch products");
		}
	},
	fetchProductsByCategory: async (category) => {
		set({ loading: true });
		try {
			const response = await axios.get(`/products/category/${category}`);
			set({ products: response.data.products, loading: false });
		} catch (error) {
			set({ error: "Failed to fetch products", loading: false });
			toast.error(error.response.data.error || "Failed to fetch products");
		}
	},
	deleteProduct: async (productId) => {
		set({ loading: true });
		try {
			await axios.delete(`/products/${productId}`);
			set((prevProducts) => ({
				products: prevProducts.products.filter((product) => product._id !== productId),
				loading: false,
			}));
            toast.success("Product deleted successfully");
		} catch (error) {
			set({ loading: false });
			toast.error(error.response.data.error || "Failed to delete product");
		}
	},
	toggleFeaturedProduct: async (productId) => {
		set({ loading: true });
		try {
			const response = await axios.patch(`/products/toggle/${productId}`);
			// this will update the isFeatured prop of the product
			set((prevProducts) => ({
				products: prevProducts.products.map((product) =>
					product._id === productId ? { ...product, isFeatured: response.data.isFeatured } : product
				),
				loading: false,
			}));
            toast.success(response.data.message);
		} catch (error) {
			set({ loading: false });
			toast.error(error.response.data.error || "Failed to update product");
		}
	},
	fetchFeaturedProducts: async () => {
		set({ loading: true });
		try {
			const response = await axios.get("/products/featured");
			set({ products: response.data, loading: false });
		} catch (error) {
			set({ error: "Failed to fetch products", loading: false });
			console.log("Error fetching featured products:", error);
		}
	},
}));