import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Department from './models/Department.js';
import Product from './models/Product.js';

dotenv.config();

async function verifyData() {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
        console.error('Error: MONGODB_URI is not defined in .env.');
        process.exit(1);
    }

    try {
        console.log('Connecting to MongoDB Atlas to run health checks...');
        await mongoose.connect(mongoUri);
        console.log('Connected successfully. Gathering database stats...\n');

        // 1. Check counts in both collections
        const deptCount = await Department.countDocuments({});
        const productCount = await Product.countDocuments({});

        console.log('--- 📊 DATABASE STATS ---');
        console.log(`Total Departments : ${deptCount} (Expected: 2)`);
        console.log(`Total Products    : ${productCount} (Expected: 29120)`);
        console.log('-------------------------\n');

        // 2. Fetch a sample product from the database
        const sampleProduct = await Product.findOne({});

        if (sampleProduct) {
            console.log('--- 🔍 SAMPLE PRODUCT AUDIT ---');
            console.log(`Product ID   : ${sampleProduct.id}`);
            console.log(`Name         : ${sampleProduct.name}`);
            console.log(`Brand        : ${sampleProduct.brand}`);
            console.log(`Category     : ${sampleProduct.category}`);
            console.log(`Cost (INR)   : ₹${sampleProduct.cost}`);
            console.log(`Retail Price : ₹${sampleProduct.retail_price}`);
            console.log(`SKU Code     : ${sampleProduct.sku}`);
            console.log(`Dist. Center : Center #${sampleProduct.distribution_center_id}`);
            console.log(`Cover Image  : ${sampleProduct.image}`);
            console.log(`Dept ID Ref  : ${sampleProduct.department_id}`);

            // Look up the corresponding department in the DB to verify relation
            const linkedDept = await Department.findOne({ department_id: sampleProduct.department_id });
            console.log(`Linked Dept  : ${linkedDept ? linkedDept.name : '⚠️ RELATION NOT FOUND'}`);
            console.log('-------------------------------\n');
        } else {
            console.log('⚠️ No products found in the database!');
        }

        // 3. Run validation checks for missing fields and duplicates
        const productsWithoutImages = await Product.countDocuments({ image: { $exists: false } });
        const productsWithoutSKU = await Product.countDocuments({ sku: { $exists: false } });
        const productsWithoutDept = await Product.countDocuments({ department_id: { $exists: false } });

        console.log('--- 🛡️ INTEGRITY CHECKS ---');
        if (productsWithoutImages === 0 && productsWithoutSKU === 0 && productsWithoutDept === 0) {
            console.log('✅ Integrity check passed! All products have valid images, SKUs, and department IDs.');
        } else {
            console.log(`⚠️ Warning: ${productsWithoutImages} products are missing image URLs.`);
            console.log(`⚠️ Warning: ${productsWithoutSKU} products are missing SKU codes.`);
            console.log(`⚠️ Warning: ${productsWithoutDept} products are missing department IDs.`);
        }
        console.log('---------------------------');

    } catch (error) {
        console.error('Verification failed:', error);
    } finally {
        await mongoose.connection.close();
        console.log('\nDatabase connection closed.');
    }
}

verifyData();
