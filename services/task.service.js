const boom = require('@hapi/boom');
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
  async find(userId) {
    try {
      const tasks = await models.Task.findAll({
        include: [
          { model: models.List, as: 'list', where: { userId: userId } },
        ],
      });
      return tasks;
    } catch (error) {
      throw error;
    }
  }
  async findOne(id, userId) {
    try {
      const task = await models.Task.findByPk(id, {
        include: ['list'],
      });
      if (!task) {
        throw boom.notFound('task not found');
      }
      if (task.list.userId !== userId) {
        throw boom.unauthorized('Unauthorized');
      }
      return task;
    } catch (error) {
      throw error;
    }
  }
  async update(id, changes, userId) {
    try {
      const task = await models.Task.findByPk(id, { include: ['list'] });
      if (!task) {
        throw boom.notFound('task not found');
      }

      if (task.list.userId !== userId) {
        throw boom.unauthorized('Unauthorized');
      }
      const rta = task.update(changes);
      return rta;
    } catch (error) {
      throw error;
    }
  }
  async delete(id, userId) {
    try {
      const task = await models.Task.findByPk(id, { include: ['list'] });
      if (!task) {
        throw boom.notFound('Task not found');
      }
      if (task.list.userId !== userId) {
        throw boom.unauthorized('Unauthorized');
      }
      await task.destroy();
      return id;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = taskService;
