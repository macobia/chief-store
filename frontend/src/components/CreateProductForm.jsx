// import { useState } from 'react';
// // eslint-disable-next-line
// import { motion } from 'framer-motion';
// import { PlusCircle, Upload, Loader } from 'lucide-react';
// import { useProductStore } from '../stores/useProductStore';

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

// const CreateProductForm = () => {
//   const [newProduct, setNewProduct] = useState({
//     name: '',
//     description: '',
//     price: '',
//     category: '',
//     image: '',
//   });

//   const { createProduct, loading } = useProductStore();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       await createProduct(newProduct);
//       setNewProduct({
//         name: '',
//         description: '',
//         price: '',
//         category: '',
//         image: '',
//       });
//     } catch {
//       console.log('error creating a product');
//     }
//   };

//   const handleImageChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       const reader = new FileReader();

//       reader.onloadend = () => {
//         setNewProduct({ ...newProduct, image: reader.result });
//       };

//       reader.readAsDataURL(file); // base64
//     }
//   };

//   return (
//     <motion.div
//       className="bg-gray-800 shadow-lg rounded-lg p-8 mb-8 max-w-xl mx-auto"
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.8 }}
//     >
//       <h2 className="text-2xl font-semibold mb-6 text-emerald-300">
//         Create New Product
//       </h2>

//       <form onSubmit={handleSubmit} className="space-y-4">
//         <div>
//           <label
//             htmlFor="name"
//             className="block text-sm font-medium text-gray-300"
//           >
//             Product Name
//           </label>
//           <input
//             type="text"
//             id="name"
//             name="name"
//             value={newProduct.name}
//             onChange={(e) =>
//               setNewProduct({ ...newProduct, name: e.target.value })
//             }
//             className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2
// 						 px-3 text-white focus:outline-none focus:ring-2
// 						focus:ring-emerald-500 focus:border-emerald-500"
//             required
//           />
//         </div>

//         <div>
//           <label
//             htmlFor="description"
//             className="block text-sm font-medium text-gray-300"
//           >
//             Description
//           </label>
//           <textarea
//             id="description"
//             name="description"
//             value={newProduct.description}
//             onChange={(e) =>
//               setNewProduct({ ...newProduct, description: e.target.value })
//             }
//             rows="3"
//             className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm
// 						 py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500
// 						 focus:border-emerald-500"
//             required
//           />
//         </div>

//         <div>
//           <label
//             htmlFor="price"
//             className="block text-sm font-medium text-gray-300"
//           >
//             Price
//           </label>
//           <input
//             type="number"
//             id="price"
//             name="price"
//             value={newProduct.price}
//             onChange={(e) =>
//               setNewProduct({ ...newProduct, price: e.target.value })
//             }
//             step="0.01"
//             className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm
// 						py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500
// 						 focus:border-emerald-500"
//             required
//           />
//         </div>

//         <div>
//           <label
//             htmlFor="category"
//             className="block text-sm font-medium text-gray-300"
//           >
//             Category
//           </label>
//           <select
//             id="category"
//             name="category"
//             value={newProduct.category}
//             onChange={(e) =>
//               setNewProduct({ ...newProduct, category: e.target.value })
//             }
//             className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md
// 						 shadow-sm py-2 px-3 text-white focus:outline-none
// 						 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
//             required
//           >
//             <option value="">Select a category</option>
//             {categories.map((category) => (
//               <option key={category} value={category}>
//                 {category}
//               </option>
//             ))}
//           </select>
//         </div>

//         <div className="mt-1 flex items-center">
//           <input
//             type="file"
//             id="image"
//             className="sr-only"
//             accept="image/*"
//             onChange={handleImageChange}
//           />
//           <label
//             htmlFor="image"
//             className="cursor-pointer bg-gray-700 py-2 px-3 border border-gray-600 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-300 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
//           >
//             <Upload className="h-5 w-5 inline-block mr-2" />
//             Upload Image
//           </label>
//           {newProduct.image && (
//             <span className="ml-3 text-sm text-gray-400">Image uploaded </span>
//           )}
//         </div>

//         <button
//           type="submit"
//           className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md
// 					shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700
// 					focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 cursor-pointer"
//           disabled={loading}
//         >
//           {loading ? (
//             <>
//               <Loader
//                 className="mr-2 h-5 w-5 animate-spin"
//                 aria-hidden="true"
//               />
//               Loading...
//             </>
//           ) : (
//             <>
//               <PlusCircle className="mr-2 h-5 w-5" />
//               Create Product
//             </>
//           )}
//         </button>
//       </form>
//     </motion.div>
//   );
// };
// export default CreateProductForm;

import { useState } from 'react';
// eslint-disable-next-line
import { motion } from 'framer-motion';
import { PlusCircle, Upload, Loader } from 'lucide-react';
import { useProductStore } from '../stores/useProductStore';

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

const sizeOptions = ['s', 'm', 'l', 'xl', 'xxl', 'xxxl'];

const CreateProductForm = () => {
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    image: '',
    sizes: [],
    stock: '',
    discountPrice: '',
    tags: '',
    status: 'active',
    isFeatured: false,
  });

  const { createProduct, loading } = useProductStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...newProduct,
        tags: newProduct.tags
          ? newProduct.tags.split(',').map((tag) => tag.trim())
          : [],
        price: parseFloat(newProduct.price),
        stock: parseInt(newProduct.stock, 10),
        discountPrice: parseFloat(newProduct.discountPrice || 0),
        isFeatured: Boolean(newProduct.isFeatured),
      };

      await createProduct(payload);

      setNewProduct({
        name: '',
        description: '',
        price: '',
        category: '',
        image: '',
        sizes: [],
        stock: '',
        discountPrice: '',
        tags: '',
        status: 'active',
        isFeatured: false,
      });
    } catch (err) {
      console.error('Error creating product:', err);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewProduct({ ...newProduct, image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSizeChange = (size) => {
    setNewProduct((prev) => {
      const sizes = prev.sizes.includes(size)
        ? prev.sizes.filter((s) => s !== size)
        : [...prev.sizes, size];
      return { ...prev, sizes };
    });
  };

  return (
    <motion.div
      className="bg-gray-800 shadow-lg rounded-lg p-8 mb-8 max-w-xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <h2 className="text-2xl font-semibold mb-6 text-emerald-300">
        Create New Product
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Basic Fields */}
        {[
          { id: 'name', label: 'Product Name' },
          { id: 'description', label: 'Description', isTextarea: true },
          { id: 'price', label: 'Price', type: 'number' },
          { id: 'stock', label: 'Stock', type: 'number' },
          { id: 'discountPrice', label: 'Discount Price', type: 'number' },
          { id: 'tags', label: 'Tags (comma separated)' },
        ].map(({ id, label, type = 'text', isTextarea }) => (
          <div key={id}>
            <label
              htmlFor={id}
              className="block text-sm font-medium text-gray-300"
            >
              {label}
            </label>
            {isTextarea ? (
              <textarea
                id={id}
                value={newProduct[id]}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, [id]: e.target.value })
                }
                rows="3"
                className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm
                  py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                required
              />
            ) : (
              <input
                type={type}
                id={id}
                value={newProduct[id]}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, [id]: e.target.value })
                }
                className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm 
                  py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                required={id !== 'discountPrice' && id !== 'tags'}
              />
            )}
          </div>
        ))}

        {/* Sizes */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Available Sizes
          </label>
          <div className="flex flex-wrap gap-2">
            {sizeOptions.map((size) => (
              <label
                key={size}
                className="flex items-center space-x-1 text-sm text-white"
              >
                <input
                  type="checkbox"
                  checked={newProduct.sizes.includes(size)}
                  onChange={() => handleSizeChange(size)}
                  className="text-emerald-500 focus:ring-emerald-500 rounded"
                />
                <span className="capitalize">{size}</span>
              </label>
            ))}
          </div>
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
            value={newProduct.category}
            onChange={(e) =>
              setNewProduct({ ...newProduct, category: e.target.value })
            }
            className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md
              shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            required
          >
            <option value="">Select a category</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
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
            value={newProduct.status}
            onChange={(e) =>
              setNewProduct({ ...newProduct, status: e.target.value })
            }
            className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md
              shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          >
            <option value="active">Active</option>
            <option value="archived">Archived</option>
            <option value="draft">Draft</option>
          </select>
        </div>

        {/* isFeatured */}
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="isFeatured"
            checked={newProduct.isFeatured}
            onChange={(e) =>
              setNewProduct({ ...newProduct, isFeatured: e.target.checked })
            }
            className="text-emerald-500 focus:ring-emerald-500 rounded"
          />
          <label htmlFor="isFeatured" className="text-sm text-gray-300">
            Featured Product
          </label>
        </div>

        {/* Image Upload */}
        <div className="mt-1 flex items-center">
          <input
            type="file"
            id="image"
            className="sr-only"
            accept="image/*"
            onChange={handleImageChange}
          />
          <label
            htmlFor="image"
            className="cursor-pointer bg-gray-700 py-2 px-3 border border-gray-600 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-300 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
          >
            <Upload className="h-5 w-5 inline-block mr-2" />
            Upload Image
          </label>
          {newProduct.image && (
            <span className="ml-3 text-sm text-gray-400">Image uploaded</span>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md 
            shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 
            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 cursor-pointer"
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader
                className="mr-2 h-5 w-5 animate-spin"
                aria-hidden="true"
              />
              Loading...
            </>
          ) : (
            <>
              <PlusCircle className="mr-2 h-5 w-5" />
              Create Product
            </>
          )}
        </button>
      </form>
    </motion.div>
  );
};

export default CreateProductForm;
