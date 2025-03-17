import React, { useState, useEffect } from 'react';
import { 
  EyeIcon, 
  PencilIcon, 
  TrashIcon,
  MagnifyingGlassIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';
import { ordersApi } from '../../utils/apiClient';
import toast from 'react-hot-toast';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'detail'
  const [searchQuery, setSearchQuery] = useState('');
  const [sort, setSort] = useState({ field: 'createdAt', direction: 'desc' });
  const [filter, setFilter] = useState('all'); // all, processing, shipped, delivered, cancelled
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1
  });

  // Fetch orders
  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      setError(null);

      try {
        // In a real implementation, this would fetch from your API
        // const response = await ordersApi.getAll({ 
        //   page: pagination.page, 
        //   limit: pagination.limit,
        //   sort: sort.field,
        //   order: sort.direction,
        //   status: filter !== 'all' ? filter : undefined
        // });
        // setOrders(response.data.orders);
        // setPagination({
        //   ...pagination,
        //   total: response.data.total,
        //   totalPages: response.data.totalPages
        // });

        // Mock data for demonstration
        setTimeout(() => {
          const mockOrders = [
            { 
              _id: '1',
              user: { 
                _id: 'u1', 
                firstName: 'John', 
                lastName: 'Doe', 
                email: 'john@example.com' 
              },
              items: [
                { product: { _id: 'p1', name: 'Eco-Friendly T-Shirt', price: 29.99 }, quantity: 2, price: 29.99 },
                { product: { _id: 'p2', name: 'Recycled Denim Jeans', price: 59.99 }, quantity: 1, price: 59.99 }
              ],
              totalAmount: 119.97,
              shippingAddress: {
                street: '123 Green St',
                city: 'Eco City',
                state: 'CA',
                zipCode: '12345',
                country: 'USA'
              },
              paymentMethod: 'credit_card',
              paymentStatus: 'paid',
              orderStatus: 'processing',
              createdAt: '2023-07-15T10:30:00Z'
            },
            { 
              _id: '2',
              user: { 
                _id: 'u2', 
                firstName: 'Jane', 
                lastName: 'Smith', 
                email: 'jane@example.com' 
              },
              items: [
                { product: { _id: 'p3', name: 'Sustainable Wool Scarf', price: 34.99 }, quantity: 1, price: 34.99 }
              ],
              totalAmount: 34.99,
              shippingAddress: {
                street: '456 Earth Ave',
                city: 'Green Town',
                state: 'NY',
                zipCode: '54321',
                country: 'USA'
              },
              paymentMethod: 'paypal',
              paymentStatus: 'paid',
              orderStatus: 'shipped',
              createdAt: '2023-07-14T14:45:00Z'
            },
            { 
              _id: '3',
              user: { 
                _id: 'u3', 
                firstName: 'Robert', 
                lastName: 'Johnson', 
                email: 'robert@example.com' 
              },
              items: [
                { product: { _id: 'p4', name: 'Upcycled Canvas Tote', price: 24.99 }, quantity: 2, price: 24.99 },
                { product: { _id: 'p5', name: 'Recycled Plastic Sunglasses', price: 79.99 }, quantity: 1, price: 79.99 }
              ],
              totalAmount: 129.97,
              shippingAddress: {
                street: '789 Sustainable Rd',
                city: 'Eco Village',
                state: 'WA',
                zipCode: '98765',
                country: 'USA'
              },
              paymentMethod: 'credit_card',
              paymentStatus: 'paid',
              orderStatus: 'delivered',
              createdAt: '2023-07-10T09:15:00Z'
            },
            { 
              _id: '4',
              user: { 
                _id: 'u4', 
                firstName: 'Emily', 
                lastName: 'Davis', 
                email: 'emily@example.com' 
              },
              items: [
                { product: { _id: 'p6', name: 'Organic Cotton Dress', price: 89.99 }, quantity: 1, price: 89.99 }
              ],
              totalAmount: 89.99,
              shippingAddress: {
                street: '321 Zero Waste Lane',
                city: 'Sustainable City',
                state: 'OR',
                zipCode: '45678',
                country: 'USA'
              },
              paymentMethod: 'stripe',
              paymentStatus: 'pending',
              orderStatus: 'processing',
              createdAt: '2023-07-08T16:20:00Z'
            },
            { 
              _id: '5',
              user: { 
                _id: 'u5', 
                firstName: 'Michael', 
                lastName: 'Brown', 
                email: 'michael@example.com' 
              },
              items: [
                { product: { _id: 'p7', name: 'Bamboo Toothbrush Set', price: 14.99 }, quantity: 3, price: 14.99 }
              ],
              totalAmount: 44.97,
              shippingAddress: {
                street: '654 Eco Park Blvd',
                city: 'Clean City',
                state: 'FL',
                zipCode: '33333',
                country: 'USA'
              },
              paymentMethod: 'paypal',
              paymentStatus: 'failed',
              orderStatus: 'cancelled',
              createdAt: '2023-07-05T11:10:00Z'
            }
          ];

          // Filter based on status if needed
          let filteredOrders = mockOrders;
          if (filter !== 'all') {
            filteredOrders = mockOrders.filter(order => order.orderStatus === filter);
          }

          // Filter based on search query
          if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filteredOrders = filteredOrders.filter(order => 
              order.user.firstName.toLowerCase().includes(query) || 
              order.user.lastName.toLowerCase().includes(query) || 
              order.user.email.toLowerCase().includes(query) ||
              order._id.includes(query)
            );
          }

          // Sort orders
          filteredOrders.sort((a, b) => {
            if (sort.field === 'createdAt') {
              return sort.direction === 'asc' 
                ? new Date(a.createdAt) - new Date(b.createdAt)
                : new Date(b.createdAt) - new Date(a.createdAt);
            }
            if (sort.field === 'totalAmount') {
              return sort.direction === 'asc'
                ? a.totalAmount - b.totalAmount
                : b.totalAmount - a.totalAmount;
            }
            return 0;
          });

          setOrders(filteredOrders);
          setPagination({
            ...pagination,
            total: filteredOrders.length,
            totalPages: Math.ceil(filteredOrders.length / pagination.limit)
          });
          setLoading(false);
        }, 800);
      } catch (err) {
        console.error('Error fetching orders:', err);
        setError('Failed to fetch orders. Please try again.');
        setLoading(false);
        toast.error('Failed to fetch orders');
      }
    };

    fetchOrders();
  }, [pagination.page, pagination.limit, sort, filter, searchQuery]);

  // Handle pagination
  const handlePageChange = (newPage) => {
    setPagination({ ...pagination, page: newPage });
  };

  // Handle sorting
  const handleSort = (field) => {
    setSort(prev => ({
      field,
      direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  // Handle order status update
  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      setLoading(true);
      // In a real implementation, this would update via your API
      // await ordersApi.updateOrderStatus(orderId, newStatus);
      
      // For the demo, we'll just update the local state
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order._id === orderId 
            ? { ...order, orderStatus: newStatus } 
            : order
        )
      );
      
      if (selectedOrder && selectedOrder._id === orderId) {
        setSelectedOrder({ ...selectedOrder, orderStatus: newStatus });
      }
      
      setLoading(false);
      toast.success(`Order status updated to ${newStatus}`);
    } catch (err) {
      console.error('Error updating order status:', err);
      setLoading(false);
      toast.error('Failed to update order status');
    }
  };

  // View order details
  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setViewMode('detail');
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  // Format currency
  const formatCurrency = (amount) => {
    return `$${amount.toFixed(2)}`;
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'processing': return 'bg-yellow-100 text-yellow-800';
      case 'shipped': return 'bg-blue-100 text-blue-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Get payment status color
  const getPaymentStatusColor = (status) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Render order list
  const renderOrderList = () => {
    return (
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-4 border-b">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <h3 className="text-lg font-semibold">Orders List</h3>
            <div className="mt-3 md:mt-0 flex flex-col md:flex-row md:items-center gap-3">
              <div className="flex items-center rounded-md border border-gray-300">
                <input
                  type="text"
                  placeholder="Search orders..."
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
                <option value="all">All Orders</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </div>
        
        {loading ? (
          <div className="py-10 text-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-3 text-gray-600">Loading orders...</p>
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
        ) : orders.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-gray-500">No orders found.</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Order ID
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer
                    </th>
                    <th 
                      scope="col" 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort('totalAmount')}
                    >
                      <div className="flex items-center">
                        Total
                        {sort.field === 'totalAmount' && (
                          sort.direction === 'asc' ? 
                            <ArrowUpIcon className="h-4 w-4 ml-1" /> : 
                            <ArrowDownIcon className="h-4 w-4 ml-1" />
                        )}
                      </div>
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th 
                      scope="col" 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort('createdAt')}
                    >
                      <div className="flex items-center">
                        Date
                        {sort.field === 'createdAt' && (
                          sort.direction === 'asc' ? 
                            <ArrowUpIcon className="h-4 w-4 ml-1" /> : 
                            <ArrowDownIcon className="h-4 w-4 ml-1" />
                        )}
                      </div>
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {orders.slice((pagination.page - 1) * pagination.limit, pagination.page * pagination.limit).map((order) => (
                    <tr key={order._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        #{order._id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {order.user.firstName} {order.user.lastName}
                        <div className="text-xs text-gray-400">{order.user.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatCurrency(order.totalAmount)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(order.orderStatus)}`}>
                          {order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(order.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button 
                          className="text-primary-600 hover:text-primary-900 mr-3"
                          onClick={() => handleViewOrder(order)}
                        >
                          <EyeIcon className="h-5 w-5" />
                        </button>
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

  // Render order details
  const renderOrderDetails = () => {
    if (!selectedOrder) return null;

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
            <h3 className="text-lg font-semibold">Order Details</h3>
          </div>
          <div className="flex items-center space-x-2">
            <span className={`px-3 py-1 text-sm rounded-full ${getStatusColor(selectedOrder.orderStatus)}`}>
              {selectedOrder.orderStatus.charAt(0).toUpperCase() + selectedOrder.orderStatus.slice(1)}
            </span>
            <span className={`px-3 py-1 text-sm rounded-full ${getPaymentStatusColor(selectedOrder.paymentStatus)}`}>
              Payment: {selectedOrder.paymentStatus.charAt(0).toUpperCase() + selectedOrder.paymentStatus.slice(1)}
            </span>
          </div>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <h4 className="text-sm font-medium text-gray-500 uppercase mb-3">Order Information</h4>
              <p className="mb-1"><span className="font-medium">Order ID:</span> #{selectedOrder._id}</p>
              <p className="mb-1"><span className="font-medium">Date:</span> {formatDate(selectedOrder.createdAt)}</p>
              <p className="mb-1"><span className="font-medium">Payment Method:</span> {selectedOrder.paymentMethod.replace('_', ' ').charAt(0).toUpperCase() + selectedOrder.paymentMethod.replace('_', ' ').slice(1)}</p>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-gray-500 uppercase mb-3">Customer Information</h4>
              <p className="mb-1"><span className="font-medium">Name:</span> {selectedOrder.user.firstName} {selectedOrder.user.lastName}</p>
              <p className="mb-1"><span className="font-medium">Email:</span> {selectedOrder.user.email}</p>
            </div>
          </div>
          
          <div className="mb-8">
            <h4 className="text-sm font-medium text-gray-500 uppercase mb-3">Shipping Address</h4>
            <p className="mb-1">{selectedOrder.shippingAddress.street}</p>
            <p className="mb-1">{selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} {selectedOrder.shippingAddress.zipCode}</p>
            <p className="mb-1">{selectedOrder.shippingAddress.country}</p>
          </div>
          
          <div className="mb-8">
            <h4 className="text-sm font-medium text-gray-500 uppercase mb-3">Order Items</h4>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Product
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Quantity
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {selectedOrder.items.map((item, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {item.product.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatCurrency(item.price)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.quantity}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                        {formatCurrency(item.price * item.quantity)}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-gray-50">
                  <tr>
                    <td colSpan="3" className="px-6 py-4 text-right text-sm font-medium text-gray-900">
                      Total
                    </td>
                    <td className="px-6 py-4 text-right text-sm font-bold text-gray-900">
                      {formatCurrency(selectedOrder.totalAmount)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
          
          <div className="border-t pt-6">
            <h4 className="text-sm font-medium text-gray-500 uppercase mb-3">Update Order Status</h4>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => handleUpdateStatus(selectedOrder._id, 'processing')}
                disabled={selectedOrder.orderStatus === 'processing'}
                className={`px-4 py-2 text-sm rounded-md ${
                  selectedOrder.orderStatus === 'processing'
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                }`}
              >
                Processing
              </button>
              <button
                onClick={() => handleUpdateStatus(selectedOrder._id, 'shipped')}
                disabled={selectedOrder.orderStatus === 'shipped'}
                className={`px-4 py-2 text-sm rounded-md ${
                  selectedOrder.orderStatus === 'shipped'
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                }`}
              >
                Shipped
              </button>
              <button
                onClick={() => handleUpdateStatus(selectedOrder._id, 'delivered')}
                disabled={selectedOrder.orderStatus === 'delivered'}
                className={`px-4 py-2 text-sm rounded-md ${
                  selectedOrder.orderStatus === 'delivered'
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-green-100 text-green-800 hover:bg-green-200'
                }`}
              >
                Delivered
              </button>
              <button
                onClick={() => handleUpdateStatus(selectedOrder._id, 'cancelled')}
                disabled={selectedOrder.orderStatus === 'cancelled'}
                className={`px-4 py-2 text-sm rounded-md ${
                  selectedOrder.orderStatus === 'cancelled'
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-red-100 text-red-800 hover:bg-red-200'
                }`}
              >
                Cancelled
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Orders Management</h2>
      {viewMode === 'list' ? renderOrderList() : renderOrderDetails()}
    </div>
  );
};

export default AdminOrders; 