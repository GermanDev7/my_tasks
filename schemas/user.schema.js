const Joi = require('joi');

const id = Joi.number().integer();
const email = Joi.string().email();
const password = Joi.string().min(8);
const role = Joi.string().min(4);

const createUserSchema = Joi.object({
  email: email.required(),
  password: password.required(),
  role: role.required(),
});

const updateUserSchema = Joi.object({
  email: email,
  role: role,
});

const getUserSchema = Joi.object({
  id: id.required(),
});
const changePasswordUser = Joi.object({
  oldPassword: password.required(),
  newPassword: password.required(),
});

const loginSchema = Joi.object({
  password: password.required(),
  newPassword: password.required(),
});
module.exports = {
  createUserSchema,
  updateUserSchema,
  getUserSchema,
  changePasswordUser,
};
