import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useUserManagementStore } from '../stores/useUserManagementStore';

const OrderTracking = () => {
  const { userOrders, fetchUserOrders, loading, error } =
    useUserManagementStore();

  useEffect(() => {
    fetchUserOrders();
  }, [fetchUserOrders]);

  return (
    <motion.div
      className="bg-gray-800 shadow-lg rounded-lg p-6 max-w-7xl mx-auto mt-6 overflow-x-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <h2 className="text-2xl font-semibold text-emerald-400 mb-4 text-center">
        Order Tracking
      </h2>

      {loading ? (
        <p className="text-white text-center py-4">Loading orders...</p>
      ) : error ? (
        <p className="text-red-400 text-center py-4">{error}</p>
      ) : userOrders.length === 0 ? (
        <p className="text-gray-400 text-center py-4">
          You have no orders yet.
        </p>
      ) : (
        <table className="min-w-full divide-y divide-gray-700">
          <thead className="bg-gray-700">
            <tr>
              <th className="px-4 py-2 text-xs font-medium text-left text-gray-300 uppercase">
                Order ID
              </th>
              <th className="px-4 py-2 text-xs font-medium text-left text-gray-300 uppercase">
                Flutterwave Session ID
              </th>
              <th className="px-4 py-2 text-xs font-medium text-left text-gray-300 uppercase">
                Product Name(s)
              </th>
              <th className="px-4 py-2 text-xs font-medium text-left text-gray-300 uppercase">
                Quantity
              </th>
              <th className="px-4 py-2 text-xs font-medium text-left text-gray-300 uppercase">
                Total Amount (₦)
              </th>
              <th className="px-4 py-2 text-xs font-medium text-left text-gray-300 uppercase">
                Status
              </th>
              <th className="px-4 py-2 text-xs font-medium text-left text-gray-300 uppercase">
                Date
              </th>
            </tr>
          </thead>
          <tbody className="bg-gray-800 divide-y divide-gray-700 text-white text-sm">
            {userOrders.map((order) => (
              <tr key={order.orderId} className="hover:bg-gray-700">
                <td className="px-4 py-3">{order.orderId}</td>
                <td className="px-4 py-3 text-xs text-gray-400">
                  {order.flutterwaveSessionId}
                </td>
                <td className="px-4 py-3 space-y-1">
                  {order.products.map((p, idx) => (
                    <p key={idx}>{p.name}</p>
                  ))}
                </td>
                <td className="px-4 py-3">
                  {order.products.reduce((total, p) => total + p.quantity, 0)}
                </td>
                <td className="px-4 py-3 font-semibold">
                  ₦{order.totalAmount.toLocaleString()}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      order.orderStatus === 'pending'
                        ? 'bg-yellow-600 text-yellow-100'
                        : order.orderStatus === 'success'
                          ? 'bg-green-600 text-green-100'
                          : 'bg-red-600 text-red-100'
                    }`}
                  >
                    {order.orderStatus}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-400">
                  {new Date(order.createdAt).toLocaleDateString()} <br />
                  <span className="text-xs">
                    {new Date(order.createdAt).toLocaleTimeString()}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </motion.div>
  );
};

export default OrderTracking;
