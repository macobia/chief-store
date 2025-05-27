import React, { useEffect, useState } from 'react'

import { ArrowRight, CheckCircle, HandHeart } from "lucide-react";
import { Link } from "react-router-dom";
import { useCartStore } from "../stores/useCartStore";
import axios from "../lib/axios";
import Confetti from "react-confetti";
import toast from 'react-hot-toast';

const PurchaseSuccessPage = () => {
	const [isProcessing, setIsProcessing] = useState(true);
	const [isApproved, setIsApproved] = useState(false);
	const [orderId, setOrderId] = useState(null);
	const [hasTriggeredAfterApprove, setHasTriggeredAfterApprove] = useState(false);
	
	const [error, setError] = useState(null);

	const { clearCart } = useCartStore();

	const [billingInfo, setBillingInfo] = useState({
		street: "",
		city: "",
		state: "",
		country: "",
		postal_code: "",
	});
	


	useEffect(() => {

		const queryParams = new URLSearchParams(window.location.search);
		const transaction_id = queryParams.get("transaction_id");

		if (!transaction_id) {
		setIsProcessing(false);
		setError("No session ID found in the URL");
		return;
	}

	// Check if we've already processed this transaction
	if (localStorage.getItem(`processed_${transaction_id}`)) {
		setIsProcessing(false);
		toast.error("This transaction has already been processed.");
		// setError("This transaction has already been processed.");
		return;
	}


		// Extract billing fields
		const street = queryParams.get("street") || "";
		const city = queryParams.get("city") || "";
		const state = queryParams.get("state") || "";
		const country = queryParams.get("country") || "";
		const postal_code = queryParams.get("postal_code") || "";

		setBillingInfo({
   		 street,
  		 city,
   		 state,
   		 country,
   		 postal_code,
  		});

	
		const handleCheckoutSuccess = async (transaction_id) => {
			try {
				const res =  await axios.post("/payments/checkout-success", {
					transaction_id,
					street,
					city,
					state,
					country,
					postal_code,
				});

				localStorage.setItem(`processed_${transaction_id}`, 'true');
				setOrderId(res.data.orderId);  //store order ID in state for polling
				clearCart();
			} catch (error) {
				console.log(error);
				setError("Failed to Verify Payment");
			} finally {
				setIsProcessing(false);
			}
		};
		
		if (transaction_id) {
			handleCheckoutSuccess(transaction_id);
		} else {
			setIsProcessing(false);
			setError("No session ID found in the URL");
		}
	}, [clearCart]);

	// if (isProcessing) {
    //     return "Processing...";
    // }

	// if (error) {
    //     return `Error: ${error}`;
    // }

	
	   // Poll admin approval status every 5s
  useEffect(() => {
    if (!orderId) return;

    const interval = setInterval(async () => {
      try {
        const res = await axios.get(`/orders/${orderId}/status`);
		
        if (res.data.status === "success") {
		  
          setIsApproved(true);
          clearInterval(interval);


        //  Trigger after-approve logic only once
        if (!hasTriggeredAfterApprove) {
          try {
            await axios.post(`/payments/${orderId}/after-approve`);
            setHasTriggeredAfterApprove(true);
          } catch (err) {
            console.error("Failed to trigger /after-approve", err);
          }
        }
        }
      } catch (err) {
        console.error(err);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [orderId, hasTriggeredAfterApprove]);

   if (error) return <div className="text-center mt-20 text-red-400">{error}</div>;


	 return (
    <div className='h-screen flex items-center justify-center px-4'>
      {/* {isApproved && ( */}
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          gravity={0.1}
          style={{ zIndex: 99 }}
          numberOfPieces={700}
          recycle={false}
        />
      {/* )} */}

      <div className='max-w-md w-full bg-gray-800 rounded-lg shadow-xl overflow-hidden relative z-10'>
        <div className='p-6 sm:p-8'>
          <div className='flex justify-center'>
            <CheckCircle
              className={`w-16 h-16 mb-4 ${
                isApproved ? "text-emerald-400" : "text-yellow-400 animate-pulse"
              }`}
            />
          </div>
          <h1 className='text-2xl sm:text-3xl font-bold text-center mb-2 text-emerald-300'>
            {isApproved ? "Purchase Approved!" : "Payment Received!"}
          </h1>

          <p className='text-gray-300 text-center mb-2'>
            {isApproved
              ? "Your order has been approved and is now being processed."
              : "Payment is successful. Awaiting admin approval..."}
          </p>
          <p className='text-emerald-400 text-center text-sm mb-6'>
            Check your email for order updates.
          </p>

          <div className='bg-gray-700 rounded-lg p-4 mb-6'>
            <div className='flex items-center justify-between mb-2'>
              <span className='text-sm text-gray-400'>Order ID</span>
              <span className='text-sm font-semibold text-emerald-400'>
                #{orderId?.slice(0, 8) || "Pending"}
              </span>
            </div>
            <div className='flex items-center justify-between'>
              <span className='text-sm text-gray-400'>Estimated delivery</span>
              <span className='text-sm font-semibold text-emerald-400'>
                3-5 business days
              </span>
            </div>
            <div className='mt-4'>
              <h2 className='text-sm text-gray-400 mb-2'>Billing Address</h2>
              <ul className='text-sm text-emerald-300 space-y-1'>
                <li>{billingInfo.street}</li>
                <li>
                  {billingInfo.city}, {billingInfo.state}
                </li>
                <li>
                  {billingInfo.country} - {billingInfo.postal_code}
                </li>
              </ul>
            </div>
          </div>

          <div className='space-y-4'>
            <button className='w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300 flex items-center justify-center'>
              <HandHeart className='mr-2' size={18} />
              Thanks for trusting us!
            </button>
            <Link
              to={"/"}
              className='w-full bg-gray-700 hover:bg-gray-600 text-emerald-400 font-bold py-2 px-4  rounded-lg transition duration-300 flex items-center justify-center'
            >
              Continue Shopping
              <ArrowRight className='ml-2' size={18} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
export default PurchaseSuccessPage;