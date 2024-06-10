var createError = require('http-errors');
var express = require('express');

var indexRouter = require('./routes/index');
const { createUserRouter } = require('./routes/users');
const { logRequestsDetails, pinoMiddleware } = require('./middlewares/logger');
const { errorHandler } = require('./middlewares/errorHandler');

var app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Pino logger
app.use(pinoMiddleware);

// Requests middleware
app.use(logRequestsDetails);

// Initialize the usersRouter asynchronously and start the server
const startServer = async () => {
  try {
    const usersRouter = await createUserRouter();
    app.use('/users', usersRouter);

    app.use('/', indexRouter);

    // catch 404 and forward to error handler
    app.use((req, res, next) => {
      next(createError(404));
    });

    // Error handler middleware
    app.use(errorHandler);
  } catch (error) {
    console.error('Failed to create user router:', error);
    process.exit(1); // Exit the process with failure
  }
};

startServer();

module.exports = app;
