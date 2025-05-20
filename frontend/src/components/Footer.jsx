import React from "react";
import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaTiktok,
  FaYoutube,
} from "react-icons/fa";
import PaymentMethods from './PaymentMethods';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-200 py-10 px-6 border-t  border-emerald-800">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Brand Section */}
        <div>
          <h2 className="web-title text-emerald-400 text-2xl font-bold ">Chief-Store</h2>
          <p className="mt-2 text-sm text-gray-400">
            Your trusted online store for premium products.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold mb-3 text-white">Quick Links</h3>
          <ul className="space-y-2 text-sm text-gray-400">
            <li><a href="/shop" className="hover:text-white">Shop</a></li>
            <li><a href="/about" className="hover:text-white">About Us</a></li>
            <li><a href="/contact" className="hover:text-white">Contact</a></li>
            <li><a href="/faq" className="hover:text-white">FAQ</a></li>
          </ul>
        </div>

        {/* Support Links */}
        <div>
          <h3 className="text-lg font-semibold mb-3 text-white">Customer Support</h3>
          <ul className="space-y-2 text-sm text-gray-400">
            <li><a href="/privacy-policy" className="hover:text-white">Privacy Policy</a></li>
            <li><a href="/terms" className="hover:text-white">Terms & Conditions</a></li>
            <li><a href="/returns" className="hover:text-white">Returns & Refunds</a></li>
          </ul>
        </div>

        {/* Newsletter & Social */}
        <div>
          <h3 className="text-lg font-semibold mb-3 text-white">Stay Updated</h3>
          <form className="flex flex-col gap-2">
            <input
              type="email"
              placeholder="Enter your email"
              className="px-3 py-2 rounded bg-gray-800 text-white focus:outline-none"
            />
            <button
              type="submit"
              className=" bg-emerald-600  hover:bg-emerald-500 transition duration-300 ease-in-out' text-white py-2 rounded cursor-pointer"
            >
              Subscribe
            </button>
          </form>
          <div className="flex gap-4 mt-4 text-white">
            <a href="https://facebook.com/ChiefStore" target="_blank" rel="noopener noreferrer"><FaFacebookF /></a>
            <a href="https://instagram.com/ChiefStore" target="_blank" rel="noopener noreferrer"><FaInstagram /></a>
            <a href="https://twitter.com/ChiefStore" target="_blank" rel="noopener noreferrer"><FaTwitter /></a>
            <a href="https://twitter.com/ChiefStore" target="_blank" rel="noopener noreferrer"><FaTiktok /></a>
            <a href="https://twitter.com/ChiefStore" target="_blank" rel="noopener noreferrer"><FaYoutube /></a>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-800 my-6" />

      {/* Payment Methods */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 px-4">
      <PaymentMethods />
      
        {/* <div className="flex items-center gap-4">
          <span className="text-sm text-gray-400">We accept:</span>
          <img
            src="https://flutterwave.com/images/payment-methods/approved-payment-methods.svg"
            alt="Flutterwave Payment Options"
            className="h-6"
          />
        </div> */}
        <p className="text-sm text-gray-500">
          © {new Date().getFullYear()} ChiefStore. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
