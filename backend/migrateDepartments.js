import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Department from './models/Department.js';

// 1. Load environment variables from the .env file
dotenv.config();

// 2. Define the base departments data we want to seed
const departments = [
    { department_id: 1, name: 'Men' },
    { department_id: 2, name: 'Women' }
];

async function migrateDepartments() {
    const mongoUri = process.env.MONGODB_URI;

    if (!mongoUri) {
        console.error('Error: MONGODB_URI is not defined in your .env file.');
        process.exit(1);
    }

    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(mongoUri);
        console.log('Connected to MongoDB successfully.');

        console.log('Seeding departments...');

        // 3. Loop through each department and "upsert" it
        for (const dept of departments) {
            await Department.findOneAndUpdate(
                { department_id: dept.department_id }, // Query: Find department by its ID
                dept,                                  // Data: Update with this department data
                { upsert: true, new: true, setDefaultsOnInsert: true } // Options: create if it doesn't exist
            );
            console.log(`Successfully migrated department: ${dept.name} (ID: ${dept.department_id})`);
        }

        console.log('Department migration completed successfully!');
    } catch (error) {
        console.error('Migration failed:', error);
    } finally {
        // 4. Always close the database connection when finished
        await mongoose.connection.close();
        console.log('Database connection closed.');
    }
}

// 5. Run the migration function
migrateDepartments();
