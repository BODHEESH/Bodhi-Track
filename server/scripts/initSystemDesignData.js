const mongoose = require('mongoose');
const SystemDesign = require('../models/SystemDesign');

const systemDesignData = [
    {
        section: 'High Level Design',
        title: 'Distributed Systems',
        topics: [
            {
                id: 1,
                title: 'Load Balancing',
                difficulty: 'medium',
                status: 'todo',
                components: ['Nginx', 'HAProxy', 'Round Robin', 'Least Connections'],
                concepts: ['Health Checks', 'Session Persistence', 'SSL Termination']
            },
            {
                id: 2,
                title: 'Caching',
                difficulty: 'medium',
                status: 'todo',
                components: ['Redis', 'Memcached'],
                concepts: ['Cache Invalidation', 'Cache-Aside', 'Write-Through']
            }
        ]
    },
    {
        section: 'Low Level Design',
        title: 'Object Oriented Design',
        topics: [
            {
                id: 3,
                title: 'Design Patterns',
                difficulty: 'hard',
                status: 'todo',
                components: ['Singleton', 'Factory', 'Observer'],
                concepts: ['SOLID Principles', 'Dependency Injection']
            },
            {
                id: 4,
                title: 'Concurrency',
                difficulty: 'hard',
                status: 'todo',
                components: ['Threads', 'Locks', 'Semaphores'],
                concepts: ['Race Conditions', 'Deadlocks', 'Thread Safety']
            }
        ]
    }
];

const initializeData = async () => {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/bodhi-track', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('Connected to MongoDB');

        // Clear existing data
        await SystemDesign.deleteMany({});
        console.log('Cleared existing system design data');

        // Insert new data
        await SystemDesign.insertMany(systemDesignData);
        console.log('Inserted system design data successfully');

        mongoose.connection.close();
    } catch (error) {
        console.error('Error initializing data:', error);
    }
};

initializeData();
