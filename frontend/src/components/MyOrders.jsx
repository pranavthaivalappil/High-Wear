import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { fetchMyOrders } from '../services/api';
import { Link } from 'react-router-dom';

function MyOrders() {
    const { user, token } = useAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getOrders = async () => {
            try {
                const response = await fetchMyOrders(token);
                setOrders(response.data);
            } catch (error) {
                console.error("Failed to fetch orders", error);
            } finally {
                setLoading(false);
            }
        };

        if (token) {
            getOrders();
        }
    }, [token]);

    if (!user) {
        return (
            <div className="container mt-5 pt-5 text-center">
                <h3 className="text-main fw-bold">Please sign in to view your orders.</h3>
                <Link to="/login" className="btn glass-btn mt-3">Sign In</Link>
            </div>
        );
    }

    if (loading) return <div className="text-center mt-5"><div className="spinner-border text-accent"></div></div>;

    return (
        <div className="container mt-4 pt-3">
            <h2 className="text-main fw-bold mb-4">
                <i className="bi bi-box-seam me-2 text-accent"></i>My Orders
            </h2>

            {orders.length === 0 ? (
                <div className="glass-panel p-5 text-center">
                    <h5 className="text-muted">You haven't placed any orders yet.</h5>
                    <Link to="/catalog" className="btn glass-btn mt-3">Start Shopping</Link>
                </div>
            ) : (
                <div className="row g-4">
                    {orders.map(order => (
                        <div key={order._id} className="col-12">
                            <div className="glass-panel p-4">
                                <div className="d-flex justify-content-between align-items-center mb-3 border-bottom border-secondary border-opacity-25 pb-3">
                                    <div>
                                        <span className="badge bg-success mb-2">{order.status}</span>
                                        <p className="text-muted fs-7 mb-0">Order ID: {order._id}</p>
                                        <p className="text-muted fs-7 mb-0">Date: {new Date(order.createdAt).toLocaleDateString()}</p>
                                    </div>
                                    <h4 className="text-main fw-bold mb-0">₹{order.total_price.toLocaleString()}</h4>
                                </div>

                                <div className="row g-3">
                                    {order.items.map((item, idx) => (
                                        <div key={idx} className="col-md-6 col-lg-4">
                                            <div className="d-flex align-items-center gap-3">
                                                <img
                                                    src={item.product_id?.image || 'https://via.placeholder.com/60'}
                                                    alt="Product"
                                                    className="rounded"
                                                    style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                                                />
                                                <div>
                                                    <h6 className="text-main mb-0 fs-7 fw-semibold text-truncate" style={{ maxWidth: '150px' }}>
                                                        {item.product_id?.name || 'Unknown Product'}
                                                    </h6>
                                                    <span className="text-muted fs-8">Qty: {item.quantity}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default MyOrders;
