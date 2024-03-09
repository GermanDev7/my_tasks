const { config } = require('../config/config');
const environment = process.env.NODE_ENV;
const configMigration = {
  development: {
    username: config.dbUser,
    password: config.dbPassword,
    database: config.dbName,
    host: config.dbHost,
    dialect: config.dialect,
    logging: console.log,
  },
  test: {
    username: config.dbUser,
    password: config.dbPassword,
    database: config.dbName,
    host: config.dbHost,
    dialect: config.dialect,
    logging: console.log,
  },
  production: {
    username: config.dbUserProduction,
    password: config.dbPasswordProduction,
    database: config.dbNameProduction,
    host: config.dbHostProduction,
    dialect: config.dialect,
    logging: console.log,
  },
};

module.exports = configMigration[environment];
