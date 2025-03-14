import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../context/authStore';
import { ordersApi } from '../utils/api';

const ProfilePage = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, updateProfile, logout } = useAuthStore();
  
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('profile');
  
  // Form state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: ''
  });
  
  // Update form data when user changes
  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phoneNumber: user.phoneNumber || ''
      });
    }
  }, [user]);
  
  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/auth', { state: { from: { pathname: '/profile' } } });
    }
  }, [isAuthenticated, navigate]);
  
  // Fetch user orders
  useEffect(() => {
    const fetchOrders = async () => {
      if (!isAuthenticated) return;
      
      try {
        setIsLoading(true);
        const response = await ordersApi.getAll();
        setOrders(response.data);
      } catch (err) {
        setError('Failed to load orders. Please try again later.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    
    if (activeTab === 'orders') {
      fetchOrders();
    }
  }, [isAuthenticated, activeTab]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const success = await updateProfile({
      firstName: formData.firstName,
      lastName: formData.lastName,
      phoneNumber: formData.phoneNumber
    });
    
    if (success) {
      alert('Profile updated successfully');
    }
  };
  
  const handleLogout = () => {
    logout();
    navigate('/');
  };
  
  if (!user) return null;
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">My Account</h1>
      
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <div className="md:w-1/4">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6 border-b">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                  <span className="text-primary-600 font-bold text-xl">
                    {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
                  </span>
                </div>
                <div className="ml-4">
                  <h2 className="text-lg font-semibold">{user.firstName} {user.lastName}</h2>
                  <p className="text-gray-500 text-sm">{user.email}</p>
                </div>
              </div>
            </div>
            
            <nav className="p-4">
              <ul className="space-y-2">
                <li>
                  <button
                    onClick={() => setActiveTab('profile')}
                    className={`w-full text-left px-4 py-2 rounded-md ${
                      activeTab === 'profile' 
                        ? 'bg-primary-50 text-primary-600' 
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    Profile Information
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveTab('orders')}
                    className={`w-full text-left px-4 py-2 rounded-md ${
                      activeTab === 'orders' 
                        ? 'bg-primary-50 text-primary-600' 
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    Order History
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveTab('addresses')}
                    className={`w-full text-left px-4 py-2 rounded-md ${
                      activeTab === 'addresses' 
                        ? 'bg-primary-50 text-primary-600' 
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    Addresses
                  </button>
                </li>
                <li>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 rounded-md text-red-600 hover:bg-red-50"
                  >
                    Logout
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="md:w-3/4">
          <div className="bg-white rounded-lg shadow-md p-6">
            {activeTab === 'profile' && (
              <>
                <h2 className="text-xl font-semibold mb-6">Profile Information</h2>
                
                <form onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-gray-700 font-medium mb-2" htmlFor="firstName">
                        First Name
                      </label>
                      <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-gray-700 font-medium mb-2" htmlFor="lastName">
                        Last Name
                      </label>
                      <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-2" htmlFor="email">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      disabled
                      className="w-full p-3 border border-gray-300 rounded-md bg-gray-50"
                    />
                    <p className="text-sm text-gray-500 mt-1">Email cannot be changed</p>
                  </div>
                  
                  <div className="mb-6">
                    <label className="block text-gray-700 font-medium mb-2" htmlFor="phoneNumber">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phoneNumber"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  
                  <button
                    type="submit"
                    className="btn-primary"
                  >
                    Update Profile
                  </button>
                </form>
              </>
            )}
            
            {activeTab === 'orders' && (
              <>
                <h2 className="text-xl font-semibold mb-6">Order History</h2>
                
                {isLoading ? (
                  <p>Loading orders...</p>
                ) : error ? (
                  <div className="bg-red-50 text-red-600 p-4 rounded-md">
                    {error}
                  </div>
                ) : orders.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500 mb-4">You haven't placed any orders yet.</p>
                    <button
                      onClick={() => navigate('/products')}
                      className="btn-primary"
                    >
                      Start Shopping
                    </button>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Order ID
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Date
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Total
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {orders.map(order => (
                          <tr key={order._id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              #{order._id.substring(0, 8)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {new Date(order.createdAt).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              ${order.totalAmount.toFixed(2)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                order.orderStatus === 'delivered' 
                                  ? 'bg-green-100 text-green-800' 
                                  : order.orderStatus === 'cancelled'
                                  ? 'bg-red-100 text-red-800'
                                  : 'bg-yellow-100 text-yellow-800'
                              }`}>
                                {order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              <button
                                onClick={() => navigate(`/orders/${order._id}`)}
                                className="text-primary-600 hover:text-primary-900"
                              >
                                View Details
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </>
            )}
            
            {activeTab === 'addresses' && (
              <>
                <h2 className="text-xl font-semibold mb-6">Saved Addresses</h2>
                
                {user.addresses && user.addresses.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {user.addresses.map((address, index) => (
                      <div key={index} className={`border rounded-md p-4 ${address.isDefault ? 'border-primary-500 bg-primary-50' : ''}`}>
                        {address.isDefault && (
                          <div className="text-primary-600 text-sm font-medium mb-2">Default Address</div>
                        )}
                        <p className="font-medium">{user.firstName} {user.lastName}</p>
                        <p className="text-gray-600">{address.street}</p>
                        <p className="text-gray-600">{address.city}, {address.state} {address.zipCode}</p>
                        <p className="text-gray-600">{address.country}</p>
                        
                        <div className="mt-4 flex space-x-2">
                          {!address.isDefault && (
                            <button className="text-sm text-primary-600 hover:text-primary-800">
                              Set as Default
                            </button>
                          )}
                          <button className="text-sm text-gray-600 hover:text-gray-800">
                            Edit
                          </button>
                          <button className="text-sm text-red-600 hover:text-red-800">
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500 mb-4">You don't have any saved addresses yet.</p>
                    <button className="btn-primary">
                      Add New Address
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage; 