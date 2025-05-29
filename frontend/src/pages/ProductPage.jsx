import { useEffect, useState } from 'react';
import { useProductStore } from '../stores/useProductStore';
import { Link } from 'react-router-dom';
import categories from '../lib/categories';

const ProductPage = () => {
  const {
    products,
    fetchAllProductsForUsers,
    totalPages,
    currentPage,
    setCurrentPage,
  } = useProductStore();

  const [sortBy, setSortBy] = useState('');
  const [category, setCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // Fetch products with the correct filters and sort options
    fetchAllProductsForUsers({
      sortBy,
      category,
      page: currentPage,
      search: searchQuery,
    });
  }, [sortBy, category, currentPage, searchQuery]);

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1); // Reset to first page when searching
    fetchAllProductsForUsers({
      sortBy,
      category,
      page: 1,
      search: searchQuery,
    });
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
    setCurrentPage(1); // Reset to first page when sorting
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 sm:p-8">
      <h1 className="text-3xl sm:text-5xl font-bold text-center mb-8 text-emerald-400">
        All Products
      </h1>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
        {/* Search */}
        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="px-4 py-2 rounded text-black bg-white"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-emerald-500 rounded hover:bg-emerald-600"
          >
            Search
          </button>
        </form>

        {/* Category filter */}
        <select
          onChange={(e) => {
            setCategory(e.target.value);
            setCurrentPage(1); // Reset to first page
          }}
          value={category}
          className="px-4 py-2 rounded bg-gray-700 text-white"
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat.name} value={cat.name.toLowerCase()}>
              {cat.name}
            </option>
          ))}
        </select>

        {/* Sort by */}
        <select
          onChange={handleSortChange}
          value={sortBy}
          className="px-4 py-2 rounded bg-gray-700 text-white"
        >
          <option value="">Sort By</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="newest">Newest</option>
        </select>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.length > 0 ? (
          products.map((product) => (
            <Link to={`/products/${product._id}`} key={product._id}>
              <div className="bg-gray-800 rounded-xl p-4 shadow hover:shadow-emerald-500">
                <img
                  src={product.image || '/fallback-image.png'}
                  alt={product.name}
                  className="w-full h-48 object-cover rounded"
                />
                <h3 className="text-lg font-bold mt-2">{product.name}</h3>
                <div className="text-emerald-400 text-sm flex items-center gap-2">
                  {product.discountPrice && product.discountPrice > 0 ? (
                    <>
                      <span className="line-through text-gray-400">
                        ₦{product.price.toLocaleString()}
                      </span>
                      <span className="font-bold text-white">
                        ₦{product.discountPrice.toLocaleString()}
                      </span>
                    </>
                  ) : (
                    <span className="font-bold">
                      ₦{product.price.toLocaleString()}
                    </span>
                  )}
                </div>
              </div>
            </Link>
          ))
        ) : (
          <p className="col-span-full text-center text-gray-400">
            No products found.
          </p>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-8">
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index}
              onClick={() => setCurrentPage(index + 1)}
              className={`px-4 py-2 rounded ${
                currentPage === index + 1
                  ? 'bg-emerald-500 text-white'
                  : 'bg-gray-700 text-gray-300'
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductPage;
