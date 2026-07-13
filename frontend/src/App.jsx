import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import Home from './components/Home';
import './App.css';

// Simple temporary placeholders so the router doesn't crash when clicking navbar links
const CatalogPlaceholder = () => (
  <div className="container mt-5 text-center glass-panel p-5">
    <h2 className="text-main fw-bold">👕 Catalog Grid Page</h2>
    <p className="text-muted">This is where the search sidebar, filter sliders, and product items will go in the next step!</p>
  </div>
);

const MenPlaceholder = () => (
  <div className="container mt-5 text-center glass-panel p-5">
    <h2 className="text-main fw-bold">👔 Men's Fashion</h2>
    <p className="text-muted">This page will reuse our catalog component but will be pre-filtered only for department_id = 1 (Men).</p>
  </div>
);

const WomenPlaceholder = () => (
  <div className="container mt-5 text-center glass-panel p-5">
    <h2 className="text-main fw-bold">👗 Women's Fashion</h2>
    <p className="text-muted">This page will reuse our catalog component but will be pre-filtered only for department_id = 2 (Women).</p>
  </div>
);

function App() {
  return (
    <Router>
      <div className="app-container">
        {/* Persistent Navigation Bar across all pages */}
        <Navigation />

        {/* Main page content area */}
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/catalog" element={<CatalogPlaceholder />} />
            <Route path="/men" element={<MenPlaceholder />} />
            <Route path="/women" element={<WomenPlaceholder />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
