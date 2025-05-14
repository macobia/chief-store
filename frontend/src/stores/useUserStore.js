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
            set({user: res.data.user, loading: false});
            toast.success(res.data.message);
             
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
            set({checkingAuth: false, user: null});
            // toast.error( error.response.data.message || "An error occurred during logout");
        }
    }
   
   
    // signup: async () => {},
    // signup: async () => {},
 
}))

export default useUserStore