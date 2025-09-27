const { v4: uuidv4 } = require('uuid');
const { validationResult } = require('express-validator');
const User = require('../models/user');

const HttpError = require('../models/http-error');
const user = require('../models/user');

const DUMMY_USERS = [
  {
    id: 'u1',
    name: 'Denis Stavila',
    email: 'test@test.com',
    password: 'testers',
  },
];

const getUsers = (req, res, next) => {
  res.status(200).json({ users: DUMMY_USERS });
};

const signup = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError('Invalid inputs passed, please check your data.', 422)
    );
  }

  const { name, email, password, image } = req.body;

  let userExists;
  try {
    userExists = await User.findOne({ email: email });
  } catch (error) {
    return next(
      new HttpError('Creating user failed, please try again later.', 500)
    );
  }

  if (userExists) {
    return next(
      new HttpError('User exists already, please login instead.', 422)
    );
  }

  let createdUser;
  try {
    createdUser = new User({
      name,
      email,
      password,
      image: image || 'https://picsum.photos/200',
      places: '[]',
    });
    await createdUser.save();
  } catch (error) {
    return next(
      new HttpError('Could not create user, please try again later.', 500)
    );
  }

  res.status(201).json({ user: createdUser.toObject({ getters: true }) });
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  const identifiedUser = DUMMY_USERS.find((user) => user.email === email);
  if (!identifiedUser || identifiedUser.password !== password) {
    throw new HttpError(
      'Could not identify user, credentials are invalid',
      401
    );
  }
  res.json({ message: 'Logged in !' });
};

module.exports = { getUsers, signup, login };
