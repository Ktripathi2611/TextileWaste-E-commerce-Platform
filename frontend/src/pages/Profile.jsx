import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../context/authStore';
import { useCartStore } from '../context/cartStore';
import { authApi, ordersApi, supportTicketsApi } from '../utils/apiClient';
import toast from 'react-hot-toast';
import {
  UserIcon,
  ShoppingBagIcon,
  Cog6ToothIcon,
  HeartIcon,
  MapPinIcon,
  BellIcon,
  PencilIcon,
  XMarkIcon,
  CheckCircleIcon,
  ChatBubbleLeftRightIcon,
  QuestionMarkCircleIcon,
  PaperAirplaneIcon
} from '@heroicons/react/24/outline';

const WelcomeBanner = ({ user, onClose }) => {
  return (
    <div className="bg-gradient-to-r from-blue-500 to-primary-600 text-white p-6 rounded-lg mb-8 shadow-lg">
      <div className="flex justify-between items-start">
        <div className="flex items-center space-x-4">
          <div className="h-12 w-12 bg-white rounded-full flex items-center justify-center">
            <CheckCircleIcon className="h-8 w-8 text-primary-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Welcome, {user?.firstName}!</h2>
            <p className="mt-1">You're now logged in to your TextileWaste account.</p>
          </div>
        </div>
        <button onClick={onClose} className="text-white hover:text-gray-200">
          <XMarkIcon className="h-6 w-6" />
        </button>
      </div>
      <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white bg-opacity-20 p-3 rounded">
          <h3 className="font-semibold">Manage Your Profile</h3>
          <p className="text-sm">Update your personal information and preferences</p>
        </div>
        <div className="bg-white bg-opacity-20 p-3 rounded">
          <h3 className="font-semibold">Track Your Orders</h3>
          <p className="text-sm">View order history and check delivery status</p>
        </div>
        <div className="bg-white bg-opacity-20 p-3 rounded">
          <h3 className="font-semibold">Save Your Addresses</h3>
          <p className="text-sm">Add and manage shipping addresses for faster checkout</p>
        </div>
      </div>
    </div>
  );
};

const ProfileTourStep = ({ step, title, description, position, onClose, onNext, onPrev, isLastStep }) => {
  return (
    <div className={`absolute ${position} z-50 bg-white p-4 rounded-lg shadow-lg border border-primary-100 w-64`}>
      <div className="flex justify-between items-center mb-2">
        <span className="text-xs font-medium text-primary-500">Step {step}</span>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          <XMarkIcon className="h-4 w-4" />
        </button>
      </div>
      <h3 className="text-sm font-medium text-gray-900">{title}</h3>
      <p className="text-xs text-gray-500 mt-1">{description}</p>
      <div className="flex justify-between mt-4">
        {step > 1 ? (
          <button 
            onClick={onPrev}
            className="text-xs text-primary-600 hover:text-primary-700"
          >
            Previous
          </button>
        ) : (
          <div></div>
        )}
        <button 
          onClick={isLastStep ? onClose : onNext}
          className="text-xs bg-primary-600 text-white px-3 py-1 rounded hover:bg-primary-700"
        >
          {isLastStep ? 'Finish Tour' : 'Next'}
        </button>
      </div>
    </div>
  );
};

const ProfileCompletionTracker = ({ user }) => {
  // Calculate profile completion percentage
  const calculateCompletionPercentage = () => {
    let totalFields = 7; // firstName, lastName, email, username, phoneNumber, address, avatar (these are essential)
    let completedFields = 0;
    
    if (user.firstName) completedFields++;
    if (user.lastName) completedFields++;
    if (user.email) completedFields++;
    if (user.username) completedFields++;
    if (user.phoneNumber) completedFields++;
    if (user.addresses && user.addresses.length > 0) completedFields++;
    if (user.avatar) completedFields++;
    
    return Math.round((completedFields / totalFields) * 100);
  };
  
  const percentage = calculateCompletionPercentage();
  
  // Determine progress color
  const getProgressColor = () => {
    if (percentage < 50) return 'bg-red-500';
    if (percentage < 75) return 'bg-yellow-500';
    return 'bg-green-500';
  };
  
  // Determine which fields are missing
  const getMissingFields = () => {
    const missing = [];
    
    if (!user.phoneNumber) missing.push('Phone Number');
    if (!user.addresses || user.addresses.length === 0) missing.push('Address');
    if (!user.avatar) missing.push('Profile Picture');
    
    return missing;
  };
  
  const missingFields = getMissingFields();
  
  return (
    <div className="bg-white rounded-lg shadow p-4 mb-6">
      <h3 className="font-medium text-gray-900 mb-2">Profile Completion</h3>
      <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
        <div className={`h-2.5 rounded-full ${getProgressColor()}`} style={{ width: `${percentage}%` }}></div>
      </div>
      <div className="flex justify-between text-sm mb-1">
        <span>{percentage}% Complete</span>
        <span className={percentage === 100 ? 'text-green-600 font-medium' : 'text-gray-500'}>
          {percentage === 100 ? 'Complete!' : `${missingFields.length} item${missingFields.length !== 1 ? 's' : ''} left`}
        </span>
      </div>
      
      {missingFields.length > 0 && (
        <div className="mt-3">
          <p className="text-xs text-gray-500 mb-2">Complete your profile by adding:</p>
          <ul className="text-xs text-gray-700 space-y-1">
            {missingFields.map((field, index) => (
              <li key={index} className="flex items-center">
                <div className="h-1.5 w-1.5 rounded-full bg-primary-500 mr-2"></div>
                {field}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

const Profile = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, updateProfile, logout } = useAuthStore();
  const { items, clearCart } = useCartStore();
  const [activeTab, setActiveTab] = useState('profile');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [showWelcomeBanner, setShowWelcomeBanner] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    addresses: []
  });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [orderLoading, setOrderLoading] = useState(true);
  const [tourStep, setTourStep] = useState(0);
  const [showTour, setShowTour] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    orderUpdates: true,
    stockNotifications: false,
    marketingEmails: false
  });
  const [tickets, setTickets] = useState([]);
  const [ticketLoading, setTicketLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [ticketForm, setTicketForm] = useState({
    subject: '',
    message: '',
    category: 'general'
  });
  const [replyText, setReplyText] = useState('');

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phoneNumber: user.phoneNumber || '',
        addresses: user.addresses || []
      });
      
      // Initialize preferences from user data if available
      if (user.preferences) {
        setPreferences({
          emailNotifications: user.preferences.emailNotifications ?? true,
          orderUpdates: user.preferences.orderUpdates ?? true,
          stockNotifications: user.preferences.stockNotifications ?? false,
          marketingEmails: user.preferences.marketingEmails ?? false
        });
      }
      
      setLoading(false);
      fetchOrders();
      
      // Check if user just logged in (coming from auth page)
      const isJustLoggedIn = location.state?.from === '/auth';
      setShowWelcomeBanner(isJustLoggedIn || localStorage.getItem('showWelcome') === 'true');
      
      // Set show tour flag if this is first login
      if (localStorage.getItem('showWelcome') === 'true') {
        localStorage.removeItem('showWelcome');
        
        // Wait a bit before showing the tour to let the welcome banner be noticed first
        const tourTimeout = setTimeout(() => {
          setShowTour(true);
          setTourStep(1);
        }, 2000);
        
        return () => clearTimeout(tourTimeout);
      }
    }
  }, [user, location]);
  
  // Effect to load tickets when active tab is support
  useEffect(() => {
    if (activeTab === 'support' && user && !ticketLoading) {
      fetchTickets();
    }
  }, [activeTab, user]);

  const fetchOrders = async () => {
    try {
      setOrderLoading(true);
      const response = await ordersApi.getAll();
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to load order history');
    } finally {
      setOrderLoading(false);
    }
  };

  const fetchTickets = async () => {
    try {
      setTicketLoading(true);
      const response = await supportTicketsApi.getAll();
      setTickets(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Error fetching support tickets:', error);
      toast.error(error.response?.data?.message || 'Failed to load support tickets');
      setTickets([]);
    } finally {
      setTicketLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateProfile(formData);
      setIsEditing(false);
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handleLogout = () => {
    logout();
    clearCart();
    navigate('/');
  };

  const handleAddAddress = () => {
    setFormData(prev => ({
      ...prev,
      addresses: [...prev.addresses, {
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: '',
        isDefault: prev.addresses.length === 0 // Make default if it's the first address
      }]
    }));
    // Switch to addresses tab after adding a new address
    setActiveTab('addresses');
    setIsEditing(true);
  };

  const handleAddressChange = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      addresses: prev.addresses.map((addr, i) => 
        i === index ? { ...addr, [field]: value } : addr
      )
    }));
  };

  const handleSetDefaultAddress = async (index) => {
    try {
      // First update formData for immediate UI feedback
      setFormData(prev => ({
        ...prev,
        addresses: prev.addresses.map((addr, i) => ({
          ...addr,
          isDefault: i === index
        }))
      }));
      
      // Then send to backend if we have an addressId
      const address = formData.addresses[index];
      if (address && address._id) {
        await authApi.setDefaultAddress(address._id);
        toast.success('Default address updated');
      } else {
        // If the address doesn't have an ID yet, update it after saving
        await handleSaveAddress(index, true);
      }
    } catch (error) {
      console.error('Error setting default address:', error);
      toast.error(error.response?.data?.message || 'Failed to update default address');
      
      // Revert the UI change if there was an error
      if (user && user.addresses) {
        setFormData(prev => ({
          ...prev,
          addresses: user.addresses
        }));
      }
    }
  };

  const handleRemoveAddress = (index) => {
    // Ensure at least one address remains as default
    let addresses = [...formData.addresses];
    const isRemovingDefault = addresses[index].isDefault;
    
    // Remove the address
    addresses = addresses.filter((_, i) => i !== index);
    
    // If we removed the default address and there are other addresses,
    // make the first one default
    if (isRemovingDefault && addresses.length > 0) {
      addresses[0].isDefault = true;
    }
    
    setFormData(prev => ({
      ...prev,
      addresses
    }));
  };

  const handleSaveAddress = async (index, isSettingDefault = false) => {
    try {
      const address = formData.addresses[index];
      if (!address.street || !address.city || !address.zipCode || !address.country) {
        toast.error('Please fill in all required address fields');
        return;
      }
      
      // Create a new address or update existing one
      const response = address._id 
        ? await authApi.updateAddress(address._id, address)
        : await authApi.addAddress(address);
      
      // If this is a new address, update the formData with the server-returned address (including its ID)
      if (!address._id) {
        const newAddresses = [...formData.addresses];
        newAddresses[index] = response.data;
        setFormData(prev => ({
          ...prev,
          addresses: newAddresses
        }));
      }
      
      toast.success('Address saved successfully');
      
      // If we're setting this as default, now is the time to do it
      if (isSettingDefault && response.data._id) {
        await authApi.setDefaultAddress(response.data._id);
        toast.success('Default address updated');
      }
      
      // Refresh user data to get updated addresses with IDs from the server
      await updateProfile(formData);
    } catch (error) {
      console.error('Error saving address:', error);
      toast.error(error.response?.data?.message || 'Failed to save address');
    }
  };

  const startTour = () => {
    setShowTour(true);
    setTourStep(1);
  };

  const closeTour = () => {
    setShowTour(false);
    setTourStep(0);
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    // Check if passwords match
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    
    if (passwordForm.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }
    
    try {
      setPasswordLoading(true);
      
      // Call password update API
      await authApi.changePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword
      });
      
      // Reset form
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      
      toast.success('Password updated successfully');
    } catch (error) {
      console.error('Error updating password:', error);
      toast.error(error.response?.data?.message || 'Failed to update password');
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      try {
        await authApi.deleteAccount();
        toast.success('Your account has been deleted');
        logout();
        navigate('/');
      } catch (error) {
        console.error('Error deleting account:', error);
        toast.error(error.response?.data?.message || 'Failed to delete account');
      }
    }
  };

  const handlePreferenceToggle = async (preference) => {
    try {
      const updatedPreferences = {
        ...preferences,
        [preference]: !preferences[preference]
      };
      
      setPreferences(updatedPreferences);
      
      // Update preferences in the backend
      await authApi.updatePreferences(updatedPreferences);
      toast.success('Preferences updated');
    } catch (error) {
      console.error('Error updating preferences:', error);
      toast.error('Failed to update preferences');
      
      // Revert the change on error
      setPreferences(preferences);
    }
  };

  const handleTicketFormChange = (e) => {
    const { name, value } = e.target;
    setTicketForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCreateTicket = async (e) => {
    e.preventDefault();
    if (!ticketForm.subject.trim() || !ticketForm.message.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      setTicketLoading(true);
      const response = await supportTicketsApi.create({
        subject: ticketForm.subject,
        description: ticketForm.message,
        category: ticketForm.category
      });
      
      toast.success('Support ticket created successfully');
      
      // Add new ticket to the list
      setTickets(prev => [response.data, ...prev]);
      
      // Reset form
      setTicketForm({
        subject: '',
        message: '',
        category: 'general'
      });
      
      // Select the new ticket to show it
      setSelectedTicket(response.data);
    } catch (error) {
      console.error('Error creating support ticket:', error);
      toast.error(error.response?.data?.message || 'Failed to create support ticket');
    } finally {
      setTicketLoading(false);
    }
  };

  const handleReplySubmit = async (e) => {
    e.preventDefault();
    if (!replyText.trim() || !selectedTicket) {
      return;
    }

    try {
      const response = await supportTicketsApi.addReply(selectedTicket._id, { message: replyText });
      
      // Update the selected ticket with the new reply
      setSelectedTicket(response.data);
      
      // Also update the ticket in the tickets list
      setTickets(tickets.map(ticket => 
        ticket._id === selectedTicket._id ? response.data : ticket
      ));
      
      // Clear the reply input
      setReplyText('');
      
      toast.success('Reply sent successfully');
    } catch (error) {
      console.error('Error sending reply:', error);
      toast.error(error.response?.data?.message || 'Failed to send reply');
    }
  };

  const handleSelectTicket = (ticket) => {
    setSelectedTicket(ticket);
  };

  const handleCloseTicket = async () => {
    if (!selectedTicket) return;
    
    try {
      setTicketLoading(true);
      const response = await supportTicketsApi.closeTicket(selectedTicket._id);
      
      // Update the selected ticket status
      setSelectedTicket(response.data);
      
      // Update the ticket in the tickets list
      setTickets(tickets.map(ticket => 
        ticket._id === selectedTicket._id ? response.data : ticket
      ));
      
      toast.success('Ticket closed successfully');
    } catch (error) {
      console.error('Error closing ticket:', error);
      toast.error(error.response?.data?.message || 'Failed to close ticket');
    } finally {
      setTicketLoading(false);
    }
  };

  const handleReopenTicket = async () => {
    if (!selectedTicket) return;
    
    try {
      setTicketLoading(true);
      const response = await supportTicketsApi.reopenTicket(selectedTicket._id);
      
      // Update the selected ticket status
      setSelectedTicket(response.data);
      
      // Update the ticket in the tickets list
      setTickets(tickets.map(ticket => 
        ticket._id === selectedTicket._id ? response.data : ticket
      ));
      
      toast.success('Ticket reopened successfully');
    } catch (error) {
      console.error('Error reopening ticket:', error);
      toast.error(error.response?.data?.message || 'Failed to reopen ticket');
    } finally {
      setTicketLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {showWelcomeBanner && user && (
        <WelcomeBanner 
          user={user} 
          onClose={() => {
            setShowWelcomeBanner(false);
            if (!localStorage.getItem('profileTourDone')) {
              startTour();
            }
          }} 
        />
      )}
      
      <div className="flex flex-col md:flex-row gap-8 relative">
        {/* Sidebar Navigation */}
        <div className="w-full md:w-64 relative">
          {showTour && tourStep === 1 && (
            <ProfileTourStep
              step={1}
              title="Navigation Menu"
              description="Use this menu to navigate between different sections of your profile."
              position="top-0 right-0 translate-x-1/2"
              onClose={closeTour}
              onNext={() => setTourStep(2)}
              onPrev={() => {}}
              isLastStep={false}
            />
          )}
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                <UserIcon className="w-6 h-6 text-primary-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold">{user?.firstName} {user?.lastName}</h2>
                <p className="text-sm text-gray-500">{user?.email}</p>
              </div>
            </div>
            <nav className="space-y-2">
              <button
                onClick={() => setActiveTab('profile')}
                className={`w-full flex items-center space-x-3 px-4 py-2 rounded-lg ${
                  activeTab === 'profile' ? 'bg-primary-50 text-primary-600' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <UserIcon className="w-5 h-5" />
                <span>Profile Information</span>
              </button>
              <button
                onClick={() => setActiveTab('orders')}
                className={`w-full flex items-center space-x-3 px-4 py-2 rounded-lg ${
                  activeTab === 'orders' ? 'bg-primary-50 text-primary-600' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <ShoppingBagIcon className="w-5 h-5" />
                <span>Order History</span>
              </button>
              <button
                onClick={() => setActiveTab('wishlist')}
                className={`w-full flex items-center space-x-3 px-4 py-2 rounded-lg ${
                  activeTab === 'wishlist' ? 'bg-primary-50 text-primary-600' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <HeartIcon className="w-5 h-5" />
                <span>Wishlist</span>
              </button>
              <button
                onClick={() => setActiveTab('addresses')}
                className={`w-full flex items-center space-x-3 px-4 py-2 rounded-lg ${
                  activeTab === 'addresses' ? 'bg-primary-50 text-primary-600' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <MapPinIcon className="w-5 h-5" />
                <span>Addresses</span>
              </button>
              <button
                onClick={() => setActiveTab('notifications')}
                className={`w-full flex items-center space-x-3 px-4 py-2 rounded-lg ${
                  activeTab === 'notifications' ? 'bg-primary-50 text-primary-600' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <BellIcon className="w-5 h-5" />
                <span>Notifications</span>
              </button>
              <button
                onClick={() => {
                  setActiveTab('support');
                  // Fetch tickets when navigating to support tab if not already loaded
                  if (tickets.length === 0 && !ticketLoading) {
                    fetchTickets();
                  }
                }}
                className={`w-full flex items-center space-x-3 px-4 py-2 rounded-lg ${
                  activeTab === 'support' ? 'bg-primary-50 text-primary-600' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <ChatBubbleLeftRightIcon className="w-5 h-5" />
                <span>Support Tickets</span>
              </button>
              <button
                onClick={() => setActiveTab('settings')}
                className={`w-full flex items-center space-x-3 px-4 py-2 rounded-lg ${
                  activeTab === 'settings' ? 'bg-primary-50 text-primary-600' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Cog6ToothIcon className="w-5 h-5" />
                <span>Settings</span>
              </button>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 relative">
          {showTour && tourStep === 2 && (
            <ProfileTourStep
              step={2}
              title="Profile Information"
              description="View and edit your personal information here."
              position="top-0 left-0"
              onClose={closeTour}
              onNext={() => setTourStep(3)}
              onPrev={() => setTourStep(1)}
              isLastStep={false}
            />
          )}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-6 relative">
              <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
              {showTour && tourStep === 3 && (
                <ProfileTourStep
                  step={3}
                  title="Logout Button"
                  description="Click here to safely log out from your account."
                  position="top-0 right-0"
                  onClose={closeTour}
                  onNext={() => {
                    setTourStep(4);
                    setActiveTab('orders');
                  }}
                  onPrev={() => setTourStep(2)}
                  isLastStep={false}
                />
              )}
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Logout
              </button>
            </div>

            {activeTab === 'profile' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold">Profile Information</h2>
                  <button
                    onClick={() => setIsEditing(!isEditing)}
                    className="flex items-center space-x-2 text-primary-600 hover:text-primary-700"
                  >
                    <PencilIcon className="w-5 h-5" />
                    <span>{isEditing ? 'Cancel' : 'Edit Profile'}</span>
                  </button>
                </div>
                
                {/* Profile Completion Tracker - only show when not editing */}
                {!isEditing && <ProfileCompletionTracker user={user} />}
                
                {/* Profile Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                    <div className="flex items-center space-x-2">
                      <ShoppingBagIcon className="w-5 h-5 text-blue-500" />
                      <h3 className="text-blue-700 font-medium">Orders</h3>
                    </div>
                    <p className="text-2xl font-bold mt-2">{orders.length}</p>
                    <p className="text-sm text-gray-500 mt-1">Total orders placed</p>
                  </div>
                  
                  <div className="bg-green-50 rounded-lg p-4 border border-green-100">
                    <div className="flex items-center space-x-2">
                      <MapPinIcon className="w-5 h-5 text-green-500" />
                      <h3 className="text-green-700 font-medium">Addresses</h3>
                    </div>
                    <p className="text-2xl font-bold mt-2">{user?.addresses?.length || 0}</p>
                    <p className="text-sm text-gray-500 mt-1">Saved addresses</p>
                  </div>
                  
                  <div className="bg-purple-50 rounded-lg p-4 border border-purple-100">
                    <div className="flex items-center space-x-2">
                      <HeartIcon className="w-5 h-5 text-purple-500" />
                      <h3 className="text-purple-700 font-medium">Wishlist</h3>
                    </div>
                    <p className="text-2xl font-bold mt-2">{user?.wishlist?.length || 0}</p>
                    <p className="text-sm text-gray-500 mt-1">Saved products</p>
                  </div>
                </div>
                
                {isEditing ? (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">First Name</label>
                        <input
                          type="text"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Last Name</label>
                        <input
                          type="text"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Email</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                      <input
                        type="tel"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                      />
                    </div>
                    <div className="flex justify-end space-x-4">
                      <button
                        type="button"
                        onClick={() => setIsEditing(false)}
                        className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
                      >
                        Save Changes
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Personal Information */}
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Personal Information</h3>
                        <div className="space-y-4">
                          <div>
                            <h4 className="text-sm font-medium text-gray-500">Full Name</h4>
                            <p className="mt-1 text-lg font-medium">{user?.firstName} {user?.lastName}</p>
                          </div>
                          <div>
                            <h4 className="text-sm font-medium text-gray-500">Email</h4>
                            <p className="mt-1 text-lg">{user?.email}</p>
                          </div>
                          <div>
                            <h4 className="text-sm font-medium text-gray-500">Phone Number</h4>
                            <p className="mt-1 text-lg">{user?.phoneNumber || 'Not provided'}</p>
                          </div>
                          <div>
                            <h4 className="text-sm font-medium text-gray-500">Username</h4>
                            <p className="mt-1 text-lg">{user?.username}</p>
                          </div>
                        </div>
                      </div>
                      
                      {/* Account Information */}
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Account Information</h3>
                        <div className="space-y-4">
                          <div>
                            <h4 className="text-sm font-medium text-gray-500">Account Type</h4>
                            <p className="mt-1 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {user?.role === 'admin' ? 'Administrator' : 'Customer'}
                            </p>
                          </div>
                          <div>
                            <h4 className="text-sm font-medium text-gray-500">Member Since</h4>
                            <p className="mt-1 text-lg">
                              {user?.createdAt 
                                ? new Date(user.createdAt).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                  })
                                : 'Not available'}
                            </p>
                          </div>
                          <div>
                            <h4 className="text-sm font-medium text-gray-500">Default Shipping Address</h4>
                            {user?.addresses?.find(addr => addr.isDefault) ? (
                              <div className="mt-1">
                                <p className="text-lg">{user.addresses.find(addr => addr.isDefault).street}</p>
                                <p className="text-gray-600">
                                  {user.addresses.find(addr => addr.isDefault).city}, {user.addresses.find(addr => addr.isDefault).state} {user.addresses.find(addr => addr.isDefault).zipCode}
                                </p>
                                <p className="text-gray-600">{user.addresses.find(addr => addr.isDefault).country}</p>
                              </div>
                            ) : (
                              <p className="mt-1 text-gray-500">No default address set</p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Recent Activity */}
                    <div className="mt-8 pt-6 border-t border-gray-200">
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h3>
                      {orders.length > 0 ? (
                        <div className="space-y-4">
                          <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                            <ul className="divide-y divide-gray-200">
                              {orders.slice(0, 3).map((order) => (
                                <li key={order._id} className="p-4 hover:bg-gray-50">
                                  <div className="flex items-center space-x-4">
                                    <div className="flex-shrink-0">
                                      <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                                        <ShoppingBagIcon className="w-5 h-5 text-primary-600" />
                                      </div>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <p className="text-sm font-medium text-gray-900 truncate">
                                        Order #{order._id.substring(order._id.length - 8)}
                                      </p>
                                      <p className="text-sm text-gray-500">
                                        {new Date(order.createdAt).toLocaleDateString()} - ${order.totalAmount.toFixed(2)}
                                      </p>
                                    </div>
                                    <div>
                                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                                        ${order.orderStatus === 'delivered' ? 'bg-green-100 text-green-800' :
                                          order.orderStatus === 'shipped' ? 'bg-blue-100 text-blue-800' :
                                          order.orderStatus === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                                          'bg-gray-100 text-gray-800'}`}>
                                        {order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)}
                                      </span>
                                    </div>
                                  </div>
                                </li>
                              ))}
                            </ul>
                            {orders.length > 3 && (
                              <div className="bg-gray-50 px-4 py-3 text-right sm:px-6">
                                <button 
                                  onClick={() => setActiveTab('orders')} 
                                  className="text-sm font-medium text-primary-600 hover:text-primary-700">
                                  View all orders
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      ) : (
                        <p className="text-gray-500">No recent activity</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'orders' && (
              <div className="relative">
                {showTour && tourStep === 4 && (
                  <ProfileTourStep
                    step={4}
                    title="Order History"
                    description="Track all your orders and check their status here."
                    position="top-0 left-0"
                    onClose={() => {
                      closeTour();
                      localStorage.setItem('profileTourDone', 'true');
                    }}
                    onNext={() => {}}
                    onPrev={() => {
                      setTourStep(3);
                      setActiveTab('profile');
                    }}
                    isLastStep={true}
                  />
                )}
                <h2 className="text-xl font-semibold mb-6">Order History</h2>
                {orderLoading ? (
                  <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
                  </div>
                ) : orders.length === 0 ? (
                  <div className="border-t border-gray-200 px-4 py-5 sm:p-6 text-center">
                    <p className="text-gray-500">You haven't placed any orders yet.</p>
                    <button
                      onClick={() => navigate('/products')}
                      className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
                    >
                      Browse Products
                    </button>
                  </div>
                ) : (
                  <div className="border-t border-gray-200 divide-y divide-gray-200">
                    {orders.map((order) => (
                      <div key={order._id} className="px-4 py-5 sm:p-6">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="text-md font-medium text-gray-900">Order #{order._id.substring(order._id.length - 8)}</h4>
                            <p className="text-sm text-gray-500">
                              Placed on {new Date(order.createdAt).toLocaleDateString()}
                            </p>
                            <p className="mt-1 text-sm text-gray-500">
                              Status: <span className="font-medium capitalize">{order.orderStatus}</span>
                            </p>
                            <p className="text-sm text-gray-500">
                              Payment: <span className="font-medium capitalize">{order.paymentStatus}</span>
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-bold text-primary-600">${order.totalAmount.toFixed(2)}</p>
                            <p className="text-sm text-gray-500">{order.items.length} item(s)</p>
                          </div>
                        </div>
                        
                        <div className="mt-4 space-y-2">
                          {order.items.map((item, index) => (
                            <div key={index} className="flex items-center space-x-4">
                              {item.product && (
                                <>
                                  <img 
                                    src={item.product.imageUrl} 
                                    alt={item.product.name} 
                                    className="w-12 h-12 object-cover rounded-md"
                                  />
                                  <div>
                                    <p className="text-sm font-medium text-gray-900">{item.product.name}</p>
                                    <p className="text-sm text-gray-500">
                                      ${item.price.toFixed(2)} x {item.quantity}
                                    </p>
                                  </div>
                                </>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'wishlist' && (
              <div>
                <h2 className="text-xl font-semibold mb-6">Wishlist</h2>
                <p className="text-gray-500 text-center py-8">Your wishlist is empty</p>
              </div>
            )}

            {activeTab === 'addresses' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold">Addresses</h2>
                  <button
                    onClick={handleAddAddress}
                    className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700"
                  >
                    Add New Address
                  </button>
                </div>
                {isEditing ? (
                  <div className="space-y-6">
                    {formData.addresses.map((address, index) => (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Street Address *</label>
                            <input
                              type="text"
                              value={address.street}
                              onChange={(e) => handleAddressChange(index, 'street', e.target.value)}
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">City *</label>
                            <input
                              type="text"
                              value={address.city}
                              onChange={(e) => handleAddressChange(index, 'city', e.target.value)}
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">State/Province</label>
                            <input
                              type="text"
                              value={address.state}
                              onChange={(e) => handleAddressChange(index, 'state', e.target.value)}
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Zip/Postal Code *</label>
                            <input
                              type="text"
                              value={address.zipCode}
                              onChange={(e) => handleAddressChange(index, 'zipCode', e.target.value)}
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Country *</label>
                            <input
                              type="text"
                              value={address.country}
                              onChange={(e) => handleAddressChange(index, 'country', e.target.value)}
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                              required
                            />
                          </div>
                          <div className="flex items-center">
                            <label className="flex items-center">
                              <input
                                type="checkbox"
                                checked={address.isDefault}
                                onChange={() => {
                                  const newAddresses = formData.addresses.map((a, i) => ({
                                    ...a,
                                    isDefault: i === index
                                  }));
                                  setFormData({...formData, addresses: newAddresses});
                                }}
                                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500 h-4 w-4"
                              />
                              <span className="ml-2 text-sm text-gray-700">Set as default address</span>
                            </label>
                          </div>
                        </div>
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => handleRemoveAddress(index)}
                            className="px-3 py-1 text-sm border border-gray-300 text-gray-700 rounded hover:bg-gray-50"
                          >
                            Remove
                          </button>
                          <button
                            onClick={() => handleSaveAddress(index)}
                            className="px-3 py-1 text-sm bg-primary-600 text-white rounded hover:bg-primary-700"
                          >
                            Save Address
                          </button>
                        </div>
                      </div>
                    ))}
                    <div className="flex justify-end mt-4">
                      <button
                        onClick={() => setIsEditing(false)}
                        className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
                      >
                        Done
                      </button>
                    </div>
                  </div>
                ) : (
                  user?.addresses?.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-gray-500 mb-4">No addresses saved</p>
                      <button
                        onClick={handleAddAddress}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
                      >
                        Add Your First Address
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {user?.addresses?.map((address, index) => (
                        <div key={index} className={`border rounded-lg p-4 ${address.isDefault ? 'border-primary-500 bg-primary-50' : ''}`}>
                          <div className="flex justify-between items-start">
                            <div>
                              {address.isDefault && (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800 mb-2">
                                  Default Address
                                </span>
                              )}
                              <p className="font-medium">{address.street}</p>
                              <p className="text-sm text-gray-500">
                                {address.city}, {address.state} {address.zipCode}
                              </p>
                              <p className="text-sm text-gray-500">{address.country}</p>
                            </div>
                            <div className="flex space-x-2">
                              {!address.isDefault && (
                                <button
                                  onClick={() => handleSetDefaultAddress(index)}
                                  className="text-sm text-primary-600 hover:text-primary-700"
                                >
                                  Set as Default
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                      <button
                        onClick={() => setIsEditing(true)}
                        className="mt-4 inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50"
                      >
                        Edit Addresses
                      </button>
                    </div>
                  )
                )}
              </div>
            )}

            {activeTab === 'notifications' && (
              <div>
                <h2 className="text-xl font-semibold mb-6">Notification Preferences</h2>
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Email Notifications</h3>
                      <p className="text-sm text-gray-500">Receive updates about your orders and account</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="sr-only peer" 
                        checked={preferences.emailNotifications}
                        onChange={() => handlePreferenceToggle('emailNotifications')}
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                    </label>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Order Updates</h3>
                      <p className="text-sm text-gray-500">Get notified about your order status</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="sr-only peer" 
                        checked={preferences.orderUpdates}
                        onChange={() => handlePreferenceToggle('orderUpdates')}
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                    </label>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Stock Notifications</h3>
                      <p className="text-sm text-gray-500">Get notified when items in your wishlist are back in stock</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="sr-only peer" 
                        checked={preferences.stockNotifications}
                        onChange={() => handlePreferenceToggle('stockNotifications')}
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                    </label>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Marketing Emails</h3>
                      <p className="text-sm text-gray-500">Receive promotions, discounts, and newsletter</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="sr-only peer" 
                        checked={preferences.marketingEmails}
                        onChange={() => handlePreferenceToggle('marketingEmails')}
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                    </label>
                  </div>
                  
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <h3 className="font-medium mb-4">Privacy Settings</h3>
                    <p className="text-sm text-gray-500 mb-4">
                      Your data privacy is important to us. You can download a copy of your data or request data deletion at any time.
                    </p>
                    <div className="flex space-x-4">
                      <button
                        onClick={() => toast.success('Data export request sent. You will receive your data within 48 hours.')}
                        className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                      >
                        Export Data
                      </button>
                      <button
                        onClick={() => toast.info('Please go to the Account Settings tab to delete your account.')}
                        className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                      >
                        Request Data Deletion
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div>
                <h2 className="text-xl font-semibold mb-6">Account Settings</h2>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-4">Change Password</h3>
                    <form onSubmit={handlePasswordSubmit} className="space-y-4 max-w-md">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Current Password</label>
                        <input
                          type="password"
                          name="currentPassword"
                          value={passwordForm.currentPassword}
                          onChange={handlePasswordChange}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">New Password</label>
                        <input
                          type="password"
                          name="newPassword"
                          value={passwordForm.newPassword}
                          onChange={handlePasswordChange}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                          required
                          minLength={6}
                        />
                        <p className="mt-1 text-xs text-gray-500">Password must be at least 6 characters long</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Confirm New Password</label>
                        <input
                          type="password"
                          name="confirmPassword"
                          value={passwordForm.confirmPassword}
                          onChange={handlePasswordChange}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                          required
                        />
                      </div>
                      <button
                        type="submit"
                        className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                        disabled={passwordLoading}
                      >
                        {passwordLoading ? (
                          <div className="flex items-center">
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Updating...
                          </div>
                        ) : (
                          'Update Password'
                        )}
                      </button>
                    </form>
                  </div>
                  <div className="border-t pt-6">
                    <h3 className="text-lg font-medium text-red-600 mb-4">Danger Zone</h3>
                    <p className="text-sm text-gray-500 mb-4">
                      Once you delete your account, there is no going back. This action cannot be undone.
                    </p>
                    <button
                      onClick={handleDeleteAccount}
                      className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
                    >
                      Delete Account
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'support' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold">Support Tickets</h2>
                  {selectedTicket ? (
                    <button
                      onClick={() => setSelectedTicket(null)}
                      className="text-primary-600 hover:text-primary-700 flex items-center space-x-1"
                      disabled={ticketLoading}
                    >
                      <span>Back to All Tickets</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        // Force refresh tickets list
                        fetchTickets();
                      }}
                      className="text-primary-600 hover:text-primary-700 flex items-center space-x-1"
                      disabled={ticketLoading}
                    >
                      <span>Refresh Tickets</span>
                      {ticketLoading && (
                        <svg className="animate-spin ml-1 h-4 w-4 text-primary-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      )}
                    </button>
                  )}
                </div>

                {ticketLoading ? (
                  <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
                  </div>
                ) : selectedTicket ? (
                  // Ticket Detail View
                  <div className="bg-white border border-gray-200 rounded-lg">
                    {/* Ticket header */}
                    <div className="border-b border-gray-200 p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-medium">{selectedTicket.subject}</h3>
                          <div className="flex items-center space-x-2 mt-1">
                            <span className="text-sm text-gray-500">
                              Opened on {new Date(selectedTicket.createdAt).toLocaleDateString()}
                            </span>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                              ${selectedTicket.status === 'open' ? 'bg-green-100 text-green-800' :
                                selectedTicket.status === 'closed' ? 'bg-gray-100 text-gray-800' :
                                selectedTicket.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                                selectedTicket.status === 'resolved' ? 'bg-purple-100 text-purple-800' :
                                'bg-yellow-100 text-yellow-800'}`}>
                              {selectedTicket.status?.split('_').map(word => 
                                word.charAt(0).toUpperCase() + word.slice(1)
                              ).join(' ') || 'Unknown'}
                            </span>
                          </div>
                          <p className="text-sm text-gray-500 mt-1">
                            Category: <span className="font-medium capitalize">{selectedTicket.category}</span>
                          </p>
                        </div>
                        <div>
                          {selectedTicket.status === 'open' || selectedTicket.status === 'in_progress' ? (
                            <button
                              onClick={handleCloseTicket}
                              className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded text-white bg-red-600 hover:bg-red-700"
                            >
                              Close Ticket
                            </button>
                          ) : (
                            <button
                              onClick={handleReopenTicket}
                              className="inline-flex items-center px-3 py-1 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50"
                            >
                              Reopen Ticket
                            </button>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Ticket conversation */}
                    <div className="p-4 space-y-4 max-h-96 overflow-y-auto">
                      {/* Original message */}
                      <div className="flex space-x-3">
                        <div className="flex-shrink-0">
                          <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                            <UserIcon className="h-6 w-6 text-primary-600" />
                          </div>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-3 flex-1">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm font-medium">{user?.firstName} {user?.lastName}</span>
                            <span className="text-xs text-gray-500">
                              {new Date(selectedTicket.createdAt).toLocaleString()}
                            </span>
                          </div>
                          <p className="text-sm text-gray-800 whitespace-pre-wrap">{selectedTicket.description || selectedTicket.message}</p>
                        </div>
                      </div>

                      {/* Replies/Messages */}
                      {selectedTicket.messages && selectedTicket.messages.map((message, index) => (
                        <div key={index} className="flex space-x-3">
                          <div className="flex-shrink-0">
                            <div className={`h-10 w-10 rounded-full ${message.sender !== user?._id ? 'bg-blue-100' : 'bg-primary-100'} flex items-center justify-center`}>
                              {message.sender !== user?._id ? (
                                <QuestionMarkCircleIcon className="h-6 w-6 text-blue-600" />
                              ) : (
                                <UserIcon className="h-6 w-6 text-primary-600" />
                              )}
                            </div>
                          </div>
                          <div className={`${message.sender !== user?._id ? 'bg-blue-50' : 'bg-gray-50'} rounded-lg p-3 flex-1`}>
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-sm font-medium">
                                {message.sender !== user?._id ? 'Support Agent' : `${user?.firstName} ${user?.lastName}`}
                              </span>
                              <span className="text-xs text-gray-500">
                                {new Date(message.createdAt).toLocaleString()}
                              </span>
                            </div>
                            <p className="text-sm text-gray-800 whitespace-pre-wrap">{message.message}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Reply form */}
                    {(selectedTicket.status === 'open' || selectedTicket.status === 'in_progress') && (
                      <div className="border-t border-gray-200 p-4">
                        <form onSubmit={handleReplySubmit} className="space-y-3">
                          <div>
                            <label htmlFor="reply" className="sr-only">Reply</label>
                            <textarea
                              id="reply"
                              name="reply"
                              rows="3"
                              value={replyText}
                              onChange={(e) => setReplyText(e.target.value)}
                              placeholder="Type your reply here..."
                              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                              required
                            ></textarea>
                          </div>
                          <div className="flex justify-end">
                            <button
                              type="submit"
                              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                            >
                              <PaperAirplaneIcon className="h-4 w-4 mr-1" />
                              Send Reply
                            </button>
                          </div>
                        </form>
                      </div>
                    )}
                  </div>
                ) : tickets.length === 0 ? (
                  // No tickets view
                  <div className="text-center py-12 bg-white border border-gray-200 rounded-lg">
                    <div className="mx-auto h-16 w-16 bg-primary-100 rounded-full flex items-center justify-center">
                      <ChatBubbleLeftRightIcon className="h-8 w-8 text-primary-600" />
                    </div>
                    <h3 className="mt-4 text-lg font-medium text-gray-900">No Support Tickets Yet</h3>
                    <p className="mt-1 text-sm text-gray-500">Create a new support ticket to get help from our team.</p>
                    <div className="mt-6">
                      <button
                        onClick={() => {
                          // Show create ticket form
                          setSelectedTicket({
                            isNewTicket: true,
                            subject: '',
                            message: '',
                            category: 'general'
                          });
                        }}
                        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                      >
                        Create New Ticket
                      </button>
                    </div>
                  </div>
                ) : selectedTicket && selectedTicket.isNewTicket ? (
                  // Create ticket form
                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Create New Support Ticket</h3>
                    <form onSubmit={handleCreateTicket} className="space-y-4">
                      <div>
                        <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
                        <select
                          id="category"
                          name="category"
                          value={ticketForm.category}
                          onChange={handleTicketFormChange}
                          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
                        >
                          <option value="general">General Inquiry</option>
                          <option value="order">Order Issue</option>
                          <option value="product">Product Question</option>
                          <option value="shipping">Shipping & Delivery</option>
                          <option value="return">Returns & Refunds</option>
                          <option value="account">Account Help</option>
                          <option value="technical">Technical Support</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                      <div>
                        <label htmlFor="subject" className="block text-sm font-medium text-gray-700">Subject</label>
                        <input
                          type="text"
                          id="subject"
                          name="subject"
                          value={ticketForm.subject}
                          onChange={handleTicketFormChange}
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="message" className="block text-sm font-medium text-gray-700">Description</label>
                        <textarea
                          id="message"
                          name="message"
                          rows="5"
                          value={ticketForm.message}
                          onChange={handleTicketFormChange}
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                          placeholder="Please provide as much detail as possible about your issue or question..."
                          required
                        ></textarea>
                      </div>
                      <div className="flex items-start">
                        <div className="flex items-center h-5">
                          <input
                            id="terms"
                            name="terms"
                            type="checkbox"
                            className="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300 rounded"
                            required
                          />
                        </div>
                        <div className="ml-3 text-sm">
                          <label htmlFor="terms" className="font-medium text-gray-700">
                            I understand that my contact details will be used to respond to this inquiry
                          </label>
                        </div>
                      </div>
                      <div className="flex justify-end space-x-3">
                        <button
                          type="button"
                          onClick={() => setSelectedTicket(null)}
                          className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                          disabled={ticketLoading}
                        >
                          {ticketLoading ? (
                            <div className="flex items-center">
                              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              Submitting...
                            </div>
                          ) : (
                            'Submit Ticket'
                          )}
                        </button>
                      </div>
                    </form>
                  </div>
                ) : (
                  // Ticket list view
                  <div>
                    <div className="flex justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">Your Tickets</h3>
                        <p className="text-sm text-gray-500">View and manage your support requests</p>
                      </div>
                      <button
                        onClick={() => {
                          // Show create ticket form
                          setSelectedTicket({
                            isNewTicket: true,
                            subject: '',
                            message: '',
                            category: 'general'
                          });
                        }}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                      >
                        New Ticket
                      </button>
                    </div>
                    <div className="bg-white shadow overflow-hidden sm:rounded-md">
                      <ul className="divide-y divide-gray-200">
                        {tickets.map((ticket) => (
                          <li key={ticket._id}>
                            <button
                              onClick={() => handleSelectTicket(ticket)}
                              className="block hover:bg-gray-50 w-full text-left"
                            >
                              <div className="px-4 py-4 sm:px-6">
                                <div className="flex items-center justify-between">
                                  <p className="text-sm font-medium text-primary-600 truncate">{ticket.subject}</p>
                                  <div className="ml-2 flex-shrink-0 flex">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                      ${ticket.status === 'open' ? 'bg-green-100 text-green-800' :
                                        ticket.status === 'closed' ? 'bg-gray-100 text-gray-800' :
                                        ticket.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                                        ticket.status === 'resolved' ? 'bg-purple-100 text-purple-800' :
                                        'bg-yellow-100 text-yellow-800'}`}>
                                      {ticket.status?.split('_').map(word => 
                                        word.charAt(0).toUpperCase() + word.slice(1)
                                      ).join(' ') || 'Unknown'}
                                    </span>
                                  </div>
                                </div>
                                <div className="mt-2 sm:flex sm:justify-between">
                                  <div className="sm:flex">
                                    <p className="flex items-center text-sm text-gray-500">
                                      <span className="truncate capitalize">{ticket.category}</span>
                                    </p>
                                  </div>
                                  <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                                    <p>
                                      Opened on {new Date(ticket.createdAt).toLocaleDateString()}
                                    </p>
                                  </div>
                                </div>
                                <div className="mt-2">
                                  <p className="text-sm text-gray-500 truncate">{ticket.description?.substring(0, 100) || ''}{ticket.description?.length > 100 ? '...' : ''}</p>
                                </div>
                                {ticket.messages && ticket.messages.length > 0 && (
                                  <div className="mt-2 flex items-center text-xs text-gray-500">
                                    <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                                      {ticket.messages.length} {ticket.messages.length === 1 ? 'reply' : 'replies'}
                                    </span>
                                    <span className="ml-2">
                                      Last update: {new Date(ticket.updatedAt).toLocaleDateString()}
                                    </span>
                                  </div>
                                )}
                              </div>
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile; 