import {create} from 'zustand';
import axios from '../lib/axios';
import {toast} from 'react-hot-toast';
import { Navigate } from 'react-router-dom';





export const useUserStore = create((set, get) => ({
    user: null,
    loading: false,
    checkingAuth: true,

    signup: async ({name, email, password, confirmPassword}) => {
        set({loading: true});
        if (password.length < 6){
            toast.error("Password should be at least 6 characters long");
            return set({loading: false});
        }
        if (password !== confirmPassword){
            toast.error("Passwords do not match");
            return set({loading: false});
           
        }
        try {
            const res = await axios.post("/auth/signup", { name, email, password });
            set({user: res.data.user, loading: false});
            toast.success(res.data.message);
             
        } catch (error) {
            set({ loading: false });
            toast.error(error.response.data.error.message || "Something went wrong");
        }
    },
    login: async ( email, password) => {
        set({loading: true});
        
        try {
            const res = await axios.post("/auth/login", { email, password });
            // console.log("user", res.data.user);
            set({user: res.data, loading: false});
            toast.success(`Welcome ${res.data.user.name}`);
            setTimeout(() => {
             toast.success(`Spend ₦2000 or more and unlock instant discounts. Let’s go!`);
            }, 5000);

             
        } catch (error) {
            set({ loading: false });
            console.log("error", error);
            toast.error(error.response.data.error.message || "Something went wrong");

            
        }
    },

    logout: async () => {
        set({loading: true});
   
        try {
            const res = await axios.post("/auth/logout");
            // console.log("user", res.data);
            toast.success(res.data.message);
            set({user: null, loading: false});
        } catch (error) {
            console.log("log-out", error)
            set({loading: false});
            // console.log("error", error);
        }
     
    },

    checkAuth: async () => {
        set({checkingAuth: true});
        try {
           const res = await axios.get("/auth/profile");
            // console.log("user", res.data);
            
            set({user:res.data, checkingAuth: false});
             
        } catch (error) {
            console.error(error);
            set({checkingAuth: false, user: null});
            // toast.error( error.response.data.message || "An error occurred during logout");
        }
    },
    refreshToken: async () => {
		// Prevent multiple simultaneous refresh attempts
		if (get().checkingAuth){ return; }

		set({ checkingAuth: true });
		try {
			const response = await axios.post("/auth/refresh-token");
			set({ checkingAuth: false });
			return response.data;
		} catch (error) {
			set({ user: null, checkingAuth: false });
			throw error;
		}
	},
   
   
 
 
}))

// Axios interceptor for token refresh
let refreshPromise = null;

axios.interceptors.response.use(
	(response) => response,
	async (error) => {
		const originalRequest = error.config;
		if (error.response?.status === 401 && !originalRequest._retry) {
			originalRequest._retry = true;

			try {
				// If a refresh is already in progress, wait for it to complete
				if (refreshPromise) {
					await refreshPromise;
					return axios(originalRequest);
				}

				// Start a new refresh process
				refreshPromise = useUserStore.getState().refreshToken();
				await refreshPromise;
				refreshPromise = null;

				return axios(originalRequest);
			} catch (refreshError) {
				// If refresh fails, redirect to login or handle as needed
				useUserStore.getState().logout();
				return Promise.reject(refreshError);
			}
		}
		return Promise.reject(error);
	}
);


// let refreshPromise = null;

// axios.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const originalRequest = error.config;

//     // Check if it's an auth error and not already retried
//     if (error.response?.status === 401 && !originalRequest._retry) {
//       originalRequest._retry = true;

//       const userStore = useUserStore.getState();

//       // If already refreshing, wait
//       if (refreshPromise) {
//         try {
//           await refreshPromise;
//           return axios(originalRequest);
//         } catch (err) {
//           userStore.logout();
//           return Promise.reject(err);
//         }
//       }

//       try {
//         // Begin new refresh
//         refreshPromise = userStore.refreshToken();
//         await refreshPromise;
//         refreshPromise = null;
//         return axios(originalRequest);
//       } catch (refreshError) {
//         userStore.logout();
//         refreshPromise = null;
//         return Promise.reject(refreshError);
//       }
//     }

//     return Promise.reject(error);
//   }
// );