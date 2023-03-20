const Event = require('../models/eventModel');
const User = require('../models/UserModel');
const APIFeatures = require('../utils/apiFeatures');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.getAllEvents = catchAsync(async (req, res, next) => {
    // console.log(await Event.find({ owner: req.query.user }))
    const features = new APIFeatures(req.query.user ? Event.find({ owner: req.query.user }) : Event.find(), req.query)
        .filter()
        .sort()
        .limitFields()
        .paginate();
    
    const events = await features.query;
    res.status(200).json({
        status: 'success',
        results: events.length,
        data: {
            events
        }
    });
});

exports.getEvent = catchAsync(async (req, res, next) => {
    const event = await Event.findById(req.params.id);

    if (!event) {
        return next(new AppError('No found event with that id', 404))
    }

    res.status(200).json({
        status: 'success',
        data: {
            event
        }
    });
});

exports.createEvent = catchAsync(async (req, res, next) => {
    const { startDate: start, endDate: end } = req.body;
    
    if (new Date(start) > new Date(end)) {
        return next(new AppError('Start date should be greater or equal then end date', 400));
    }

    // check if specified date is already taken
    const eventsWithSpecifiedDate = await Event.find({
        owner: req.body.owner,
        $or: [
            {
                $or: [
                    { startDate: { $gte: start, $lte: end } },
                    { endDate: { $gte: start, $lte: end } },
                ]
            },
            {
                $and: [
                    { startDate: { $lte: start } },
                    { endDate: { $gte: end } }
                ]
            }
        ]
    });

    if (eventsWithSpecifiedDate[0]) {
        return next(new AppError('You can\'t create event for this date', 400));
    }

    const newEvent = await Event.create(req.body);
    
    await User.findByIdAndUpdate(newEvent.owner, { $push: { events: newEvent._id } });

    res.status(201).json({
        status: 'success',
        data: {
            event: newEvent
        }
    });
});

exports.updateEvent = catchAsync(async (req, res, next) => {
    const event = await Event.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    if (!event) {
        return next(new AppError('No found event with that id', 404));
    }

    res.status(200).json({
        status: 'success',
        data: {
            event
        }
    });
});

exports.deleteEvent = catchAsync(async (req, res, next) => {
    const event = await Event.findByIdAndDelete(req.params.id);

    if (!event) {
        return next(new AppError('No event found with that ID', 404));
    }

    res.status(204).json({
        status: 'success',
        data: null
    });
});

exports.deleteAllEvents = catchAsync(async (req, res, next) => {
    await Event.deleteMany();

    res.status(204).json({
        status: 'success',
        data: null
    });
});