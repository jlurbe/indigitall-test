const codify_error = (err, code) => {
  err.code = code;
  return err;
};

const error_message = (error) => {
  return {
    error_code: error.code,
    error_message: error.message,
  };
};

module.exports = { codify_error, error_message };
