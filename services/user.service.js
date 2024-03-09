const  boom  = require('@hapi/boom');
const { models } = require('./../libs/sequelize');
const bcrypt = require('bcrypt');


class userService {
  constructor() {}

  async create(data) {
    try {
      //hash password
      const passHash = await bcrypt.hash(data.password, 10);
      const newUser = await models.User.create({ ...data, password: passHash });
      //lo inserto  a la data y creo el user
      delete newUser.dataValues.password;

      return newUser;
    } catch (error) {
      throw error;
    }
  }
  async find() {
    try {
      const users = await models.User.findAll({
        include: ['lists'],
      });
      return users;
    } catch (error) {
      throw error;
    }
  }
  async findOne(id) {
    try {
      const user = await models.User.findByPk(id, { include: ['lists'] });
      return user;
    } catch (error) {
      throw error;
    }
  }
  async findByEmail(email) {
    try {
      const rta = await models.User.findOne({
        where: { email },
      });
      return rta;
    } catch (error) {
      throw error;
    }
  }
  async update(id, changes) {
    const user = await models.User.findOne(id);
    if (!user) {
      throw boom.notFound('User not found');
    }

    if (changes.password) {
      const passHash = await bcrypt.hash(changes.password, 10);
      changes.password = passHash;
    }

    const rta = user.update(changes);
    delete newUser.dataValues.password;
    return rta;
  }
  async delete(id) {
    const user = await models.User.findOne(id);
    await user.destroy();
    return id;
  }
  async changePassword(id, data) {
    try {
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
    } catch (error) {
      throw error;
    }
  }
}

module.exports = userService;
