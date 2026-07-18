import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { registerUser, loginUser } from '../services/api';

function Auth() {
    const [isLogin, setIsLogin] = useState(true); // Toggle between Login and Register modes
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const response = isLogin
                ? await loginUser({ email: formData.email, password: formData.password })
                : await registerUser(formData);

            // Save user details and verification token into AuthContext
            login(response.data.user, response.data.token);
            navigate('/'); // Head back to main store on success
        } catch (err) {
            setError(err.response?.data?.error || 'Authentication failed. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mt-5 pt-4">
            <div className="row justify-content-center">
                <div className="col-md-5">
                    <div className="glass-panel p-5">
                        <div className="text-center mb-4">
                            <i className="bi bi-person-circle text-accent display-4"></i>
                            <h3 className="text-main fw-bold mt-2">
                                {isLogin ? 'Welcome Back!' : 'Create Account'}
                            </h3>
                            <p className="text-muted fs-7">
                                {isLogin ? 'Sign in to your Apollo Market account' : 'Join Apollo Market today'}
                            </p>
                        </div>

                        {error && (
                            <div className="alert alert-danger py-2 fs-7" role="alert">
                                <i className="bi bi-exclamation-circle me-2"></i>{error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit}>
                            {!isLogin && (
                                <div className="mb-3">
                                    <label className="form-label text-muted fs-7 fw-semibold">Full Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        className="form-control glass-input"
                                        placeholder="Pranav Thaivalappil"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            )}
                            <div className="mb-3">
                                <label className="form-label text-muted fs-7 fw-semibold">Email Address</label>
                                <input
                                    type="email"
                                    name="email"
                                    className="form-control glass-input"
                                    placeholder="you@example.com"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="form-label text-muted fs-7 fw-semibold">Password</label>
                                <input
                                    type="password"
                                    name="password"
                                    className="form-control glass-input"
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                className="btn glass-btn w-100 py-3 fw-bold"
                                disabled={loading}
                            >
                                {loading
                                    ? <><span className="spinner-border spinner-border-sm me-2"></span>Please wait...</>
                                    : isLogin ? 'Sign In' : 'Create Account'
                                }
                            </button>
                        </form>

                        <div className="text-center mt-4">
                            <span className="text-muted fs-7">
                                {isLogin ? "Don't have an account? " : "Already have an account? "}
                            </span>
                            <button
                                className="btn btn-link text-accent fs-7 p-0 fw-semibold"
                                onClick={() => { setIsLogin(!isLogin); setError(null); }}
                            >
                                {isLogin ? 'Register here' : 'Sign in'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Auth;
