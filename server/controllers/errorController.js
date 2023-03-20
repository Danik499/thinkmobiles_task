const AppError = require("../utils/appError");

const handleCastErrorDB = err => {
    const message = `Invalid ${err.path}: ${err.value}`;

    return new AppError(message, 400);
}

const handleDuplicateFieldsDB = err => {
    const message = `Duplicate field '${Object.keys(err.keyValue)[0]}'. Please use another value`;

    return new AppError(message, 400);
}

const handleValidationError = err => {
    const message = err.errors[Object.keys(err.errors)[0]].message;
    
    return new AppError(message, 400);
}

const sendError = (err, res) => {
    if (err.isOperational) {
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message
        });
    } else {
        console.error('ERROR', err);

        res.status(500).json({
            status: 'fail',
            message: 'Something went wrong!'
        });
    }
}

module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    let error = JSON.parse(JSON.stringify(err));
    error.errmsg = err.errmsg;
    error.message = err.message;

    if (err.name === 'CastError') {
        error = handleCastErrorDB(error);
    }
    
    if (err.name === 'ValidationError') {
        error = handleValidationError(error);
    }

    if (err.code === 11000) {
        error = handleDuplicateFieldsDB(error)
    }

    sendError(error, res);
}