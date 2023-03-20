const User = require('../models/userModel');
const APIFeatures = require('../utils/apiFeatures');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const bcrypt = require('bcryptjs');

exports.getAllUsers = catchAsync(async (req, res, next) => {
    let users;
    const { page, limit } = req.query;
    
    // sorting by virtual fields
    const sortingOption = req.query.sort;
    if (sortingOption.includes('eventsCount')) {
        const allUsers = await User.find().populate('events');
        users = allUsers.sort((a, b) => sortingOption.substring(0, 1) === '-' ? b.eventsCount - a.eventsCount : a.eventsCount - b.eventsCount);

        if (page && limit) {
            users = users.slice((page - 1) * limit, page * limit);
        }

    } else if (sortingOption.includes('nextEventStartDate')) {
        const allUsers = await User.find().populate('events');
        users = allUsers.sort((a, b) => sortingOption.substring(0, 1) === '-' ? b.nextEventStartDate - a.nextEventStartDate : a.nextEventStartDate - b.nextEventStartDate);

        if (page && limit) {
            users = users.slice((page - 1) * limit, page * limit);
        }

    } else {
        const features = new APIFeatures(User.find().populate('events'), req.query)
            .filter()
            .sort()
            .limitFields()
            .paginate();
        
        users = await features.query;
    }

    res.status(200).json({
        status: 'success',
        results: users.length,
        data: {
            users
        }
    });
});

exports.getUser = catchAsync(async (req, res, next) => {
    const user = await User.findById(req.params.id).populate('events');

    if (!user) {
        return next(new AppError('No found user with that id', 404))
    }

    res.status(200).json({
        status: 'success',
        data: {
            user
        }
    });
});

exports.createUser = catchAsync(async (req, res, next) => {
    console.log(req.body)
    const hashedPassword = await bcrypt.hash(req.body.password, 12)
    const newUser = await User.create({ ...req.body, password: hashedPassword });

    const createdUser = newUser.toObject();
    delete createdUser.password;

    res.status(201).json({
        status: 'success',
        data: {
            user: createdUser
        }
    });
});

exports.login = catchAsync((async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email });
    
    if (!user) {
        return next(new AppError('Check your email or password', 400));
    }
    
    const isMatch = await bcrypt.compare(req.body.password, user.password);

    if (!isMatch) {
        return next(new AppError('Check your email or password', 400));
    }

    const response = user.toObject();
    delete response.password;

    res.status(200).json({
        status: 'success',
        data: {
            user: response
        }
    });
}));

exports.updateUser = catchAsync(async (req, res, next) => {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    if (!user) {
        return next(new AppError('No found user with that id', 404));
    }

    res.status(200).json({
        status: 'success',
        data: {
            user
        }
    });
});

exports.deleteUser = catchAsync(async (req, res, next) => {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
        return next(new AppError('No user found with that ID', 404));
    }

    res.status(204).json({
        status: 'success',
        data: null
    });
});

exports.deleteAllUsers = catchAsync(async (req, res, next) => {
    await User.deleteMany();

    res.status(204).json({
        status: 'success',
        data: null
    });
});