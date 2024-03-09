const boom  = require('@hapi/boom');
const { models } = require('./../libs/sequelize');

class listService {
  constructor() {}

  async create(data) {
    try {
      const newList = await models.List.create(data);
      return newList;
    } catch (error) {
      throw error;
    }
  }
  async find() {
    try {
      const lists = await models.List.findAll({
        include: ['tasks'],
      });
      return lists;
    } catch (error) {
      throw error;
    }
  }
  async findOne(id) {
    try {
      const list = await models.List.findByPk(id, { include: ['tasks'] });
      return list;
    } catch (error) {
      throw error;
    }
  }
  async update(id, changes) {
    const list = await models.List.findByPk(id);
    if (!list) {
      throw boom.notFound('List not found');
    }

    const rta = list.update(changes);
    return rta;
  }
  async delete(id) {
    const list = await models.List.findOne(id);
    await list.destroy();
    return id;
  }
}

module.exports = listService;
