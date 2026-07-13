import React from 'react';

function ProductCard({ product }) {
    return (
        <div className="card glass-card h-100 border-0">
            {/* 1. Product Image Display */}
            <div className="product-card-img-wrapper">
                <img
                    src={product.image} // Changed from image_url to image
                    alt={product.name}
                    className="product-card-img"
                    loading="lazy"
                />
            </div>

            {/* 2. Product Information Details */}
            <div className="card-body product-card-body d-flex flex-column">
                <div className="product-brand">{product.brand}</div>

                <h5 className="product-name text-truncate" title={product.name}>
                    {product.name}
                </h5>

                <div className="mb-3">
                    <span className="badge rounded-pill bg-light-subtle text-muted border border-white border-opacity-10 py-1.5 px-2.5 fw-normal">
                        {product.category}
                    </span>
                </div>

                <div className="product-price-section mt-auto pt-2">
                    {/* Changed price to retail_price */}
                    <span className="product-price-inr">₹{product.retail_price.toLocaleString()}</span>
                    <span className="product-price-usd">${product.price_usd ? product.price_usd.toFixed(2) : (product.retail_price / 80).toFixed(2)}</span>

                </div>
            </div>
        </div>
    );
}

export default ProductCard;
