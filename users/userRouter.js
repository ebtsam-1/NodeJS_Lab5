const express = require('express');
const UserModel = require('./UserModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const router = express.Router();

const auth = require('../middlewares/auth');

const util = require('util')

router.use((req, res, next) => {
  console.log("in users router");
  next();
});

router.get('/', async (req, res) => {
  const users = await UserModel.find();
  res.json(users);
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const user = await UserModel.findById(id);
    res.json(user);
  } catch (error) {
    error.code = 'Database_Error';
    next(error);
  }
});

// [1] Adding user with hashed passwor => look in userschema for the hook


router.post('/', async (req, res, next) => {
  const { username, age, password } = req.body;

  try {

    const addedUser = await UserModel.create({ username, age, password });
    res.json(addedUser);
  } catch (error) {
    error.code = 'SERVER_ERROR';
    next(error);
  };
});

// [2] login 

router.post('/login', async (req, res, next) => {
  const { username, password } = req.body;

  try {

    const user = await UserModel.findOne({ username });
    if (!user) {
      const err = new Error('Wrong user or password');
      err.statusCode = 401;
      throw err;
    }

    const correctPassword = await bcrypt.compare(password, user.password);
    if (!correctPassword) {
      const err = new Error('Wrong user or password');
      err.statusCode = 401;
      throw err;
    }

    const signAsync = util.promisify(jwt.sign);

    const secretKey = "my_secret_key";

    const token = await signAsync({ id: user.id, isAdmin: false }, secretKey)
    res.json({ token });

  } catch (error) {
    next(error);
  }
})
module.exports = router;

// [3] edit in user with jwt auth => pls check the auth.js file

router.patch('/:id', auth, async (req, res)=>{
  const {id} = req.params;
  const { age, username, password} = req.body;
  console.log(age,password);
  
  const saltRounds = 10;
  
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  await UserModel.findByIdAndUpdate(id, { username, age , hashedPassword });
  res.json({ success: true });
});

