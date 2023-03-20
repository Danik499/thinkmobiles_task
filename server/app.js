const express = require('express');
const cors = require('cors');
const globalErrorHandler = require('./controllers/errorController');
const userRouter = require('./routes/userRoutes');
const eventRouter = require('./routes/eventRouter');

const app = express();

app.use(express.json());

app.use(cors({
    origin: '*'
}));

app.use('/api/v1/users', userRouter);
app.use('/api/v1/events', eventRouter);

app.use(globalErrorHandler);

module.exports = app;