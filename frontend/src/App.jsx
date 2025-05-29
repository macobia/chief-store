import { Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage.jsx';
import CartPage from './pages/CartPage';
import ItemPage from './pages/ItemPage';

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

import Navbar from './components/Navbar.jsx';

import { Toaster } from 'react-hot-toast';
import { useUserStore } from './stores/useUserStore';
import React, { Suspense, useEffect } from 'react';
import LoadingSpinner from './components/LoadingSpinner.jsx';
import { useCartStore } from './stores/useCartStore.js';
import PurchaseSuccessPage from './pages/PurchaseSuccessPage';
import AdminPage from './pages/AdminPage';

// used lazy loading for code splitting and better performance
// const HomePage = React.lazy(() => import('./pages/HomePage.jsx'));
const SignUpPage = React.lazy(() => import('./pages/SignUpPage.jsx'));
const LoginPage = React.lazy(() => import('./pages/LoginPage.jsx'));
const ForgotPassPage = React.lazy(() => import('./pages/ForgotPassPage.jsx'));
const ResetPassPage = React.lazy(() => import('./pages/ResetPassPage.jsx'));
// const AdminPage = React.lazy(() => import('./pages/AdminPage.jsx'));
const UserPage = React.lazy(() => import('./pages/UserPage.jsx'));
const CategoryPage = React.lazy(() => import('./pages/CategoryPage.jsx'));
const ProductPage = React.lazy(() => import('./pages/ProductPage.jsx'));

function App() {
  // const token = useTokenStore((state) => state.token);
  const { user, checkAuth, checkingAuth } = useUserStore();

  const { getCartItems } = useCartStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (!user) {
      return;
    }
    getCartItems();
  }, [getCartItems, user]);

  if (checkingAuth) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white relative overflow-hidden">
      <Toaster position="top-right" reverseOrder={false} />
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.3)_0%,rgba(10,80,60,0.2)_45%,rgba(0,0,0,0.1)_100%)]" />
        </div>
      </div>

      <div className="relative z-50 pt-20">
        <Navbar />
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route
              path="/signup"
              element={!user ? <SignUpPage /> : <Navigate to="/" />}
            />
            {/* <Route path='/login' element={ <LoginPage/>}/> */}
            <Route
              path="/login"
              element={
                !user ? (
                  <LoginPage />
                ) : (
                  <Navigate to={user?.role ? '/secret-dashboard' : '/'} />
                )
              }
            />
            <Route
              path="/secret-dashboard"
              element={
                user?.role === 'admin' ? (
                  <AdminPage />
                ) : (
                  <Navigate to="/login" />
                )
              }
            />

            <Route path="/category/:category" element={<CategoryPage />} />
            <Route
              path="/cart"
              element={user ? <CartPage /> : <Navigate to="/login" />}
            />
            <Route
              path="/user"
              element={user ? <UserPage /> : <Navigate to="/login" />}
            />
            <Route
              path="/purchase-success"
              element={
                user ? <PurchaseSuccessPage /> : <Navigate to="/login" />
              }
            />
            <Route path="/products" element={<ProductPage />} />
            <Route path="/products/:id" element={<ItemPage />} />

            <Route path="/forgot-password" element={<ForgotPassPage />} />
            <Route
              path="/reset-password/:token"
              element={!user ? <ResetPassPage /> : <Navigate to="/" replace />}
            />
          </Routes>
        </Suspense>
      </div>
    </div>
  );
}

export default App;
