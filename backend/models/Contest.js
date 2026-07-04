const mongoose = require('mongoose');

const contestSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    startTime: { type: Date, required: true },
    durationMinutes: { type: Number, required: true },
    problems: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Problem' }],
}, { timestamps: true });

module.exports = mongoose.model('Contest', contestSchema);