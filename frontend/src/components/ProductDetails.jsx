import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { io } from 'socket.io-client';
import { fetchProductById, fetchRecommendations } from '../services/api';

function ProductDetails() {
    const { id } = useParams();
    const { addToCart } = useCart();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [recommendations, setRecommendations] = useState([]);

    useEffect(() => {
        const getProduct = async () => {
            setLoading(true);
            try {
                // Fetch details and suggestions concurrently
                const [productRes, recsRes] = await Promise.all([
                    fetchProductById(id),
                    fetchRecommendations(id)
                ]);

                setProduct(productRes.data);
                setRecommendations(recsRes.data);
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

    useEffect(() => {
        const socket = io('http://localhost:5000');

        socket.on('stock_update', (data) => {
            console.log('Received stock update:', data);
            setProduct(prevProduct => {
                if (prevProduct && prevProduct._id === data.product_id) {
                    return { ...prevProduct, inventory: data.new_inventory };
                }
                return prevProduct;
            });
        });

        return () => {
            socket.disconnect();
        };
    }, []);

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
            <div className="container" style={{ paddingTop: 'var(--spacing-xxl)', paddingBottom: 'var(--spacing-xxl)', textAlign: 'center' }}>
                <div className="text-mono fw-bold">[ FETCHING DOSSIER... ]</div>
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="container" style={{ paddingTop: 'var(--spacing-xxl)', paddingBottom: 'var(--spacing-xxl)', textAlign: 'center' }}>
                <h3 className="heading-massive" style={{ marginBottom: 'var(--spacing-md)' }}>FILE NOT FOUND</h3>
                <div className="text-mono" style={{ backgroundColor: 'var(--text-main)', color: 'var(--text-light)', padding: 'var(--spacing-md)', marginBottom: 'var(--spacing-lg)', display: 'inline-block' }}>
                    [ ERROR ]: {error || 'The requested product could not be located.'}
                </div>
                <br />
                <Link to="/shop" className="hover-invert" style={{ display: 'inline-block', border: '2px solid var(--text-main)', padding: 'var(--spacing-sm) var(--spacing-md)', fontWeight: 'bold' }}>
                    RETURN TO ARCHIVE
                </Link>
            </div>
        );
    }

    const dateAdded = new Date(product.createdAt).toLocaleDateString('en-IN', {
        day: '2-digit', month: '2-digit', year: 'numeric'
    }).replace(/\//g, '.');

    const lastUpdated = new Date(product.updatedAt).toLocaleDateString('en-IN', {
        day: '2-digit', month: '2-digit', year: 'numeric'
    }).replace(/\//g, '.');

    return (
        <div className="container" style={{ paddingTop: 'var(--spacing-xl)', paddingBottom: 'var(--spacing-xxl)' }}>

            {/* Top Navigation */}
            <div style={{ marginBottom: 'var(--spacing-lg)' }}>
                <Link to="/shop" className="text-tiny hover-invert bracket-wrap">
                    RETURN TO CATALOG
                </Link>
            </div>

            {/* Main 2-Column Product Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-xl)', marginBottom: 'var(--spacing-xxl)' }}>

                {/* Left Column: Image view */}
                <div style={{ backgroundColor: 'var(--bg-accent)', border: '2px solid var(--text-main)', display: 'flex', alignItems: 'center', justifyContent: 'center', alignSelf: 'start', height: 'auto', maxHeight: '70vh' }}>
                    <img
                        src={product.image || 'https://via.placeholder.com/600'}
                        alt={product.name}
                        style={{ width: '100%', height: '100%', maxHeight: '70vh', objectFit: 'contain', mixBlendMode: 'multiply', padding: 'var(--spacing-md)' }}
                    />
                </div>

                {/* Right Column: Details & Actions */}
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                        <div className="text-tiny bracket-wrap" style={{ marginBottom: 'var(--spacing-xs)', display: 'inline-block' }}>
                            BRAND: {product.brand || 'UNKNOWN'}
                        </div>
                        <h1 className="heading-medium" style={{ marginBottom: 'var(--spacing-md)', wordWrap: 'break-word', fontSize: 'clamp(2rem, 4vw, 3.5rem)' }}>
                            {product.name}
                        </h1>

                        {/* Specifications Grid */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-sm)', marginBottom: 'var(--spacing-lg)' }}>
                            <div className="text-mono" style={{ border: '1px solid var(--text-main)', padding: 'var(--spacing-xs)' }}>
                                <div className="text-tiny" style={{ opacity: 0.7 }}>CATEGORY</div>
                                <div className="fw-bold">{product.category}</div>
                            </div>
                            <div className="text-mono" style={{ border: '1px solid var(--text-main)', padding: 'var(--spacing-xs)' }}>
                                <div className="text-tiny" style={{ opacity: 0.7 }}>DEPARTMENT</div>
                                <div className="fw-bold">{product.department_name}</div>
                            </div>
                            <div className="text-mono" style={{ border: '1px solid var(--text-main)', padding: 'var(--spacing-xs)' }}>
                                <div className="text-tiny" style={{ opacity: 0.7 }}>SKU</div>
                                <div className="fw-bold text-truncate" title={product.sku}>{product.sku}</div>
                            </div>
                            <div className="text-mono" style={{ border: '1px solid var(--text-main)', padding: 'var(--spacing-xs)' }}>
                                <div className="text-tiny" style={{ opacity: 0.7 }}>DIST. CENTER</div>
                                <div className="fw-bold">#{product.distribution_center_id}</div>
                            </div>
                            <div className="text-mono" style={{ border: '1px solid var(--text-main)', padding: 'var(--spacing-xs)' }}>
                                <div className="text-tiny" style={{ opacity: 0.7 }}>ADDED / UPDATED</div>
                                <div className="fw-bold">{dateAdded} / {lastUpdated}</div>
                            </div>
                            <div className="text-mono" style={{ border: '1px solid var(--text-main)', padding: 'var(--spacing-xs)', backgroundColor: product.inventory > 0 ? 'transparent' : 'var(--text-main)', color: product.inventory > 0 ? 'var(--text-main)' : 'var(--text-light)' }}>
                                <div className="text-tiny" style={{ opacity: 0.7 }}>INVENTORY STATUS</div>
                                <div className="fw-bold">
                                    {product.inventory > 0 ? `[ ${product.inventory} UNITS AVAILABLE ]` : '[ OUT OF STOCK ]'}
                                </div>
                            </div>
                        </div>

                        {/* Sizing selection */}
                        <div style={{ marginBottom: 'var(--spacing-lg)' }}>
                            <div className="text-tiny bracket-wrap" style={{ marginBottom: 'var(--spacing-xs)' }}>SELECT SIZE</div>
                            <div style={{ display: 'flex', gap: 'var(--spacing-xs)' }}>
                                {['S', 'M', 'L', 'XL'].map(size => (
                                    <div key={size} className="hover-invert text-mono fw-bold" style={{ width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid var(--text-main)', cursor: 'pointer' }}>
                                        {size}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Price tag & Cart Button */}
                    <div style={{ borderTop: '2px solid var(--text-main)', paddingTop: 'var(--spacing-md)' }}>
                        <div className="flex-between" style={{ alignItems: 'flex-end', marginBottom: 'var(--spacing-md)' }}>
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <h1 className="heading-medium m-0" style={{ fontSize: 'clamp(1.8rem, 3vw, 2.5rem)' }}>
                                    ₹{product.retail_price?.toLocaleString('en-IN')}
                                </h1>
                            </div>
                        </div>

                        <button
                            className="hover-invert"
                            style={{ width: '100%', border: '2px solid var(--text-main)', padding: 'var(--spacing-md)', fontSize: '1.2rem', fontWeight: 'bold' }}
                            onClick={() => addToCart(product)}
                            disabled={product.inventory <= 0}
                        >
                            {product.inventory > 0 ? '[ ACQUIRE ITEM ]' : '[ UNAVAILABLE ]'}
                        </button>
                    </div>
                </div>
            </div>

            {/* Action Row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--spacing-sm)', borderTop: '2px solid var(--text-main)', borderBottom: '2px solid var(--text-main)', padding: 'var(--spacing-md) 0', marginBottom: 'var(--spacing-xxl)' }}>
                <button className="hover-invert text-mono fw-bold" style={{ border: '1px solid var(--text-main)', padding: 'var(--spacing-sm)' }} onClick={handleShare}>
                    [ INITIATE SHARE ]
                </button>
                <button className="hover-invert text-mono fw-bold" style={{ border: '1px solid var(--text-main)', padding: 'var(--spacing-sm)' }} onClick={() => alert('Added to Dossier!')}>
                    [ FLAG FOR REVIEW ]
                </button>
                <button className="hover-invert text-mono fw-bold" style={{ border: '1px solid var(--text-main)', padding: 'var(--spacing-sm)' }} onClick={() => window.print()}>
                    [ PRINT SCHEMATIC ]
                </button>
            </div>

            {/* Recommendations */}
            {recommendations.length > 0 && (
                <div>
                    <h2 className="heading-medium" style={{ borderBottom: '2px solid var(--text-main)', paddingBottom: 'var(--spacing-xs)', marginBottom: 'var(--spacing-lg)' }}>
                        RELATED ACQUISITIONS
                    </h2>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'var(--spacing-sm)' }}>
                        {recommendations.map((rec) => (
                            <div key={rec._id} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-xs)' }}>
                                <Link to={`/products/${rec._id}`} style={{ backgroundColor: 'var(--bg-accent)', aspectRatio: '1/1', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                                    <img src={rec.image || 'https://via.placeholder.com/400'} alt={rec.name} style={{ mixBlendMode: 'multiply', width: '100%', height: '100%', objectFit: 'cover' }} />
                                </Link>
                                <div className="flex-between text-mono text-tiny" style={{ fontWeight: 'bold' }}>
                                    <span>{rec.name}</span>
                                    <span>${rec.retail_price}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

        </div>
    );
}

export default ProductDetails;
