// import { useEffect, useState } from 'react';
// import { useProductStore } from '../stores/useProductStore';
// import { Save, X, Loader, Upload } from 'lucide-react';

// // eslint-disable-next-line
// import { motion } from 'framer-motion';

// const categories = [
//   'jeans',
//   't-shirts',
//   'shoes',
//   'glasses',
//   'jackets',
//   'suits',
//   'bags',
//   'watches',
// ];

// const UpdateProductForm = ({ productId, onClose }) => {
//   const { updateProduct, fetchSingleProduct, product, loading } =
//     useProductStore();
//   const [formData, setFormData] = useState({
//     name: '',
//     description: '',
//     price: '',
//     image: '',
//     category: '',
//   });

//   useEffect(() => {
//     fetchSingleProduct(productId);
//   }, [productId, fetchSingleProduct]);

//   useEffect(() => {
//     if (product) {
//       setFormData({
//         name: product.name || '',
//         description: product.description || '',
//         price: product.price || '',
//         image: product.image || '',
//         category: product.category || '',
//       });
//     }
//   }, [product]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleImageChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setFormData((prev) => ({ ...prev, image: reader.result }));
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     await updateProduct(productId, formData);
//     onClose();
//   };

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center">
//       <motion.div
//         initial={{ opacity: 0, scale: 0.9 }}
//         animate={{ opacity: 1, scale: 1 }}
//         transition={{ duration: 0.3 }}
//         className="bg-gray-900 text-white rounded-lg p-6 w-full max-w-md shadow-2xl relative"
//       >
//         <h2 className="text-2xl font-semibold mb-6 text-emerald-300">
//           Update Product
//         </h2>
//         <form onSubmit={handleSubmit} className="space-y-4">
//           {/* Name */}
//           <div>
//             <label
//               htmlFor="name"
//               className="block text-sm font-medium text-gray-300"
//             >
//               Product Name
//             </label>
//             <input
//               type="text"
//               id="name"
//               name="name"
//               value={formData.name}
//               onChange={handleChange}
//               className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2
// 						               px-3 text-white focus:outline-none focus:ring-2
// 						             focus:ring-emerald-500 focus:border-emerald-500"
//               placeholder="Product Name"
//               required
//             />
//           </div>

//           {/* Description */}
//           <div>
//             <label
//               htmlFor="description"
//               className="block text-sm font-medium text-gray-300"
//             >
//               Description
//             </label>
//             <textarea
//               name="description"
//               id="description"
//               value={formData.description}
//               onChange={handleChange}
//               className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm
// 						           py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500
// 						         focus:border-emerald-500"
//               placeholder="Description"
//               required
//             />
//           </div>

//           {/* Price */}
//           <div>
//             <label
//               htmlFor="price"
//               className="block text-sm font-medium text-gray-300"
//             >
//               Price
//             </label>
//             <input
//               type="number"
//               id="price"
//               name="price"
//               step="0.01"
//               value={formData.price}
//               onChange={handleChange}
//               className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm
// 						               py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500
// 						             focus:border-emerald-500"
//               placeholder="Price"
//               required
//             />
//           </div>

//           {/* Category */}
//           <div>
//             <label
//               htmlFor="category"
//               className="block text-sm font-medium text-gray-300"
//             >
//               Category
//             </label>
//             <select
//               name="category"
//               id="category"
//               value={formData.category}
//               onChange={handleChange}
//               className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md
// 						               shadow-sm py-2 px-3 text-white focus:outline-none
// 						               focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
//               required
//             >
//               <option value="">Select a category</option>
//               {categories.map((cat) => (
//                 <option key={cat} value={cat}>
//                   {cat}
//                 </option>
//               ))}
//             </select>
//           </div>

//           {/* Image Upload */}
//           <div className="flex items-center">
//             <input
//               type="file"
//               id="image-upload"
//               className="sr-only"
//               accept="image/*"
//               onChange={handleImageChange}
//             />
//             <label
//               htmlFor="image-upload"
//               className="cursor-pointer bg-gray-800 py-2 px-3 border border-gray-700 rounded-md text-sm text-gray-300 hover:bg-gray-700"
//             >
//               <Upload className="inline-block mr-2 h-4 w-4" />
//               Upload Image
//             </label>
//             {formData.image && (
//               <span className="ml-3 text-sm text-gray-400">Image uploaded</span>
//             )}
//           </div>

//           {/* Buttons */}
//           <div className="flex justify-end space-x-2">
//             <button
//               type="button"
//               onClick={onClose}
//               className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 cursor-pointer"
//             >
//               <X size={16} />
//               Cancel
//             </button>
//             <button
//               type="submit"
//               disabled={loading}
//               className={`flex items-center gap-2 px-4 py-2 rounded text-white ${
//                 loading
//                   ? 'bg-gray-500'
//                   : 'bg-emerald-600 hover:bg-emerald-700 cursor-pointer'
//               }`}
//             >
//               {loading ? (
//                 <>
//                   <Loader size={16} className="animate-spin" />
//                   Updating...
//                 </>
//               ) : (
//                 <>
//                   <Save size={16} />
//                   Update
//                 </>
//               )}
//             </button>
//           </div>
//         </form>
//       </motion.div>
//     </div>
//   );
// };

// export default UpdateProductForm;

import { useEffect, useState } from 'react';
import { useProductStore } from '../stores/useProductStore';
import { Save, X, Loader, Upload } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { motion } from 'framer-motion';

const categories = [
  'jeans',
  't-shirts',
  'shoes',
  'glasses',
  'jackets',
  'suits',
  'bags',
  'watches',
];

const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
const statuses = ['active', 'archived', 'draft'];

const UpdateProductForm = ({ productId, onClose }) => {
  const { updateProduct, fetchSingleProduct, product, loading } =
    useProductStore();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    discountPrice: '',
    image: '',
    category: '',
    sku: '',
    stock: '',
    availableSizes: [],
    status: 'active',
  });

  useEffect(() => {
    fetchSingleProduct(productId);
  }, [productId, fetchSingleProduct]);

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        description: product.description || '',
        price: product.price || '',
        discountPrice: product.discountPrice || '',
        image: product.image || '',
        category: product.category || '',
        sku: product.sku || uuidv4(),
        stock: product.stock || '',
        availableSizes: product.availableSizes || [],
        status: product.status || 'active',
      });
    }
  }, [product]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSizesChange = (e) => {
    const { value, checked } = e.target;
    setFormData((prev) => {
      const newSizes = checked
        ? [...prev.availableSizes, value]
        : prev.availableSizes.filter((size) => size !== value);
      return { ...prev, availableSizes: newSizes };
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await updateProduct(productId, formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center overflow-auto p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="bg-gray-900 text-white rounded-lg p-6 w-full max-w-md max-h-[90vh] shadow-2xl relative flex flex-col"
      >
        <h2 className="text-2xl font-semibold mb-6 mt-10 text-emerald-300">
          Update Product
        </h2>

        <div className="overflow-auto flex-grow">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Product Name */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-300"
              >
                Product Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="Product Name"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-300"
              >
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="Description"
                required
              />
            </div>

            {/* Price */}
            <div>
              <label
                htmlFor="price"
                className="block text-sm font-medium text-gray-300"
              >
                Price
              </label>
              <input
                type="number"
                id="price"
                name="price"
                step="0.01"
                value={formData.price}
                onChange={handleChange}
                className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="Price"
                required
              />
            </div>

            {/* Discount Price */}
            <div>
              <label
                htmlFor="discountPrice"
                className="block text-sm font-medium text-gray-300"
              >
                Discount Price (optional)
              </label>
              <input
                type="number"
                id="discountPrice"
                name="discountPrice"
                step="0.01"
                value={formData.discountPrice}
                onChange={handleChange}
                className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="Discount Price"
              />
            </div>

            {/* Category */}
            <div>
              <label
                htmlFor="category"
                className="block text-sm font-medium text-gray-300"
              >
                Category
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                required
              >
                <option value="">Select a category</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Stocks */}
            <div>
              <label
                htmlFor="stock"
                className="block text-sm font-medium text-gray-300"
              >
                Stocks
              </label>
              <input
                type="number"
                id="stock"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                min={0}
                className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="Stocks"
                required
              />
            </div>

            {/* Available Sizes */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Available Sizes
              </label>
              <div className="flex flex-wrap gap-2">
                {sizes.map((size) => (
                  <label
                    key={size}
                    className="inline-flex items-center space-x-2"
                  >
                    <input
                      type="checkbox"
                      name="availableSizes"
                      value={size}
                      checked={formData.availableSizes.includes(size)}
                      onChange={handleSizesChange}
                      className="form-checkbox h-4 w-4 text-emerald-500"
                    />
                    <span>{size}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Status */}
            <div>
              <label
                htmlFor="status"
                className="block text-sm font-medium text-gray-300"
              >
                Status
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                required
              >
                {statuses.map((status) => (
                  <option key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* SKU */}
            <div>
              <label
                htmlFor="sku"
                className="block text-sm font-medium text-gray-300"
              >
                SKU
              </label>
              <input
                type="text"
                id="sku"
                name="sku"
                value={formData.sku}
                onChange={handleChange}
                className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="SKU"
                required
              />
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Product Image
              </label>
              {formData.image && (
                <img
                  src={formData.image}
                  alt="Product"
                  className="mb-2 rounded-md max-h-40 object-contain"
                />
              )}
              <label
                htmlFor="image-upload"
                className="inline-flex items-center cursor-pointer rounded-md bg-emerald-600 hover:bg-emerald-700 px-3 py-2 text-white font-medium"
              >
                <Upload size={18} className="mr-2" />
                Choose Image
              </label>
              <input
                id="image-upload"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </div>

            {/* Buttons */}
            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-700">
              <button
                type="button"
                onClick={onClose}
                className="inline-flex items-center px-4 py-2 bg-red-700 hover:bg-gray-600 rounded-md text-white"
              >
                <X size={18} className="mr-2" />
                Cancel
              </button>

              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center px-4 py-2 bg-emerald-600 hover:bg-emerald-700 rounded-md text-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <Loader className="animate-spin mr-2" size={18} />
                ) : (
                  <Save className="mr-2" size={18} />
                )}
                Save
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default UpdateProductForm;
