const Joi = require('joi');

const id = Joi.number().integer();
const name = Joi.string().min(4);
const tema = Joi.string().min(4);
const initialDate = Joi.date().min('now');
const finalDate = Joi.date().min('now');
const complete = Joi.boolean().default(() => false);
const listId = Joi.number().integer();

const createTaskSchema = Joi.object({
  name: name.required(),
  tema: tema,
  initialDate: initialDate.required(),
  finalDate: finalDate.required(),
  complete: complete,
  listId: listId.required(),
});

const updateTaskSchema = Joi.object({
  name: name.required(),
  tema: tema,
  initialDate: initialDate.required(),
  finalDate: finalDate.required(),
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
