import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { createOrder, createRazorpayOrder } from '../services/api';
import { useAuth } from '../context/AuthContext';

function Cart() {
    const { cart, removeFromCart, updateQuantity, cartTotal, clearCart } = useCart();
    const { user } = useAuth();

    // States for handling checkout flow
    const [checkoutMode, setCheckoutMode] = useState(false);
    const [customerInfo, setCustomerInfo] = useState({ name: '', email: '', address: '' });
    const [isPlacing, setIsPlacing] = useState(false);
    const [orderSuccess, setOrderSuccess] = useState(null);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCustomerInfo(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmitOrder = async (e) => {
        e.preventDefault();
        setIsPlacing(true);

        try {
            // 1. Request a payment token order from our Express backend
            const rzpOrderResponse = await createRazorpayOrder(cartTotal);
            const rzpOrder = rzpOrderResponse.data;

            // 2. Configure the Razorpay payment modal options
            const options = {
                key: rzpOrder.key_id,
                amount: rzpOrder.amount,
                currency: rzpOrder.currency,
                name: "HIGH WEAR",
                description: "Secure Checkout Payment",
                order_id: rzpOrder.id,

                // 3. Callback triggered when the customer successfully completes payment
                handler: async function (response) {
                    try {
                        const payload = {
                            user_id: user ? user.id : null,
                            items: cart.map(item => ({
                                product_id: item.product._id,
                                quantity: item.quantity
                            })),
                            customer_info: customerInfo,
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature
                        };

                        // Verify signature and create invoice on the backend
                        const orderResponse = await createOrder(payload);
                        setOrderSuccess(orderResponse.data);
                        clearCart();
                    } catch (err) {
                        console.error('Order completion failed:', err);
                        alert(`Error logging transaction: ${err.response?.data?.error || err.message}`);
                    } finally {
                        setIsPlacing(false);
                    }
                },
                prefill: {
                    name: customerInfo.name,
                    email: customerInfo.email
                },
                theme: {
                    color: "#0b0b0b" // Match brutalist theme
                },
                modal: {
                    ondismiss: function () {
                        setIsPlacing(false);
                    }
                }
            };

            // 4. Open Razorpay secure window
            const rzp = new window.Razorpay(options);
            rzp.open();

        } catch (error) {
            console.error('Checkout creation failed:', error);
            const errMsg = error.response?.data?.error || 'Failed to initiate payment gateway.';
            alert(`Payment Gateway Error: ${errMsg}`);
            setIsPlacing(false);
        }
    };

    // 1. SUCCESS SCREEN (Printed Receipt Analogy)
    if (orderSuccess) {
        return (
            <div className="container" style={{ paddingTop: 'var(--spacing-xl)', paddingBottom: 'var(--spacing-xxl)' }}>
                <div style={{ border: '2px solid var(--text-main)', padding: 'var(--spacing-lg)', maxWidth: '600px', margin: '0 auto' }}>
                    <h3 className="heading-large" style={{ marginBottom: 'var(--spacing-md)' }}>ORDER CONFIRMED</h3>
                    
                    <div className="text-mono" style={{ marginBottom: 'var(--spacing-lg)', borderTop: '2px solid var(--text-main)', borderBottom: '2px solid var(--text-main)', padding: 'var(--spacing-md) 0' }}>
                        <div style={{ marginBottom: 'var(--spacing-sm)' }}><strong>REFERENCE:</strong> {orderSuccess.order_id}</div>
                        <div style={{ marginBottom: 'var(--spacing-sm)' }}><strong>TOTAL:</strong> ${orderSuccess.total.toLocaleString()}</div>
                        <div style={{ fontSize: '0.8rem' }}>RECEIPT SENT TO: {customerInfo.email}</div>
                    </div>

                    <Link to="/shop" className="hover-invert" style={{ display: 'inline-block', border: '2px solid var(--text-main)', padding: 'var(--spacing-sm) var(--spacing-md)', fontWeight: 'bold' }}>
                        RETURN TO SHOP
                    </Link>
                </div>
            </div>
        );
    }

    // 2. EMPTY BASKET VIEW
    if (cart.length === 0) {
        return (
            <div className="container" style={{ paddingTop: 'var(--spacing-xl)', paddingBottom: 'var(--spacing-xxl)', textAlign: 'center' }}>
                <h3 className="heading-massive" style={{ marginBottom: 'var(--spacing-md)' }}>CART IS EMPTY</h3>
                <Link to="/shop" className="hover-invert" style={{ display: 'inline-block', border: '2px solid var(--text-main)', padding: 'var(--spacing-sm) var(--spacing-md)', fontWeight: 'bold' }}>
                    EXPLORE PRODUCTS
                </Link>
            </div>
        );
    }

    return (
        <div className="container" style={{ paddingTop: 'var(--spacing-xl)', paddingBottom: 'var(--spacing-xxl)' }}>
            <h2 className="heading-massive" style={{ marginBottom: 'var(--spacing-lg)', borderBottom: '2px solid var(--text-main)', paddingBottom: 'var(--spacing-md)' }}>
                {checkoutMode ? 'SHIPPING DETAILS' : 'BASKET'}
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 'var(--spacing-xl)' }}>
                {/* Left Column: Toggles between Basket Items and Checkout Form */}
                <div>
                    {!checkoutMode ? (
                        // REVIEW CART ITEMS VIEW
                        <div>
                            {cart.map((item) => (
                                <div key={item.product._id} style={{ display: 'grid', gridTemplateColumns: '100px 1fr auto', gap: 'var(--spacing-md)', borderBottom: '2px solid var(--text-main)', paddingBottom: 'var(--spacing-md)', marginBottom: 'var(--spacing-md)' }}>
                                    <div style={{ backgroundColor: 'var(--bg-accent)', aspectRatio: '1/1' }}>
                                        <img src={item.product.image || 'https://via.placeholder.com/100'} alt={item.product.name} style={{ width: '100%', height: '100%', objectFit: 'cover', mixBlendMode: 'multiply' }} />
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                        <span className="text-tiny bracket-wrap" style={{ marginBottom: 'var(--spacing-xs)' }}>{item.product.brand || 'BRAND'}</span>
                                        <h6 className="heading-medium" style={{ margin: 0 }}>{item.product.name}</h6>
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'space-between' }}>
                                        <div className="text-mono fw-bold fs-6">
                                            ${(item.product.retail_price * item.quantity).toLocaleString()}
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
                                            <button className="hover-invert" style={{ border: '2px solid var(--text-main)', width: '30px', height: '30px' }} onClick={() => updateQuantity(item.product._id, item.quantity - 1)}>-</button>
                                            <span className="text-mono fw-bold">{item.quantity}</span>
                                            <button className="hover-invert" style={{ border: '2px solid var(--text-main)', width: '30px', height: '30px' }} onClick={() => updateQuantity(item.product._id, item.quantity + 1)}>+</button>
                                        </div>
                                        <button className="text-tiny hover-invert" style={{ marginTop: 'var(--spacing-sm)', padding: '2px 4px' }} onClick={() => removeFromCart(item.product._id)}>
                                            [ REMOVE ]
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        // CHECKOUT SHIPPMENT FORM VIEW
                        <div style={{ border: '2px solid var(--text-main)', padding: 'var(--spacing-lg)' }}>
                            <form onSubmit={handleSubmitOrder} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-xs)' }}>
                                    <label className="text-tiny bracket-wrap">FULL NAME</label>
                                    <input type="text" style={{ borderBottom: '2px solid var(--text-main)', padding: 'var(--spacing-sm) 0', fontSize: '1.2rem' }} name="name" value={customerInfo.name} onChange={handleInputChange} required />
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-xs)' }}>
                                    <label className="text-tiny bracket-wrap">EMAIL</label>
                                    <input type="email" style={{ borderBottom: '2px solid var(--text-main)', padding: 'var(--spacing-sm) 0', fontSize: '1.2rem' }} name="email" value={customerInfo.email} onChange={handleInputChange} required />
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-xs)' }}>
                                    <label className="text-tiny bracket-wrap">ADDRESS</label>
                                    <textarea style={{ borderBottom: '2px solid var(--text-main)', padding: 'var(--spacing-sm) 0', fontSize: '1.2rem', resize: 'vertical', minHeight: '80px', fontFamily: 'var(--font-body)' }} name="address" value={customerInfo.address} onChange={handleInputChange} required></textarea>
                                </div>
                                <div style={{ display: 'flex', gap: 'var(--spacing-sm)', marginTop: 'var(--spacing-md)' }}>
                                    <button type="button" className="hover-invert" style={{ flex: 1, border: '2px solid var(--text-main)', padding: 'var(--spacing-md)', fontWeight: 'bold' }} onClick={() => setCheckoutMode(false)} disabled={isPlacing}>
                                        BACK TO BASKET
                                    </button>
                                    <button type="submit" className="hover-invert" style={{ flex: 2, border: '2px solid var(--text-main)', padding: 'var(--spacing-md)', fontWeight: 'bold' }} disabled={isPlacing}>
                                        {isPlacing ? 'PROCESSING...' : 'PAY & PLACE ORDER'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}
                </div>

                {/* Right Column: Cost Receipts Summary */}
                <div>
                    <div style={{ border: '2px solid var(--text-main)', padding: 'var(--spacing-lg)', position: 'sticky', top: 'var(--spacing-lg)' }}>
                        <h4 className="heading-large" style={{ marginBottom: 'var(--spacing-md)', borderBottom: '2px solid var(--text-main)', paddingBottom: 'var(--spacing-xs)' }}>SUMMARY</h4>
                        <div className="flex-between text-mono" style={{ marginBottom: 'var(--spacing-sm)' }}>
                            <span>SUBTOTAL</span>
                            <span>${cartTotal.toLocaleString()}</span>
                        </div>
                        <div className="flex-between text-mono" style={{ marginBottom: 'var(--spacing-lg)' }}>
                            <span>DELIVERY</span>
                            <span>FREE</span>
                        </div>
                        <div className="flex-between text-mono" style={{ borderTop: '2px solid var(--text-main)', paddingTop: 'var(--spacing-sm)', marginBottom: 'var(--spacing-lg)', fontWeight: 'bold', fontSize: '1.5rem' }}>
                            <span>TOTAL</span>
                            <span>${cartTotal.toLocaleString()}</span>
                        </div>

                        {!checkoutMode && (
                            <button className="hover-invert" style={{ width: '100%', border: '2px solid var(--text-main)', padding: 'var(--spacing-md)', fontWeight: 'bold', fontSize: '1.2rem' }} onClick={() => setCheckoutMode(true)}>
                                PROCEED TO CHECKOUT
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Cart;
