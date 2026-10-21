import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

function Navigation() {
    const { cartCount } = useCart();
    const { user, logout } = useAuth();

    return (
        <nav className="brutalist-nav">
            {/* Brand Logo */}
            <div className='nav-logo'>
                <Link to="/">HIGH WEAR</Link>
            </div>

            {/* Centered Links */}
            <div className="nav-links">
                <NavLink to="/shop" className="hover-invert">SHOP</NavLink>
                <NavLink to="/about" className="hover-invert">ABOUT</NavLink>
                <NavLink to="/contact" className="hover-invert">CONTACT</NavLink>
            </div>

            {/* Right side Auth/Cart */}
            <div className='nav-actions'>
                {user ? (
                    <div style={{ display: 'flex', gap: 'var(--spacing-md)' }}>
                        <span>[ {user.name} ]</span>
                        <button onClick={logout} className="hover-invert" style={{ cursor: 'pointer', fontWeight: 'bold' }}>LOGOUT</button>
                    </div>
                ) : (
                    <Link to="/login" className="hover-invert" style={{ fontWeight: 'bold' }}>LOGIN</Link>
                )}
                <Link to="/cart" className="hover-invert bracket-wrap" style={{ fontWeight: 'bold' }}>
                    CART {cartCount > 0 ? `(${cartCount})` : ''}
                </Link>
            </div>
        </nav>
    );
}

export default Navigation;
