import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Trash, Eye, Shield } from 'lucide-react';
import { useUserManagementStore } from '../stores/useUserManagementStore';

const UserDetailsModal = ({ user, onClose }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
    <div className="bg-gray-900 rounded-lg p-6 w-full max-w-2xl text-white shadow-lg">
      <h2 className="text-xl font-semibold mb-4 text-emerald-400">
        User Details
      </h2>
      <div className="space-y-2">
        <p>
          <strong>Name:</strong> {user.name || user.username}
        </p>
        <p>
          <strong>Email:</strong> {user.email}
        </p>
        <p>
          <strong>Monthly Products Bought:</strong>{' '}
          {user.monthlyStats?.totalProducts || 0}
        </p>
        <p>
          <strong>Monthly Amount Spent:</strong> ₦
          {user.monthlyStats?.totalSpent?.toFixed(2) || '0.00'}
        </p>
        <p>
          <strong>Net Total Products Bought:</strong>{' '}
          {user.netStats?.totalProducts || 0}
        </p>
        <p>
          <strong>Net Total Amount Spent:</strong> ₦
          {user.netStats?.totalSpent?.toFixed(2) || '0.00'}
        </p>
      </div>
      <button
        onClick={onClose}
        className="mt-6 px-4 py-2 bg-red-600 rounded hover:bg-red-700 transition cursor-pointer"
      >
        Close
      </button>
    </div>
  </div>
);

const UserManagement = () => {
  const { users, fetchAllUserStats, deleteUser, changeUserRole, loading } =
    useUserManagementStore();
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    fetchAllUserStats();
  }, [fetchAllUserStats]);

  const handleChangeRole = (user) => {
    const newRole = user.role === 'admin' ? 'customer' : 'admin';
    changeUserRole(user._id, newRole);
  };

  return (
    <motion.div
      className="bg-gray-800 shadow-lg rounded-lg overflow-hidden max-w-6xl mx-auto mt-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      {loading && <p className="text-center text-white py-4">Loading...</p>}

      <table className="min-w-full divide-y divide-gray-700">
        <thead className="bg-gray-700">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">
              Username
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">
              Email
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">
              Role
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-gray-800 divide-y divide-gray-700">
          {users?.map((user) => (
            <tr key={user._id} className="hover:bg-gray-700">
              <td className="px-6 py-4 whitespace-nowrap text-white">
                {user.name}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-gray-300">
                {user.email}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-gray-300">
                {user.role}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-3">
                <button
                  onClick={() => setSelectedUser(user)}
                  className="text-blue-400 hover:text-blue-300 cursor-pointer"
                  title="View Details"
                >
                  <Eye className="h-5 w-5" />
                </button>
                <button
                  onClick={() => deleteUser(user._id)}
                  className="text-red-400 hover:text-red-300 cursor-pointer"
                  title="Delete User"
                >
                  <Trash className="h-5 w-5" />
                </button>
                <button
                  onClick={() => handleChangeRole(user)}
                  className="text-yellow-400 hover:text-yellow-300 cursor-pointer"
                  title={`Change Role to ${user.role === 'admin' ? 'Customer' : 'Admin'}`}
                >
                  <Shield className="h-5 w-5" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedUser && (
        <UserDetailsModal
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
        />
      )}
    </motion.div>
  );
};

export default UserManagement;
