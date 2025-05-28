import React, { useEffect, useState } from 'react';
import {
  BarChart,
  PlusCircleIcon,
  ShoppingBasket,
  Bell,
  Users as UsersIcon,
} from 'lucide-react';
import io from 'socket.io-client';
import axios from '../lib/axios';
// eslint-disable-next-line
import { motion } from 'framer-motion';

import AnalyticsTab from '../components/AnalyticsTab';
import CreateProductForm from '../components/CreateProductForm';
import ProductsList from '../components/ProductsList';
import UserManagement from '../components/UserManagement';
import { useProductStore } from '../stores/useProductStore';

const tabs = [
  { id: 'create', label: 'Create Product', icon: PlusCircleIcon },
  { id: 'products', label: 'Products', icon: ShoppingBasket },
  { id: 'analytics', label: 'Analytics', icon: BarChart },
  { id: 'users', label: 'User Management', icon: UsersIcon },
];

const AdminPage = () => {
  const [orders, setOrders] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [activeTab, setActiveTab] = useState('products');
  const { fetchAllProducts } = useProductStore();

  //Fetches all current orders from the backend
  // Listens for new incoming orders via a Socket.IO connection and updates the UI instantly.
  useEffect(() => {
    const fetchOrders = async () => {
      const res = await axios.get('/orders/admin');

      // Filter out orders older than 5 minutes
      const freshOrders = res.data.filter((order) => {
        const createdAt = new Date(order.createdAt);
        const now = new Date();
        return now - createdAt < 5 * 60 * 1000; // 5 minutes
      });

      setOrders(freshOrders);
    };

    fetchOrders();

    const socket = io(import.meta.env.VITE_API_URL); // backend URL

    socket.on('connect', () => {});

    socket.on('new_order', (order) => {
      const now = new Date();
      const createdAt = new Date(order.createdAt);

      if (now - createdAt < 5 * 60 * 1000) {
        // Check if the order is already in the list
        const alreadyExists = orders.some((o) => o._id === order._id);

        if (!alreadyExists) {
          // Update orders list
          setOrders((prev) => [order, ...prev]);

          // Update unreadCount if order is pending
          if (order.orderStatus === 'pending') {
            setUnreadCount((prev) => prev + 1);
          }
        }
      }
    });

    return () => socket.disconnect();
  }, []);
  // Updates the status of an order and schedules removal after 5 mins
  const updateOrderStatus = async (id, orderStatus) => {
    await axios.patch(`orders/${id}/status`, { orderStatus });

    // Update order status immediately
    setOrders((prev) =>
      prev.map((order) =>
        order._id === id ? { ...order, orderStatus } : order
      )
    );
    // Remove order from UI after 5 minutes (300,000 ms)
    setTimeout(() => {
      setOrders((prev) => prev.filter((order) => order._id !== id));
    }, 300); // 5 mins
  };
  const toggleNotifications = () => {
    setShowNotifications((prev) => {
      const newState = !prev;
      // if (newState) setUnreadCount(0); // Reset count on open
      return newState;
    });
  };

  // Fetches all current products from the backend
  useEffect(() => {
    fetchAllProducts();
  }, [fetchAllProducts]);

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* notification bell icon UI*/}

      <div className="mx-30 my-4  ">
        {/* <button onClick={() => setShowNotifications(!showNotifications)} className="relative"> */}
        <button
          onClick={toggleNotifications}
          className="relative cursor-pointer"
        >
          <Bell className="text-white " />
          {/* {unreadCount > 0 && ( */}
          <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {unreadCount}
          </span>
          {/* )}  */}
        </button>
      </div>

      {/* notification panel UI */}
      {showNotifications && (
        // <div className="absolute right-4 top-14 bg-gray-800 border border-gray-600 rounded-lg shadow-lg z-20 w-[90vw] sm:w-[600px] p-4">
        <div className="absolute right-4 top-14 bg-gray-800 border border-gray-600 rounded-lg shadow-lg z-20 w-[95vw] max-w-7xl p-4 overflow-x-auto">
          <h3 className="text-lg font-semibold text-white mb-4">New Orders</h3>
          <button
            className="bg-red-600 hover:bg-red-700 text-white text-sm px-3 py-1 rounded"
            onClick={() => setOrders([])}
          >
            Clear All
          </button>
          {/* <table className="w-full text-sm text-white"> */}
          <table className="w-full min-w-[600px] text-sm text-white">
            <thead>
              <tr className="border-b border-gray-600">
                <th className="p-2 text-left">Order ID</th>
                <th className="p-2 text-left">Session ID</th>
                {/* <th className="p-2 text-left">User ID</th> */}

                <th className="p-2 text-left">User Name</th>
                <th className="p-2 text-left">Email</th>
                <th className="p-2 text-left">Transaction Time</th>
                <th className="p-2 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id} className="border-b border-gray-700">
                  <td className="p-2 text-white">{order._id}</td>
                  <td className="p-2 text-white">
                    {order.flutterwaveSessionId}
                  </td>
                  {/* <td className="p-2 text-white">{order.user?._id}</td> */}
                  <td className="p-2 text-white">{order.user?.name}</td>
                  <td className="p-2 text-white">{order.user?.email}</td>
                  <td className="p-2 text-white">
                    {/* ✅ Local time formatting */}
                    {new Date(order.createdAt).toLocaleString()}
                  </td>
                  <td className="p-2">
                    {order.orderStatus === 'pending' ? (
                      <>
                        <button
                          className="bg-emerald-600 text-white px-2 py-1 rounded mr-2 cursor-pointer"
                          onClick={() =>
                            updateOrderStatus(order._id, 'success')
                          }
                        >
                          Accept
                        </button>
                        <button
                          className="bg-red-600 text-white px-2 py-1 rounded cursor-pointer"
                          onClick={() =>
                            updateOrderStatus(order._id, 'decline')
                          }
                        >
                          Decline
                        </button>
                      </>
                    ) : (
                      <span
                        className={`px-2 py-1 rounded ${order.orderStatus === 'success' ? 'bg-green-500' : 'bg-red-500'}`}
                      >
                        {order.orderStatus}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="relative z-10 container mx-auto px-4 py-16">
        <motion.h1
          className="text-4xl font-bold mb-8 text-emerald-400 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Admin Dashboard
        </motion.h1>

        <div className="flex justify-center mb-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center px-4 py-2 mx-2 rounded-md transition-colors duration-200 cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-emerald-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              <tab.icon className="mr-2 h-5 w-5" />
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'create' && <CreateProductForm />}
        {activeTab === 'products' && <ProductsList />}
        {activeTab === 'analytics' && <AnalyticsTab />}
        {activeTab === 'users' && <UserManagement />}
      </div>
    </div>
  );
};

export default AdminPage;
