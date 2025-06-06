import { create } from 'zustand';
import toast from 'react-hot-toast';
import axios from '../lib/axios';

export const useUserManagementStore = create((set) => ({
  users: [], // For admin: list of users if needed
  userStats: null, // For stats of a specific user
  userOrders: [], // For tracking orders of a user
  userProfile: null, // Logged-in user's profile
  loading: false,
  error: null,

  // Fetch user stats by admin (requires userId)
  fetchAllUserStats: async () => {
    set({ loading: true, error: null });
    try {
      const res = await axios.get(`/userManagement/admin/users-with-stats`);

      set({ users: res.data, loading: false }); // assuming you want to store the result in `users`
    } catch (error) {
      set({
        loading: false,
        error: error.response?.data?.message || 'Failed to fetch users stats',
      });
      toast.error(
        error.response?.data?.message || 'Failed to fetch users stats'
      );
    }
  },

  // Delete a user by admin
  deleteUser: async (userId) => {
    set({ loading: true, error: null });
    try {
      await axios.delete(`/userManagement/admin/users/${userId}`);

      // Remove the deleted user from the local state
      set((state) => ({
        users: state.users.filter((user) => user._id !== userId),
        loading: false,
      }));

      toast.success('User deleted successfully');
    } catch (error) {
      set({
        loading: false,
        error: error.response.data.message || 'Failed to delete user',
      });
      toast.error(error.response.data.message|| 'Failed to delete user');
    }
  },

  // Change user role by admin
  changeUserRole: async (userId, role) => {
    set({ loading: true, error: null });
    try {
      const res = await axios.patch(
        `/userManagement/admin/users/${userId}/role`,
        { role }
      );
      // Update user in local list if present
      set((state) => ({
        users: state.users.map((u) => (u._id === userId ? res.data.user : u)),
        loading: false,
      }));
      toast.success(res.data.message || 'User role updated');
    } catch (error) {
      set({
        loading: false,
        error: error.response.data.message || 'Failed to update user role',
      });
      toast.error(
        error.response.data.message || 'Failed to update user role'
      );
    }
  },

  // Track orders for logged-in user
  fetchUserOrders: async () => {
    set({ loading: true, error: null });
    try {
      const res = await axios.get('/userManagement/users/orders');
      set({ userOrders: res.data.orders || [], loading: false });
    } catch (error) {
      set({
        loading: false,
        error: error.res?.data?.message || 'Failed to fetch orders',
      });
      toast.error(error.res?.data?.message || 'Failed to fetch orders');
    }
  },

  // Get user purchase history
  getUserPurchaseHistory: async () => {
    try {
      const response = await axios.get(
        '/userManagement/users/purchase-history'
      );

      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error('Error fetching purchase history:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Something went wrong',
      };
    }
  },

  // Get logged-in user profile
  fetchUserProfile: async () => {
    set({ loading: true, error: null });
    try {
      const res = await axios.get('/userManagement/users/profile');
      set({ userProfile: res.data, loading: false });
    } catch (error) {
      set({
        loading: false,
        error: error.response?.data?.message || 'Failed to fetch profile',
      });
      toast.error(error.response?.data?.message || 'Failed to fetch profile');
    }
  },

  // Update logged-in user profile
  updateUserProfile: async (profileData) => {
    set({ loading: true, error: null });
    try {
      const res = await axios.patch(
        '/userManagement/users/profile',
        profileData
      );
      set({ userProfile: res.data.user, loading: false });
      toast.success(res.data.message || 'Profile updated');
    } catch (error) {
      set({
        loading: false,
        error: error.response?.data?.message || 'Failed to update profile',
      });
      toast.error(error.response?.data?.message || 'Failed to update profile');
    }
  },
}));
