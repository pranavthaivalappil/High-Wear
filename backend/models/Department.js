import mongoose from 'mongoose';

// 1. Define the Schema (Blueprint)
const departmentSchema = new mongoose.Schema({
    department_id: {
        type: Number,
        required: true,
        unique: true,
        index: true // Indexing this makes search lookups extremely fast
    },
    name: {
        type: String,
        required: true,
        trim: true
    }
}, {
    timestamps: true // Automatically adds 'createdAt' and 'updatedAt' fields
});

// 2. Compile the schema into a Mongoose Model
const Department = mongoose.model('Department', departmentSchema);

// 3. Export it so other parts of the application can use it
export default Department;
