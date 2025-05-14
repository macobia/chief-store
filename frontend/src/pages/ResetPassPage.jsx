
import { Lock,} from 'lucide-react';
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router-dom';
import useTokenStore from '../stores/useTokenStore';
import axios from '../lib/axios';



const ResetPassPage = () => {
    const { token } = useParams();
    const setToken = useTokenStore((state) => state.setToken);
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        setToken(token);
    }, [token, setToken]);


    const handleReset = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(`auth/reset-password/${token}`, { password });
           
            toast.success(res.data.message || "Password reset successfully");
            setTimeout(() => {
                navigate('/login');
            }, 1500);
        } catch (error) {
            toast.error(error.response.data.message || "Something went wrong");
        }
    }
    return (
        <div>
            <form action="" onSubmit={handleReset} className='space-y-6'>
                <div>
                    <label htmlFor='password' className='block text-sm font-medium text-gray-300'>
                        New Password
                    </label>
                    <div className='mt-1 relative rounded-md shadow-sm'>
                        <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                            <Lock className='h-5 w-5 text-gray-400' aria-hidden='true' />
                        </div>
                        <input
                            id='password'
                            type='password'
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className=' block w-full px-3 py-2 pl-10 bg-gray-700 border border-gray-600 
									rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm'
                            placeholder='••••••••'
                        />
                    </div>
                </div>
                <button
                    type='submit'
                    className='w-full flex justify-center py-2 px-4 border border-transparent 
							rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600
							 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2
							  focus:ring-emerald-500 transition duration-150 ease-in-out disabled:opacity-50 cursor-pointer'

                >
                    Reset Password
                </button>
            </form>
        </div>
    )
}

export default ResetPassPage