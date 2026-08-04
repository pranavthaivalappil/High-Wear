// Save this as backend/test-razorpay.js
import Razorpay from 'razorpay';
import dotenv from 'dotenv';

dotenv.config();

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

async function verifyAPIKeys() {
    console.log("Checking Razorpay credentials...");
    console.log("Key ID:", process.env.RAZORPAY_KEY_ID);

    try {
        // Attempt creating a basic minimum test order of 10 INR (1000 paise)
        const order = await razorpay.orders.create({
            amount: 1000,
            currency: 'INR',
            receipt: 'test_receipt_check'
        });

        console.log("SUCCESS! Your Razorpay test keys are valid and working.");
        console.log("Order ID generated:", order.id);
    } catch (error) {
        console.error("FAILURE! Razorpay API returned an error:");
        if (error.error) {
            console.error("Code:", error.error.code);
            console.error("Description:", error.error.description);
        } else {
            console.error(error.message || error);
        }
    }
}

verifyAPIKeys();
