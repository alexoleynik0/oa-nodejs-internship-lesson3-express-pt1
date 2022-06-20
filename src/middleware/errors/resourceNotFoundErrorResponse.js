const ResourceNotFound = require('../../errors/ResourceNotFound');

// 404 Resource response
module.exports = (err, _req, res, next) => {
  if (err instanceof ResourceNotFound) {
    res.status(404).json({
      message: 'Resource Not Found.',
    });
  } else {
    next(err);
  }
};
