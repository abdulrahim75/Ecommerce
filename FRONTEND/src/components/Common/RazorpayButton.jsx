import React from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';

// Pass the cart total as a prop
const RazorpayButton = ({ amount, onPaymentSuccess }) => {
    const { user } = useSelector((state) => {
        console.log(state);
        return state.auth;
    });
    const { checkout } = useSelector((state) => state.checkout);
    console.log(user);

    const handlePayment = async () => {
        try {
            // 1. Create a Razorpay Order on your backend
            const { data: order } = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/api/orders/create-razorpay-order`,
                { amount }
            );

            // 2. Configure Razorpay options
            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID, // You need to add this to your .env file
                amount: order.amount,
                currency: order.currency,
                name: 'M4x E-commerce',
                description: 'Thank you for your purchase',
                image: 'your_logo_url_here', // Optional
                order_id: order.id,
                handler: async function (response) {
                    // 3. This function is called after a successful payment
                    try {
                        const verificationData = {
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                            my_db_order_id: checkout._id, // Pass your own order ID here
                        };

                        // 4. Verify the payment on your backend
                        const { data } = await axios.post(
                            `${import.meta.env.VITE_BACKEND_URL}/api/orders/verify-payment`,
                            verificationData
                        );

                        if (data.status === 'success') {
                            // Call a function passed from the parent component
                            // to handle post-payment logic (e.g., redirect to success page)
                            onPaymentSuccess(response.razorpay_payment_id);
                        }
                    } catch (error) {
                        console.error('Payment verification failed', error);
                        alert('Payment verification failed. Please contact support.');
                    }
                },
                prefill: {
                    name: user.name,
                    email: user.email,
                    // contact: '9999999999' // Optional
                },
                notes: {
                    address: 'Your customer address',
                },
                theme: {
                    color: '#3399cc',
                },
            };

            // 5. Open the Razorpay checkout modal
            const rzp = new window.Razorpay(options);
            rzp.open();
        } catch (error) {
            console.error('Error creating Razorpay order', error.message);
        }
    };

    return (
        <button
            onClick={handlePayment}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
        >
            Pay with Razorpay
        </button>
    );
};

export default RazorpayButton;