import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css'; // Load Bootstrap stylesheet
import 'bootstrap/dist/js/bootstrap.bundle.min.js'; // Load Bootstrap JS (handles mobile collapse menu)
import 'bootstrap-icons/font/bootstrap-icons.css'; // Load Bootstrap Icons font
import './index.css'; // Load our custom glassmorphism styles
import App from './App.jsx';
import { CartProvider } from './context/CartContext.jsx';
import { AuthProvider } from './context/AuthContext.jsx';



createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <CartProvider> {/* 👈 Wrap here */}
        <App />
      </CartProvider>
    </AuthProvider>
  </StrictMode>,
);
