import React, { useState, useEffect } from 'react';
import { fetchFilters, fetchProducts } from '../services/api';
import ProductCard from './ProductCard';

function ProductList({ departmentId = null }) {
    // 1. Database stats filters (populated on mount)
    const [availableBrands, setAvailableBrands] = useState([]);
    const [availableCategories, setAvailableCategories] = useState([]);
    const [priceLimits, setPriceLimits] = useState({ min: 0, max: 10000 });

    // 2. Active filter states
    const [products, setProducts] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalProducts, setTotalProducts] = useState(0);
    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState('');
    const [selectedBrand, setSelectedBrand] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [maxPrice, setMaxPrice] = useState(10000);

    // 3. Fetch filter list dropdowns on component mount
    useEffect(() => {
        const getFilters = async () => {
            try {
                const response = await fetchFilters();
                setAvailableBrands(response.data.brands);
                setAvailableCategories(response.data.categories);
                setPriceLimits({ min: response.data.minPrice, max: response.data.maxPrice });
                setMaxPrice(response.data.maxPrice); // Default slider value to max
            } catch (err) {
                console.error('Error fetching filter values:', err);
            }
        };
        getFilters();
    }, []);

    // Reset pagination to page 1 whenever any filter criteria changes
    useEffect(() => {
        setPage(1);
    }, [search, selectedBrand, selectedCategory, maxPrice, departmentId]);

    // 4. Fetch products when page or filter state updates
    useEffect(() => {
        const getProducts = async () => {
            setLoading(true);
            try {
                const params = {
                    page,
                    limit: 12, // Show 12 products per page
                    search,
                    brand: selectedBrand,
                    category: selectedCategory,
                    maxPrice
                };

                // Add department filter if scoped page
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

        // Simple debounce: Wait 300ms before querying API if price is being dragged rapidly
        const delayDebounce = setTimeout(() => {
            getProducts();
        }, 300);

        return () => clearTimeout(delayDebounce);
    }, [page, search, selectedBrand, selectedCategory, maxPrice, departmentId]);

    // Clear all filters back to default
    const handleResetFilters = () => {
        setSearch('');
        setSelectedBrand('');
        setSelectedCategory('');
        setMaxPrice(priceLimits.max);
    };

    return (
        <div className="container-fluid px-lg-5 mt-4">
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
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>

                        {/* Category filter dropdown */}
                        <div className="filter-section">
                            <div className="filter-title">Category</div>
                            <select
                                className="form-select glass-input w-100"
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
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
                                onChange={(e) => setSelectedBrand(e.target.value)}
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
                                <span className="text-accent fw-bold">₹{maxPrice.toLocaleString()}</span>
                            </div>
                            <input
                                type="range"
                                className="form-range"
                                min={priceLimits.min}
                                max={priceLimits.max}
                                step={100}
                                value={maxPrice}
                                onChange={(e) => setMaxPrice(Number(e.target.value))}
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
                    {/* Catalog Header Info */}
                    <div className="d-flex justify-content-between align-items-center mb-4 px-2">
                        <div className="text-muted">
                            Showing <span className="text-main fw-semibold">{totalProducts}</span> clothes
                        </div>
                    </div>

                    {/* Loader element */}
                    {loading ? (
                        <div className="text-center py-5 my-5">
                            <div className="spinner-border text-accent" role="status" style={{ width: '3rem', height: '3rem' }}>
                                <span className="visually-hidden">Loading catalog...</span>
                            </div>
                        </div>
                    ) : (
                        <>
                            {/* Empty State */}
                            {products.length === 0 ? (
                                <div className="text-center py-5 my-5 glass-panel p-5">
                                    <i className="bi bi-emoji-frown text-accent display-1 d-block mb-3"></i>
                                    <h4 className="text-main fw-bold">No Products Found</h4>
                                    <p className="text-muted">Try adjusting your filters or typing another search term.</p>
                                </div>
                            ) : (
                                /* Product Cards Grid */
                                <div className="row g-4 product-grid">
                                    {products.map((product) => (
                                        <div className="col-xl-3 col-md-4 col-sm-6" key={product._id}>
                                            <ProductCard product={product} />
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* --- C. GLASS PAGINATION NAVIGATION --- */}
                            {totalPages > 1 && (
                                <nav className="d-flex justify-content-center mt-5 mb-4">
                                    <ul className="pagination glass-pagination gap-1">
                                        {/* Previous Button */}
                                        <li className={`page-item ${page === 1 ? 'disabled' : ''}`}>
                                            <button
                                                className="page-link rounded-start-3"
                                                onClick={() => setPage(page - 1)}
                                                disabled={page === 1}
                                            >
                                                <i className="bi bi-chevron-left"></i>
                                            </button>
                                        </li>

                                        {/* Current Page Indicator */}
                                        <li className="page-item active">
                                            <span className="page-link px-4">
                                                Page {page} of {totalPages}
                                            </span>
                                        </li>

                                        {/* Next Button */}
                                        <li className={`page-item ${page === totalPages ? 'disabled' : ''}`}>
                                            <button
                                                className="page-link rounded-end-3"
                                                onClick={() => setPage(page + 1)}
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
