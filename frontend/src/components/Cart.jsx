import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

function Cart() {
    const { cart, removeFromCart, updateQuantity, cartTotal, clearCart } = useCart();

    const handleCheckout = () => {
        alert('Proceeding to Checkout! (We will build the secure checkout transaction next!)');
    };

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
                Review Your Basket
            </h2>

            <div className="row g-4">
                {/* 1. Left Side: Items List */}
                <div className="col-lg-8">
                    <div className="glass-panel p-4">
                        {cart.map((item) => (
                            <div key={item.product._id} className="row align-items-center g-3 mb-4 pb-4 border-bottom border-white border-opacity-10 last-border-none">
                                {/* Product Image */}
                                <div className="col-3 col-sm-2">
                                    <div className="product-card-img-wrapper" style={{ paddingTop: '100%', borderRadius: '10px' }}>
                                        <img src={item.product.image} alt={item.product.name} className="product-card-img" />
                                    </div>
                                </div>

                                {/* Title & Brand */}
                                <div className="col-9 col-sm-5">
                                    <span className="text-accent fw-bold fs-8 text-uppercase">{item.product.brand}</span>
                                    <h6 className="text-main fw-semibold text-truncate m-0" title={item.product.name}>
                                        {item.product.name}
                                    </h6>
                                    <span className="text-muted fs-7">Category: {item.product.category}</span>
                                </div>

                                {/* Quantity Control */}
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

                                {/* Item Total & Delete */}
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
                </div>

                {/* 2. Right Side: Order Summary Panel */}
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
                        <button className="btn glass-btn w-100 py-2.5 fw-bold fs-6" onClick={handleCheckout}>
                            Proceed to Checkout
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Cart;
