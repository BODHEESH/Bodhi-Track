const mongoose = require('mongoose');
const User = require('../models/User');

const seedUser = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect('mongodb://127.0.0.1:27017/bodhi-track', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    
    console.log('MongoDB Connected...');

    // Check if default user exists
    const existingUser = await User.findOne({ username: 'bodhi' });
    
    if (!existingUser) {
      // Create default user
      const defaultUser = new User({
        username: 'bodhi',
        password: 'qwerty',
        isFirstLogin: false
      });

      await defaultUser.save();
      console.log('Default user created successfully');
    } else {
      console.log('Default user already exists');
    }

    process.exit(0);
  } catch (error) {
    console.error('Error seeding user:', error);
    process.exit(1);
  }
};

seedUser();
