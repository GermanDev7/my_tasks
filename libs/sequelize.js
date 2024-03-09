const { Sequelize } = require('sequelize');

const { config } = require('./../config/config');
const { setupModels } = require('./../db/models');
const sequelize = new Sequelize(config.dbUrl, { dialect: config.dialect });
setupModels(sequelize);


module.exports = sequelize;
