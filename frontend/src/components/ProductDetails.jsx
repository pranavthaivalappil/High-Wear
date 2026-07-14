import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchProductById } from '../services/api';
import { useCart } from '../context/CartContext';


function ProductDetails() {
    const { id } = useParams();
    const { addToCart } = useCart();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const getProduct = async () => {
            setLoading(true);
            try {
                const response = await fetchProductById(id);
                setProduct(response.data);
                setError(null);
            } catch (err) {
                console.error('Error fetching product by ID:', err);
                setError('Product not found or database server offline!');
            } finally {
                setLoading(false);
            }
        };
        getProduct();
    }, [id]);

    // 🌟 URL Share Handler (Copies direct product route to clipboard or opens Native Share Sheet)
    const handleShare = () => {
        if (!product) return;
        const shareData = {
            title: `${product.brand} - ${product.name}`,
            text: `Check out the ${product.name} on Apollo Market!`,
            url: window.location.href // Current browser product URL
        };

        if (navigator.share) {
            navigator.share(shareData)
                .catch((err) => console.log('Share canceled or failed:', err));
        } else {
            // Fallback: Copy Link to Clipboard
            navigator.clipboard.writeText(window.location.href);
            alert('Product link copied to clipboard! You can share it now.');
        }
    };

    if (loading) {
        return (
            <div className="text-center py-5 my-5">
                <div className="spinner-border text-accent" role="status" style={{ width: '3rem', height: '3rem' }}>
                    <span className="visually-hidden">Loading product details...</span>
                </div>
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="container mt-5">
                <div className="row justify-content-center">
                    <div className="col-md-8">
                        <div className="alert alert-danger glass-panel border-danger text-center p-5" role="alert">
                            <i className="bi bi-x-circle-fill text-danger display-3 d-block mb-3"></i>
                            <h4 className="fw-bold">Product Not Found</h4>
                            <p className="text-muted mb-4">{error || 'The requested product could not be located in our inventory.'}</p>
                            <Link to="/catalog" className="btn glass-btn">
                                <i className="bi bi-arrow-left me-2"></i>Back to Catalog
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const dateAdded = new Date(product.createdAt).toLocaleDateString('en-IN', {
        day: 'numeric', month: 'long', year: 'numeric'
    });
    const lastUpdated = new Date(product.updatedAt).toLocaleDateString('en-IN', {
        day: 'numeric', month: 'long', year: 'numeric'
    });

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-lg-10">
                    {/* Glass Container */}
                    <div className="glass-panel p-4 p-md-5">
                        <div className="row g-4">

                            {/* Left Column: Image view */}
                            <div className="col-md-5 pe-md-4">
                                <div className="product-card-img-wrapper" style={{ paddingTop: '110%', borderRadius: '16px' }}>
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        className="product-card-img"
                                    />
                                </div>
                                <div className="mt-4 d-grid">
                                    <Link to="/catalog" className="btn glass-btn-secondary py-2.5">
                                        <i className="bi bi-arrow-left me-2"></i>
                                        Back to Products
                                    </Link>
                                </div>
                            </div>

                            {/* Right Column: Spec Grid & Buy controls */}
                            <div className="col-md-7 d-flex flex-column justify-content-between">
                                <div>
                                    <span className="text-accent fw-bold text-uppercase fs-7 letter-spacing-1.5">
                                        {product.brand}
                                    </span>
                                    <h2 className="text-main fw-bold mt-1 mb-3">{product.name}</h2>

                                    <div className="mb-4 d-flex flex-wrap gap-2">
                                        <span className="badge rounded-pill bg-light-subtle text-muted border border-white border-opacity-10 py-1.5 px-3">
                                            Category: {product.category}
                                        </span>
                                        <span className="badge rounded-pill bg-light-subtle text-muted border border-white border-opacity-10 py-1.5 px-3">
                                            Dept: {product.department_name}
                                        </span>
                                    </div>

                                    {/* Specifications Grid */}
                                    <div className="row g-3 mb-4">
                                        <div className="col-sm-6">
                                            <div className="glass-panel p-3 h-100 bg-opacity-25" style={{ borderRadius: '10px' }}>
                                                <div className="text-muted fs-8 text-uppercase fw-semibold mb-1">
                                                    <i className="bi bi-hash text-accent me-1"></i>Product SKU
                                                </div>
                                                <div className="text-main fw-medium fs-7 text-truncate" title={product.sku}>
                                                    {product.sku}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="col-sm-6">
                                            <div className="glass-panel p-3 h-100 bg-opacity-25" style={{ borderRadius: '10px' }}>
                                                <div className="text-muted fs-8 text-uppercase fw-semibold mb-1">
                                                    <i className="bi bi-geo-alt-fill text-accent me-1"></i>Distribution Center
                                                </div>
                                                <div className="text-main fw-medium fs-7">
                                                    Center #{product.distribution_center_id}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="col-sm-6">
                                            <div className="glass-panel p-3 h-100 bg-opacity-25" style={{ borderRadius: '10px' }}>
                                                <div className="text-muted fs-8 text-uppercase fw-semibold mb-1">
                                                    <i className="bi bi-calendar-event text-accent me-1"></i>Added Date
                                                </div>
                                                <div className="text-main fw-medium fs-7">{dateAdded}</div>
                                            </div>
                                        </div>

                                        <div className="col-sm-6">
                                            <div className="glass-panel p-3 h-100 bg-opacity-25" style={{ borderRadius: '10px' }}>
                                                <div className="text-muted fs-8 text-uppercase fw-semibold mb-1">
                                                    <i className="bi bi-calendar-check text-accent me-1"></i>Last Updated
                                                </div>
                                                <div className="text-main fw-medium fs-7">{lastUpdated}</div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Sizing selection */}
                                    <div className="mb-4">
                                        <h6 className="text-muted fw-bold text-uppercase fs-8 mb-2">Select Size</h6>
                                        <span className="size-pill">S</span>
                                        <span className="size-pill">M</span>
                                        <span className="size-pill">L</span>
                                        <span className="size-pill">XL</span>
                                    </div>
                                </div>

                                {/* Price tag & Cart Button */}
                                <div>
                                    <div className="d-flex align-items-baseline gap-2 mb-3">
                                        <h1 className="text-main fw-bold m-0 display-5">
                                            ₹{product.retail_price.toLocaleString()}
                                        </h1>
                                        <span className="text-muted text-decoration-line-through fs-5">
                                            ${product.price_usd ? product.price_usd.toFixed(2) : (product.retail_price / 80).toFixed(2)}
                                        </span>
                                    </div>

                                    <button
                                        className="btn glass-btn w-100 py-3 fw-bold fs-5"
                                        onClick={() => addToCart(product)} // 👈 Call the real context function here
                                    >
                                        <i className="bi bi-cart-plus-fill me-2"></i>
                                        Add to Cart
                                    </button>

                                </div>
                            </div>
                        </div>

                        {/* --- 🌟 bottom Actions Row (Matching Report Fig 5.5) --- */}
                        <div className="row g-3 mt-4 pt-4 border-top border-white border-opacity-10 text-center">
                            <div className="col-md-4">
                                <button className="btn glass-btn-secondary w-100 py-2.5" onClick={handleShare}>
                                    <i className="bi bi-share-fill me-2"></i>Share Product
                                </button>
                            </div>
                            <div className="col-md-4">
                                <button className="btn glass-btn-secondary w-100 py-2.5" onClick={() => alert('Added to Favorites!')}>
                                    <i className="bi bi-heart-fill me-2"></i>Add to Favorites
                                </button>
                            </div>
                            <div className="col-md-4">
                                <button className="btn glass-btn-secondary w-100 py-2.5" onClick={() => window.print()}>
                                    <i className="bi bi-printer-fill me-2"></i>Print Details
                                </button>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProductDetails;
