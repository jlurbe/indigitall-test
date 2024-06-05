var createError = require('http-errors');
var express = require('express');

var indexRouter = require('./routes/index');
const { usersRouter } = require('./routes/users');
const { logRequestsDetails, pinoMiddleware } = require('./middlewares/logger');
const { errorHandler } = require('./middlewares/errorHandler');

var app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Pino logger
app.use(pinoMiddleware);

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

//Requests middleware
app.use(logRequestsDetails);

// Error handler middleware
app.use(errorHandler);

module.exports = app;
