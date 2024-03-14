const taskService = require('./task.service');
const { models } = require('../libs/sequelize');
const boom = require('@hapi/boom');
jest.mock('../libs/sequelize.js');

describe('Task service', () => {
  let service;
  const mockTaskData = {
    name: 'Book2s2',
    tema: 'Helmer.Leannon@gmail.com',
    initialDate: '2024-09-07T04:19:27.000Z',
    finalDate: '2024-12-06T05:06:14.000Z',
    complete: false,
    listId: 6,
    list: { userId: 6 },
  };
  const changes = { name: 'Book2s22', tema: 'Helmer.Leannon@gmail.com2' };
  const mockUserId = 6;
  beforeEach(() => {
    service = new taskService();
    models.List.create.mockResolvedValue(mockTaskData);
    models.List.findAll.mockResolvedValue([mockTaskData]);
    models.List.findByPk.mockResolvedValue(mockTaskData);
    models.List.prototype.update.mockResolvedValue(mockTaskData);
    models.List.prototype.destroy.mockResolvedValue(mockTaskData.id);
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new Task', async () => {
      const task = await service.create(mockTaskData);
      expect(task).toEqual(mockTaskData);
      expect(models.Task.create).toHaveBeenCalledWith(mockTaskData);
    });
  });

  describe('find and findAll', () => {
    it('should find all Task by userId', async () => {
      const tasks = await service.find(mockUserId);
      expect(tasks).toEqual([mockTaskData]);
      expect(tasks).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            list: expect.objectContaining({ userId: mockUserId }),
          }),
        ])
      );

      expect(models.Task.findAll).toHaveBeenCalledWith(
        expect.objectContaining({
          include: expect.arrayContaining([
            expect.objectContaining({
              model: models.List,
              as: 'list',
              where: { userId: mockUserId },
            }),
          ]),
        })
      );
    });

    it('should find a task by id and userId', async () => {
      const task = await service.findOne(mockTaskData.id, mockUserId);
      expect(task).toEqual(mockTaskData);
      expect(task.list.userId).toBe(mockUserId);
    });
    it('should throw an error if the task does not belong to the authenticated user', async () => {
      const wrongUserId = mockUserId + 1; // Un ID de usuario diferente al autenticado
      // Simular la tarea que se devuelve incluye un objeto 'list' con un 'userId' diferente
      models.Task.findByPk.mockResolvedValue({
        ...mockTaskData,
        list: { userId: wrongUserId },
      });

      // Intentar obtener la tarea y esperar que se lance un error
      await expect(
        service.findOne(mockTaskData.id, mockUserId)
      ).rejects.toThrow('Unauthorized');
    });
  });

  describe('update', () => {
    it('should update the task if the user is authorized', async () => {
      // Este mock representa el método update en la instancia del modelo Task
      const mockUpdate = jest
        .fn()
        .mockResolvedValue({ ...mockTaskData, ...changes });

      // Mock findByPk para devolver un objeto que incluya el método update mockeado
      models.Task.findByPk.mockResolvedValue({
        ...mockTaskData,
        list: { userId: mockUserId }, // Esto asegura que la tarea pertenece al usuario correcto
        update: mockUpdate, // Usamos la función mockeada aquí
      });

      // Llamar al método update con la id de la tarea, los cambios, y el userId correcto
      const updatedTask = await service.update(
        mockTaskData.id,
        changes,
        mockUserId
      );

      // Comprobar que se haya llamado al método update con los cambios correctos
      expect(mockUpdate).toHaveBeenCalledWith(changes);

      // Verificar que la tarea actualizada tiene el nuevo nombre
      expect(updatedTask.name).toBe(changes.name);
    });

    it('should throw an error if the task does not belong to the user', async () => {
      models.Task.findByPk.mockResolvedValue({
        ...mockTaskData,
        list: { userId: mockUserId + 1 }, // Simula un userID diferente al autorizado
        update: jest.fn(),
      });

      await expect(
        service.update(mockTaskData.id, changes, mockUserId)
      ).rejects.toThrow('Unauthorized');
    });
  });

  describe('delete', () => {
    it('should delete the task if the user is authorized', async () => {
      models.Task.findByPk.mockResolvedValue({
        ...mockTaskData,
        list: { userId: mockUserId },
        destroy: jest.fn().mockResolvedValue(true),
      });

      const result = await service.delete(mockTaskData.id, mockUserId);
      expect(result).toBe(mockTaskData.id);
      expect(models.Task.findByPk).toHaveBeenCalledWith(mockTaskData.id, {
        include: ['list'],
      });
    });

    it('should throw an error if the task does not belong to the user', async () => {
      models.Task.findByPk.mockResolvedValue({
        ...mockTaskData,
        list: { userId: mockUserId + 1 }, // Simula un userID diferente al autorizado
        destroy: jest.fn(),
      });

      await expect(service.delete(mockTaskData.id, mockUserId)).rejects.toThrow(
        'Unauthorized'
      );
    });

    it('should throw an error if the task is not found', async () => {
      models.Task.findByPk.mockResolvedValue(null);

      await expect(service.delete(mockTaskData.id, mockUserId)).rejects.toThrow(
        'Task not found'
      );
    });
  });
});
