const express = require('express');
const listService = require('../services/list.service');
const service = new listService();
const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const lists = await service.find();
    res.json(lists);
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const list = await service.findOne(id);
    res.json(list);
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const newList = await service.create(req.body);
    res.json(newList);
  } catch (error) {
    next(error);
  }
});

router.put('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const listChange = await service.update(id, req.body);
    res.json(listChange);
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const idDeleted = service.delete(id);
    res.json(idDeleted);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
