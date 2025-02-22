const mongoose = require('mongoose');

const devOpsSchema = new mongoose.Schema({
    week: {
        type: String,
        required: true
    },
    goal: {
        type: String,
        required: true
    },
    topics: [{
        day: {
            type: Number,
            required: true
        },
        title: {
            type: String,
            required: true
        },
        subtopics: [{
            type: String,
            required: true
        }],
        status: {
            type: String,
            enum: ['todo', 'in-progress', 'completed'],
            default: 'todo'
        }
    }]
}, {
    timestamps: true,
    collection: 'devopstopics'
});

module.exports = mongoose.model('DevOps', devOpsSchema);
