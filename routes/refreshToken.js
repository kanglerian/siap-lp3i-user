const express = require('express');
const router = express.Router();
const Validator = require('fastest-validator');
const v = new Validator(); 

const { RefreshToken } = require('../models');

router.get('/', async (req, res) => {
  const token = await RefreshToken.findOne({
    where: {
      token: req.query.refresh_token
    }
  });
  if(!token){
    return res.status(400).json({
      status: 'error',
      message: 'invalid token'
    });
  }
  return res.json({
    status: 'success',
    token: token
  });
});

module.exports = router;
