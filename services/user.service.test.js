const userService = require('./user.service');
const { models } = require('../libs/sequelize');
const boom = require('@hapi/boom');
jest.mock('../libs/sequelize.js');

describe('User service', () => {
  let service;
  const mockUserData = {
    id: 1,
    email: 'test@example.com',
    password: 'hashedPassword',
    lists: [],
  };
  const changes = { email: 'nosd@gmail.com', role: 'admin' };
  const mockUserId = 1;

  beforeEach(() => {
    service = new userService();
    models.User.create.mockResolvedValue(mockUserData);
    models.User.findAll.mockResolvedValue([mockUserData]);
    models.User.findByPk.mockResolvedValue(mockUserData);
    models.User.prototype.update.mockResolvedValue(mockUserData);
    models.User.prototype.destroy.mockResolvedValue(mockUserData.id);
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('creates a new user with hashed password', async () => {
      const mockedUser = {
        dataValues: {
          ...mockUserData,
          password: 'hashedPassword',
        },
      };

      // Hacer que el mock de models.User.create devuelva el objeto simulado
      models.User.create.mockResolvedValue(mockedUser);

      // Llamar al método create y pasar los datos del nuevo usuario
      const newUser = {
        email: 'test@example.com',
        password: 'password123',
      };
      const createdUser = await service.create(newUser);

      // Verificar que se llamó al método models.User.create con los datos correctos
      expect(models.User.create).toHaveBeenCalledWith({
        ...newUser,
        password: expect.any(String),
      });

      // Verificar que el password no esté presente en los dataValues del objeto devuelto
      expect(createdUser.password).toBeUndefined();
    });
  });
  describe('find and find all', () => {
    it('should return all users with their lists', async () => {
      const users = await service.find();

      // Verificar que se obtiene el array de usuarios simulado
      expect(users).toEqual([mockUserData]);

      // Verificar que se llamó al método models.User.findAll
      expect(models.User.findAll).toHaveBeenCalledWith({
        include: ['lists'],
      });
    });
    it('should return a specific user with their lists if userId matches', async () => {
      const user = await service.findOne(mockUserData.id, mockUserId);
      expect(user).toEqual(mockUserData);
    });

    it('should throw an unauthorized error if the userId does not match', async () => {

      const wrongUserId = 2;

      // Llamando al método findOne con un id que no coincide con el id del usuario autenticado
      await expect(service.findOne(mockUserId, wrongUserId)).rejects.toThrow(
        'Unauthorized'
      );
    });

    it('should throw an error if user is not found', async () => {
      // Hacer que el mock de models.User.findByPk devuelva null
      models.User.findByPk.mockResolvedValue(null);

      // Llamar al método findOne y esperar que falle
      await expect(service.findOne(999)).rejects.toThrow('User not found');
    });
  });
  describe('update', () => {
    it('should update a user if userId matches', async () => {
      const mockUpdate = jest
      .fn()
      .mockResolvedValue({ ...mockUserData, ...changes });

    // Mock findByPk para devolver un objeto que incluya el método update mockeado
    models.User.findByPk.mockResolvedValue({
      ...mockUserData,
      list: { userId: mockUserId }, // Esto asegura que la tarea pertenece al usuario correcto
      update: mockUpdate, // Usamos la función mockeada aquí
    });

    // Llamar al método update con la id de la tarea, los cambios, y el userId correcto
    const updatedUser = await service.update(
      mockUserData.id,
      changes,
      mockUserId
    );

    // Comprobar que se haya llamado al método update con los cambios correctos
    expect(mockUpdate).toHaveBeenCalledWith(changes);
    // Verificar que la tarea actualizada tiene el nuevo nombre
    expect(updatedUser.email).toBe(changes.email);
    });

    it('should not update a user if userId does not match', async () => {

      models.User.findByPk.mockResolvedValue({
        ...mockUserData,
        id: mockUserId + 1 , // Simula un userID diferente al autorizado
        update: jest.fn(),
      });

      await expect(
        service.update(mockUserData.id, changes, mockUserId)
      ).rejects.toThrow('Unauthorized');
    });

  });
  describe('delete', () => {
    it('should delete a user if userId matches', async () => {
      models.User.findByPk.mockResolvedValue({
        ...mockUserData,
        destroy: jest.fn().mockResolvedValue(true),
      });

      const result = await service.delete(mockUserData.id, mockUserId);
      expect(result).toEqual({
        message: 'User deleted succesfully',
        id: mockUserId,
      });

    });

    it('should not delete a user if userId does not match', async () => {
      const mockUserId = 1;
      const wrongUserId = 2;
      models.User.findByPk.mockResolvedValue({
        ...mockUserData,
        destroy: jest.fn().mockResolvedValue(true),
      });
      // Configurar findByPk para devolver un usuario simulado
      models.User.findByPk.mockResolvedValue(mockUserData);

      // Intentar eliminar y esperar que se lance una excepción
      await expect(service.delete(mockUserId, wrongUserId)).rejects.toThrow(
        'Unauthorized'
      );
    });
  });
});
