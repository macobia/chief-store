import React from "react";
import Slider from "react-slick";
import { Link} from 'react-router-dom';


const Carousel = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 700,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 500, 
    arrows: false,
  };
  const imgStyle = { height: "600px",};

  return (
    <div className="w-full max-w-full mx-auto my-0 h-96 " style={imgStyle}>
    <Slider {...settings}>
      
      {/* Slide 1 */}
<div className="relative">
  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-900 opacity-50 z-10 pointer-events-none" />
  <img
    src="delivery1.jpg"
    alt="We Ship Everywhere"
    className="w-full object-cover object-center rounded-lg max-h-full"
    style={imgStyle}
  />

  <div className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center z-20 text-white p-6">
    <div className="text-center">
      <h2 className="text-5xl font-semibold">We Ship Everywhere</h2>
      <p className="text-lg">Enjoy fast and reliable delivery worldwide.</p>

      <button
        className="mt-4 px-6 py-2 bg-emerald-600 hover:bg-emerald-500 rounded-full text-white font-semibold"
      >
        <Link to={'/cart'}>Shop Now</Link>
        
      </button>
    </div>
  </div>
  </div>

      {/* Slide 2 */}
    
      <div className="relative">
  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-900 opacity-50 z-10 pointer-events-none" />
  <img
    src="product.jpg"
    alt="We Ship Everywhere"
    className="w-full object-cover rounded-lg"
    style={imgStyle}
  />
  <div className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center z-20 text-white p-6">
    <div className="text-center">
       <h2 className="text-5xl font-semibold">We Offer Quality Products</h2>
        <p className="text-lg">Our products are carefully selected for excellence.</p>

      
      <button
        className="mt-4 px-6 py-2 bg-emerald-600 hover:bg-emerald-500 rounded-full text-white font-semibold"
      >
        <Link to={'/cart'}>Shop Now</Link>
      </button>
    </div>
  </div>
  </div>

      {/* Slide 3 */}

  <div className="relative">
  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-900 opacity-50 z-10 pointer-events-none" />
  <img
    src="brand.jpg"
    alt="We Ship Everywhere"
    className="w-full object-cover rounded-lg top-0"
    style={imgStyle}
  />
  <div className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center z-20 text-white p-6">
    <div className="text-center">
       <h2 className="text-5xl font-semibold">Our Brand Story</h2>
        <p className="text-lg">Building trust and quality since day one.</p>

    
      <button
        className="mt-4 px-6 py-2 bg-emerald-600 hover:bg-emerald-500 rounded-full text-white font-semibold"
      >
       <Link to={'/cart'}>Shop Now</Link>
      </button>
    </div>
  </div>
  </div>
      
    </Slider>
  </div>
  );
};

export default Carousel;