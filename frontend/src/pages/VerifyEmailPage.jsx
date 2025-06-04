import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { ShieldCheck, RefreshCcw } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useUserStore } from '../stores/useUserStore';

const VerifyEmailPage = () => {
  const [code, setCode] = useState('');
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const email = searchParams.get('email');

  const { verifyEmail, resendVerificationCode, loading } = useUserStore();

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!email || !code) {
      return toast.error('Email or verification code is missing.');
    }

    try {
      await verifyEmail(email, code);
      setTimeout(() => {
        // navigate('/');
        window.location.href = `/`;
      }, 1500);
    } catch (error) {
      console.log(error);
    }
  };

  const handleResend = async () => {
    if (!email) return toast.error('Missing email');

    try {
      await resendVerificationCode(email);
      // toast.success('New verification code sent!');
      // eslint-disable-next-line
    } catch (error) {
      toast.error('Failed to resend code.');
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
          Verify your email
        </h2>

        <p className="text-sm text-gray-300 text-center mb-4">
          Enter the verification code sent to{' '}
          <span className="font-medium">{email}</span>
        </p>

        <form onSubmit={handleVerify} className="space-y-6">
          <div>
            <label
              htmlFor="code"
              className="block text-sm font-medium text-gray-300 mb-1"
            >
              Verification Code
            </label>
            <div className="relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <ShieldCheck
                  className="h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
              </div>
              <input
                id="code"
                type="text"
                required
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="block w-full px-3 py-2 pl-10 bg-gray-700 border border-gray-600 
                  rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-emerald-500 
                  focus:border-emerald-500 sm:text-sm text-white"
                placeholder="Enter code"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent 
              rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600
              hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2
              focus:ring-emerald-500 transition duration-150 ease-in-out cursor-pointer"
            disabled={loading}
          >
            {loading ? 'Verifying...' : 'Verify Email'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-400 text-sm mb-2">Didn't receive the code?</p>
          <button
            onClick={handleResend}
            disabled={loading}
            className="flex items-center justify-center gap-2 text-sm text-emerald-400 hover:underline disabled:opacity-60 cursor-pointer"
          >
            <RefreshCcw className="w-4 h-4" /> Resend Code
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmailPage;
