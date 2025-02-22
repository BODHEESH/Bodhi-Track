const mongoose = require('mongoose');

const systemDesignSchema = new mongoose.Schema({
    section: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    topics: [{
        id: {
            type: Number,
            required: true
        },
        title: {
            type: String,
            required: true
        },
        difficulty: {
            type: String,
            enum: ['easy', 'medium', 'hard'],
            required: true
        },
        status: {
            type: String,
            enum: ['todo', 'in-progress', 'completed'],
            default: 'todo'
        },
        subtopics: [{
            type: String
        }],
        components: [{
            type: String
        }],
        principles: [{
            type: String
        }],
        patterns: [{
            type: String
        }],
        concepts: [{
            type: String
        }],
        types: [{
            type: String
        }],
        aspects: [{
            type: String
        }]
    }]
}, {
    timestamps: true,
    collection: 'systemdesigntopics'
});

module.exports = mongoose.model('SystemDesign', systemDesignSchema);
