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

// Curated list of high-quality Unsplash fashion images mapped by product name keywords
const keywordImages = [
    // Accessories Subtypes
    { keywords: ['cap', 'hat', 'caps', 'headwear'], url: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=500&auto=format&fit=crop&q=60' }, // Hat
    { keywords: ['glasses', 'sunglass', 'sunglasses', 'wayfarer', 'eyewear'], url: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500&auto=format&fit=crop&q=60' }, // Sunglasses
    { keywords: ['belt', 'belts'], url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&auto=format&fit=crop&q=60' }, // Belt
    { keywords: ['wallet', 'purse', 'card holder', 'wallets', 'insert'], url: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=500&auto=format&fit=crop&q=60' }, // Wallet / Card Inserts (Validated Link)
    { keywords: ['watch', 'watches'], url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=60' }, // Watch
    { keywords: ['bag', 'backpack', 'tote', 'handbag'], url: 'https://images.unsplash.com/photo-1547949003-9792a18a2601?w=500&auto=format&fit=crop&q=60' }, // Bag
    { keywords: ['glove', 'gloves', 'mittens'], url: 'https://images.unsplash.com/photo-1581044777550-4cfa60707c03?w=500&auto=format&fit=crop&q=60' }, // Gloves

    // Apparel Categories
    { keywords: ['swim', 'swimsuit', 'bikini', 'tankini', 'swimwear', 'trunks'], url: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=500&auto=format&fit=crop&q=60' }, // Swimwear (Validated Link)
    { keywords: ['jean', 'jeans', 'denim'], url: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=500&auto=format&fit=crop&q=60' }, // Jeans
    { keywords: ['socks', 'sock', 'hosiery'], url: 'https://images.unsplash.com/photo-1582966772680-860e372bb558?w=500&auto=format&fit=crop&q=60' }, // Socks
    { keywords: ['t-shirt', 'tee', 'tees', 'top', 'tops', 'polo', 'shirt', 'shirts'], url: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=500&auto=format&fit=crop&q=60' }, // Tops
    { keywords: ['sweater', 'sweaters', 'cardigan', 'pullover', 'fleece'], url: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=500&auto=format&fit=crop&q=60' }, // Sweaters
    { keywords: ['jacket', 'coat', 'outerwear', 'windbreaker', 'blazer', 'parka'], url: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500&auto=format&fit=crop&q=60' }, // Outerwear
    { keywords: ['pant', 'pants', 'chinos', 'trousers', 'leggings'], url: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=500&auto=format&fit=crop&q=60' }, // Pants
    { keywords: ['dress', 'dresses', 'gown', 'skirt', 'skirts'], url: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=500&auto=format&fit=crop&q=60' }, // Dresses/Skirts
    { keywords: ['suit', 'suits', 'tuxedo'], url: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=500&auto=format&fit=crop&q=60' }, // Suits
    { keywords: ['sleepwear', 'pyjama', 'pajama', 'robe', 'nightgown'], url: 'https://images.unsplash.com/photo-1541855492-581f618f69a0?w=500&auto=format&fit=crop&q=60' }, // Sleepwear
    { keywords: ['underwear', 'boxer', 'brief', 'briefs', 'bra', 'panties', 'undershirt'], url: 'https://images.unsplash.com/photo-1617957718614-8c23f060c2d0?w=500&auto=format&fit=crop&q=60' }, // Underwear (Validated Link)
    { keywords: ['active', 'tights', 'hoodie', 'workout', 'compression'], url: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=500&auto=format&fit=crop&q=60' }, // Activewear
    { keywords: ['shorts', 'short'], url: 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=500&auto=format&fit=crop&q=60' } // Shorts
];

const defaultImage = 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=500&auto=format&fit=crop&q=60';

// Helper function to resolve dynamic image mapping
function getImageUrl(name, category) {
    const lowercaseName = name.toLowerCase();
    const lowercaseCategory = category.toLowerCase();

    // 1. Search name keywords (specific match)
    for (const item of keywordImages) {
        for (const kw of item.keywords) {
            if (lowercaseName.includes(kw)) {
                return item.url;
            }
        }
    }

    // 2. Search category keyword (general fallback)
    for (const item of keywordImages) {
        for (const kw of item.keywords) {
            if (lowercaseCategory.includes(kw)) {
                return item.url;
            }
        }
    }

    return defaultImage;
}

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

        // Clear out old products to start fresh with new schema fields
        await Product.deleteMany({});
        console.log('Product collection cleared. Starting CSV streaming seeder...');

        const csvFilePath = path.join(__dirname, 'archive', 'products.csv');
        let batch = [];
        let totalCount = 0;
        const BATCH_SIZE = 1000;

        // Open CSV read stream
        const stream = fs.createReadStream(csvFilePath).pipe(csv());

        for await (const row of stream) {
            // A. Format standard fields
            const id = parseInt(row.id) || 0;
            const name = row.name || 'Unnamed Product';
            let brand = row.brand || 'Generic';
            const category = row.category || 'General';

            // Exclude all bra, bikini, tankini, and monokini products
            const braRegex = /\b(bras?|bralettes?|bikinis?|tankinis?|monokinis?)\b/i;
            if (braRegex.test(name) || braRegex.test(category)) {
                continue; // Skip this product from database insertion
            }

            const sku = row.sku || `SKU-TEMP-${id}`;
            const distributionCenterId = parseInt(row.distribution_center_id) || 1;

            // Intercept and rename "Made in USA" brand to "Made in Taiwan"
            if (brand.trim().toLowerCase() === 'made in usa') {
                brand = 'Made in Taiwan';
            }

            // B. USD-to-INR Conversion with FIXED ₹80 multiplier
            const exchangeRate = 80;
            const costUSD = parseFloat(row.cost) || 0.0;
            const retailPriceUSD = parseFloat(row.retail_price) || 0.0;

            let costINR = Math.round(costUSD * exchangeRate);
            let retailPriceINR = Math.round(retailPriceUSD * exchangeRate);

            // Enforce minimum premium prices for cheap wallets & inserts
            const lowercaseName = name.toLowerCase();
            if (lowercaseName.includes('wallet')) {
                if (retailPriceINR < 300) {
                    retailPriceINR = 499; // Minimum retail price ₹499
                    costINR = 199;        // Minimum cost ₹199
                }
            } else if (lowercaseName.includes('insert')) {
                if (retailPriceINR < 150) {
                    retailPriceINR = 299; // Minimum retail price ₹299
                    costINR = 99;         // Minimum cost ₹99
                }
            }

            // C. Map category fashion images
            const imageUrl = getImageUrl(name, category);

            // D. Set department reference
            const deptName = row.department ? row.department.toLowerCase() : '';
            const departmentId = deptName === 'men' ? 1 : 2;

            // E. Build product document object (aligned to report Table 3.2)
            const product = {
                id,
                cost: costINR,
                retail_price: retailPriceINR,
                category,
                name,
                brand,
                department_id: departmentId,
                sku,
                distribution_center_id: distributionCenterId,
                image: imageUrl
            };

            batch.push(product);

            if (batch.length === BATCH_SIZE) {
                stream.pause();
                await Product.insertMany(batch);
                totalCount += batch.length;
                console.log(`Saved batch of ${batch.length} products. Total saved: ${totalCount}`);

                batch = [];
                stream.resume();
            }
        }

        // Insert remaining rows
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
    }
}

seedProducts();
