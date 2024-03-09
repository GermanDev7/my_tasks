const  boom  = require('@hapi/boom');
const { models } = require('./../libs/sequelize');

class taskService {
  constructor() {}

  async create(data) {
    try {
      const newTask = await models.Task.create(data);
      return newTask;
    } catch (error) {
      throw error;
    }
  }
  async find() {
    try {
      const tasks = await models.Task.findAll({
        include: ['list'],
      });
      return tasks;
    } catch (error) {
      throw error;
    }
  }
  async findOne(id) {
    try {
      const task = await models.Task.findByPk(id, {
        include: ['list'],
      });
      if (!task) {
        throw boom.notFound('task not found');
      }
      return task;
    } catch (error) {
      throw error;
    }
  }
  async update(id, changes) {
    try {
      const task = await models.Task.findByPk(id);
      if (!task) {
        throw boom.notFound('task not found');
      }
      const rta = task.update(changes);
      return rta;
    } catch (error) {
      throw error;
    }
  }
  async delete(id) {
    try {
      const task = await models.Task.findByPk(id);
      if (!task) {
        throw boom.notFound('Task not found');
      }
      await task.destroy();
      return id;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = taskService;
