const express = require('express');

const router = express.Router();

router.get('/login', async (req, res, next) => {
  try {
    res.json('login');
  } catch (error) {
    next(error);
  }
});

module.exports=router
