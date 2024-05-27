var createError = require('http-errors');
var express = require('express');

var indexRouter = require('./routes/index');
const { usersRouter } = require('./routes/users');
const { logRequestsDetails, pinoMiddleware } = require('./middlewares/logger');

var app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Pino logger
app.use(pinoMiddleware);

//Requests middleware
app.use(logRequestsDetails);

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.send('error');
});

module.exports = app;
