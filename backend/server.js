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
app.use(cors());
app.use(express.json());

// Connect to MongoDB Atlas
const mongoUri = process.env.MONGODB_URI;
mongoose.connect(mongoUri)
    .then(() => console.log('Connected to MongoDB Atlas successfully.'))
    .catch(err => console.error('Database connection error:', err));

// 1. GET /api/stats - Statistics dashboard metrics
app.get('/api/stats', async (req, res) => {
    try {
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

// 3. GET /api/filters - Fetch sidebar filter constraints using updated retail_price field
app.get('/api/filters', async (req, res) => {
    try {
        const [brands, categories, priceStats] = await Promise.all([
            Product.distinct('brand'),
            Product.distinct('category'),
            Product.aggregate([
                {
                    $group: {
                        _id: null,
                        minPrice: { $min: "$retail_price" }, // Changed from price to retail_price
                        maxPrice: { $max: "$retail_price" }  // Changed from price to retail_price
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

// 4. GET /api/products - Paginated product listings with search and filter queries
app.get('/api/products', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;

        const query = {};

        // Case-insensitive search on name or brand
        if (req.query.search) {
            query.$or = [
                { name: { $regex: req.query.search, $options: 'i' } },
                { brand: { $regex: req.query.search, $options: 'i' } }
            ];
        }

        if (req.query.brand) {
            query.brand = req.query.brand;
        }

        if (req.query.category) {
            query.category = req.query.category;
        }

        if (req.query.department_id) {
            query.department_id = parseInt(req.query.department_id);
        }

        // Price range filter on retail_price field
        if (req.query.minPrice || req.query.maxPrice) {
            query.retail_price = {}; // Changed from price to retail_price
            if (req.query.minPrice) query.retail_price.$gte = parseInt(req.query.minPrice);
            if (req.query.maxPrice) query.retail_price.$lte = parseInt(req.query.maxPrice);
        }

        // Fetch products and departments concurrently for custom join
        const [products, totalProducts, departments] = await Promise.all([
            Product.find(query).skip(skip).limit(limit).lean(),
            Product.countDocuments(query),
            Department.find({}).lean()
        ]);

        // Build in-memory hash-map join
        const departmentMap = {};
        departments.forEach(dept => {
            departmentMap[dept.department_id] = dept.name;
        });

        const joinedProducts = products.map(prod => ({
            ...prod,
            department_name: departmentMap[prod.department_id] || 'Unknown'
        }));

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

// 5. GET /api/products/:id - Single product lookup with in-memory relational join
app.get('/api/products/:id', async (req, res) => {
    try {
        const productId = req.params.id;

        let product = null;

        // Support lookup by numeric "id" or Mongoose ObjectId
        if (!isNaN(productId)) {
            product = await Product.findOne({ id: parseInt(productId) }).lean();
        } else if (mongoose.Types.ObjectId.isValid(productId)) {
            product = await Product.findById(productId).lean();
        }

        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        // Perform single in-memory join
        const dept = await Department.findOne({ department_id: product.department_id }).lean();

        const joinedProduct = {
            ...product,
            department_name: dept ? dept.name : 'Unknown'
        };

        res.json(joinedProduct);
    } catch (error) {
        console.error('Error fetching single product:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
