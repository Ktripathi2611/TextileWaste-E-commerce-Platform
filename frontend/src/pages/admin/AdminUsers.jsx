import React, { useState, useEffect } from 'react';
import { 
  EyeIcon, 
  PencilIcon, 
  TrashIcon,
  MagnifyingGlassIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  UserPlusIcon,
  ShieldCheckIcon,
  ShieldExclamationIcon
} from '@heroicons/react/24/outline';
import { adminApi } from '../../utils/apiClient';
import toast from 'react-hot-toast';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'detail'
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all'); // all, admin, customer
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1
  });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  // Fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError(null);

      try {
        // In a real implementation, this would fetch from your API
        // const response = await adminApi.getUsers({ 
        //   page: pagination.page, 
        //   limit: pagination.limit,
        //   role: filter !== 'all' ? filter : undefined,
        //   search: searchQuery || undefined
        // });
        // setUsers(response.data.users);
        // setPagination({
        //   ...pagination,
        //   total: response.data.total,
        //   totalPages: response.data.totalPages
        // });

        // Mock data for demonstration
        setTimeout(() => {
          const mockUsers = [
            {
              _id: '1',
              firstName: 'John',
              lastName: 'Doe',
              username: 'johndoe',
              email: 'john@example.com',
              role: 'customer',
              createdAt: '2023-06-15T10:30:00Z',
              phoneNumber: '+1 555-123-4567',
              addresses: [
                {
                  street: '123 Green St',
                  city: 'Eco City',
                  state: 'CA',
                  zipCode: '12345',
                  country: 'USA',
                  isDefault: true
                }
              ],
              avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
              preferences: {
                emailNotifications: true,
                orderUpdates: true
              }
            },
            {
              _id: '2',
              firstName: 'Jane',
              lastName: 'Smith',
              username: 'janesmith',
              email: 'jane@example.com',
              role: 'admin',
              createdAt: '2023-05-20T14:45:00Z',
              phoneNumber: '+1 555-987-6543',
              addresses: [],
              avatar: 'https://randomuser.me/api/portraits/women/2.jpg',
              preferences: {
                emailNotifications: true,
                orderUpdates: true
              }
            },
            {
              _id: '3',
              firstName: 'Robert',
              lastName: 'Johnson',
              username: 'robertj',
              email: 'robert@example.com',
              role: 'customer',
              createdAt: '2023-07-05T09:15:00Z',
              phoneNumber: '+1 555-789-0123',
              addresses: [
                {
                  street: '456 Earth Ave',
                  city: 'Green Town',
                  state: 'NY',
                  zipCode: '54321',
                  country: 'USA',
                  isDefault: true
                }
              ],
              avatar: 'https://randomuser.me/api/portraits/men/3.jpg',
              preferences: {
                emailNotifications: false,
                orderUpdates: true
              }
            },
            {
              _id: '4',
              firstName: 'Emily',
              lastName: 'Davis',
              username: 'emilyd',
              email: 'emily@example.com',
              role: 'customer',
              createdAt: '2023-06-28T16:20:00Z',
              phoneNumber: '+1 555-456-7890',
              addresses: [],
              avatar: 'https://randomuser.me/api/portraits/women/4.jpg',
              preferences: {
                emailNotifications: true,
                orderUpdates: false
              }
            },
            {
              _id: '5',
              firstName: 'Michael',
              lastName: 'Brown',
              username: 'michaelb',
              email: 'michael@example.com',
              role: 'customer',
              createdAt: '2023-07-10T11:10:00Z',
              phoneNumber: '+1 555-321-7654',
              addresses: [
                {
                  street: '789 Sustainable Rd',
                  city: 'Eco Village',
                  state: 'WA',
                  zipCode: '98765',
                  country: 'USA',
                  isDefault: true
                }
              ],
              avatar: 'https://randomuser.me/api/portraits/men/5.jpg',
              preferences: {
                emailNotifications: true,
                orderUpdates: true
              }
            }
          ];

          // Filter based on role if needed
          let filteredUsers = mockUsers;
          if (filter !== 'all') {
            filteredUsers = mockUsers.filter(user => user.role === filter);
          }

          // Filter based on search query
          if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filteredUsers = filteredUsers.filter(user => 
              user.firstName.toLowerCase().includes(query) || 
              user.lastName.toLowerCase().includes(query) || 
              user.email.toLowerCase().includes(query) ||
              user.username.toLowerCase().includes(query)
            );
          }

          setUsers(filteredUsers);
          setPagination({
            ...pagination,
            total: filteredUsers.length,
            totalPages: Math.ceil(filteredUsers.length / pagination.limit)
          });
          setLoading(false);
        }, 800);
      } catch (err) {
        console.error('Error fetching users:', err);
        setError('Failed to fetch users. Please try again.');
        setLoading(false);
        toast.error('Failed to fetch users');
      }
    };

    fetchUsers();
  }, [pagination.page, pagination.limit, filter, searchQuery]);

  // Handle pagination
  const handlePageChange = (newPage) => {
    setPagination({ ...pagination, page: newPage });
  };

  // Handle view user
  const handleViewUser = (user) => {
    setSelectedUser(user);
    setViewMode('detail');
  };

  // Handle update user role
  const handleUpdateRole = async (userId, newRole) => {
    try {
      setLoading(true);
      // In a real implementation, this would update via your API
      // await adminApi.updateUserRole(userId, newRole);
      
      // For the demo, we'll just update the local state
      setUsers(prevUsers => 
        prevUsers.map(user => 
          user._id === userId 
            ? { ...user, role: newRole } 
            : user
        )
      );
      
      if (selectedUser && selectedUser._id === userId) {
        setSelectedUser({ ...selectedUser, role: newRole });
      }
      
      setLoading(false);
      toast.success(`User role updated to ${newRole}`);
    } catch (err) {
      console.error('Error updating user role:', err);
      setLoading(false);
      toast.error('Failed to update user role');
    }
  };

  // Show delete confirmation
  const confirmDelete = (user) => {
    setUserToDelete(user);
    setShowDeleteConfirm(true);
  };

  // Cancel delete
  const cancelDelete = () => {
    setUserToDelete(null);
    setShowDeleteConfirm(false);
  };

  // Handle delete user
  const handleDeleteUser = async () => {
    if (!userToDelete) return;

    try {
      setLoading(true);
      // In a real implementation, this would delete via your API
      // await adminApi.deleteUser(userToDelete._id);
      
      // For the demo, we'll just update the local state
      setUsers(prevUsers => prevUsers.filter(user => user._id !== userToDelete._id));
      
      if (selectedUser && selectedUser._id === userToDelete._id) {
        setSelectedUser(null);
        setViewMode('list');
      }
      
      setShowDeleteConfirm(false);
      setUserToDelete(null);
      setLoading(false);
      toast.success('User deleted successfully');
    } catch (err) {
      console.error('Error deleting user:', err);
      setLoading(false);
      toast.error('Failed to delete user');
    }
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Render user list
  const renderUserList = () => {
    return (
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-4 border-b">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <h3 className="text-lg font-semibold">Users List</h3>
            <div className="mt-3 md:mt-0 flex flex-col md:flex-row md:items-center gap-3">
              <div className="flex items-center rounded-md border border-gray-300">
                <input
                  type="text"
                  placeholder="Search users..."
                  className="w-full px-4 py-2 text-sm border-none focus:ring-0"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button className="p-2 bg-gray-100 text-gray-600">
                  <MagnifyingGlassIcon className="h-5 w-5" />
                </button>
              </div>
              <select 
                className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              >
                <option value="all">All Users</option>
                <option value="admin">Admins</option>
                <option value="customer">Customers</option>
              </select>
            </div>
          </div>
        </div>
        
        {loading ? (
          <div className="py-10 text-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-3 text-gray-600">Loading users...</p>
          </div>
        ) : error ? (
          <div className="p-8 text-center">
            <p className="text-red-500">{error}</p>
            <button 
              className="mt-4 px-4 py-2 bg-primary-600 text-white rounded-md"
              onClick={() => window.location.reload()}
            >
              Retry
            </button>
          </div>
        ) : users.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-gray-500">No users found.</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Role
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Joined
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.slice((pagination.page - 1) * pagination.limit, pagination.page * pagination.limit).map((user) => (
                    <tr key={user._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 flex-shrink-0">
                            <img 
                              className="h-10 w-10 rounded-full" 
                              src={user.avatar || `https://ui-avatars.com/api/?name=${user.firstName}+${user.lastName}`} 
                              alt={`${user.firstName} ${user.lastName}`} 
                            />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {user.firstName} {user.lastName}
                            </div>
                            <div className="text-sm text-gray-500">
                              @{user.username}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {user.role === 'admin' ? (
                          <span className="px-2 py-1 text-xs rounded-full bg-purple-100 text-purple-800">
                            Admin
                          </span>
                        ) : (
                          <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                            Customer
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(user.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end items-center space-x-2">
                          <button 
                            className="text-primary-600 hover:text-primary-900 p-1"
                            onClick={() => handleViewUser(user)}
                            title="View User"
                          >
                            <EyeIcon className="h-5 w-5" />
                          </button>
                          {user.role === 'admin' ? (
                            <button
                              className="text-yellow-600 hover:text-yellow-900 p-1"
                              onClick={() => handleUpdateRole(user._id, 'customer')}
                              title="Revoke Admin"
                            >
                              <ShieldExclamationIcon className="h-5 w-5" />
                            </button>
                          ) : (
                            <button
                              className="text-blue-600 hover:text-blue-900 p-1"
                              onClick={() => handleUpdateRole(user._id, 'admin')}
                              title="Make Admin"
                            >
                              <ShieldCheckIcon className="h-5 w-5" />
                            </button>
                          )}
                          <button 
                            className="text-red-600 hover:text-red-900 p-1"
                            onClick={() => confirmDelete(user)}
                            title="Delete User"
                          >
                            <TrashIcon className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      Showing <span className="font-medium">{(pagination.page - 1) * pagination.limit + 1}</span> to{' '}
                      <span className="font-medium">
                        {Math.min(pagination.page * pagination.limit, pagination.total)}
                      </span>{' '}
                      of <span className="font-medium">{pagination.total}</span> results
                    </p>
                  </div>
                  <div>
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                      <button
                        onClick={() => handlePageChange(Math.max(1, pagination.page - 1))}
                        disabled={pagination.page === 1}
                        className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
                          pagination.page === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        <ChevronLeftIcon className="h-5 w-5" />
                      </button>
                      {[...Array(pagination.totalPages)].map((_, i) => (
                        <button
                          key={i}
                          onClick={() => handlePageChange(i + 1)}
                          className={`relative inline-flex items-center px-4 py-2 border ${
                            pagination.page === i + 1
                              ? 'z-10 bg-primary-50 border-primary-500 text-primary-600'
                              : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                          } text-sm font-medium`}
                        >
                          {i + 1}
                        </button>
                      ))}
                      <button
                        onClick={() => handlePageChange(Math.min(pagination.totalPages, pagination.page + 1))}
                        disabled={pagination.page === pagination.totalPages}
                        className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                          pagination.page === pagination.totalPages ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        <ChevronRightIcon className="h-5 w-5" />
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    );
  };

  // Render user details
  const renderUserDetails = () => {
    if (!selectedUser) return null;

    return (
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-4 border-b flex items-center justify-between">
          <div className="flex items-center">
            <button 
              className="mr-3 p-1 rounded-full hover:bg-gray-100"
              onClick={() => setViewMode('list')}
            >
              <ChevronLeftIcon className="h-5 w-5" />
            </button>
            <h3 className="text-lg font-semibold">User Details</h3>
          </div>
          <span className={`px-3 py-1 text-sm rounded-full ${
            selectedUser.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'
          }`}>
            {selectedUser.role.charAt(0).toUpperCase() + selectedUser.role.slice(1)}
          </span>
        </div>
        
        <div className="p-6">
          <div className="flex flex-col md:flex-row md:items-start gap-6 mb-8">
            <div className="md:w-1/4 flex flex-col items-center">
              <img 
                className="h-32 w-32 rounded-full" 
                src={selectedUser.avatar || `https://ui-avatars.com/api/?name=${selectedUser.firstName}+${selectedUser.lastName}&size=128`} 
                alt={`${selectedUser.firstName} ${selectedUser.lastName}`} 
              />
              <h4 className="mt-4 text-lg font-medium">{selectedUser.firstName} {selectedUser.lastName}</h4>
              <p className="text-gray-500">@{selectedUser.username}</p>
              <div className="mt-4 flex space-x-2">
                {selectedUser.role === 'admin' ? (
                  <button
                    className="px-3 py-1 text-sm bg-yellow-100 text-yellow-800 rounded-md hover:bg-yellow-200"
                    onClick={() => handleUpdateRole(selectedUser._id, 'customer')}
                  >
                    Revoke Admin
                  </button>
                ) : (
                  <button
                    className="px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded-md hover:bg-blue-200"
                    onClick={() => handleUpdateRole(selectedUser._id, 'admin')}
                  >
                    Make Admin
                  </button>
                )}
                <button
                  className="px-3 py-1 text-sm bg-red-100 text-red-800 rounded-md hover:bg-red-200"
                  onClick={() => confirmDelete(selectedUser)}
                >
                  Delete
                </button>
              </div>
            </div>
            
            <div className="md:w-3/4">
              <h4 className="text-sm font-medium text-gray-500 uppercase mb-3">Account Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">{selectedUser.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="font-medium">{selectedUser.phoneNumber || 'Not provided'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Joined</p>
                  <p className="font-medium">{formatDate(selectedUser.createdAt)}</p>
                </div>
              </div>
              
              <h4 className="text-sm font-medium text-gray-500 uppercase mb-3">Addresses</h4>
              {selectedUser.addresses && selectedUser.addresses.length > 0 ? (
                <div className="space-y-4 mb-6">
                  {selectedUser.addresses.map((address, index) => (
                    <div key={index} className={`p-3 border rounded-md ${address.isDefault ? 'border-primary-300 bg-primary-50' : 'border-gray-300'}`}>
                      {address.isDefault && (
                        <p className="text-xs text-primary-600 mb-1">Default Address</p>
                      )}
                      <p className="font-medium">{address.street}</p>
                      <p>{address.city}, {address.state} {address.zipCode}</p>
                      <p>{address.country}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 mb-6">No addresses found</p>
              )}
              
              <h4 className="text-sm font-medium text-gray-500 uppercase mb-3">Preferences</h4>
              <div className="flex flex-wrap gap-3 mb-6">
                <div className={`px-3 py-1 text-sm rounded-md ${
                  selectedUser.preferences?.emailNotifications 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  Email Notifications: {selectedUser.preferences?.emailNotifications ? 'On' : 'Off'}
                </div>
                <div className={`px-3 py-1 text-sm rounded-md ${
                  selectedUser.preferences?.orderUpdates 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  Order Updates: {selectedUser.preferences?.orderUpdates ? 'On' : 'Off'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Delete confirmation dialog
  const renderDeleteConfirmation = () => {
    if (!showDeleteConfirm || !userToDelete) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg max-w-md w-full p-6">
          <h3 className="text-lg font-semibold mb-4">Confirm Deletion</h3>
          <p className="mb-6">
            Are you sure you want to delete the user <span className="font-semibold">{userToDelete.firstName} {userToDelete.lastName}</span>? 
            This action cannot be undone.
          </p>
          <div className="flex justify-end space-x-3">
            <button
              className="px-4 py-2 text-sm bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
              onClick={cancelDelete}
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 text-sm bg-red-600 text-white rounded-md hover:bg-red-700"
              onClick={handleDeleteUser}
            >
              Delete User
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">User Management</h2>
      {viewMode === 'list' ? renderUserList() : renderUserDetails()}
      {renderDeleteConfirmation()}
    </div>
  );
};

export default AdminUsers; 