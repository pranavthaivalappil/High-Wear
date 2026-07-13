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
                {/* Brand Logo */}
                <Link className="navbar-brand fw-bold text-main d-flex align-items-center" to="/">
                    <i className="bi bi-rocket-takeoff-fill me-2 text-accent"></i>
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
                                    `nav-link px-3 fw-medium text-main ${isActive ? 'text-accent border-bottom border-2 border-accent' : ''}`
                                }
                                to="/"
                            >
                                Home
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink
                                className={({ isActive }) =>
                                    `nav-link px-3 fw-medium text-main ${isActive ? 'text-accent border-bottom border-2 border-accent' : ''}`
                                }
                                to="/catalog"
                            >
                                Catalog
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink
                                className={({ isActive }) =>
                                    `nav-link px-3 fw-medium text-main ${isActive ? 'text-accent border-bottom border-2 border-accent' : ''}`
                                }
                                to="/men"
                            >
                                Men
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink
                                className={({ isActive }) =>
                                    `nav-link px-3 fw-medium text-main ${isActive ? 'text-accent border-bottom border-2 border-accent' : ''}`
                                }
                                to="/women"
                            >
                                Women
                            </NavLink>
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
                                    <i className="bi bi-sun-fill text-warning"></i> // Sun icon for dark mode (click to go to light)
                                ) : (
                                    <i className="bi bi-moon-stars-fill text-accent"></i> // Moon icon for light mode (click to go to dark)
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
