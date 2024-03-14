const express = require('express');
const taskService = require('../services/task.service');
const service = new taskService();
const router = express.Router();
const {
  getTaskSchema,
  updateTaskSchema,
  createTaskSchema,
} = require('../schemas/task.schema');
const validatorHandler = require('../middlewares/validator.handler');
const boom = require('@hapi/boom');
const passport = require('passport');
const { checkRoles } = require('../middlewares/auth.handler');

router.get(
  '/',
  passport.authenticate('jwt',{ session: false }),
  checkRoles('user', 'admin'),
  async (req, res, next) => {
    try {
      const tasks = await service.find(req.user.sub);
      res.json(tasks);
    } catch (error) {
      next(error);
    }
  }
);

router.get(
  '/:id',
  passport.authenticate('jwt',{ session: false }),
  checkRoles('user', 'admin'),
  validatorHandler(getTaskSchema, 'params'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const task = await service.findOne(id, req.user.sub);
      res.json(task);
    } catch (error) {
      next(error);
    }
  }
);

router.post(
  '/',
  passport.authenticate('jwt',{ session: false }),
  checkRoles('user', 'admin'),
  validatorHandler(createTaskSchema, 'body'),
  async (req, res, next) => {
    try {
      const task = await service.create(req.body, req.user.sub);
      res.json(task);
    } catch (error) {
      next(error);
    }
  }
);

router.put(
  '/:id',
  passport.authenticate('jwt',{ session: false }),
  checkRoles('user', 'admin'),
  validatorHandler(getTaskSchema, 'params'),
  validatorHandler(updateTaskSchema, 'body'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const taskChange = await service.update(id, req.body, req.user.sub);
      res.json(taskChange);
    } catch (error) {
      next(error);
    }
  }
);

router.delete(
  '/:id',
  passport.authenticate('jwt',{ session: false }),
  checkRoles('user', 'admin'),
  validatorHandler(getTaskSchema, 'params'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const idDeleted = await service.delete(id, req.user.sub);
      res.json(idDeleted);
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
