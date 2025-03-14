import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import Home from './pages/Home';
import Products from './pages/Products';
import Cart from './pages/Cart';
import Auth from './pages/Auth';
import OrderSuccess from './pages/OrderSuccess';
import About from './pages/About';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<MainLayout />}>
                    <Route index element={<Home />} />
                    <Route path="products" element={<Products />} />
                    <Route path="cart" element={<Cart />} />
                    <Route path="auth" element={<Auth />} />
                    <Route path="order-success" element={<OrderSuccess />} />
                    <Route path="about" element={<About />} />
                </Route>
            </Routes>
        </Router>
    );
}

export default App; 