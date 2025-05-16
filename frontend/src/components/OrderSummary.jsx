import React, { useState } from 'react';
// eslint-disable-next-line
import { motion } from 'framer-motion';
import { useCartStore } from '../stores/useCartStore';
import { Link } from 'react-router-dom';
import { MoveRight } from 'lucide-react';
import axios from '../lib/axios';
import { toast } from 'react-hot-toast';
import { useUserStore } from '../stores/useUserStore';

const OrderSummary = () => {
	const { total, subtotal, coupon, isCouponApplied, cart } = useCartStore();
	const user = useUserStore((state) => state.user);

	const savings = subtotal - total;
	const formattedSubtotal = subtotal.toFixed(2);
	const formattedTotal = total.toFixed(2);
	const formattedSavings = savings.toFixed(2);


	const [showModal, setShowModal] = useState(false);
	const [billingInfo, setBillingInfo] = useState({
		street: '',
		city: '',
		state: '',
		country: '',
		postal_code: '',
	});
	

	const handleChange = (e) => {
		setBillingInfo({ ...billingInfo, [e.target.name]: e.target.value });
		
	};

	const handleProceed = () => {
	
		
		setShowModal(true); // Show billing address modal
	};
    const handlePayment = async () => {
		
        const isBillingInfoValid = Object.values(billingInfo).every(Boolean);

		if (!isBillingInfoValid) {
		  toast.error("Please fill all billing fields.");
		  return;
		}
		
        try {
      
          const res = await axios.post("/payments/create-checkout-session", {
            products : cart,
            couponCode: coupon ? coupon.code : null,
			billingInfo,
          });
    
          const {  tx_ref, redirect_url, flutterwavePublicKey, totalAmount } = res.data;
		  const productMeta = cart.map((p) => ({
			id: p._id,
			quantity: p.quantity,
			price: p.price,
		}));
		
		
    
		  //  Redirect user to Flutterwave payment link
          window.FlutterwaveCheckout({
            public_key:flutterwavePublicKey,
            tx_ref,
            amount: totalAmount.toFixed(2),
            // amount: formattedTotal ,
            currency: "NGN",
            redirect_url: redirect_url,
            customer: {
              email: user.email,
              name: user.name,

            },
            customizations: {
              title: "Product Checkout",
              description: "Purchase from Chief-Store",
            //   logo: logo,
            },
			meta: {
				userId: user.name,
				email: user.email,
				couponCode: coupon ? coupon.code : null,
				products: JSON.stringify(productMeta),
				shipping_address: billingInfo,
			  }
          });


        } catch (error) {
          console.error("Flutterwave payment error", error.message);
        toast.error("Something went wrong. Please try again.");
        }
      };


	return (<>
		<motion.div
			className='space-y-4 rounded-lg border border-gray-700 bg-gray-800 p-4 shadow-sm sm:p-6'
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5 }}
		>
			<p className='text-xl font-semibold text-emerald-400'>Order summary</p>

			<div className='space-y-4'>
				<div className='space-y-2'>
					<dl className='flex items-center justify-between gap-4'>
						<dt className='text-base font-normal text-gray-300'>Original price</dt>
						<dd className='text-base font-medium text-white'>N{formattedSubtotal}</dd>
					</dl>

					{savings > 0 && (
						<dl className='flex items-center justify-between gap-4'>
							<dt className='text-base font-normal text-gray-300'>Savings</dt>
							<dd className='text-base font-medium text-emerald-400'>-N{formattedSavings}</dd>
						</dl>
					)}

					{coupon && isCouponApplied && (
						<dl className='flex items-center justify-between gap-4'>
							<dt className='text-base font-normal text-gray-300'>Coupon ({coupon.code})</dt>
							<dd className='text-base font-medium text-emerald-400'>-{coupon.discountPercentage}%</dd>
						</dl>
					)}

					<dl className='flex items-center justify-between gap-4 border-t border-gray-600 pt-2'>
						<dt className='text-base font-bold text-white'>Total</dt>
						<dd className='text-base font-bold text-emerald-400'>N{formattedTotal}</dd>
					</dl>
				</div>

				<motion.button
					className='flex w-full items-center justify-center rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-300 cursor-pointer'
					whileHover={{ scale: 1.05 }}
					whileTap={{ scale: 0.95 }}
					onClick={handleProceed}
				>
					Proceed to Checkout
				</motion.button>

				<div className='flex items-center justify-center gap-2'>
					<span className='text-sm font-normal text-gray-400'>or</span>
					<Link
						to='/'
						className='inline-flex items-center gap-2 text-sm font-medium text-emerald-400 underline hover:text-emerald-300 hover:no-underline'
					>
						Continue Shopping
						<MoveRight size={16} />
					</Link>
				</div>
			</div>
		</motion.div>
		{showModal && (
			<div className='fixed inset-0 z-50 flex items-center justify-center bg-opacity-0.5'>
				<div className=' bg-gray-400 p-6 rounded-lg w-full max-w-md space-y-4 text-white'>
					<h2 className='text-lg font-bold text-emerald-400'>Enter Billing Address</h2>
					<input type='text' name='street' placeholder='Street' className='w-full p-2 border rounded' onChange={handleChange} />
					<input type='text' name='city' placeholder='City' className='w-full p-2 border rounded' onChange={handleChange} />
					<input type='text' name='state' placeholder='State' className='w-full p-2 border rounded' onChange={handleChange} />
					<input type='text' name='country' placeholder='Country' className='w-full p-2 border rounded' onChange={handleChange} />
					<input type='text' name='postal_code' placeholder='Postal Code' className='w-full p-2 border rounded' onChange={handleChange} />
					
					<div className='flex justify-between pt-4'>
						<button
							className='px-4 py-2 bg-gray-300 rounded hover:bg-gray-400'
							onClick={() => setShowModal(false)}
						>
							Cancel
						</button>
						<button
							className='px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700'
							onClick={() => {
								setShowModal(false);
								handlePayment();
							}}
						>
							Continue Payment
						</button>
					</div>
				</div>
			</div>
		)
	} 
    </>
	);
};

export default OrderSummary;