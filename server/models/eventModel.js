const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'An event must have a title'],
        trim: true,
        maxLength: [100, 'A title must have less or equal then 100 characters']
    },
    description: {
        type: String,
        trim: true
    },
    startDate: Date,
    endDate: Date,
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
});

const Event = mongoose.models.Event || mongoose.model('Event', eventSchema);

module.exports = Event;