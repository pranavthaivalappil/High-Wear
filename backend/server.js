import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import Product from './models/Product.js';
import Department from './models/Department.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors()); // Allows our frontend (Vite) to communicate with our backend on a different port
app.use(express.json()); // Parses incoming JSON requests

// Connect to MongoDB Atlas
const mongoUri = process.env.MONGODB_URI;
mongoose.connect(mongoUri)
    .then(() => console.log('Connected to MongoDB Atlas successfully.'))
    .catch(err => console.error('Database connection error:', err));

// 1. GET /api/stats - Statistics dashboard data
app.get('/api/stats', async (req, res) => {
    try {
        // Fetch stats in parallel to save time!
        const [totalProducts, totalDepartments, uniqueBrands] = await Promise.all([
            Product.countDocuments({}),
            Department.countDocuments({}),
            Product.distinct('brand')
        ]);

        res.json({
            totalProducts,
            totalDepartments,
            totalBrands: uniqueBrands.length
        });
    } catch (error) {
        console.error('Error fetching stats:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// 2. GET /api/departments - Fetch all departments
app.get('/api/departments', async (req, res) => {
    try {
        const departments = await Department.find({}).sort({ name: 1 });
        res.json(departments);
    } catch (error) {
        console.error('Error fetching departments:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// 3. GET /api/filters - Sidebar filter categories, brands, and price limits
app.get('/api/filters', async (req, res) => {
    try {
        const [brands, categories, priceStats] = await Promise.all([
            Product.distinct('brand'),
            Product.distinct('category'),
            Product.aggregate([
                {
                    $group: {
                        _id: null,
                        minPrice: { $min: "$price" },
                        maxPrice: { $max: "$price" }
                    }
                }
            ])
        ]);

        const minPrice = priceStats[0]?.minPrice || 0;
        const maxPrice = priceStats[0]?.maxPrice || 10000;

        res.json({
            brands: brands.sort(),
            categories: categories.sort(),
            minPrice,
            maxPrice
        });
    } catch (error) {
        console.error('Error fetching filters:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// 4. GET /api/products - Main product list endpoint with filtering, search, pagination, and IN-MEMORY JOIN
app.get('/api/products', async (req, res) => {
    try {
        // A. Parse pagination params
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;

        // B. Build search & filter queries dynamically
        const query = {};

        // Search text filter (matches name or brand case-insensitively)
        if (req.query.search) {
            query.$or = [
                { name: { $regex: req.query.search, $options: 'i' } },
                { brand: { $regex: req.query.search, $options: 'i' } }
            ];
        }

        // Brand filter
        if (req.query.brand) {
            query.brand = req.query.brand;
        }

        // Category filter
        if (req.query.category) {
            query.category = req.query.category;
        }

        // Department ID filter (converted to Number)
        if (req.query.department_id) {
            query.department_id = parseInt(req.query.department_id);
        }

        // Price range filter
        if (req.query.minPrice || req.query.maxPrice) {
            query.price = {};
            if (req.query.minPrice) query.price.$gte = parseInt(req.query.minPrice);
            if (req.query.maxPrice) query.price.$lte = parseInt(req.query.maxPrice);
        }

        // C. Fetch products and departments concurrently (In-Memory Join preparation)
        const [products, totalProducts, departments] = await Promise.all([
            Product.find(query).skip(skip).limit(limit).lean(),
            Product.countDocuments(query),
            Department.find({}).lean()
        ]);

        // D. Perform In-Memory Join using a Hash Map
        const departmentMap = {};
        departments.forEach(dept => {
            departmentMap[dept.department_id] = dept.name;
        });

        const joinedProducts = products.map(prod => ({
            ...prod,
            department_name: departmentMap[prod.department_id] || 'Unknown'
        }));

        // E. Send paginated response
        res.json({
            products: joinedProducts,
            totalPages: Math.ceil(totalProducts / limit),
            currentPage: page,
            totalProducts
        });

    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Start listening
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
