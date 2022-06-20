const ValidationError = require('../../errors/ValidationError');

// 422 Validation response
module.exports = (err, _req, res, next) => {
  if (err instanceof ValidationError) {
    res.status(422).json({
      message: err.message,
    });
  } else {
    next(err);
  }
};
