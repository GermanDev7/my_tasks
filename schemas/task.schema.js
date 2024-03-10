const Joi = require('joi');

const id = Joi.number().integer();
const name = Joi.string().min(4);
const tema = Joi.string().min(4);
const initial_date = Joi.date.min('now');
const final_date = Joi.date.min('now');
const complete = Joi.boolean.default(() => false);
const listId = Joi.number().integer();

const createTaskSchema = Joi.object({
  name: name.required(),
  tema: tema,
  initial_date: initial_date.required(),
  final_date: final_date.required(),
  complete: complete,
  listId: listId.required(),
});

const updateTaskSchema = Joi.object({
  name: name.required(),
  tema: tema,
  initial_date: initial_date.required(),
  final_date: final_date.required(),
  complete: complete,
  listId: listId.required(),
});

const getTaskSchema = Joi.object({
  id: id.required(),
});

module.exports = {
  createTaskSchema,
  updateTaskSchema,
  getTaskSchema,
};
