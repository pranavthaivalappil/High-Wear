import mongoose from 'mongoose';

// 1. Define the Schema (Blueprint matching report Table 3.2)
const productSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true,
        unique: true,
        index: true // Numeric index for the product's primary ID
    },
    cost: {
        type: Number,
        required: true // Cost price of product in INR
    },
    retail_price: {
        type: Number,
        required: true,
        index: true // Indexed for sorting by price
    },
    category: {
        type: String,
        required: true,
        trim: true,
        index: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    brand: {
        type: String,
        required: true,
        trim: true,
        index: true
    },
    department_id: {
        type: Number,
        required: true,
        index: true // Foreign Key referencing Department
    },
    sku: {
        type: String,
        required: true,
        unique: true,
        index: true // Stock Keeping Unit code
    },
    distribution_center_id: {
        type: Number,
        required: true
    },
    image: {
        type: String,
        required: true // Unsplash cover image URL
    },
    inventory: {
        type: Number,
        required: true,
        default: 20 // 👈 Every product starts with 20 items in stock
    }
}, {
    timestamps: true
});

// 2. Compile the schema into a Mongoose Model
const Product = mongoose.model('Product', productSchema);

// 3. Export the model
export default Product;
