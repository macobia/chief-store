import { useEffect } from 'react';
// import { useUserStore } from '../stores/useUserStore';
import CategoryItem from '../components/CategoryItem';
import { useProductStore } from '../stores/useProductStore';
import FeaturedProducts from '../components/FeaturedProducts';
import Footer from '../components/Footer';
import Carousel from '../components/Carousel';
import ReviewsSlider from '../components/ReviewsSlider';
import InfoCards from '../components/InfoCards';

const categories = [
  { href: '/jeans', name: 'Jeans', imageUrl: '/jeans.jpg' },
  { href: '/t-shirts', name: 'T-shirts', imageUrl: '/tshirts.jpg' },
  { href: '/shoes', name: 'Shoes', imageUrl: '/shoes.jpg' },
  { href: '/glasses', name: 'Glasses', imageUrl: '/glasses.jpg' },
  { href: '/jackets', name: 'Jackets', imageUrl: '/jacket1.jpg' },
  { href: '/suits', name: 'Suits', imageUrl: '/suits.jpg' },
  { href: '/bags', name: 'Bags', imageUrl: '/bags.jpg' },
  { href: '/watches', name: 'Watches', imageUrl: '/watch1.jpg' },
];
const HomePage = () => {
  const { fetchFeaturedProducts, products, isLoading } = useProductStore();
  useEffect(() => {
    fetchFeaturedProducts();
  }, [fetchFeaturedProducts]);

  //   useEffect(() => {
  //   useUserStore.getState().checkAuth(); // check login status after redirect from Google
  // }, []);

  return (
    <div className="relative min-h-screen text-white overflow-hidden ">
      <Carousel />
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-center text-5xl sm:text-6xl font-bold text-emerald-400 mb-4">
          Explore Our Categories
        </h1>
        <p className="text-center text-xl text-gray-300 mb-12">
          Discover the latest trends in eco-friendly fashion
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((category) => (
            <CategoryItem category={category} key={category.name} />
          ))}
        </div>

        {!isLoading && products.length > 0 && (
          <FeaturedProducts featuredProducts={products} />
        )}
      </div>
      <ReviewsSlider />
      <InfoCards />
      <Footer />
    </div>
  );
};

export default HomePage;
