const express = require('express');

const userRouter = require('./user.router');
const listRouter = require('./list.router');
const taskRouter = require('./task.router');
const authRouter = require('./auth.router');

function routerApi(app) {
  const router = express.Router();
  app.use('/api/v1', router);
  router.use('/auth', authRouter);
  router.use('/users', userRouter);
  router.use('/lists', listRouter);
  router.use('/tasks', taskRouter);

}

module.exports = routerApi;
