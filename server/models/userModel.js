const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, 'A user must have a first name'],
        trim: true,
        maxLength: [30, 'A first name must have less or equal then 30 characters']
    },
    lastName: {
        type: String,
        required: [true, 'A user must have a last name'],
        trim: true,
        maxLength: [30, 'A last name must have less or equal then 30 characters']
    },
    email: {
        type: String,
        required: [true, 'Please provide your email'],
        trim: true,
        unique: true,
        validate: [validator.isEmail, 'Please provide a valid email']
    },
    password: {
        type: String,
        required: [true, 'A user must have a password']
    },
    phoneNumber: {
        type: String,
        match: [/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/,
                'Invalid phone number'],
    },
    events: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Event"
    }]
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    id: false
});

userSchema.virtual('eventsCount').get(function () {
    return this.events.length;
});

userSchema.virtual('nextEventStartDate').get(function () {
    const events = this.events.filter(e => e.startDate >= Date.now());
    return events.sort((a, b) => a.startDate - b.startDate)[0]?.startDate || '';
});

const User = mongoose.models.User || mongoose.model('User', userSchema);

module.exports = User;