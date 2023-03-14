const mongoose = require('mongoose');

//Quiz Schema
const schQuiz = new mongoose.Schema( {
    name: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    created: {
        type: Date,
        default: Date.now
    },
    user: {
        type: String,
        required: true
    },
    questions: {
        type: Array,
        "default": [String],
        required: true
    }
})

const quizCollection = new mongoose.model("quizzes", schQuiz);

module.exports = quizCollection