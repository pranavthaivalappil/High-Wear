import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

function Navigation() {
    const { cartCount } = useCart();
    const { user, logout } = useAuth();

    return (
        <nav style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: 'var(--spacing-md) var(--spacing-lg)',
            borderBottom: '2px solid var(--text-main)',
            backgroundColor: 'var(--bg-primary)'
        }}>
            {/* Brand Logo */}
            <div style={{ flex: 1 }}>
                <Link to="/" style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: '4rem',
                    letterSpacing: '0.05em'
                }}>
                    HIGH WEAR
                </Link>
            </div>

            {/* Centered Links */}
            <div style={{
                display: 'flex',
                gap: 'var(--spacing-lg)',
                flex: 2,
                justifyContent: 'center',
                textTransform: 'uppercase',
                fontFamily: 'var(--font-body)',
                fontSize: '2.5 rem',
                fontWeight: 'bold'
            }}>
                <NavLink to="/shop" className="hover-invert">SHOP</NavLink>
                <NavLink to="/editorial" className="hover-invert">EDITORIAL</NavLink>
                <NavLink to="/about" className="hover-invert">ABOUT</NavLink>
                <NavLink to="/blog" className="hover-invert">CULTURE</NavLink>
                <NavLink to="/contact" className="hover-invert">CONTACT</NavLink>
            </div>

            {/* Right side Auth/Cart */}
            <div style={{
                display: 'flex',
                gap: 'var(--spacing-md)',
                flex: 1,
                justifyContent: 'flex-end',
                textTransform: 'uppercase',
                fontFamily: 'var(--font-body)',
                fontSize: '2.5 rem'
            }}>
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
