import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { Mail } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from '../lib/axios';

const ForgotPassPage = () => {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post('/auth/forgot-password', { email });
      toast.success(res.data.message || 'Reset link sent to your email');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4">
      <div className="w-full max-w-md bg-gray-800 py-8 px-6 shadow rounded-lg">
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-1 bg-emerald-600 text-white rounded hover:bg-emerald-700 transition"
          >
            Go back
          </button>
        </div>

        <h2 className="text-center text-2xl font-bold text-gray-100 mb-6">
          Forgot your password?
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-300 mb-1"
            >
              Email address
            </label>
            <div className="relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" aria-hidden="true" />
              </div>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full px-3 py-2 pl-10 bg-gray-700 border border-gray-600 
                  rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-emerald-500 
                  focus:border-emerald-500 sm:text-sm text-white"
                placeholder="you@example.com"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent 
              rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600
              hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2
              focus:ring-emerald-500 transition duration-150 ease-in-out cursor-pointer"
          >
            Reset Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassPage;
