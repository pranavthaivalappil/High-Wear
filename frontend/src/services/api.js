import axios from 'axios';

// 1. Create a configured Axios instance
const API = axios.create({
    baseURL: 'http://localhost:5000/api' // Point to our Express server
});

// 2. Define clear helper functions for each endpoint
export const fetchStats = () => API.get('/stats');
export const fetchDepartments = () => API.get('/departments');
export const fetchFilters = () => API.get('/filters');

// Params will hold pagination (?page=1) and search filters (?search=denim&minPrice=200)
export const fetchProducts = (params) => API.get('/products', { params });
export const fetchProductById = (id) => API.get(`/products/${id}`); // 👈 Make sure this line is here!
export const createOrder = (orderData) => API.post('/orders', orderData);

export const createRazorpayOrder = (amount) => API.post('/create-razorpay-order', { amount });
export const fetchRecommendations = (id) => API.get(`/products/${id}/recommendations`);
export default API;
