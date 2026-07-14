import mongoose from 'mongoose';

// Receipt line item schema
const orderItemSchema = new mongoose.Schema({
    product_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    price_at_purchase: {
        type: Number,
        required: true
    }
});

// Main Order invoice schema
const orderSchema = new mongoose.Schema({
    items: [orderItemSchema],
    total_price: {
        type: Number,
        required: true
    },
    customer_info: {
        name: { type: String, required: true },
        email: { type: String, required: true },
        address: { type: String, required: true }
    },
    status: {
        type: String,
        required: true,
        enum: ['Pending', 'Completed', 'Cancelled'],
        default: 'Pending'
    }
}, {
    timestamps: true
});

const Order = mongoose.model('Order', orderSchema);
export default Order;
