import mongoose from 'mongoose';

// 1. Define the Schema (Blueprint)
const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    brand: {
        type: String,
        required: true,
        trim: true,
        index: true // Indexing this allows lightning-fast filtering by brand
    },
    category: {
        type: String,
        required: true,
        trim: true,
        index: true // Indexing this allows lightning-fast filtering by categories
    },
    price: {
        type: Number,
        required: true,
        index: true // Indexing this allows fast sorting/filtering by price
    },
    price_usd: {
        type: Number
    },
    image_url: {
        type: String,
        required: true
    },
    department_id: {
        type: Number,
        required: true,
        index: true // Used as a Foreign Key to relate the product to a Department in-memory
    }
}, {
    timestamps: true
});

// 2. Compile the schema into a Mongoose Model
const Product = mongoose.model('Product', productSchema);

// 3. Export the model
export default Product;
