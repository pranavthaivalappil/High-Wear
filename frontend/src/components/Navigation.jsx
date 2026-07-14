import React, { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';

function Navigation() {
    // 1. Initialize theme state from localStorage (default to light mode if not set)
    const [isDark, setIsDark] = useState(() => {
        return localStorage.getItem('theme') === 'dark';
    });

    // 2. Apply theme whenever it changes
    useEffect(() => {
        if (isDark) {
            document.body.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.body.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [isDark]);

    return (
        <nav className="navbar navbar-expand-lg glass-navbar navbar-dark">
            <div className="container">
                {/* Brand Logo with custom Greek Bow symbol on the left */}
                <Link className="navbar-brand fw-bold text-main d-flex align-items-center" to="/">
                    <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        width="22" 
                        height="22" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke="url(#logo-gradient)" 
                        strokeWidth="2" 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        className="me-2.5" 
                        style={{ transform: 'rotate(-45deg)' }}
                    >
                        <defs>
                            <linearGradient id="logo-gradient" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
                                <stop offset="0%" stopColor="var(--primary-color)" />
                                <stop offset="100%" stopColor="var(--accent-color)" />
                            </linearGradient>
                        </defs>
                        <path d="M4 22V2" />
                        <path d="M4 2C13.5 2 20 6.5 20 12C20 17.5 13.5 22 4 22" />
                        <path d="M4 12H22" />
                        <path d="M18 9L22 12L18 15" />
                    </svg>
                    Apollo Market
                </Link>

                {/* Mobile hamburger menu toggle button */}
                <button
                    className="navbar-toggler border-0 text-main"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNav"
                    aria-controls="navbarNav"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <i className="bi bi-list fs-2"></i>
                </button>

                {/* Collapsible menu links */}
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav ms-auto align-items-center gap-2">
                        <li className="nav-item">
                            <NavLink
                                className={({ isActive }) =>
                                    `nav-link px-3 fw-medium text-main d-flex align-items-center ${isActive ? 'active' : ''}`
                                }
                                to="/"
                            >
                                <i className="bi bi-house-door-fill me-1.5 opacity-75"></i>
                                Home
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink
                                className={({ isActive }) =>
                                    `nav-link px-3 fw-medium text-main d-flex align-items-center ${isActive ? 'active' : ''}`
                                }
                                to="/catalog"
                            >
                                <i className="bi bi-box-seam-fill me-1.5 opacity-75"></i>
                                Products
                            </NavLink>
                        </li>
                        
                        {/* Dropdown Menu for Departments */}
                        <li className="nav-item dropdown">
                            <a
                                className="nav-link dropdown-toggle px-3 fw-medium text-main d-flex align-items-center"
                                href="#"
                                role="button"
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                            >
                                <i className="bi bi-building-fill me-1.5 opacity-75"></i>
                                Departments
                            </a>
                            <ul className="dropdown-menu glass-panel border-0 shadow mt-2 p-1">
                                <li>
                                    <Link className="dropdown-item fw-medium py-2 px-3 text-main rounded" to="/men">
                                        Men's Collection
                                    </Link>
                                </li>
                                <li>
                                    <Link className="dropdown-item fw-medium py-2 px-3 text-main rounded" to="/women">
                                        Women's Collection
                                    </Link>
                                </li>
                            </ul>
                        </li>

                        {/* Theme Toggle Button */}
                        <li className="nav-item ms-lg-3 mt-3 mt-lg-0">
                            <button
                                className="btn border-0 theme-switch d-flex align-items-center justify-content-center p-2"
                                onClick={() => setIsDark(!isDark)}
                                aria-label="Toggle dark mode"
                                type="button"
                            >
                                {isDark ? (
                                    <i className="bi bi-sun-fill text-warning"></i>
                                ) : (
                                    <i className="bi bi-moon-stars-fill text-accent"></i>
                                )}
                            </button>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
}

export default Navigation;
