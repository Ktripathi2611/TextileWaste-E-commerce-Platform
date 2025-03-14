import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCartIcon, UserIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { useCartStore } from '../../context/cartStore';
import { useAuthStore } from '../../context/authStore';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useAuthStore();
  const { getItemCount, clearCart } = useCartStore();
  const navigate = useNavigate();
  const cartItemCount = getItemCount();

  const handleLogout = () => {
    logout();
    clearCart();
    navigate('/');
    setIsMenuOpen(false);
  };

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold text-primary-600">
            TextileWaste
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link to="/" className="text-gray-700 hover:text-primary-600">Home</Link>
            <Link to="/products" className="text-gray-700 hover:text-primary-600">Products</Link>
            <Link to="/about" className="text-gray-700 hover:text-primary-600">About</Link>
          </nav>
          
          {/* User Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                <Link to="/profile" className="text-gray-700 hover:text-primary-600 flex items-center">
                  <UserIcon className="h-6 w-6 mr-1" />
                  <span className="text-sm">{user.firstName}</span>
                </Link>
                <button 
                  onClick={handleLogout}
                  className="text-gray-700 hover:text-primary-600 text-sm"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link to="/auth" className="text-gray-700 hover:text-primary-600">
                <UserIcon className="h-6 w-6" />
              </Link>
            )}
            <Link to="/cart" className="text-gray-700 hover:text-primary-600 relative">
              <ShoppingCartIcon className="h-6 w-6" />
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </Link>
          </div>
          
          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-gray-700"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <XMarkIcon className="h-6 w-6" />
            ) : (
              <Bars3Icon className="h-6 w-6" />
            )}
          </button>
        </div>
        
        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4">
            <nav className="flex flex-col space-y-4">
              <Link 
                to="/" 
                className="text-gray-700 hover:text-primary-600"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                to="/products" 
                className="text-gray-700 hover:text-primary-600"
                onClick={() => setIsMenuOpen(false)}
              >
                Products
              </Link>
              <Link 
                to="/about" 
                className="text-gray-700 hover:text-primary-600"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
              
              {user ? (
                <>
                  <Link 
                    to="/profile" 
                    className="text-gray-700 hover:text-primary-600"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="text-left text-gray-700 hover:text-primary-600"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link 
                  to="/auth" 
                  className="text-gray-700 hover:text-primary-600"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login / Register
                </Link>
              )}
              
              <Link 
                to="/cart" 
                className="text-gray-700 hover:text-primary-600 flex items-center"
                onClick={() => setIsMenuOpen(false)}
              >
                Cart
                {cartItemCount > 0 && (
                  <span className="ml-2 bg-primary-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cartItemCount}
                  </span>
                )}
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header; 