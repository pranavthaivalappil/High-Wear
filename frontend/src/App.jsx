import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import ProductDetails from './components/ProductDetails';


// Pages
import Home from './components/Home';
import Shop from './components/Shop';
import Contact from './components/Contact';
import About from './components/About';

// Keep Auth and Cart for continuity if they exist
import Auth from './components/Auth';
import Cart from './components/Cart';
import MyOrders from './components/MyOrders';

import './App.css';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Navigation />

        <main className="main-content">
          <Routes>
            {/* 6 Core Brutalist Pages */}
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/about" element={<About />} />


            {/* Legacy/Functional Routes */}
            <Route path="/login" element={<Auth />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/orders" element={<MyOrders />} />
            <Route path="/products/:id" element={<ProductDetails />} />

            {/* Fallbacks for existing catalog links to Shop */}
            <Route path="/catalog" element={<Shop />} />
            <Route path="/men" element={<Shop />} />
            <Route path="/women" element={<Shop />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}

export default App;
