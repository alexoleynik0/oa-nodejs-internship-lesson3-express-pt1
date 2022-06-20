const ValidationError = require('../errors/ValidationError');

const validationOptions = {
  abortEarly: false,
  allowUnknown: false,
  stripUnknown: false,
};

const validation = (schema) => (req, _res, next) => {
  const { value, error } = schema.validate(req.body, validationOptions);
  const valid = error === null || error === undefined;

  if (valid) {
    req.bodyValidated = value;
    next();
  } else {
    const message = error.details.map((detail) => detail.message).join(', ');
    next(new ValidationError(message));
  }
};

module.exports = validation;
