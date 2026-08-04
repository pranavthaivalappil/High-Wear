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
            <div className="container" style={{ paddingTop: 'var(--spacing-xxl)', paddingBottom: 'var(--spacing-xxl)', textAlign: 'center' }}>
                <h3 className="heading-large" style={{ marginBottom: 'var(--spacing-md)' }}>AUTHENTICATION REQUIRED</h3>
                <Link to="/login" className="hover-invert" style={{ display: 'inline-block', border: '2px solid var(--text-main)', padding: 'var(--spacing-sm) var(--spacing-md)', fontWeight: 'bold' }}>
                    SIGN IN TO VIEW ORDERS
                </Link>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="container" style={{ paddingTop: 'var(--spacing-xxl)', paddingBottom: 'var(--spacing-xxl)', textAlign: 'center' }}>
                <div className="text-mono fw-bold">[ FETCHING DOSSIER... ]</div>
            </div>
        );
    }

    return (
        <div className="container" style={{ paddingTop: 'var(--spacing-xl)', paddingBottom: 'var(--spacing-xxl)' }}>
            <div className="flex-between" style={{ borderBottom: '2px solid var(--text-main)', paddingBottom: 'var(--spacing-md)', marginBottom: 'var(--spacing-lg)' }}>
                <h2 className="heading-massive m-0">ORDER ARCHIVE</h2>
                <div className="text-tiny bracket-wrap">OPERATIVE: {user.name.toUpperCase()}</div>
            </div>

            {orders.length === 0 ? (
                <div style={{ border: '2px solid var(--text-main)', padding: 'var(--spacing-xl)', textAlign: 'center' }}>
                    <h5 className="text-mono fw-bold" style={{ marginBottom: 'var(--spacing-md)' }}>NO ORDERS FOUND IN DATABASE.</h5>
                    <Link to="/shop" className="hover-invert" style={{ display: 'inline-block', border: '2px solid var(--text-main)', padding: 'var(--spacing-sm) var(--spacing-md)', fontWeight: 'bold' }}>
                        INITIATE NEW ACQUISITION
                    </Link>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-lg)' }}>
                    {orders.map((order, index) => (
                        <div key={order._id} style={{ border: '2px solid var(--text-main)', padding: 'var(--spacing-md)' }}>
                            <div className="flex-between" style={{ borderBottom: '2px solid var(--text-main)', paddingBottom: 'var(--spacing-sm)', marginBottom: 'var(--spacing-sm)' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-xs)' }}>
                                    <div className="text-tiny bracket-wrap" style={{ display: 'inline-block', alignSelf: 'flex-start' }}>STATUS: {order.status.toUpperCase()}</div>
                                    <span className="text-mono fw-bold fs-7">REF: {order._id}</span>
                                    <span className="text-mono fs-8">DATE: {new Date(order.createdAt).toLocaleDateString().replace(/\//g, '.')}</span>
                                </div>
                                <h4 className="heading-large m-0">${order.total_price.toLocaleString()}</h4>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 'var(--spacing-md)' }}>
                                {order.items.map((item, idx) => (
                                    <div key={idx} style={{ display: 'grid', gridTemplateColumns: '60px 1fr', gap: 'var(--spacing-sm)', alignItems: 'center' }}>
                                        <div style={{ backgroundColor: 'var(--bg-accent)', width: '60px', height: '60px' }}>
                                            <img
                                                src={item.product_id?.image || 'https://via.placeholder.com/60'}
                                                alt="Product"
                                                style={{ width: '100%', height: '100%', objectFit: 'cover', mixBlendMode: 'multiply' }}
                                            />
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                                            <h6 className="text-mono fw-bold m-0 text-truncate" style={{ fontSize: '0.9rem' }}>
                                                {item.product_id?.name || 'UNKNOWN ITEM'}
                                            </h6>
                                            <span className="text-tiny">QTY: {item.quantity}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default MyOrders;
