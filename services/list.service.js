const boom = require('@hapi/boom');
const { models } = require('./../libs/sequelize');

class listService {
  constructor() {}

  async create(data) {
    const newList = await models.List.create(data);
    return newList;
  }
  async find(userId) {
    const lists = await models.List.findAll({
      include: ['tasks'],
    });

    return lists;
  }
  async findOne(id, userId) {
    const list = await models.List.findByPk(id, {
      where: { userId: userId },
      include: ['tasks'],
    });
    if (!list) {
      throw boom.notFound('List not found');
    }
    if (list.userId !== userId) {
      throw boom.unauthorized('Unauthorized');
    }
    return list;
  }
  async update(id, changes) {
    const list = await models.List.findByPk(id);
    if (!list) {
      throw boom.unauthorized('Unauthorized');
    }
    if (list.userId !== userId) {
      throw boom.unauthorized('Unauthorized');
    }

    delete changes.userId; // Protege el campo userId de ser actualizado
    const rta = list.update(changes);
    return rta;
  }
  async delete(id, userId) {
    const list = await models.List.findByPk(id);
    if (list.userId !== userId) {
      throw boom.unauthorized('Unauthorized');
    }
    await list.destroy();
    return id;
  }
}

module.exports = listService;
