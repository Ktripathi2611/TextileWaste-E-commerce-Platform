import React, { useState } from 'react';
import { 
  Cog6ToothIcon, 
  ArrowPathIcon,
  CloudArrowUpIcon,
  ArrowDownTrayIcon,
  ServerIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const AdminSettings = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [generalSettings, setGeneralSettings] = useState({
    storeName: 'EcoFashion',
    storeEmail: 'contact@ecofashion.com',
    currency: 'USD',
    itemsPerPage: 12,
    enableReviews: true,
    maintenance: false
  });
  
  const [emailSettings, setEmailSettings] = useState({
    emailHost: 'smtp.example.com',
    emailPort: '587',
    emailUser: 'notifications@ecofashion.com',
    emailFromName: 'EcoFashion Store',
    enableOrderConfirmation: true,
    enableShippingUpdates: true,
    enableMarketingEmails: false
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Handle general settings change
  const handleGeneralChange = (e) => {
    const { name, value, type, checked } = e.target;
    setGeneralSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  
  // Handle email settings change
  const handleEmailChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEmailSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  
  // Handle general settings submit
  const handleGeneralSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // In a real app, you would send this data to your API
    // apiClient.post('/admin/settings/general', generalSettings)
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success('General settings updated successfully');
    }, 800);
  };
  
  // Handle email settings submit
  const handleEmailSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // In a real app, you would send this data to your API
    // apiClient.post('/admin/settings/email', emailSettings)
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success('Email settings updated successfully');
    }, 800);
  };
  
  // Handle database backup
  const handleDatabaseBackup = () => {
    toast.success('Database backup initiated');
    
    // In a real app, you would trigger a backup API call
    // apiClient.post('/admin/settings/backup')
    
    // Show success message after a delay
    setTimeout(() => {
      toast.success('Database backup completed successfully');
    }, 2000);
  };
  
  // Handle send test email
  const handleTestEmail = () => {
    toast('Sending test email...', { icon: '📧' });
    
    // In a real app, you would call an API
    // apiClient.post('/admin/settings/test-email')
    
    // Show success message after a delay
    setTimeout(() => {
      toast.success('Test email sent successfully');
    }, 1500);
  };
  
  // Render general settings tab
  const renderGeneralSettings = () => {
    return (
      <form onSubmit={handleGeneralSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="storeName" className="block text-sm font-medium text-gray-700 mb-1">
              Store Name
            </label>
            <input
              type="text"
              id="storeName"
              name="storeName"
              value={generalSettings.storeName}
              onChange={handleGeneralChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
              required
            />
          </div>
          
          <div>
            <label htmlFor="storeEmail" className="block text-sm font-medium text-gray-700 mb-1">
              Store Email
            </label>
            <input
              type="email"
              id="storeEmail"
              name="storeEmail"
              value={generalSettings.storeEmail}
              onChange={handleGeneralChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
              required
            />
          </div>
          
          <div>
            <label htmlFor="currency" className="block text-sm font-medium text-gray-700 mb-1">
              Currency
            </label>
            <select
              id="currency"
              name="currency"
              value={generalSettings.currency}
              onChange={handleGeneralChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="USD">USD - US Dollar</option>
              <option value="EUR">EUR - Euro</option>
              <option value="GBP">GBP - British Pound</option>
              <option value="CAD">CAD - Canadian Dollar</option>
              <option value="AUD">AUD - Australian Dollar</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="itemsPerPage" className="block text-sm font-medium text-gray-700 mb-1">
              Items Per Page
            </label>
            <input
              type="number"
              id="itemsPerPage"
              name="itemsPerPage"
              value={generalSettings.itemsPerPage}
              onChange={handleGeneralChange}
              min="4"
              max="100"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="enableReviews"
              name="enableReviews"
              checked={generalSettings.enableReviews}
              onChange={handleGeneralChange}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <label htmlFor="enableReviews" className="ml-2 block text-sm text-gray-700">
              Enable Product Reviews
            </label>
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="maintenance"
              name="maintenance"
              checked={generalSettings.maintenance}
              onChange={handleGeneralChange}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <label htmlFor="maintenance" className="ml-2 block text-sm text-gray-700">
              Maintenance Mode
            </label>
          </div>
        </div>
        
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            {isSubmitting ? (
              <>
                <ArrowPathIcon className="animate-spin h-5 w-5 mr-2 inline" />
                Saving...
              </>
            ) : 'Save Changes'}
          </button>
        </div>
      </form>
    );
  };
  
  // Render email settings tab
  const renderEmailSettings = () => {
    return (
      <form onSubmit={handleEmailSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="emailHost" className="block text-sm font-medium text-gray-700 mb-1">
              SMTP Host
            </label>
            <input
              type="text"
              id="emailHost"
              name="emailHost"
              value={emailSettings.emailHost}
              onChange={handleEmailChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
              required
            />
          </div>
          
          <div>
            <label htmlFor="emailPort" className="block text-sm font-medium text-gray-700 mb-1">
              SMTP Port
            </label>
            <input
              type="text"
              id="emailPort"
              name="emailPort"
              value={emailSettings.emailPort}
              onChange={handleEmailChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
              required
            />
          </div>
          
          <div>
            <label htmlFor="emailUser" className="block text-sm font-medium text-gray-700 mb-1">
              SMTP Username
            </label>
            <input
              type="text"
              id="emailUser"
              name="emailUser"
              value={emailSettings.emailUser}
              onChange={handleEmailChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
              required
            />
          </div>
          
          <div>
            <label htmlFor="emailFromName" className="block text-sm font-medium text-gray-700 mb-1">
              From Name
            </label>
            <input
              type="text"
              id="emailFromName"
              name="emailFromName"
              value={emailSettings.emailFromName}
              onChange={handleEmailChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
              required
            />
          </div>
        </div>
        
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-gray-700">Email Notifications</h3>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="enableOrderConfirmation"
              name="enableOrderConfirmation"
              checked={emailSettings.enableOrderConfirmation}
              onChange={handleEmailChange}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <label htmlFor="enableOrderConfirmation" className="ml-2 block text-sm text-gray-700">
              Order Confirmation Emails
            </label>
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="enableShippingUpdates"
              name="enableShippingUpdates"
              checked={emailSettings.enableShippingUpdates}
              onChange={handleEmailChange}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <label htmlFor="enableShippingUpdates" className="ml-2 block text-sm text-gray-700">
              Shipping Update Emails
            </label>
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="enableMarketingEmails"
              name="enableMarketingEmails"
              checked={emailSettings.enableMarketingEmails}
              onChange={handleEmailChange}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <label htmlFor="enableMarketingEmails" className="ml-2 block text-sm text-gray-700">
              Marketing Emails
            </label>
          </div>
        </div>
        
        <div className="flex justify-between">
          <button
            type="button"
            onClick={handleTestEmail}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            Send Test Email
          </button>
          
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            {isSubmitting ? (
              <>
                <ArrowPathIcon className="animate-spin h-5 w-5 mr-2 inline" />
                Saving...
              </>
            ) : 'Save Changes'}
          </button>
        </div>
      </form>
    );
  };
  
  // Render system tab
  const renderSystemSettings = () => {
    return (
      <div className="space-y-6">
        <div className="bg-gray-50 p-4 rounded-md">
          <h3 className="text-lg font-medium text-gray-900 mb-2">System Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Node.js Version</p>
              <p className="font-medium">18.14.0</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">MongoDB Version</p>
              <p className="font-medium">6.0.4</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Environment</p>
              <p className="font-medium">Production</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Last Updated</p>
              <p className="font-medium">May 15, 2023</p>
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">Database Management</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white p-4 border border-gray-200 rounded-md">
              <div className="flex items-start">
                <div className="bg-blue-100 p-2 rounded-md mr-4">
                  <CloudArrowUpIcon className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h4 className="text-md font-medium text-gray-900 mb-1">Backup Database</h4>
                  <p className="text-sm text-gray-500 mb-3">Create a backup of your database.</p>
                  <button 
                    onClick={handleDatabaseBackup}
                    className="px-3 py-1 bg-blue-100 text-blue-800 rounded-md hover:bg-blue-200 text-sm"
                  >
                    Create Backup
                  </button>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-4 border border-gray-200 rounded-md">
              <div className="flex items-start">
                <div className="bg-green-100 p-2 rounded-md mr-4">
                  <ArrowDownTrayIcon className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h4 className="text-md font-medium text-gray-900 mb-1">Export Data</h4>
                  <p className="text-sm text-gray-500 mb-3">Export your store data as CSV.</p>
                  <div className="space-x-2">
                    <button className="px-3 py-1 bg-green-100 text-green-800 rounded-md hover:bg-green-200 text-sm">
                      Products
                    </button>
                    <button className="px-3 py-1 bg-green-100 text-green-800 rounded-md hover:bg-green-200 text-sm">
                      Orders
                    </button>
                    <button className="px-3 py-1 bg-green-100 text-green-800 rounded-md hover:bg-green-200 text-sm">
                      Users
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 border border-gray-200 rounded-md">
          <div className="flex items-start">
            <div className="bg-yellow-100 p-2 rounded-md mr-4">
              <ServerIcon className="h-6 w-6 text-yellow-600" />
            </div>
            <div>
              <h4 className="text-md font-medium text-gray-900 mb-1">Clear Cache</h4>
              <p className="text-sm text-gray-500 mb-3">Clear system cache to resolve potential issues.</p>
              <button className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-md hover:bg-yellow-200 text-sm">
                Clear Cache
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  // Render security tab
  const renderSecuritySettings = () => {
    return (
      <div className="space-y-6">
        <div className="bg-white p-4 border border-gray-200 rounded-md">
          <div className="flex items-start">
            <div className="bg-purple-100 p-2 rounded-md mr-4">
              <ShieldCheckIcon className="h-6 w-6 text-purple-600" />
            </div>
            <div className="flex-1">
              <h4 className="text-md font-medium text-gray-900 mb-1">Two-Factor Authentication</h4>
              <p className="text-sm text-gray-500 mb-3">Require two-factor authentication for admin accounts.</p>
              <div className="flex items-center">
                <div className="relative inline-block w-10 mr-2 align-middle select-none">
                  <input 
                    type="checkbox" 
                    id="twoFactorAuth" 
                    className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                  />
                  <label 
                    htmlFor="twoFactorAuth" 
                    className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"
                  ></label>
                </div>
                <label htmlFor="twoFactorAuth" className="text-sm text-gray-700">Enable 2FA</label>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 border border-gray-200 rounded-md">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Admin Password Policy</h3>
          <div className="space-y-3">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="passwordExpiration"
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                defaultChecked
              />
              <label htmlFor="passwordExpiration" className="ml-2 block text-sm text-gray-700">
                Password expires after 90 days
              </label>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="passwordComplexity"
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                defaultChecked
              />
              <label htmlFor="passwordComplexity" className="ml-2 block text-sm text-gray-700">
                Require complex passwords (min. 8 chars, uppercase, lowercase, number)
              </label>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="loginAttempts"
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                defaultChecked
              />
              <label htmlFor="loginAttempts" className="ml-2 block text-sm text-gray-700">
                Lock account after 5 failed login attempts
              </label>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 border border-gray-200 rounded-md">
          <h3 className="text-lg font-medium text-gray-900 mb-4">API Access</h3>
          <div className="space-y-4">
            <p className="text-sm text-gray-500">Manage API keys for external integrations.</p>
            
            <div className="border rounded-md divide-y">
              <div className="p-3 flex justify-between items-center">
                <div>
                  <h4 className="font-medium">Shipping API</h4>
                  <p className="text-sm text-gray-500">Last used: 2 days ago</p>
                </div>
                <div>
                  <button className="px-3 py-1 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200 text-sm mr-2">
                    Revoke
                  </button>
                  <button className="px-3 py-1 bg-primary-100 text-primary-800 rounded-md hover:bg-primary-200 text-sm">
                    Regenerate
                  </button>
                </div>
              </div>
              
              <div className="p-3 flex justify-between items-center">
                <div>
                  <h4 className="font-medium">Payment Gateway</h4>
                  <p className="text-sm text-gray-500">Last used: Today</p>
                </div>
                <div>
                  <button className="px-3 py-1 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200 text-sm mr-2">
                    Revoke
                  </button>
                  <button className="px-3 py-1 bg-primary-100 text-primary-800 rounded-md hover:bg-primary-200 text-sm">
                    Regenerate
                  </button>
                </div>
              </div>
            </div>
            
            <button className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
              Create New API Key
            </button>
          </div>
        </div>
      </div>
    );
  };
  
  // Render active tab content
  const renderTabContent = () => {
    switch (activeTab) {
      case 'email':
        return renderEmailSettings();
      case 'system':
        return renderSystemSettings();
      case 'security':
        return renderSecuritySettings();
      case 'general':
      default:
        return renderGeneralSettings();
    }
  };
  
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Admin Settings</h2>
      
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <button
              onClick={() => setActiveTab('general')}
              className={`py-4 px-6 text-sm font-medium ${
                activeTab === 'general'
                  ? 'border-b-2 border-primary-500 text-primary-600'
                  : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              General
            </button>
            <button
              onClick={() => setActiveTab('email')}
              className={`py-4 px-6 text-sm font-medium ${
                activeTab === 'email'
                  ? 'border-b-2 border-primary-500 text-primary-600'
                  : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Email
            </button>
            <button
              onClick={() => setActiveTab('system')}
              className={`py-4 px-6 text-sm font-medium ${
                activeTab === 'system'
                  ? 'border-b-2 border-primary-500 text-primary-600'
                  : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              System
            </button>
            <button
              onClick={() => setActiveTab('security')}
              className={`py-4 px-6 text-sm font-medium ${
                activeTab === 'security'
                  ? 'border-b-2 border-primary-500 text-primary-600'
                  : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Security
            </button>
          </nav>
        </div>
        
        <div className="p-6">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default AdminSettings; 