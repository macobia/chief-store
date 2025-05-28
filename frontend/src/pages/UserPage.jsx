import React, { useState } from 'react';
import {
  ShoppingBasket,
  BarChart,
  Settings as SettingsIcon,
} from 'lucide-react';
import { motion } from 'framer-motion';
import OrderTracking from '../components/OrderTracking';
import PurchaseSummary from '../components/PurchaseSummary';
import UserSetting from '../components/UserSetting';

const tabs = [
  { id: 'orders', label: 'Order Tracking', icon: ShoppingBasket },
  { id: 'summary', label: 'Purchase Summary', icon: BarChart },
  { id: 'settings', label: 'User Profile', icon: SettingsIcon },
];

const UserDashboard = () => {
  const [activeTab, setActiveTab] = useState('orders');

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <motion.h1
        className="text-4xl font-bold text-emerald-400 text-center py-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        User Dashboard
      </motion.h1>

      <div className="flex justify-center mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center px-4 py-2 mx-2 rounded-md transition duration-200 ${
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

      <div className="container mx-auto px-4 pb-16">
        {activeTab === 'orders' && <OrderTracking />}
        {activeTab === 'summary' && <PurchaseSummary />}
        {activeTab === 'settings' && <UserSetting />}
      </div>
    </div>
  );
};

export default UserDashboard;
