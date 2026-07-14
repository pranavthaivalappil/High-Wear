import React, { createContext, useState, useEffect, useContext } from 'react';

// Create the Context
const CartContext = createContext();

// Create the Provider Component
export function CartProvider({ children }) {
    // 1. Load initial cart state from localStorage
    const [cart, setCart] = useState(() => {
        const savedCart = localStorage.getItem('apollo_cart');
        return savedCart ? JSON.parse(savedCart) : [];
    });

    // 2. Persist cart to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem('apollo_cart', JSON.stringify(cart));
    }, [cart]);

    // 3. Add item to cart
    const addToCart = (product, quantity = 1) => {
        setCart((prevCart) => {
            const existingIndex = prevCart.findIndex(item => item.product._id === product._id);
            if (existingIndex > -1) {
                // Item exists, update quantity
                const newCart = [...prevCart];
                newCart[existingIndex].quantity += quantity;
                return newCart;
            }
            // New item, append to cart
            return [...prevCart, { product, quantity }];
        });
    };

    // 4. Remove item from cart
    const removeFromCart = (productId) => {
        setCart((prevCart) => prevCart.filter(item => item.product._id !== productId));
    };

    // 5. Update quantity of an item
    const updateQuantity = (productId, qty) => {
        if (qty <= 0) {
            removeFromCart(productId);
            return;
        }
        setCart((prevCart) =>
            prevCart.map(item =>
                item.product._id === productId ? { ...item, quantity: qty } : item
            )
        );
    };

    // 6. Clear the entire cart (on successful checkout)
    const clearCart = () => {
        setCart([]);
    };

    // 7. Calculate total item count
    const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

    // 8. Calculate total price in INR
    const cartTotal = cart.reduce((total, item) => total + (item.product.retail_price * item.quantity), 0);

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, cartCount, cartTotal }}>
            {children}
        </CartContext.Provider>
    );
}

// Custom Hook to consume the Cart Context easily
export function useCart() {
    return useContext(CartContext);
}
