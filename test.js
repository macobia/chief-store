//TODO: add test for payment in frontend flutterwave issues use this to resolve in the future

// . Create Payment Button
// components/CheckoutButton.jsx
// import axios from 'axios';

// export default function CheckoutButton({ user }) {
//     const handleCheckout = async () => {
//         const res = await axios.post('/api/payment/create-payment', {
//             amount: 5000,
//             email: user.email,
//             name: user.name,
//         });
//         window.location.href = res.data.link; // redirect to Flutterwave payment
//     };

//     return (
//         <button onClick={handleCheckout} className="btn btn-primary">
//             Pay ₦5000
//         </button>
//     );
// }


// Payment Status Page

// pages/PaymentStatus.jsx
// import { useEffect, useState } from 'react';
// import { useSearchParams } from 'react-router-dom';
// import axios from 'axios';

// export default function PaymentStatus() {
//     const [status, setStatus] = useState('loading');
//     const [searchParams] = useSearchParams();
//     const tx_ref = searchParams.get('tx_ref');

//     useEffect(() => {
//         const verifyPayment = async () => {
//             try {
//                 const res = await axios.post('/api/payment/verify-payment', { tx_ref });
//                 if (res.data.success) {
//                     setStatus('success');
//                 } else {
//                     setStatus('failed');
//                 }
//             } catch (err) {
//                 setStatus('error');
//             }
//         };
//         verifyPayment();
//     }, [tx_ref]);

//     if (status === 'loading') return <p>Verifying payment...</p>;
//     if (status === 'success') return <p>✅ Payment Successful!</p>;
//     if (status === 'failed') return <p>❌ Payment Failed or Cancelled.</p>;
//     return <p>⚠️ Error verifying payment.</p>;
// }

const startDate = new Date();
console.log(startDate);


const startDate1 = Date.now();
console.log(startDate1);


const startDate11 = Date();
console.log(startDate11);

