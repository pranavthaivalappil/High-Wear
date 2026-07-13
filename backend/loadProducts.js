import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import csv from 'csv-parser';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './models/Product.js';

// Resolve current directory path in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

// 1. Image Mapping for Categories
// Generates beautiful Unsplash fashion images corresponding to the categories
const categoryImages = {
    'Accessories': 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=60',
    'Swim': 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=500&auto=format&fit=crop&q=60',
    'Jeans': 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=500&auto=format&fit=crop&q=60',
    'Tops & Tees': 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=500&auto=format&fit=crop&q=60',
    'Sweaters': 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=500&auto=format&fit=crop&q=60',
    'Outerwear & Coats': 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=500&auto=format&fit=crop&q=60',
    'Pants': 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=500&auto=format&fit=crop&q=60',
    'Dresses': 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=500&auto=format&fit=crop&q=60',
    'Suits': 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=500&auto=format&fit=crop&q=60',
    'Sleepwear': 'https://images.unsplash.com/photo-1541855492-581f618f69a0?w=500&auto=format&fit=crop&q=60',
    'Underwear': 'https://images.unsplash.com/photo-1582232775438-c90a18eb68ff?w=500&auto=format&fit=crop&q=60',
    'Active': 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=500&auto=format&fit=crop&q=60',
    'Socks': 'https://images.unsplash.com/photo-1582966772680-860e372bb558?w=500&auto=format&fit=crop&q=60'
};

const defaultImage = 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=500&auto=format&fit=crop&q=60';

async function seedProducts() {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
        console.error('Error: MONGODB_URI is not defined in .env.');
        process.exit(1);
    }

    try {
        console.log('Connecting to MongoDB Atlas...');
        await mongoose.connect(mongoUri);
        console.log('Connected successfully. Cleaning existing products...');

        // Clear out old products to start fresh
        await Product.deleteMany({});
        console.log('Product collection cleared. Starting CSV streaming seeder...');

        const csvFilePath = path.join(__dirname, 'archive', 'products.csv');
        let batch = [];
        let totalCount = 0;
        const BATCH_SIZE = 1000;

        // 2. Open Stream of the CSV file
        const stream = fs.createReadStream(csvFilePath)
            .pipe(csv()); // Pipe it to the csv-parser library

        for await (const row of stream) {
            // Translate CSV headers and format data
            const name = row.name || 'Unnamed Product';
            const brand = row.brand || 'Generic';
            const category = row.category || 'General';

            // Convert USD price to INR (approx exchange rate 83) and round to nearest integer
            const priceUSD = parseFloat(row.retail_price) || 0.0;
            const priceINR = Math.round(priceUSD * 83);

            // Assign department_id based on department name
            const deptName = row.department ? row.department.toLowerCase() : '';
            const departmentId = deptName === 'men' ? 1 : 2;

            // Pick a matching fashion image URL, or use a default stylish image
            const imageUrl = categoryImages[category] || defaultImage;

            // Prepare the product object
            const product = {
                name,
                brand,
                category,
                price: priceINR,
                price_usd: priceUSD,
                image_url: imageUrl,
                department_id: departmentId
            };

            batch.push(product);

            // 3. Batch insert when we reach 1000 items
            if (batch.length === BATCH_SIZE) {
                // Pause stream so DB doesn't get overwhelmed
                stream.pause();
                await Product.insertMany(batch);
                totalCount += batch.length;
                console.log(`Saved batch of ${batch.length} products. Total saved: ${totalCount}`);

                // Clear the batch memory container and resume streaming
                batch = [];
                stream.resume();
            }
        }

        // 4. Insert any remaining products left in the final batch
        if (batch.length > 0) {
            await Product.insertMany(batch);
            totalCount += batch.length;
            console.log(`Saved final batch of ${batch.length} products. Total saved: ${totalCount}`);
        }

        console.log(`Successfully completed! Loaded ${totalCount} products total.`);

    } catch (error) {
        console.error('Migration failed:', error);
    } finally {
        await mongoose.connection.close();
        console.log('Database connection closed.');

        // Print memory usage to verify we kept it low
        const memoryUsed = process.memoryUsage().heapUsed / 1024 / 1024;
        console.log(`Node.js Process memory usage: ${memoryUsed.toFixed(2)} MB`);
    }
}

seedProducts();
