import React from 'react';
import {
  ShoppingCart,
  UserPlus,
  LogIn,
  LogOut,
  Lock,
  User,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useUserStore } from '../stores/useUserStore';
import { useCartStore } from '../stores/useCartStore';

const Navbar = () => {
  const { user, logout } = useUserStore();
  const isAdmin = (user?.role === 'admin' || user?.role === 'superAdmin');
  const userName = user?.name;
  const navigate = useNavigate();
  const { cart } = useCartStore();
  return (
    <header className="fixed top-0 left-0 w-full bg-gray-900 bg-opacity-90 backdrop-blur-md shadow-lg z-40 transition-all duration-300 border-b border-emerald-800 ">
      <div className="container mx-auto px-4 py-5">
        <div className="flex flex-wrap justify-between items-center">
          <Link
            to="/"
            className="text-2xl text-emerald-400 font-bold items-center space-x-2 flex web-title"
          >
            Chief-store
          </Link>

          <nav className="flex flex-wrap items-center gap-4">
            {!isAdmin && (
              <>
                <Link
                  to="/"
                  className="text-gray-300 hover:text-emerald-400 transition duration-300 ease-in-out"
                >
                  Home
                </Link>

                <Link
                  to="/products"
                  className="text-gray-300 hover:text-emerald-400 transition duration-300 ease-in-out"
                >
                  Shop
                </Link>

                {user && (
                  <Link
                    to="/cart"
                    className="relative group text-gray-300 hover:text-emerald-400 transition duration-300 ease-in-out"
                  >
                    <ShoppingCart
                      className="inline-block mr-1 group-hover:text-emerald-400"
                      size={20}
                    />
                    <span className="hidden sm:inline">Cart</span>
                    {cart.length > 0 && (
                      <span className="absolute -top-2 -left-2 bg-emerald-500 text-white rounded-full px-2 py-0.5 text-xs group-hover:bg-emerald-400 transition duration-300 ease-in-out">
                        {cart.length}
                      </span>
                    )}
                  </Link>
                )}
              </>
            )}

            {user && (
              <Link
                to="/user"
                className="relative group flex items-center justify-center w-9 h-9 rounded-full bg-emerald-600 text-white text-sm font-semibold overflow-hidden hover:opacity-90 transition"
                title="Profile"
              >
                {user?.image ? (
                  <img
                    src={user.image}
                    alt="User avatar"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span>{user?.name?.charAt(0).toUpperCase()}</span>
                )}
              </Link>
            )}

            {isAdmin && (
              <Link
                className="bg-emerald-700 hover:bg-emerald-600 text-white px-3 py-1 rounded-md font-medium transition duration-300 ease-in-out flex items-center"
                to="/secret-dashboard"
              >
                <Lock className="inline-block mr-1" size={18} />
                <span className="sm:inline">Admin Dashboard</span>
              </Link>
            )}

            {user ? (
              <button
                className="bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-md flex items-center transition duration-300 ease-in-out cursor-pointer"
                onClick={() => {
                  logout();
                  setTimeout(() => navigate('/'), 100);
                }}
              >
                <LogOut size={18} />
                <span className="hidden sm:inline ml-2">Log Out</span>
              </button>
            ) : (
              <>
                <Link
                  to="/signup"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white py-2 px-4 rounded-md flex items-center transition duration-300 ease-in-out"
                >
                  <UserPlus className="mr-2" />
                  Sign Up
                </Link>
                <Link
                  to="/login"
                  className="bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-md flex items-center transition duration-300 ease-in-out"
                >
                  <LogIn className="mr-2" size={18} />
                  Login
                </Link>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
