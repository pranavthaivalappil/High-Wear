import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import Home from './components/Home';
import ProductList from './components/ProductList';
import DepartmentPage from './components/DepartmentPage';
import ProductDetails from './components/ProductDetails'; // 👈 Import the details page
import './App.css';
import Cart from './components/Cart';


function App() {
  return (
    <Router>
      <div className="app-container">
        {/* 1. Persistent Glassmorphic Header */}
        <Navigation />

        {/* 2. Main Page Router Switchboard */}
        <main className="main-content">
          <Routes>
            {/* Landing Page */}
            <Route path="/" element={<Home />} />

            {/* Main Searchable Catalog */}
            <Route path="/catalog" element={<ProductList />} />

            {/* 👈 Add this Cart Page Route */}
            <Route path="/cart" element={<Cart />} />

            {/* Dedicated Product Specifications Page */}
            <Route path="/products/:id" element={<ProductDetails />} />

            {/* Men's collection (Locked to department_id 1) */}
            <Route
              path="/men"
              element={<DepartmentPage departmentId={1} title="Men's" />}
            />

            {/* Women's collection (Locked to department_id 2) */}
            <Route
              path="/women"
              element={<DepartmentPage departmentId={2} title="Women's" />}
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
