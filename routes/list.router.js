const express = require('express');
const listService = require('../services/list.service');
const service = new listService();
const router = express.Router();
const boom = require('@hapi/boom');
const validatorHandler = require('../middlewares/validator.handler');
const {
  getListSchema,
  createListSchema,
  updateListSchema,
} = require('../schemas/list.schema');
const passport = require('passport');
const { checkRoles } = require('../middlewares/auth.handler');

router.get(
  '/',
  passport.authenticate('jwt', { session: false }),
  checkRoles('admin', 'user'),
  async (req, res, next) => {
    try {
      const lists = await service.find(req.user.sub);
      res.json(lists);
    } catch (error) {
      next(error);
    }
  }
);

router.get(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  checkRoles('admin', 'user'),
  validatorHandler(getListSchema, 'params'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const list = await service.findOne(id, req.user.sub);
      res.json(list);
    } catch (error) {
      next(error);
    }
  }
);

router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  checkRoles('admin', 'user'),
  validatorHandler(createListSchema, 'body'),
  async (req, res, next) => {
    try {
      if (req.body.userId !== req.user.sub) {
        throw boom.unauthorized();
      }
      const newList = await service.create(req.body);
      res.json(newList);
    } catch (error) {
      next(error);
    }
  }
);

router.put(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  checkRoles('admin', 'user'),
  validatorHandler(getListSchema, 'params'),
  validatorHandler(updateListSchema, 'body'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const listChange = await service.update(id, req.body, req.user.sub);
      res.json(listChange);
    } catch (error) {
      next(error);
    }
  }
);

router.delete(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  checkRoles('admin', 'user'),
  validatorHandler(getListSchema, 'params'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const idDeleted = service.delete(id, req.user.sub);
      res.json(idDeleted);
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
