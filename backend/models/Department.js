import mongoose from 'mongoose';

const departmentSchema = new mongoose.Schema({
    department_id: {
        type: Number,
        required: true,
        unique: true,
        index: true // Indexing this field makes lookups extremely fast
    },
    name: {
        type: String,
        required: true,
        trim: true
    }
}, {
    timestamps: true // Automatically adds createdAt and updatedAt fields
});

const Department = mongoose.model('Department', departmentSchema);
export default Department;
