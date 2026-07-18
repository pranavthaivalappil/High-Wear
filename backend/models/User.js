import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true, // No two accounts can share the same email
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true // This will store the HASHED password, never plain text!
    },
    role: {
        type: String,
        enum: ['customer', 'admin'], // Only these two roles are allowed
        default: 'customer'
    }
}, {
    timestamps: true // Automatically adds createdAt and updatedAt fields
});

export default mongoose.model('User', UserSchema);
