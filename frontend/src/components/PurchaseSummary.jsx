import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Package, ShoppingCart, DollarSign } from 'lucide-react';
import axios from '../lib/axios';
import LoadingSpinner from './LoadingSpinner';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const PurchaseSummary = () => {
  const [summary, setSummary] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPurchaseHistory = async () => {
      try {
        const response = await axios.get(
          '/userManagement/users/purchase-history'
        );
        setSummary(response.data);
      } catch (err) {
        console.error('Error fetching purchase history:', err);
        setError(err.response?.data?.message || 'Something went wrong');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPurchaseHistory();
  }, []);

  if (isLoading) return <LoadingSpinner />;
  if (error)
    return <div className="text-red-400 text-center mt-8">{error}</div>;

  const {
    totalProductsBought,
    totalQuantity,
    totalAmountSpent,
    monthlyChartData = [],
  } = summary;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
      <h2 className="text-2xl font-semibold text-white mb-6 text-center">
        Your Purchase Summary
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        <SummaryCard
          title="Total Products Bought"
          value={totalProductsBought}
          icon={Package}
          color="from-blue-500 to-indigo-700"
        />
        <SummaryCard
          title="Total Quantity"
          value={totalQuantity}
          icon={ShoppingCart}
          color="from-emerald-500 to-green-700"
        />
        <SummaryCard
          title="Total Amount Spent"
          value={`₦${totalAmountSpent.toLocaleString(undefined, {
            minimumFractionDigits: 2,
          })}`}
          icon={DollarSign}
          color="from-yellow-500 to-orange-700"
        />
      </div>

      {/* 🎯 Chart Section */}
      <motion.div
        className="bg-gray-800/60 rounded-lg p-6 shadow-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h3 className="text-white text-lg mb-4">Monthly Spending & Quantity</h3>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={monthlyChartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" stroke="#D1D5DB" />
            <YAxis yAxisId="left" stroke="#D1D5DB" />
            <YAxis yAxisId="right" orientation="right" stroke="#D1D5DB" />
            <Tooltip />
            <Legend />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="amountSpent"
              stroke="#10B981"
              activeDot={{ r: 8 }}
              name="Amount Spent"
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="totalQuantity"
              stroke="#3B82F6"
              activeDot={{ r: 8 }}
              name="Quantity"
            />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>
    </div>
  );
};

export default PurchaseSummary;

// Summary Card Component
const SummaryCard = ({ title, value, icon: Icon, color }) => (
  <motion.div
    className="relative bg-gray-800 rounded-lg p-6 shadow-lg overflow-hidden"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    <div className="flex justify-between items-center z-10 relative">
      <div>
        <p className="text-gray-300 text-sm font-semibold mb-1">{title}</p>
        <h3 className="text-white text-3xl font-bold">{value}</h3>
      </div>
    </div>
    <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-30`} />
    <div className="absolute -bottom-4 -right-4 text-white opacity-10">
      <Icon className="h-32 w-32" />
    </div>
  </motion.div>
);
