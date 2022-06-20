const Joi = require('joi');

const rules = {
  name: Joi.string().min(2).max(100),
  email: Joi.string().email(),
  custom: Joi.string().max(100),
  createdAt: Joi.date(),
  updatedAt: Joi.date(),
};

const userCreateSchema = Joi.object().keys({
  ...rules,
  name: rules.name.required(),
  email: rules.email.required(),
});
module.exports.userCreateSchema = userCreateSchema;

const userPutSchema = userCreateSchema;
module.exports.userPutSchema = userPutSchema;

const userPatchSchema = userCreateSchema.keys({
  ...rules,
});
module.exports.userPatchSchema = userPatchSchema;
