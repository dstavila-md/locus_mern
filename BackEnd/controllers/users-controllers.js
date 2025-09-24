const { v4: uuidv4 } = require('uuid');

const HttpError = require('../models/http-error');

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

const signup = (req, res, next) => {
  const { name, email, password } = req.body;

  const userExists = DUMMY_USERS.find((user) => user.email === email);
  if (!userExists) {
    const createdUser = { id: uuidv4(), name, email, password };

    DUMMY_USERS.push(createdUser);

    res.status(201).json({ user: createdUser });
  } else {
    throw new HttpError('Could not create user, email already exists', 422);
  }
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
