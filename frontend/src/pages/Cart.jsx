import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TrashIcon, PlusIcon, MinusIcon } from '@heroicons/react/24/outline';
import { useCartStore } from '../context/cartStore';
import { useAuthStore } from '../context/authStore';
import { ordersApi } from '../utils/apiClient';
import toast from 'react-hot-toast';

const Cart = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { items, removeItem, updateQuantity, getCartTotal, clearCart } = useCartStore();
  const [checkoutStep, setCheckoutStep] = useState(1);
  const [shippingInfo, setShippingInfo] = useState({
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: ''
  });
  const [paymentMethod, setPaymentMethod] = useState('card');

  const handleQuantityChange = (productId, currentQuantity, change) => {
    const newQuantity = currentQuantity + change;
    if (newQuantity > 0) {
      updateQuantity(productId, newQuantity);
    }
  };

  const handleCheckout = async () => {
    try {
      if (!user) {
        navigate('/auth');
        return;
      }

      const orderData = {
        items: items.map(item => ({
          productId: item._id,
          quantity: item.quantity
        })),
        shippingAddress: shippingInfo,
        paymentMethod
      };

      await ordersApi.create(orderData);
      
      // Clear cart and navigate to success page
      clearCart();
      navigate('/order-success');
      toast.success('Order placed successfully!');
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error(error.response?.data?.message || 'Failed to place order');
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-900">Your cart is empty</h2>
          <p className="mt-2 text-gray-500">Add some products to your cart to see them here.</p>
          <button
            onClick={() => navigate('/products')}
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Shopping Cart</h2>
          <div className="space-y-4">
            {items.map((item) => (
              <div key={item._id} className="flex items-center bg-white p-4 rounded-lg shadow">
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="w-24 h-24 object-cover rounded-md"
                />
                <div className="ml-4 flex-1">
                  <h3 className="text-lg font-medium text-gray-900">{item.name}</h3>
                  <p className="text-gray-500">${item.price.toFixed(2)}</p>
                  <div className="flex items-center mt-2">
                    <button
                      onClick={() => handleQuantityChange(item._id, item.quantity, -1)}
                      className="p-1 rounded-full hover:bg-gray-100"
                    >
                      <MinusIcon className="h-5 w-5 text-gray-500" />
                    </button>
                    <span className="mx-2">{item.quantity}</span>
                    <button
                      onClick={() => handleQuantityChange(item._id, item.quantity, 1)}
                      className="p-1 rounded-full hover:bg-gray-100"
                    >
                      <PlusIcon className="h-5 w-5 text-gray-500" />
                    </button>
                  </div>
                </div>
                <div className="flex items-center">
                  <button
                    onClick={() => removeItem(item._id)}
                    className="p-2 text-red-600 hover:text-red-800"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Checkout Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>
            
            {checkoutStep === 1 && (
              <div className="space-y-4">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>${getCartTotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                <div className="border-t pt-4">
                  <div className="flex justify-between font-semibold text-gray-900">
                    <span>Total</span>
                    <span>${getCartTotal().toFixed(2)}</span>
                  </div>
                </div>
                <button
                  onClick={() => setCheckoutStep(2)}
                  className="w-full mt-4 bg-primary-600 text-white py-2 px-4 rounded-md hover:bg-primary-700"
                >
                  Proceed to Checkout
                </button>
              </div>
            )}

            {checkoutStep === 2 && (
              <div className="space-y-4">
                <h3 className="font-medium text-gray-900">Shipping Information</h3>
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Address"
                    value={shippingInfo.address}
                    onChange={(e) => setShippingInfo({ ...shippingInfo, address: e.target.value })}
                    className="w-full px-3 py-2 border rounded-md"
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="City"
                      value={shippingInfo.city}
                      onChange={(e) => setShippingInfo({ ...shippingInfo, city: e.target.value })}
                      className="w-full px-3 py-2 border rounded-md"
                    />
                    <input
                      type="text"
                      placeholder="State"
                      value={shippingInfo.state}
                      onChange={(e) => setShippingInfo({ ...shippingInfo, state: e.target.value })}
                      className="w-full px-3 py-2 border rounded-md"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="ZIP Code"
                      value={shippingInfo.zipCode}
                      onChange={(e) => setShippingInfo({ ...shippingInfo, zipCode: e.target.value })}
                      className="w-full px-3 py-2 border rounded-md"
                    />
                    <input
                      type="text"
                      placeholder="Country"
                      value={shippingInfo.country}
                      onChange={(e) => setShippingInfo({ ...shippingInfo, country: e.target.value })}
                      className="w-full px-3 py-2 border rounded-md"
                    />
                  </div>
                </div>
                <button
                  onClick={() => setCheckoutStep(3)}
                  className="w-full mt-4 bg-primary-600 text-white py-2 px-4 rounded-md hover:bg-primary-700"
                >
                  Continue to Payment
                </button>
              </div>
            )}

            {checkoutStep === 3 && (
              <div className="space-y-4">
                <h3 className="font-medium text-gray-900">Payment Method</h3>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="card"
                      checked={paymentMethod === 'card'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="mr-2"
                    />
                    Credit Card
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="paypal"
                      checked={paymentMethod === 'paypal'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="mr-2"
                    />
                    PayPal
                  </label>
                </div>
                <button
                  onClick={handleCheckout}
                  className="w-full mt-4 bg-primary-600 text-white py-2 px-4 rounded-md hover:bg-primary-700"
                >
                  Place Order
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart; 