import mongoose from 'mongoose';

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
        index: true // We will filter by brand frequently
    },
    category: {
        type: String,
        required: true,
        trim: true,
        index: true // We will filter by category frequently
    },
    price: {
        type: Number,
        required: true,
        index: true // We will filter/sort by price frequently
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
        index: true // Used for joining with Department in-memory
    }
}, {
    timestamps: true
});

const Product = mongoose.model('Product', productSchema);
export default Product;
