import React from 'react';
import { useCart } from '../context/CartContext';

function ProductCard({ product }) {
    const { addToCart } = useCart();

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


                {/* 👈 Insert the Quick Add button here: */}
                <button
                    className="btn btn-sm glass-btn mt-3 w-100 py-2 fw-semibold d-flex align-items-center justify-content-center"
                    onClick={(e) => {
                        e.preventDefault(); // Prevents link navigation to details page
                        e.stopPropagation(); // Prevents click event from bubbling up to Link
                        addToCart(product);
                    }}
                >
                    <i className="bi bi-cart-plus-fill me-1.5"></i>
                    Add to Cart
                </button>
            </div>
        </div>
    );
}

export default ProductCard;
