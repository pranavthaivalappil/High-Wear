import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { createOrder, createRazorpayOrder } from '../services/api'; // 👈 Import our new API helper

function Cart() {
    const { cart, removeFromCart, updateQuantity, cartTotal, clearCart } = useCart();

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
                name: "Apollo Market",
                description: "Secure Checkout Payment",
                order_id: rzpOrder.id,
                
                // 3. Callback triggered when the customer successfully completes payment
                handler: async function (response) {
                    try {
                        const payload = {
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
                    color: "#6366f1" // Custom Indigo styling to match Apollo Market theme
                },
                modal: {
                    ondismiss: function () {
                        setIsPlacing(false); // Enable the place order button again if closed
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
            <div className="container mt-5">
                <div className="row justify-content-center">
                    <div className="col-md-8">
                        <div className="glass-panel p-5 text-center">
                            <i className="bi bi-patch-check-fill text-success display-1 d-block mb-3"></i>
                            <h3 className="text-main fw-bold">Order Placed Successfully!</h3>
                            <p className="text-muted mb-4">Thank you for shopping with Apollo Market.</p>

                            <div className="glass-panel p-4 mb-4 text-start bg-opacity-25" style={{ borderRadius: '12px' }}>
                                <div className="mb-2 text-main"><strong>Order Reference:</strong> <span className="text-accent">{orderSuccess.order_id}</span></div>
                                <div className="mb-2 text-main"><strong>Total Charged:</strong> ₹{orderSuccess.total.toLocaleString()}</div>
                                <div className="text-muted fs-7">A confirmation email has been dispatched to {customerInfo.email}.</div>
                            </div>

                            <Link to="/catalog" className="btn glass-btn">
                                Return to Catalog
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // 2. EMPTY BASKET VIEW
    if (cart.length === 0) {
        return (
            <div className="container mt-5">
                <div className="row justify-content-center">
                    <div className="col-md-8">
                        <div className="glass-panel p-5 text-center">
                            <i className="bi bi-cart-x text-accent display-1 d-block mb-3"></i>
                            <h3 className="text-main fw-bold">Your Basket is Empty</h3>
                            <p className="text-muted mb-4">Go explore the catalog and pick out some fashion items!</p>
                            <Link to="/catalog" className="btn glass-btn">
                                Explore Products
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container mt-5">
            <h2 className="text-main fw-bold mb-4">
                <i className="bi bi-bag-check-fill text-accent me-2"></i>
                {checkoutMode ? 'Delivery Information' : 'Review Your Basket'}
            </h2>

            <div className="row g-4">
                {/* Left Column: Toggles between Basket Items and Checkout Form */}
                <div className="col-lg-8">
                    {!checkoutMode ? (
                        // REVIEW CART ITEMS VIEW
                        <div className="glass-panel p-4">
                            {cart.map((item) => (
                                <div key={item.product._id} className="row align-items-center g-3 mb-4 pb-4 border-bottom border-white border-opacity-10 last-border-none">
                                    <div className="col-3 col-sm-2">
                                        <div className="product-card-img-wrapper" style={{ paddingTop: '100%', borderRadius: '10px' }}>
                                            <img src={item.product.image} alt={item.product.name} className="product-card-img" />
                                        </div>
                                    </div>
                                    <div className="col-9 col-sm-5">
                                        <span className="text-accent fw-bold fs-8 text-uppercase">{item.product.brand}</span>
                                        <h6 className="text-main fw-semibold text-truncate m-0" title={item.product.name}>
                                            {item.product.name}
                                        </h6>
                                        <span className="text-muted fs-7">Category: {item.product.category}</span>
                                    </div>
                                    <div className="col-6 col-sm-3 d-flex align-items-center gap-2">
                                        <button
                                            className="btn btn-sm glass-btn-secondary py-0.5 px-2.5"
                                            onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
                                        >
                                            -
                                        </button>
                                        <span className="text-main fw-medium px-2">{item.quantity}</span>
                                        <button
                                            className="btn btn-sm glass-btn-secondary py-0.5 px-2.5"
                                            onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                                        >
                                            +
                                        </button>
                                    </div>
                                    <div className="col-6 col-sm-2 text-end">
                                        <div className="text-main fw-bold fs-6">
                                            ₹{(item.product.retail_price * item.quantity).toLocaleString()}
                                        </div>
                                        <button
                                            className="btn btn-sm text-danger border-0 bg-transparent p-0 mt-1 fs-7"
                                            onClick={() => removeFromCart(item.product._id)}
                                        >
                                            <i className="bi bi-trash-fill me-1"></i>Remove
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        // CHECKOUT SHIPPMENT FORM VIEW
                        <div className="glass-panel p-4">
                            <h4 className="text-main fw-bold mb-4">Shipping & Invoicing Details</h4>
                            <form onSubmit={handleSubmitOrder}>
                                <div className="mb-3">
                                    <label className="form-label text-main fw-medium">Full Name</label>
                                    <input
                                        type="text"
                                        className="form-control glass-input"
                                        name="name"
                                        value={customerInfo.name}
                                        onChange={handleInputChange}
                                        placeholder="Enter your name"
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label text-main fw-medium">Email Address</label>
                                    <input
                                        type="email"
                                        className="form-control glass-input"
                                        name="email"
                                        value={customerInfo.email}
                                        onChange={handleInputChange}
                                        placeholder="email@example.com"
                                        required
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="form-label text-main fw-medium">Shipping Address</label>
                                    <textarea
                                        className="form-control glass-input"
                                        name="address"
                                        rows="3"
                                        value={customerInfo.address}
                                        onChange={handleInputChange}
                                        placeholder="Street name, City, Zipcode"
                                        required
                                    ></textarea>
                                </div>

                                <div className="d-flex gap-3">
                                    <button
                                        type="button"
                                        className="btn glass-btn-secondary px-4 py-2"
                                        onClick={() => setCheckoutMode(false)}
                                        disabled={isPlacing}
                                    >
                                        Back to Basket
                                    </button>
                                    <button
                                        type="submit"
                                        className="btn glass-btn px-4 py-2 flex-grow-1"
                                        disabled={isPlacing}
                                    >
                                        {isPlacing ? 'Placing Order...' : `Pay & Place Order`}
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}
                </div>

                {/* Right Column: Cost Receipts Summary */}
                <div className="col-lg-4">
                    <div className="glass-panel p-4 position-sticky" style={{ top: '100px' }}>
                        <h4 className="text-main fw-bold mb-4">Summary</h4>
                        <div className="d-flex justify-content-between mb-3 border-bottom border-white border-opacity-10 pb-2">
                            <span className="text-muted">Subtotal</span>
                            <span className="text-main fw-semibold">₹{cartTotal.toLocaleString()}</span>
                        </div>
                        <div className="d-flex justify-content-between mb-4">
                            <span className="text-muted">Delivery</span>
                            <span className="text-success fw-semibold">FREE</span>
                        </div>
                        <div className="d-flex justify-content-between mb-4 border-top border-white border-opacity-10 pt-3">
                            <h5 className="text-main fw-bold">Total</h5>
                            <h5 className="text-accent fw-bold">₹{cartTotal.toLocaleString()}</h5>
                        </div>

                        {!checkoutMode && (
                            <button className="btn glass-btn w-100 py-2.5 fw-bold fs-6" onClick={() => setCheckoutMode(true)}>
                                Proceed to Checkout
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Cart;
