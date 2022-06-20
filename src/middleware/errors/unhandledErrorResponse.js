// 500 unhandled response
module.exports = (err, _req, res, next) => {
  res.status(500).json({
    message: err.message,
    stack: err.stack,
  });
  next(err);
};
