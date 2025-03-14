import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircleIcon } from '@heroicons/react/24/solid';
import { useCartStore } from '../context/cartStore';

const OrderSuccess = () => {
  const navigate = useNavigate();
  const { clearCart } = useCartStore();

  // Ensure cart is cleared when reaching this page
  useEffect(() => {
    // Clear the cart if it hasn't been cleared already
    clearCart();
  }, [clearCart]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="text-center">
            <CheckCircleIcon className="mx-auto h-12 w-12 text-green-500" />
            <h2 className="mt-4 text-2xl font-extrabold text-gray-900">
              Order Placed Successfully!
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Thank you for your purchase. We'll send you a confirmation email with your order details.
            </p>
          </div>

          <div className="mt-8 space-y-4">
            <button
              onClick={() => navigate('/products')}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Continue Shopping
            </button>
            <button
              onClick={() => navigate('/profile')}
              className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              View Order History
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess; 