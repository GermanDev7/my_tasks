const express = require('express');
const validatorHandler = require('../middlewares/validator.handler');
const userService = require('../services/user.service');
const {
  getUserSchema,
  updateUserSchema,
  changePasswordUser,
  createUserSchema,
} = require('../schemas/user.schema');
const service = new userService();

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const users = await service.find();
    res.json(users);
  } catch (error) {
    next(error);
  }
});

router.get(
  '/:id',
  validatorHandler(getUserSchema, 'params'),
  async (req, res, next) => {
    try {
      const user = await service.findOne(req.params.id);
      res.json(user);
    } catch (error) {
      next(error);
    }
  }
);

router.post(
  '/',
  validatorHandler(createUserSchema, 'body'),
  async (req, res, next) => {
    try {
      const user = await service.create(req.body);
      res.json(user);
    } catch (error) {
      next(error);
    }
  }
);

router.put(
  '/:id',
  validatorHandler(getUserSchema, 'params'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const userChange = await service.update(id, req.body);
      res.json(userChange);
    } catch (error) {
      next(error);
    }
  }
);

router.delete(
  '/:id',
  validatorHandler(getUserSchema, 'params'),
  async (req, res, next) => {
    try {
      const user = await service.findOne(req.params.id);
      const id = await user.destroy();
      res.json(id);
    } catch (error) {
      next(error);
    }
  }
);

router.put(
  '/:id/change-password',
  validatorHandler(getUserSchema, 'params'),
  validatorHandler(changePasswordUser, 'body'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const message = await service.changePassword(id, req.body);
      res.json(message);
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
