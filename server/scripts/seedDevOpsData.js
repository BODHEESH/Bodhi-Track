const mongoose = require('mongoose');
const DevOps = require('../models/DevOps');
const devOpsData = require('../data/devOpsData');
require('dotenv').config();

const seedDevOpsData = async () => {
    try {
        // Connect to MongoDB
        const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/bodhi-track';
        console.log('Connecting to MongoDB at:', mongoUri);
        
        await mongoose.connect(mongoUri);
        console.log('Connected to MongoDB...');

        // Clear existing data
        console.log('Clearing existing DevOps data...');
        await DevOps.deleteMany({});
        console.log('Cleared existing DevOps data');

        // Insert new data
        console.log('Inserting DevOps data...');
        const result = await DevOps.insertMany(devOpsData);
        console.log(`Successfully seeded ${result.length} DevOps weeks!`);
        console.log('Sample data:', JSON.stringify(result[0], null, 2));

        // Verify data
        const count = await DevOps.countDocuments();
        console.log(`Total documents in collection: ${count}`);

        // Disconnect from MongoDB
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB.');

    } catch (error) {
        console.error('Error seeding data:', error);
        if (error.errors) {
            Object.keys(error.errors).forEach(key => {
                console.error(`Validation error for field ${key}:`, error.errors[key].message);
            });
        }
        process.exit(1);
    }
};

// Run the seeding function
seedDevOpsData();
