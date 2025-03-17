import React, { useEffect, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import MainLayout from './components/layout/MainLayout';
import AdminLayout from './components/layout/AdminLayout';
import LoadingSpinner from './components/common/LoadingSpinner';
import { useAuthStore } from './context/authStore';

// Lazy loaded pages
const Home = lazy(() => import('./pages/Home'));
const Products = lazy(() => import('./pages/Products'));
const ProductDetail = lazy(() => import('./pages/ProductDetail'));
const Auth = lazy(() => import('./pages/Auth'));
const Cart = lazy(() => import('./pages/Cart'));
const About = lazy(() => import('./pages/About'));
const OrderSuccess = lazy(() => import('./pages/OrderSuccess'));
const CheckoutPage = lazy(() => import('./pages/CheckoutPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));
const CustomerDashboard = lazy(() => import('./pages/CustomerDashboard'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const Profile = lazy(() => import('./pages/Profile'));

// Admin pages
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const AdminProducts = lazy(() => import('./pages/admin/AdminProductManagement'));
const AdminProductForm = lazy(() => import('./pages/admin/AdminProductForm'));
const AdminOrders = lazy(() => import('./pages/admin/AdminOrders'));
const AdminUsers = lazy(() => import('./pages/admin/AdminUsers'));
const AdminSettings = lazy(() => import('./pages/admin/AdminSettings'));

// Protected Route Component
const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, loading } = useAuthStore();
  
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner size="large" />
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/auth" state={{ from: window.location.pathname }} />;
  }
  
  if (adminOnly && user.role !== 'admin') {
    return <Navigate to="/" />;
  }
  
  return children;
};

// App Content Component
const AppContent = () => {
  const { checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={
            <Suspense fallback={<LoadingSpinner />}>
              <Home />
            </Suspense>
          } />
          <Route path="products" element={
            <Suspense fallback={<LoadingSpinner />}>
              <Products />
            </Suspense>
          } />
          <Route path="products/:id" element={
            <Suspense fallback={<LoadingSpinner />}>
              <ProductDetail />
            </Suspense>
          } />
          <Route path="cart" element={
            <Suspense fallback={<LoadingSpinner />}>
              <Cart />
            </Suspense>
          } />
          <Route path="checkout" element={
            <Suspense fallback={<LoadingSpinner />}>
              <ProtectedRoute>
                <CheckoutPage />
              </ProtectedRoute>
            </Suspense>
          } />
          <Route path="auth" element={
            <Suspense fallback={<LoadingSpinner />}>
              <Auth />
            </Suspense>
          } />
          <Route path="about" element={
            <Suspense fallback={<LoadingSpinner />}>
              <About />
            </Suspense>
          } />
          <Route path="contact" element={
            <Suspense fallback={<LoadingSpinner />}>
              <ContactPage />
            </Suspense>
          } />
          <Route path="profile" element={
            <Suspense fallback={<LoadingSpinner />}>
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            </Suspense>
          } />
          <Route path="order-success" element={
            <Suspense fallback={<LoadingSpinner />}>
              <OrderSuccess />
            </Suspense>
          } />
          <Route path="dashboard" element={
            <Suspense fallback={<LoadingSpinner />}>
              <ProtectedRoute>
                <CustomerDashboard />
              </ProtectedRoute>
            </Suspense>
          } />
          <Route path="*" element={
            <Suspense fallback={<LoadingSpinner />}>
              <NotFoundPage />
            </Suspense>
          } />
        </Route>
        
        {/* Admin Routes */}
        <Route path="/admin" element={
          <Suspense fallback={<LoadingSpinner size="large" />}>
            <ProtectedRoute adminOnly={true}>
              <AdminLayout />
            </ProtectedRoute>
          </Suspense>
        }>
          <Route index element={
            <Suspense fallback={<LoadingSpinner />}>
              <AdminDashboard />
            </Suspense>
          } />
          <Route path="products" element={
            <Suspense fallback={<LoadingSpinner />}>
              <AdminProducts />
            </Suspense>
          } />
          <Route path="products/new" element={
            <Suspense fallback={<LoadingSpinner />}>
              <AdminProductForm />
            </Suspense>
          } />
          <Route path="products/edit/:id" element={
            <Suspense fallback={<LoadingSpinner />}>
              <AdminProductForm />
            </Suspense>
          } />
          <Route path="orders" element={
            <Suspense fallback={<LoadingSpinner />}>
              <AdminOrders />
            </Suspense>
          } />
          <Route path="users" element={
            <Suspense fallback={<LoadingSpinner />}>
              <AdminUsers />
            </Suspense>
          } />
          <Route path="settings" element={
            <Suspense fallback={<LoadingSpinner />}>
              <AdminSettings />
            </Suspense>
          } />
        </Route>
      </Routes>
      <Toaster position="top-right" />
    </>
  );
};

function App() {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <AppContent />
    </Router>
  );
}

export default App; 