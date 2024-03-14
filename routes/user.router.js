const express = require('express');
const validatorHandler = require('../middlewares/validator.handler');
const userService = require('../services/user.service');
const {
  getUserSchema,
  updateUserSchema,
  changePasswordUser,
  createUserSchema,
} = require('../schemas/user.schema');
const passport = require('passport');
const service = new userService();
const { checkRoles } = require('../middlewares/auth.handler');

const router = express.Router();

router.get(
  '/',
  passport.authenticate('jwt', { session: false }),
  checkRoles('admin'),
  async (req, res, next) => {
    try {
      const users = await service.find();
      res.json(users);
    } catch (error) {
      next(error);
    }
  }
);

router.get(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  validatorHandler(getUserSchema, 'params'),
  async (req, res, next) => {
    try {
      const user = await service.findOne(req.params.id, req.user.sub);
      res.json(user);
    } catch (error) {
      next(error);
    }
  }
);

router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
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
  passport.authenticate('jwt', { session: false }),
  validatorHandler(getUserSchema, 'params'),
  validatorHandler(updateUserSchema, 'body'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const userChange = await service.update(id, req.body, req.user.sub);
      res.json(userChange);
    } catch (error) {
      next(error);
    }
  }
);

router.delete(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  validatorHandler(getUserSchema, 'params'),
  async (req, res, next) => {
    try {
      const idUser = await service.delete(req.params.id, req.user.sub);

      res.json({ message: 'User deleted succesfully', id: idUser });
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
