const express = require('express');
const router = express.Router();
const Validator = require('fastest-validator');
const v = new Validator(); 

const { User, RefreshToken } = require('../models');

router.get('/', async (req, res) => {
  const data = await User.findAll({
    attributes: ['id','fullName','role','email','status']
  });
  return res.json({
    status: 'success',
    data: data
  });
});


router.get('/:id', async (req, res) => {
  const data = await User.findOne({
    where: {
      id: req.params.id
    },
    attributes: ['id','fullName','role','email','status']
  });
  if(!data){
    return res.status(404).json({
      status: 'error',
      message: 'user not found'
    });
  }
  return res.json({
    status: 'success',
    data: data
  });
});

router.post('/register', async (req, res) => {
  const schema = {
    fullName: 'string|empty:false',
    email: 'email|empty:false',
    password: 'string|min:6',
  }
  const validate =  v.validate(req.body, schema);
  if(validate.length){
    return res.status(9).json({
      status: 'error',
      message: validate
    });
  }
  const user = await User.findOne({
    where: {
      email: req.body.email
    }
  });
  if(user){
    return res.status(409).json({
      status: 'error',
      message: 'email already exist'
    });
  }
  const data = {
    fullName: req.body.fullName,
    role: 0,
    email: req.body.email,
    password: req.body.password,
    status: 0
  }
  const createdUser = await User.create(data);
  return res.json({
    status: 'success',
    data: {
      id: createdUser.id
    }
  });
});

router.post('/login', async (req, res) => {
  const schema = {
    email: 'email|empty:false',
    password: 'string|min:6',
  }
  const validate =  v.validate(req.body, schema);
  if(validate.length){
    return res.status(9).json({
      status: 'error',
      message: validate
    });
  }
  const user = await User.findOne({
    where: {
      email: req.body.email
    }
  });
  if(!user){
    return res.status(404).json({
      status: 'error',
      message: 'user not found'
    });
  }
  if(req.body.password != user.password){
    return res.status(404).json({
      status: 'error',
      message: 'wrong password'
    });
  }
  return res.json({
    status: 'success',
    data: {
      id: user.id,
      fullName: user.fullName,
      role: user.role,
      email: user.email,
      status: user.status,
    }
  });
});

router.patch('/update/:id', async (req, res) => {
  const schema = {
    fullName: 'string|empty:false',
    role: 'boolean|empty:false',
    email: 'email|empty:false',
    password: 'string|min:6',
    status: 'boolean|empty:false',
  }
  const validate =  v.validate(req.body, schema);
  if(validate.length){
    return res.status(9).json({
      status: 'error',
      message: validate
    });
  }
  const user = await User.findByPk(req.params.id);
  if(!user){
    return res.status(404).json({
      status: 'error',
      message: 'user not found'
    });
  }
  const email = req.body.email;
  if(email){
    const checkEmail = await User.findOne({
      where: {
        email: email
      }
    });
    if(checkEmail && email !== user.email){
      return res.status(409).json({
        status: 'error',
        message: 'email already exist'
      });
    }
    console.log();
  };
  await User.update(req.body,{
    where: {
      id: req.params.id
    }
  });
  return res.json({
    status: 'success',
    data: {
      id: user.id
    }
  });
});

router.delete('/logout', async(req, res) => {
  const user = await User.findByPk(req.body.user_id);
  if(!user){
    return res.status(404).json({
      status: 'error',
      message: 'user not found'
    });
  }
  await RefreshToken.destroy({
    where: {
      user_id: req.body.user_id
    }
  });
  return res.json({
    status: 'success',
    message: 'refresh token deleted'
  });
});

module.exports = router;
