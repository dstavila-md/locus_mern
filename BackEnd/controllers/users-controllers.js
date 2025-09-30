const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');

const User = require('../models/user');
const HttpError = require('../models/http-error');

const getUsers = async (req, res, next) => {
  let users;
  try {
    users = await User.find({}, ' -password');
  } catch (error) {
    return next(
      new HttpError('Fetching users failed, please try again later.', 500)
    );
  }

  res
    .status(200)
    .json({ users: users.map((user) => user.toObject({ getters: true })) });
};

const signup = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError('Invalid inputs passed, please check your data.', 422)
    );
  }

  const { name, email, password } = req.body;

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

  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(password, 12);
  } catch (error) {
    console.log(error);
    return next(new HttpError('Could not create user, please try again.', 500));
  }

  let createdUser;
  try {
    createdUser = new User({
      name,
      email,
      password: hashedPassword,
      image: req.file.path,
      places: [],
    });
    await createdUser.save();
  } catch (error) {
    return next(
      new HttpError('Could not create user, please try again later.', 500)
    );
  }

  res.status(201).json({ user: createdUser.toObject({ getters: true }) });
};

const login = async (req, res, next) => {
  const { email, password } = req.body;
  let identifiedUser;

  try {
    identifiedUser = await User.findOne({ email: email });
  } catch (error) {
    return next(
      new HttpError('Could not log you in, please try again later.', 500)
    );
  }

  if (!identifiedUser) {
    return next(
      new HttpError('Invalid credentials, could not log you in.', 401)
    );
  }

  let isValidPassword = false;
  try {
    isValidPassword = await bcrypt.compare(password, identifiedUser.password);
  } catch (error) {
    console.log(error);
    return next(new HttpError('Could not log you in, please try again.', 500));
  }

  if (!isValidPassword) {
    return next(
      new HttpError('Invalid credentials, could not log you in.', 401)
    );
  }

  res.json({
    message: 'Logged in !',
    user: identifiedUser.toObject({ getters: true }),
  });
};

module.exports = { getUsers, signup, login };
