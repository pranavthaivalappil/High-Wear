import React, { useState, useEffect } from 'react'; // <-- Update this import
import { Link } from 'react-router-dom';
import { fetchProducts } from '../services/api';    // <-- Add this import
import { useCart } from '../context/CartContext';   // <-- Add this so we can add to cart!


function Home() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const { addToCart } = useCart();

    useEffect(() => {
        const getProducts = async () => {
            try {
                // Fetch only 4 products for the home page carousel
                const response = await fetchProducts({ limit: 4 });
                setProducts(response.data?.products || []);
            } catch (err) {
                console.error('Failed to fetch products', err);
            } finally {
                setLoading(false);
            }
        };

        getProducts();
    }, []);

    return (
        <div style={{ paddingBottom: 'var(--spacing-xxl)' }}>

            {/* 1. Hero Section ("BUILT FROM THE STREET") */}
            <section style={{ position: 'relative', height: '90vh', overflow: 'hidden' }}>
                <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        zIndex: 0
                    }}
                >
                    <source src="/hero.mp4" type="video/mp4" />
                </video>

                {/* Central circular mask/cutout effect could go here, simulating with a mix-blend-mode or clip-path div */}
                <div style={{
                    position: 'absolute',
                    top: '20%',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '60vw',
                    height: '60vw',
                    maxWidth: '800px',
                    maxHeight: '800px',
                    borderRadius: '50%',
                    background: 'rgba(255,255,255,0.1)',
                    backdropFilter: 'contrast(1.5) grayscale(1)',
                    zIndex: 1,
                    pointerEvents: 'none'
                }}></div>

                <div className="container" style={{ position: 'relative', zIndex: 2, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <h1 className="heading-massive" style={{ color: 'var(--text-light)', mixBlendMode: 'difference' }}>
                        BUILT FROM THE STREET
                    </h1>
                </div>

                <div style={{
                    position: 'absolute',
                    bottom: 'var(--spacing-lg)',
                    left: '0',
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '0 var(--spacing-md)',
                    zIndex: 3
                }}>
                    <div className="bracket-wrap text-tiny" style={{ color: 'var(--text-light)' }}>
                        WORLDWIDE
                    </div>
                    <div className="bracket-wrap text-tiny" style={{ color: 'var(--text-light)', fontSize: '1.5rem', fontWeight: 'bold' }}>
                        REFINED FOR NOW
                    </div>
                </div>
            </section>


            {/* 3. Product Carousel ("CURRENT SEASON") */}
            <section className="container" style={{ padding: 'var(--spacing-xl) 0' }}>
                <div className="flex-between" style={{ borderBottom: '2px solid var(--text-main)', paddingBottom: 'var(--spacing-md)', marginBottom: 'var(--spacing-lg)' }}>
                    <h2 className="heading-medium">CURRENT SEASON</h2>
                    <Link to="/shop" className="text-tiny hover-invert bracket-wrap">VIEW ALL</Link>
                </div>
                <div className="responsive-product-grid">
                    {loading ? (
                        <div className="text-mono fw-bold">[ FETCHING INVENTORY... ]</div>
                    ) : (
                        products?.map((product) => (
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

            </section>



            {/* 5. Full-Width Banner ("WORN IN THE WILD") */}
            <section style={{ padding: 'var(--spacing-xl) 0', borderTop: '2px solid var(--text-main)', borderBottom: '2px solid var(--text-main)', marginTop: 'var(--spacing-xl)' }}>
                <div className="container flex-between">
                    <h2 className="heading-large" style={{ flex: 1 }}>WORN IN</h2>
                    <div style={{ flex: 2, position: 'relative', height: '300px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <img src="https://images.unsplash.com/photo-1478147427282-58a87a120781?q=80&w=1200&auto=format&fit=crop" alt="Wild Banner" style={{ position: 'absolute', width: '100%', height: '100%', objectFit: 'cover', zIndex: 1 }} />
                        <div className="heading-medium bracket-wrap" style={{ position: 'relative', zIndex: 2, color: 'var(--text-light)', mixBlendMode: 'difference' }}>
                            OUTPOST
                        </div>
                    </div>
                    <h2 className="heading-large" style={{ flex: 1, textAlign: 'right' }}>THE WILD</h2>
                </div>
            </section>

        </div>
    );
}

export default Home;
