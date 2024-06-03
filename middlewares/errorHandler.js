const { error_message } = require('../services/error');
const errorCodes = require('../const/errorCodes'); // Asegúrate de ajustar la ruta según corresponda

const errorHandler = (err, req, res, next) => {
  res.locals.error = req.app.get('env') === 'development' ? err : undefined;
  let status = 500;

  if (!err.code) {
    return res.status(status).json({
      errorCode: errorCodes.INTERNAL_SERVER_ERROR,
      message: err.message,
    });
  }

  switch (err.code) {
    case errorCodes.NOT_VALIDATED_INFO:
      status = 400;
      break;
    case errorCodes.USER_ID_NOT_FOUND:
      status = 404;
      break;
    case errorCodes.USER_NOT_RETRIEVED:
    case errorCodes.NOT_CREATED_USER:
    case errorCodes.NOT_UPDATED_USER:
    case errorCodes.NOT_DELETED_USER:
      status = 500;
      break;
  }

  return res.status(status).json(error_message(err));
};

module.exports = { errorHandler };
