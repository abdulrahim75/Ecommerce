import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchUserOrders } from "../redux/slices/orderSlice";

const MyOrdersPage = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // Get the orders state
    const { orders, loading, error } = useSelector((state) => state.orders);
    // --- NEW: Get the logged-in user's info from the auth state ---
    const { user } = useSelector((state) => state.auth);

    useEffect(() => {
        // --- NEW: Only fetch orders IF a user is logged in ---
        if (user && user._id) {
            // Pass the user's ID to the Redux action
            dispatch(fetchUserOrders(user._id));
        } else {
            // If no user is logged in, you might want to redirect them
            // navigate('/login'); // Optional: redirect to login page
        }
        // Add user to the dependency array
    }, [dispatch, user, navigate]);

    const handleRowClick = (orderId) => {
        navigate(`/order/${orderId}`);
    };

    if (loading) return <p>Loading ...</p>;
    // If there's no user, you might not want to show an error, but an empty state
    if (!user) return <p className="text-center p-6">Please log in to see your orders.</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div className="max-w-7xl mx-auto p-4 sm:p-6">
            <h2 className="text-xl sm:text-2xl font-bold mb-6">My Orders</h2>
            <div className="relative shadow-md sm:rounded-lg overflow-hidden">
                {/* ... the rest of your table JSX remains exactly the same ... */}
                <table className="min-w-full text-left text-gray-500">
                    <thead className="bg-gray-100 text-xs uppercase text-gray-700">
                        <tr>
                            {/* <th className="px-4 py-3">Image</th> */}
                            <th className="px-4 py-3">Order ID</th>
                            <th className="px-4 py-3">Created</th>
                            <th className="px-4 py-3">Shipping Address</th>
                            <th className="px-4 py-3">Items</th>
                            <th className="px-4 py-3">Price</th>
                            <th className="px-4 py-3">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.length > 0 ? (
                            orders.map((order) => (
                                <tr key={order._id}
                                    onClick={() => handleRowClick(order._id)}
                                    className="border-b hover:border-gray-50 cursor-pointer">
                                    {/* <td className="py-2 px-4 sm:py-4 sm:px-4">
                                        <img
                                            src={order.orderItems[0].image}
                                            alt={order.orderItems[0].name}
                                            className="w-10 h-10 sm:w-12 sm:h-12 object-cover rounded-lg"
                                        />
                                    </td> */}
                                    <td className="py-2 px-2 sm:py-4 sm:px-4 font-medium text-gray-900 whitespace-nowrap">
                                        #{order._id}
                                    </td>
                                    <td className="py-2 px-2 sm:py-4 sm:px-4">
                                        {new Date(order.createdAt).toLocaleDateString()}{" "}
                                        {new Date(order.createdAt).toLocaleTimeString()}
                                    </td>
                                    <td className="py-2 px-2 sm:py-4 sm:px-4">
                                        {order.shippingAddress
                                            ? `${order.shippingAddress.city}, ${order.shippingAddress.country}`
                                            : "N/A"}
                                    </td>
                                    <td className="py-2 px-2 sm:px-4 sm:py-4">
                                        {order.orderItems.length}
                                    </td>
                                    <td className="py-2 px-2 sm:px-4 sm:py-4">
                                        {order.totalPrice}
                                    </td>
                                    <td className="py-2 px-2 sm:px-4 sm:py-4">
                                        <span
                                            className={` 
                                             ${order.isPaid ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"} 
                                             px-2 py-1 rounded-full text-xs sm:text-sm font-medium `}
                                        >
                                            {order.isPaid ? "Paid" : "Pending"}
                                        </span>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={7} className="px-4 py-4 text-center  text-gray-500">
                                    You Have No Orders.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default MyOrdersPage;