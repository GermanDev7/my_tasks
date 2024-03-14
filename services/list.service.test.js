const listService = require('./list.service');
const { models } = require('./../libs/sequelize');
const boom = require('@hapi/boom');
jest.mock('./../libs/sequelize');

describe('List Service', () => {
  let service;
  const mockListData = { id: 1, name: 'Test List', userId: 1, tasks: [] };
  const mockUserId = 1;
  const changes = { name: 'Updated Test List' };

  beforeEach(() => {
    service = new listService();
    models.List.create.mockResolvedValue(mockListData);
    models.List.findAll.mockResolvedValue([mockListData]);
    models.List.findByPk.mockResolvedValue(mockListData);
    models.List.prototype.update.mockResolvedValue(mockListData);
    models.List.prototype.destroy.mockResolvedValue(mockListData.id);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create a new list', async () => {
    const list = await service.create(mockListData);
    expect(list).toEqual(mockListData);
    expect(models.List.create).toHaveBeenCalledWith(mockListData);
  });

  it('should find all lists', async () => {
    const lists = await service.find();
    expect(lists).toEqual([mockListData]);
  });

  it('should find a list by id and userId', async () => {
    const list = await service.findOne(mockListData.id, mockUserId);
    expect(list).toEqual(mockListData);
  });

  it('should not find a list with wrong userId', async () => {
    try {
      await service.findOne(mockListData.id, 999);
    } catch (e) {
      expect(e).toBeInstanceOf(boom.Boom);
    }
  });

  it('should update a list if userId matches', async () => {
    // Mock findByPk to return an object that resembles a list with a matching userId
    const mockUpdate = jest.fn().mockImplementation((changes) => {
      return Promise.resolve({ ...mockListData, ...changes });
    });
    models.List.findByPk.mockResolvedValue({
      ...mockListData,
      update: mockUpdate, // Mock the update method directly
    });

    // Call the update method with the id of the list, changes, and the correct userId
    await service.update(mockListData.id, changes, mockUserId);

    // Check that the update method was called with the changes
    expect(mockUpdate).toHaveBeenCalledWith(changes);

    // Retrieve the updated list again to check the new name
    const updatedList = await service.update(mockListData.id, changes, mockUserId);
    expect(updatedList.name).toBe(changes.name);
  });

  // Corrección en las pruebas para el método 'delete'
  it('should delete a list', async () => {
    // Simula una instancia de lista con los métodos correspondientes
    const mockListInstance = {
      ...mockListData,
      destroy: jest.fn().mockResolvedValue(true),
    };
    models.List.findByPk.mockResolvedValue(mockListInstance);

    // Llama al método 'delete' con el id de la lista y el userId
    const id = await service.delete(mockListData.id, mockUserId);

    // Verifica que se llamó al método 'destroy' en la instancia
    expect(mockListInstance.destroy).toHaveBeenCalled();
    expect(id).toEqual(mockListData.id);
  });

  it('should not create a list with invalid data', async () => {
    const invalidData = { name: '' }; // Suponiendo que el nombre es requerido
    models.List.create.mockRejectedValue(new Error('Invalid data'));

    await expect(service.create(invalidData)).rejects.toThrow('Invalid data');
  });

  it('should not allow to update a list if userId does not match', async () => {
    const notOwnerUserId = 999;
    models.List.findByPk.mockResolvedValue({
      ...mockListData,
      userId: mockUserId, // El dueño real de la lista
    });

    await expect(service.update(mockListData.id, changes, notOwnerUserId)).rejects.toThrow('Unauthorized');
  });

  it('should throw an error if trying to delete a non-existing list', async () => {
    models.List.findByPk.mockResolvedValue(null);

    await expect(service.delete(mockListData.id, mockUserId)).rejects.toThrow('List not found');
  });


});
