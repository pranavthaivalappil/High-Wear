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
        <div className="container" style={{ paddingTop: 'var(--spacing-xxl)', paddingBottom: 'var(--spacing-xxl)' }}>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <div style={{ width: '100%', maxWidth: '500px', border: '2px solid var(--text-main)', padding: 'var(--spacing-xl)' }}>
                    
                    <div style={{ textAlign: 'center', marginBottom: 'var(--spacing-lg)' }}>
                        <h2 className="heading-large" style={{ marginBottom: 'var(--spacing-xs)' }}>
                            {isLogin ? 'AUTHENTICATE' : 'REGISTER'}
                        </h2>
                        <div className="text-tiny bracket-wrap">
                            {isLogin ? 'EXISTING OPERATIVE' : 'NEW OPERATIVE'}
                        </div>
                    </div>

                    {error && (
                        <div className="text-mono" style={{ backgroundColor: 'var(--text-main)', color: 'var(--text-light)', padding: 'var(--spacing-sm)', marginBottom: 'var(--spacing-md)', fontSize: '0.9rem', fontWeight: 'bold' }}>
                            [ ERROR ]: {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
                        {!isLogin && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-xs)' }}>
                                <label className="text-tiny bracket-wrap">FULL NAME</label>
                                <input
                                    type="text"
                                    name="name"
                                    style={{ borderBottom: '2px solid var(--text-main)', padding: 'var(--spacing-sm) 0', fontSize: '1.2rem' }}
                                    placeholder="JOHN DOE"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        )}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-xs)' }}>
                            <label className="text-tiny bracket-wrap">EMAIL ADDRESS</label>
                            <input
                                type="email"
                                name="email"
                                style={{ borderBottom: '2px solid var(--text-main)', padding: 'var(--spacing-sm) 0', fontSize: '1.2rem' }}
                                placeholder="OPERATIVE@HIGHWEAR.COM"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-xs)' }}>
                            <label className="text-tiny bracket-wrap">PASSWORD</label>
                            <input
                                type="password"
                                name="password"
                                style={{ borderBottom: '2px solid var(--text-main)', padding: 'var(--spacing-sm) 0', fontSize: '1.2rem', letterSpacing: '0.2em' }}
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            className="hover-invert"
                            style={{ 
                                marginTop: 'var(--spacing-md)',
                                border: '2px solid var(--text-main)', 
                                padding: 'var(--spacing-md)', 
                                fontSize: '1.2rem', 
                                fontWeight: 'bold',
                                cursor: 'pointer'
                            }}
                            disabled={loading}
                        >
                            {loading
                                ? '[ PROCESSING... ]'
                                : isLogin ? 'SIGN IN' : 'CREATE ACCOUNT'
                            }
                        </button>
                    </form>

                    <div style={{ textAlign: 'center', marginTop: 'var(--spacing-lg)', borderTop: '2px solid var(--text-main)', paddingTop: 'var(--spacing-md)' }}>
                        <span className="text-mono" style={{ fontSize: '0.8rem', marginRight: 'var(--spacing-sm)' }}>
                            {isLogin ? "DON'T HAVE AN ACCOUNT?" : "ALREADY HAVE AN ACCOUNT?"}
                        </span>
                        <button
                            className="hover-invert"
                            style={{ padding: '2px 6px', fontWeight: 'bold', fontSize: '0.8rem', cursor: 'pointer', border: '1px solid var(--text-main)' }}
                            onClick={() => { setIsLogin(!isLogin); setError(null); }}
                        >
                            {isLogin ? 'REGISTER' : 'SIGN IN'}
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
}

export default Auth;
