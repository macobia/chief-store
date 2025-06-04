import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import axios from '../lib/axios';
import { useCartStore } from '../stores/useCartStore';
import { useUserStore } from '../stores/useUserStore';
import toast from 'react-hot-toast';

const ItemPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState('');
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useUserStore();

  const { addToCart } = useCartStore();

  // const handleShopClick = () => {
  //   if (!user) {
  //     toast.success('Login to start shopping');
  //   } else {
  //     addToCart(product);
  //     toast.success('Product added to cart');
  //   }
  // };

  // Fetch the main product
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`/products/singles/${id}`);
        setProduct(res.data);
      } catch (err) {
        console.error('Failed to fetch product', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  // Fetch related products after main product loads
  useEffect(() => {
    const fetchRelated = async () => {
      if (product?.category) {
        try {
          const res = await axios.get(
            `/products/category1/${product.category}?exclude=${product._id}`
          );
          setRelatedProducts(res.data);
        } catch (err) {
          console.error('Failed to fetch related products', err);
        }
      }
    };
    fetchRelated();
  }, [product]);
  const handleAddToCart = () => {
    if (!user) {
      toast.error('Login to start shopping');
      return;
    }

    if (!selectedSize && product?.sizes?.length > 0) {
      toast.error('Please select a size');
      return;
    }

    const itemToAdd = {
      ...product,
      selectedSize, // Include selected size in the item
    };

    addToCart(itemToAdd);
  };

  if (loading) return <div className="text-white p-6">Loading...</div>;
  if (!product)
    return <div className="text-red-500 p-6">Product not found</div>;

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="flex flex-col lg:flex-row gap-10">
        {/* Left: Image & Description */}
        <div className="lg:w-1/2 space-y-4">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-[400px] object-cover rounded-lg"
          />
          <h1 className="text-3xl font-bold text-emerald-400">
            {product.name}
          </h1>
          <p className="text-gray-300">{product.description}</p>
        </div>

        {/* Right: Info & Add to Cart */}
        <div className="lg:w-1/2 space-y-6">
          {/* Sizes */}
          <div>
            <h3 className="font-semibold mb-2">Available Sizes</h3>
            <div className="flex gap-3 flex-wrap">
              {product.sizes?.length ? (
                product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2 rounded border ${
                      selectedSize === size
                        ? 'bg-emerald-500 text-white'
                        : 'bg-gray-700 text-gray-200'
                    }`}
                  >
                    {size.toUpperCase()}
                  </button>
                ))
              ) : (
                <p className="text-gray-400">
                  No sizes available for this product.
                </p>
              )}
            </div>
          </div>

          {/* Category */}
          <p>
            <span className="font-semibold">Category:</span>{' '}
            <span className="text-emerald-300">{product.category}</span>
          </p>

          {/* Price */}
          <div className="flex items-center gap-4">
            <p className="text-2xl font-bold text-emerald-400">
              ₦{product.discountPrice || product.price}
            </p>
            {product.discountPrice && (
              <p className="line-through text-gray-400"> ₦{product.price}</p>
            )}
          </div>

          {/* Add to Cart */}
          <button
            onClick={handleAddToCart}
            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-2 px-4 rounded transition-colors duration-300 
												flex items-center justify-center cursor-pointer"
          >
            <ShoppingCart className="w-5 h-5 mr-2" />
            Add to Cart
          </button>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-white mb-6">
            Related Products
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {relatedProducts.map((product) => (
              <Link key={product._id} to={`/products/${product._id}`}>
                <div className="bg-gray-800 rounded-xl p-4 shadow hover:shadow-emerald-500">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-48 object-cover rounded"
                  />
                  <h3 className="text-lg font-bold mt-2">{product.name}</h3>
                  <p className="text-emerald-400 text-sm">
                    ₦{product.discountPrice || product.price}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ItemPage;
