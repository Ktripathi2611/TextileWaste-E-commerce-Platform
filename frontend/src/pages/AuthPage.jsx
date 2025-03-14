import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../context/authStore';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  
  const { 
    login, 
    register, 
    isLoading, 
    error, 
    clearError 
  } = useAuthStore(state => ({
    login: state.login,
    register: state.register,
    isLoading: state.isLoading,
    error: state.error,
    clearError: state.clearError
  }));
  
  // Get redirect path from location state or default to home
  const from = location.state?.from?.pathname || '/';
  
  // Form state for login
  const [loginForm, setLoginForm] = useState({
    email: '',
    password: ''
  });
  
  // Form state for registration
  const [registerForm, setRegisterForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  
  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginForm(prev => ({ ...prev, [name]: value }));
    clearError();
  };
  
  const handleRegisterChange = (e) => {
    const { name, value } = e.target;
    setRegisterForm(prev => ({ ...prev, [name]: value }));
    clearError();
  };
  
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    
    const success = await login(loginForm);
    if (success) {
      navigate(from, { replace: true });
    }
  };
  
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    
    // Validate password match
    if (registerForm.password !== registerForm.confirmPassword) {
      useAuthStore.setState({ error: 'Passwords do not match' });
      return;
    }
    
    const success = await register({
      firstName: registerForm.firstName,
      lastName: registerForm.lastName,
      email: registerForm.email,
      password: registerForm.password
    });
    
    if (success) {
      navigate(from, { replace: true });
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        <div className="flex">
          <button
            className={`w-1/2 py-4 text-center font-medium ${
              isLogin
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            onClick={() => setIsLogin(true)}
          >
            Login
          </button>
          <button
            className={`w-1/2 py-4 text-center font-medium ${
              !isLogin
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            onClick={() => setIsLogin(false)}
          >
            Register
          </button>
        </div>
        
        <div className="p-6">
          {/* Error Message */}
          {error && (
            <div className="mb-4 bg-red-50 text-red-600 p-3 rounded-md text-sm">
              {error}
            </div>
          )}
          
          {isLogin ? (
            /* Login Form */
            <form onSubmit={handleLoginSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2" htmlFor="email">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={loginForm.email}
                  onChange={handleLoginChange}
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  required
                />
              </div>
              
              <div className="mb-6">
                <label className="block text-gray-700 font-medium mb-2" htmlFor="password">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={loginForm.password}
                  onChange={handleLoginChange}
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  required
                />
              </div>
              
              <button
                type="submit"
                className="w-full btn-primary py-3"
                disabled={isLoading}
              >
                {isLoading ? 'Logging in...' : 'Login'}
              </button>
            </form>
          ) : (
            /* Register Form */
            <form onSubmit={handleRegisterSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2" htmlFor="firstName">
                  First Name
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={registerForm.firstName}
                  onChange={handleRegisterChange}
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2" htmlFor="lastName">
                  Last Name
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={registerForm.lastName}
                  onChange={handleRegisterChange}
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2" htmlFor="registerEmail">
                  Email
                </label>
                <input
                  type="email"
                  id="registerEmail"
                  name="email"
                  value={registerForm.email}
                  onChange={handleRegisterChange}
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2" htmlFor="registerPassword">
                  Password
                </label>
                <input
                  type="password"
                  id="registerPassword"
                  name="password"
                  value={registerForm.password}
                  onChange={handleRegisterChange}
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  required
                  minLength={6}
                />
              </div>
              
              <div className="mb-6">
                <label className="block text-gray-700 font-medium mb-2" htmlFor="confirmPassword">
                  Confirm Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={registerForm.confirmPassword}
                  onChange={handleRegisterChange}
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  required
                />
              </div>
              
              <button
                type="submit"
                className="w-full btn-primary py-3"
                disabled={isLoading}
              >
                {isLoading ? 'Creating Account...' : 'Register'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthPage; 