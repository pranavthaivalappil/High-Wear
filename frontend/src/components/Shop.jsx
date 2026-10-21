import React, { useState, useEffect } from 'react';
import { fetchProducts } from '../services/api';
import { useCart } from '../context/CartContext'; // Import the Cart Context
import { Link } from 'react-router-dom';

function Shop() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const { addToCart } = useCart(); // Extract the addToCart function

    // Fetch products when the component loads
    useEffect(() => {
        const getProducts = async () => {
            try {
                // Fetch the first 12 products
                const response = await fetchProducts({ limit: 12 });
                // Assuming your API returns { data: { products: [...] } }
                setProducts(response.data?.products || []);
            } catch (err) {
                console.error('Failed to fetch products', err);
            } finally {
                setLoading(false);
            }
        };

        getProducts();
    }, []);

    // ... existing return statement

    return (
        <div className="container" style={{ paddingTop: 'var(--spacing-xl)', paddingBottom: 'var(--spacing-xxl)' }}>
            <div className="flex-between" style={{ borderBottom: '2px solid var(--text-main)', paddingBottom: 'var(--spacing-md)', marginBottom: 'var(--spacing-lg)' }}>
                <h1 className="heading-large">ALL PRODUCTS</h1>
                <div className="text-tiny">[ FILTERS : NONE ]</div>
            </div>

            <div className="responsive-product-grid">
                {loading ? (
                    <div className="text-mono">LOADING PRODUCTS...</div>
                ) : (
                    products.map((product) => (
                        <div key={product._id} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-xs)' }}>
                            <Link to={`/products/${product._id}`} style={{ backgroundColor: 'var(--bg-accent)', aspectRatio: '1/1', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                                <img src={product.image || 'https://via.placeholder.com/400'} alt={product.name} style={{ mixBlendMode: 'multiply', width: '100%', height: '100%', objectFit: 'cover' }} />
                            </Link>
                            <div className="flex-between text-mono text-tiny" style={{ fontWeight: 'bold' }}>
                                <span>{product.name}</span>
                                <span>${product.price}</span>
                            </div>
                            <button
                                className="hover-invert text-mono fw-bold"
                                style={{ border: '1px solid var(--text-main)', padding: 'var(--spacing-xs)', marginTop: 'var(--spacing-xs)', cursor: 'pointer' }}
                                onClick={() => addToCart(product, 1)}
                            >
                                [ ADD TO CART ]
                            </button>
                        </div>
                    ))
                )}
            </div>

        </div>
    );
}

export default Shop;
