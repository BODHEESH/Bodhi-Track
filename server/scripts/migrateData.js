const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '..', '.env') });

// Import models
const DSAProblem = require('../models/DSAProblem');
const SystemDesignTopic = require('../models/SystemDesignTopic');

// Import data
const { dsaProblems } = require('./data/dsaProblems');
const { systemDesignProblems } = require('./data/systemdesignProblems');

// Function to migrate DSA problems
const migrateDSAProblems = async () => {
  try {
    console.log('Starting DSA problems migration...');
    
    // Clear existing data
    await DSAProblem.deleteMany({});
    console.log('Cleared existing DSA problems');
    
    // Transform and insert data
    const problems = dsaProblems.map(day => ({
      day: day.day,
      title: day.title,
      problems: day.problems.map(problem => ({
        problemId: problem.id,
        title: problem.title,
        difficulty: problem.difficulty,
        status: problem.status
      }))
    }));

    await DSAProblem.insertMany(problems);
    console.log(`Migrated ${problems.length} DSA problem sets`);
    return true;
  } catch (err) {
    console.error('Error migrating DSA problems:', err.message);
    return false;
  }
};

// Function to migrate System Design topics
const migrateSystemDesignTopics = async () => {
  try {
    console.log('Starting System Design topics migration...');
    
    // Clear existing data
    await SystemDesignTopic.deleteMany({});
    console.log('Cleared existing System Design topics');
    
    // Transform and insert data
    const topics = systemDesignProblems.map(section => ({
      section: section.section,
      title: section.title,
      topics: section.topics.map(topic => ({
        topicId: topic.id,
        title: topic.title,
        subtopics: topic.subtopics,
        difficulty: topic.difficulty,
        status: topic.status
      }))
    }));

    await SystemDesignTopic.insertMany(topics);
    console.log(`Migrated ${topics.length} System Design sections`);
    return true;
  } catch (err) {
    console.error('Error migrating System Design topics:', err.message);
    return false;
  }
};

// Run migrations
const runMigrations = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('MongoDB connected successfully');

    const dsaSuccess = await migrateDSAProblems();
    const systemDesignSuccess = await migrateSystemDesignTopics();

    if (dsaSuccess && systemDesignSuccess) {
      console.log('All migrations completed successfully');
    } else {
      console.log('Some migrations failed, check the logs above');
    }
  } catch (err) {
    console.error('Migration failed:', err.message);
  } finally {
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
    process.exit(0);
  }
};

// Handle errors
process.on('unhandledRejection', (err) => {
  console.error('Unhandled rejection:', err.message);
  mongoose.connection.close().then(() => {
    console.log('MongoDB connection closed due to error');
    process.exit(1);
  });
});

runMigrations();
