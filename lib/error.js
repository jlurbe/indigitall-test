const { errorCodes } = require('../const/errorCodes');

const codify_error = (err, code, details) => {
  err.code = code;
  err.details = details;

  return err;
};

const error_message = (error) => {
  return {
    errorCode: error.code || errorCodes.INTERNAL_SERVER_ERROR,
    message: error.message || 'Internal server error',
    errorDetails: error.details ? JSON.parse(error.details) : undefined,
  };
};

module.exports = { codify_error, error_message };
