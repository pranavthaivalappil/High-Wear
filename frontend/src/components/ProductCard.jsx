import React from 'react';

function ProductCard({ product }) {
    return (
        <div className="card glass-card h-100 border-0">
            {/* 1. Product Image Display */}
            <div className="product-card-img-wrapper">
                <img
                    src={product.image_url}
                    alt={product.name}
                    className="product-card-img"
                    loading="lazy" // Lazy load images to keep memory footprint light during scroll
                />
            </div>

            {/* 2. Product Information Details */}
            <div className="card-body product-card-body d-flex flex-column">
                {/* Brand */}
                <div className="product-brand">{product.brand}</div>

                {/* Name */}
                <h5 className="product-name text-truncate" title={product.name}>
                    {product.name}
                </h5>

                {/* Category Pill Tag */}
                <div className="mb-3">
                    <span className="badge rounded-pill bg-light-subtle text-muted border border-white border-opacity-10 py-1.5 px-2.5 fw-normal">
                        {product.category}
                    </span>
                </div>

                {/* Price Tag section (INR and USD) */}
                <div className="product-price-section mt-auto pt-2">
                    <span className="product-price-inr">₹{product.price.toLocaleString()}</span>
                    <span className="product-price-usd">${product.price_usd.toFixed(2)}</span>
                </div>
            </div>
        </div>
    );
}

export default ProductCard;
