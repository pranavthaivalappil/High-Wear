import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    // Load user from localStorage on first mount (persists login across page refresh)
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem('apollo_user');
        return savedUser ? JSON.parse(savedUser) : null;
    });

    const [token, setToken] = useState(() => localStorage.getItem('apollo_token') || null);

    const login = (userData, jwtToken) => {
        setUser(userData);
        setToken(jwtToken);
        localStorage.setItem('apollo_user', JSON.stringify(userData));
        localStorage.setItem('apollo_token', jwtToken);
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('apollo_user');
        localStorage.removeItem('apollo_token');
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

// Custom hook for easy access in any component
export function useAuth() {
    return useContext(AuthContext);
}
