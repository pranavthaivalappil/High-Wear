import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import Product from './models/Product.js';
import Department from './models/Department.js';
import Order from './models/Order.js';
import Razorpay from 'razorpay';
import crypto from 'crypto'; // Node's built-in cryptography library
import { createServer } from 'http';
import { Server } from 'socket.io';



dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Wrap the Express app inside an HTTP server
const httpServer = createServer(app);

// Initialize Socket.io base station
const io = new Server(httpServer, {
    cors: {
        origin: '*', // Allow connection from any client
        methods: ['GET', 'POST']
    }
});

// Watch for walkie-talkie connections
io.on('connection', (socket) => {
    console.log(`Client connected: ${socket.id}`);

    socket.on('disconnect', () => {
        console.log(`Client disconnected: ${socket.id}`);
    });
});

// Initialize Razorpay client
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});


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

// 6. GET /api/products/:id/recommendations - Get content-based product suggestions
app.get('/api/products/:id/recommendations', async (req, res) => {
    try {
        const productId = req.params.id;
        let currentProduct = null;

        if (!isNaN(productId)) {
            currentProduct = await Product.findOne({ id: parseInt(productId) }).lean();
        } else if (mongoose.Types.ObjectId.isValid(productId)) {
            currentProduct = await Product.findById(productId).lean();
        }

        if (!currentProduct) {
            return res.status(404).json({ error: 'Product not found' });
        }

        // Extract meaningful keywords from the product name (e.g. "Sunglasses", "Jacket")
        const nameKeywords = currentProduct.name
            .toLowerCase()
            .split(/[\s\-_,]+/) // Split on spaces, hyphens, underscores, commas
            .filter(word => word.length > 3); // Ignore short filler words like "the", "a"

        // Pull candidates from same department AND same category, excluding current product
        const candidates = await Product.find({
            department_id: currentProduct.department_id,
            category: currentProduct.category,
            _id: { $ne: currentProduct._id }
        }).limit(100).lean();

        // Score each candidate by similarity
        const scored = candidates.map(item => {
            let score = 0;

            // 1. Name keyword match (strongest signal — 15 pts per matching word)
            const itemNameLower = item.name.toLowerCase();
            nameKeywords.forEach(keyword => {
                if (itemNameLower.includes(keyword)) {
                    score += 15;
                }
            });

            // 2. Brand match (medium signal — 8 pts)
            if (item.brand.toLowerCase() === currentProduct.brand.toLowerCase()) {
                score += 8;
            }

            // 3. Price closeness score (weaker signal — up to 5 pts)
            const priceDiff = Math.abs(item.retail_price - currentProduct.retail_price);
            const priceSimilarity = Math.max(0, 5 - (priceDiff / 200));
            score += priceSimilarity;

            return { ...item, similarityScore: score };
        });

        // Sort by highest score and return top 4
        const recommendations = scored
            .sort((a, b) => b.similarityScore - a.similarityScore)
            .slice(0, 4);

        res.json(recommendations);

    } catch (error) {
        console.error('Error fetching recommendations:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});




// 6. POST /api/create-razorpay-order - Generate Razorpay Payment Token Order
app.post('/api/create-razorpay-order', async (req, res) => {
    const { amount } = req.body;
    try {
        const options = {
            amount: Math.round(amount * 100), // Amount in paise (Razorpay expects smallest currency unit)
            currency: 'INR',
            receipt: `receipt_${Date.now()}`
        };
        const order = await razorpay.orders.create(options);
        res.status(201).json({
            id: order.id,
            amount: order.amount,
            currency: order.currency,
            key_id: process.env.RAZORPAY_KEY_ID
        });
    } catch (error) {
        console.error('Error creating Razorpay order:', error);
        res.status(500).json({ error: 'Failed to create payment order.' });
    }
});



// 7. POST /api/orders - Verify payment, process stock, and log invoice
app.post('/api/orders', async (req, res) => {
    const { items, customer_info, razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    if (!items || items.length === 0) {
        return res.status(400).json({ error: 'Your cart is empty!' });
    }
    if (!customer_info || !customer_info.name || !customer_info.email || !customer_info.address) {
        return res.status(400).json({ error: 'Please provide all customer details!' });
    }
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
        return res.status(400).json({ error: 'Payment details are missing!' });
    }

    // 🔒 Cryptographic Signature Verification
    const generatedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest('hex');

    if (generatedSignature !== razorpay_signature) {
        console.error('Cryptographic signature verification failed!');
        return res.status(400).json({ error: 'Payment transaction could not be verified!' });
    }

    // Start a transaction session
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        let totalPrice = 0;
        const processedItems = [];

        // Verify and deduct stock for each item
        for (const cartItem of items) {
            const product = await Product.findById(cartItem.product_id).session(session);

            if (!product) {
                throw new Error(`Product not found!`);
            }

            if (product.inventory < cartItem.quantity) {
                throw new Error(`Insufficient stock for ${product.name}! Only ${product.inventory} items left.`);
            }

            // Deduct the inventory count
            product.inventory -= cartItem.quantity;
            await product.save({ session });

            // Log item totals
            const itemCost = product.retail_price * cartItem.quantity;
            totalPrice += itemCost;

            processedItems.push({
                product_id: product._id,
                quantity: cartItem.quantity,
                price_at_purchase: product.retail_price,
                new_inventory: product.inventory
            });
        }

        // Write the Order to the database
        const order = new Order({
            items: processedItems,
            total_price: totalPrice,
            customer_info,
            status: 'Completed'
        });
        await order.save({ session });

        // Commit transaction (Confirm all updates are permanent)
        await session.commitTransaction();
        session.endSession();

        // Broadcast stock updates
        processedItems.forEach(item => {
            io.emit('stock_update', {
                product_id: item.product_id,
                new_inventory: item.new_inventory
            });
        });

        res.status(201).json({
            message: 'Checkout successful!',
            order_id: order._id,
            total: totalPrice
        });

    } catch (error) {
        // Abort transaction (Rollback any stock deductions)
        await session.abortTransaction();
        session.endSession();
        console.error('Checkout failed, rolled back changes:', error.message);
        res.status(400).json({ error: error.message });
    }
});

httpServer.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
