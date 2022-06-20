const DbError = require('../../db/errors/DbError');

// 500 DB errors response
module.exports = (err, _req, res, next) => {
  if (err instanceof DbError) {
    res.status(500).json({
      message: err.message,
    });
  } else {
    next(err);
  }
};
