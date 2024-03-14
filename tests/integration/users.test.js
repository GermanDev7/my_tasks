const request = require('supertest');
const { Sequelize } = require('sequelize');

const createApp = require('../../index');
const { config } = require('../../config/config');

const DB_NAME = config.dbName;
const MYSQL_URI = config.dbUrl;
describe('Test for books endpoint', () => {
  let app = null;
  let server = null;

  beforeAll(async () => {
    app = createApp();
    server = app.listen(3000);
    const { setupModels } = require('./../../db/models');
    const sequelize = new Sequelize(MYSQL_URI, { dialect: config.dialect });
    setupModels(sequelize);
    await sequelize.authenticate(); // Verifica la conexión a la BD
    await sequelize.sync({ force: true }); // Crea las tablas, 'force: true' elimina tablas existentes
  });

  afterAll(async () => {
    await sequelize.close(); // Asegúrate de cerrar la conexión a la BD
    await server.close(); // Cierra el servidor de express
  });

  // Pruebas para POST /users
  describe('POST /users', () => {
    it('should create a new user', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'password123',
      };

      const response = await request(app)
        .post('/api/v1/users')
        .send(userData)
        .expect('Content-Type', /json/)
        .expect(201);

      expect(response.body.id).toBeTruthy();
      expect(response.body.email).toBe(userData.email);
    });
  });
});
