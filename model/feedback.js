const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
    fname: { type: String, required: true },
    feedback: { type: String, required: true, min: 8, max: 60 }
},{ timestamps: true });

module.exports = mongoose.model('Feedback', feedbackSchema);