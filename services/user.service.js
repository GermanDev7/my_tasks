const boom = require('@hapi/boom');
const { models } = require('./../libs/sequelize');
const bcrypt = require('bcrypt');

class userService {
  constructor() {}

  async create(data) {
    //hash password
    const passHash = await bcrypt.hash(data.password, 10);
    const newUser = await models.User.create({ ...data, password: passHash });
    //lo inserto  a la data y creo el user
    delete newUser.dataValues.password;

    return newUser;
  }
  async find() {
    const users = await models.User.findAll({
      include: ['lists'],
    });
    return users;
  }
  async findOne(id, userId) {
    const user = await models.User.findByPk(id, { include: ['lists'] });
    if (!user) {
      throw boom.notFound('User not found');
    }

    if (user.id !== userId) {
      throw boom.unauthorized('Unauthorized');
    }
    return user;
  }
  async findByEmail(email) {
    const rta = await models.User.findOne({
      where: { email },
    });
    return rta;
  }
  async update(id, changes, userId) {
    const user = await models.User.findByPk(id);
    if (!user) {
      throw boom.notFound('User not found');
    }
    if (user.id !== userId) {
      throw boom.unauthorized('Unauthorized');
    }

    await user.update(changes);

    return { id: user.id, ...changes };
  }

  async delete(id, userId) {
    const user = await models.User.findByPk(id);
    if (!user) {
      throw boom.notFound('User not found');
    }
    if (user.id !== userId) {
      throw boom.unauthorized('Unauthorized');
    }
    await user.destroy();
    return { message: 'User deleted succesfully', id };
  }

  async changePassword(id, data) {
    const user = await models.User.findByPk(id);
    if (!user) {
      throw boom.notFound('User not found');
    }

    const isMatch = await bcrypt.compare(data.oldPassword, user.password);
    if (!isMatch) {
      throw boom.unauthorized('Password incorrect');
    }
    const newPassHash = await bcrypt.hash(data.newPassword, 10);
    user.password = newPassHash;
    user.save();
    return { message: 'Password changed successfully' };
  }
}

module.exports = userService;
