import { FcGoogle } from 'react-icons/fc'; // Google icon from react-icons

const GoogleLoginButton = ({ page = 'login' }) => {
  const handleGoogleLogin = () => {
    // Redirect to your backend Google OAuth route
    window.location.href = `${import.meta.env.VITE_API_URL}/api/auth/google`;
  };

  const isLogin = page === 'login';

  return (
    <button
      onClick={handleGoogleLogin}
      className="flex items-center gap-2 bg-white border border-gray-300 shadow-sm hover:shadow-md text-gray-700 font-medium px-4 py-2 rounded-lg transition-all duration-200 w-full justify-center"
    >
      <FcGoogle className="w-5 h-5" />
      {isLogin ? 'Continue with Google' : 'Sign up with Google'}
    </button>
  );
};

export default GoogleLoginButton;
