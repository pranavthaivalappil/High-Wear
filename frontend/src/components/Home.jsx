import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchStats } from '../services/api';

function Home() {
    const [stats, setStats] = useState({ totalProducts: 0, totalDepartments: 0, totalBrands: 0 });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch database statistics when the component mounts
    useEffect(() => {
        const getStats = async () => {
            try {
                setLoading(true);
                const response = await fetchStats();
                setStats(response.data);
                setError(null);
            } catch (err) {
                console.error('Error fetching statistics:', err);
                setError('Failed to fetch store metrics. Make sure the backend server is running on port 5000!');
            } finally {
                setLoading(false);
            }
        };
        getStats();
    }, []);

    return (
        <div className="container mt-5">
            {/* 1. Hero Section */}
            <div className="row justify-content-center text-center mb-5">
                <div className="col-md-10">
                    <div className="glass-panel p-5 mb-4 position-relative overflow-hidden">
                        <div className="position-relative z-index-1">
                            <h1 className="display-4 fw-bold text-main mb-3">
                                Welcome to <span className="text-accent">Apollo Market</span>
                            </h1>
                            <p className="lead text-muted mb-4 fs-5">
                                Step into the future of fashion. Browse through over 29,000 products
                                across premium brands, categorized and filtered instantly.
                            </p>
                            <Link to="/catalog" className="btn glass-btn btn-lg px-4 py-2">
                                <i className="bi bi-bag-fill me-2"></i>
                                Explore Catalog
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* 2. Live Statistics Dashboard */}
            <h3 className="text-center fw-bold text-main mb-4">
                <i className="bi bi-activity text-accent me-2"></i>
                Live Metrics Dashboard
            </h3>

            {/* Display Loading Spinner */}
            {loading && (
                <div className="text-center my-5">
                    <div className="spinner-border text-accent" role="status" style={{ width: '3rem', height: '3rem' }}>
                        <span className="visually-hidden">Loading metrics...</span>
                    </div>
                    <p className="text-muted mt-3">Connecting to catalog database...</p>
                </div>
            )}

            {/* Display Connection Error Warning */}
            {error && (
                <div className="row justify-content-center">
                    <div className="col-md-8">
                        <div className="alert alert-danger glass-panel border-danger text-center p-4" role="alert">
                            <i className="bi bi-exclamation-triangle-fill text-danger fs-1 d-block mb-3"></i>
                            <h5 className="fw-bold">Database Server Offline</h5>
                            <p className="mb-0 text-muted">{error}</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Display Stats Grid when loaded successfully */}
            {!loading && !error && (
                <div className="row justify-content-center g-4 mb-5">
                    {/* Card 1: Total Products */}
                    <div className="col-md-4 col-sm-6">
                        <div className="glass-card stat-card">
                            <i className="bi bi-box-seam-fill stat-icon"></i>
                            <div className="stat-value">{stats.totalProducts.toLocaleString()}</div>
                            <div className="stat-label">Total Products</div>
                        </div>
                    </div>

                    {/* Card 2: Brands */}
                    <div className="col-md-4 col-sm-6">
                        <div className="glass-card stat-card">
                            <i className="bi bi-tags-fill stat-icon"></i>
                            <div className="stat-value">{stats.totalBrands}</div>
                            <div className="stat-label">Curated Brands</div>
                        </div>
                    </div>

                    {/* Card 3: Departments */}
                    <div className="col-md-4 col-sm-6">
                        <div className="glass-card stat-card">
                            <i className="bi bi-gender-ambiguous stat-icon"></i>
                            <div className="stat-value">{stats.totalDepartments}</div>
                            <div className="stat-label">Departments</div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Home;
