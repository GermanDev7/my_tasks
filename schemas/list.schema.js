const Joi = require('joi');

const id = Joi.number().integer();
const name = Joi.string().min(4);
const description = Joi.string().min(4);
const date = Joi.date().min('now');
const completed = Joi.boolean().default(() => false);
const userId = Joi.number().integer();

const createListSchema = Joi.object({
  name: name.required(),
  description: description,
  date: date.required(),
  completed: completed,
  userId: userId.required(),
});

const updateListSchema = Joi.object({
  name: name.required(),
  description: description,
  date: date.required(),
  completed: completed,
  userId: userId.required(),
});

const getListSchema = Joi.object({
  id: id.required(),
});

module.exports = {
  createListSchema,
  updateListSchema,
  getListSchema,
};
