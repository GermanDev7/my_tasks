const express = require('express');
const taskService = require('../services/task.service');
const service = new taskService();
const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const tasks = await service.find();
    res.json(tasks);
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const task = await service.findOne(id);

    res.json(task);
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const task = await service.create(req.body);
    res.json(task);
  } catch (error) {
    next(error);
  }
});

router.put('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const taskChange = await service.update(id, req.body);
    res.json(taskChange);
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const idDeleted = await service.delete(id);
    res.json(idDeleted);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
