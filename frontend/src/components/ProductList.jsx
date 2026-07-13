import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { fetchFilters, fetchProducts } from '../services/api';
import ProductCard from './ProductCard';

function ProductList({ departmentId = null }) {
    const [searchParams, setSearchParams] = useSearchParams();

    // 1. Available filters fetched on mount
    const [availableBrands, setAvailableBrands] = useState([]);
    const [availableCategories, setAvailableCategories] = useState([]);
    const [priceLimits, setPriceLimits] = useState({ min: 0, max: 10000 });

    // 2. Local inputs (decoupled for smooth typing and dragging)
    const [localSearch, setLocalSearch] = useState(searchParams.get('search') || '');
    const [localMaxPrice, setLocalMaxPrice] = useState(Number(searchParams.get('maxPrice')) || 10000);

    // 3. Main product listing states
    const [products, setProducts] = useState([]);
    const [totalPages, setTotalPages] = useState(1);
    const [totalProducts, setTotalProducts] = useState(0);
    const [loading, setLoading] = useState(true);

    // 4. URL State - Single Source of Truth
    const search = searchParams.get('search') || '';
    const selectedBrand = searchParams.get('brand') || '';
    const selectedCategory = searchParams.get('category') || '';
    const maxPrice = Number(searchParams.get('maxPrice')) || priceLimits.max || 10000;
    const page = Number(searchParams.get('page')) || 1;

    // Fetch filters list on mount
    useEffect(() => {
        const getFilters = async () => {
            try {
                const response = await fetchFilters();
                setAvailableBrands(response.data.brands);
                setAvailableCategories(response.data.categories);
                setPriceLimits({ min: response.data.minPrice, max: response.data.maxPrice });

                // If maxPrice URL parameter doesn't exist, set local slider to the database max
                if (!searchParams.get('maxPrice')) {
                    setLocalMaxPrice(response.data.maxPrice);
                }
            } catch (err) {
                console.error('Error fetching filter values:', err);
            }
        };
        getFilters();
    }, []);

    // Sync local input states if the URL updates externally (like Back button or Clear All)
    useEffect(() => {
        setLocalSearch(searchParams.get('search') || '');
        setLocalMaxPrice(Number(searchParams.get('maxPrice')) || priceLimits.max || 10000);
    }, [searchParams, priceLimits.max]);

    // 5. Debounce Search & Price slider inputs to avoid spamming network requests
    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            const newParams = new URLSearchParams(searchParams);

            if (localSearch) newParams.set('search', localSearch);
            else newParams.delete('search');

            if (localMaxPrice !== priceLimits.max) newParams.set('maxPrice', localMaxPrice);
            else newParams.delete('maxPrice');

            // Reset to page 1 on search or price change to prevent page overflow
            if (
                localSearch !== (searchParams.get('search') || '') ||
                localMaxPrice !== (Number(searchParams.get('maxPrice')) || priceLimits.max)
            ) {
                newParams.set('page', 1);
            }

            setSearchParams(newParams);
        }, 300);

        return () => clearTimeout(delayDebounce);
    }, [localSearch, localMaxPrice, priceLimits.max, setSearchParams]);

    // 6. Fetch products when URL query strings or department change
    useEffect(() => {
        const getProducts = async () => {
            setLoading(true);
            try {
                const params = {
                    page,
                    limit: 12,
                    search,
                    brand: selectedBrand,
                    category: selectedCategory,
                    maxPrice
                };

                if (departmentId !== null) {
                    params.department_id = departmentId;
                }

                const response = await fetchProducts(params);
                setProducts(response.data.products);
                setTotalPages(response.data.totalPages);
                setTotalProducts(response.data.totalProducts);
            } catch (err) {
                console.error('Error fetching products:', err);
            } finally {
                setLoading(false);
            }
        };

        getProducts();
    }, [page, search, selectedBrand, selectedCategory, maxPrice, departmentId]);

    // Helper: Update filter parameter in URL
    const updateURLParam = (key, value) => {
        const newParams = new URLSearchParams(searchParams);
        if (value) {
            newParams.set(key, value);
        } else {
            newParams.delete(key);
        }
        newParams.set('page', 1); // Reset page
        setSearchParams(newParams);
    };

    const handleResetFilters = () => {
        setSearchParams({});
        setLocalSearch('');
        setLocalMaxPrice(priceLimits.max);
    };

    return (
        <div className="container-fluid px-lg-5 mt-4">
            {/* Catalog Page Header */}
            <div className="row mb-4">
                <div className="col-12 px-2">
                    <h2 className="text-main fw-bold d-flex align-items-center gap-2">
                        <svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            width="26" 
                            height="26" 
                            viewBox="0 0 24 24" 
                            fill="none" 
                            stroke="url(#logo-gradient-catalog)" 
                            strokeWidth="2" 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            className="me-2" 
                            style={{ transform: 'rotate(-45deg)' }}
                        >
                            <defs>
                                <linearGradient id="logo-gradient-catalog" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" stopColor="var(--primary-color)" />
                                    <stop offset="100%" stopColor="var(--accent-color)" />
                                </linearGradient>
                            </defs>
                            <path d="M4 22V2" />
                            <path d="M4 2C13.5 2 20 6.5 20 12C20 17.5 13.5 22 4 22" />
                            <path d="M4 12H22" />
                            <path d="M18 9L22 12L18 15" />
                        </svg>
                        Apollo Market Catalog
                    </h2>
                </div>
            </div>
            <div className="row">
                {/* --- A. SIDEBAR FILTERS PANEL --- */}
                <div className="col-lg-3 mb-4">
                    <div className="glass-panel filter-sidebar">
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <h4 className="fw-bold m-0 text-main">Filters</h4>
                            <button
                                className="btn btn-sm text-accent fw-medium p-0 border-0 bg-transparent"
                                onClick={handleResetFilters}
                            >
                                Clear All
                            </button>
                        </div>

                        {/* Search Bar filter */}
                        <div className="filter-section">
                            <div className="filter-title">Search</div>
                            <input
                                type="text"
                                className="form-control glass-input w-100"
                                placeholder="Search clothing or brand..."
                                value={localSearch}
                                onChange={(e) => setLocalSearch(e.target.value)}
                            />
                        </div>

                        {/* Category filter dropdown */}
                        <div className="filter-section">
                            <div className="filter-title">Category</div>
                            <select
                                className="form-select glass-input w-100"
                                value={selectedCategory}
                                onChange={(e) => updateURLParam('category', e.target.value)}
                            >
                                <option value="">All Categories</option>
                                {availableCategories.map((cat, idx) => (
                                    <option key={idx} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>

                        {/* Brand filter dropdown */}
                        <div className="filter-section">
                            <div className="filter-title">Brand</div>
                            <select
                                className="form-select glass-input w-100"
                                value={selectedBrand}
                                onChange={(e) => updateURLParam('brand', e.target.value)}
                            >
                                <option value="">All Brands</option>
                                {availableBrands.map((brand, idx) => (
                                    <option key={idx} value={brand}>{brand}</option>
                                ))}
                            </select>
                        </div>

                        {/* Price range filter slider */}
                        <div className="filter-section">
                            <div className="filter-title">
                                <span>Max Price</span>
                                <span className="text-accent fw-bold">₹{localMaxPrice.toLocaleString()}</span>
                            </div>
                            <input
                                type="range"
                                className="form-range"
                                min={priceLimits.min}
                                max={priceLimits.max}
                                step={100}
                                value={localMaxPrice}
                                onChange={(e) => setLocalMaxPrice(Number(e.target.value))}
                            />
                            <div className="d-flex justify-content-between text-muted fs-8">
                                <span>₹{priceLimits.min}</span>
                                <span>₹{priceLimits.max.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- B. PRODUCT CATALOG GRID --- */}
                <div className="col-lg-9">
                    <div className="d-flex justify-content-between align-items-center mb-4 px-2">
                        <div className="text-muted">
                            Showing <span className="text-main fw-semibold">{totalProducts}</span> clothes
                        </div>
                    </div>

                    {loading ? (
                        <div className="text-center py-5 my-5">
                            <div className="spinner-border text-accent" role="status" style={{ width: '3rem', height: '3rem' }}>
                                <span className="visually-hidden">Loading catalog...</span>
                            </div>
                        </div>
                    ) : (
                        <>
                            {products.length === 0 ? (
                                <div className="text-center py-5 my-5 glass-panel p-5">
                                    <i className="bi bi-emoji-frown text-accent display-1 d-block mb-3"></i>
                                    <h4 className="text-main fw-bold">No Products Found</h4>
                                    <p className="text-muted">Try adjusting your filters or typing another search term.</p>
                                </div>
                            ) : (
                                <div className="product-grid">
                                    {products.map((product) => (
                                        // Wrap card in a Link to redirect to details page /products/:id
                                        <Link
                                            to={`/products/${product.id}`}
                                            key={product._id}
                                            className="text-decoration-none text-reset"
                                        >
                                            <ProductCard product={product} />
                                        </Link>
                                    ))}
                                </div>
                            )}

                            {/* --- C. GLASS PAGINATION NAVIGATION --- */}
                            {totalPages > 1 && (
                                <nav className="d-flex justify-content-center mt-5 mb-4">
                                    <ul className="pagination glass-pagination gap-1">
                                        <li className={`page-item ${page === 1 ? 'disabled' : ''}`}>
                                            <button
                                                className="page-link rounded-start-3"
                                                onClick={() => {
                                                    const newParams = new URLSearchParams(searchParams);
                                                    newParams.set('page', page - 1);
                                                    setSearchParams(newParams);
                                                }}
                                                disabled={page === 1}
                                            >
                                                <i className="bi bi-chevron-left"></i>
                                            </button>
                                        </li>
                                        <li className="page-item active">
                                            <span className="page-link px-4">
                                                Page {page} of {totalPages}
                                            </span>
                                        </li>
                                        <li className={`page-item ${page === totalPages ? 'disabled' : ''}`}>
                                            <button
                                                className="page-link rounded-end-3"
                                                onClick={() => {
                                                    const newParams = new URLSearchParams(searchParams);
                                                    newParams.set('page', page + 1);
                                                    setSearchParams(newParams);
                                                }}
                                                disabled={page === totalPages}
                                            >
                                                <i className="bi bi-chevron-right"></i>
                                            </button>
                                        </li>
                                    </ul>
                                </nav>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ProductList;
