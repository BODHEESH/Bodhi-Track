const mongoose = require('mongoose');
const dotenv = require('dotenv');
const SystemDesignTopic = require('../models/SystemDesignTopic');
const systemDesignTopics = require('../data/systemDesignTopics');

// Load env vars
dotenv.config({ path: '../.env' });

const importData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect('mongodb://127.0.0.1:27017/bodhi-track', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    
    console.log('MongoDB Connected...');

    // Clear existing data
    console.log('Clearing existing data...');
    await SystemDesignTopic.deleteMany();
    
    // Import new data
    console.log('Importing new data...');
    await SystemDesignTopic.insertMany(systemDesignTopics);
    
    console.log('Data imported successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error importing data:', error);
    process.exit(1);
  }
};

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
  process.exit(1);
});

importData();
