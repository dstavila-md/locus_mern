const jwt = require('jsonwebtoken');

const HttpError = require('../models/http-error');
const { jwtSecret: JWT_SECRET } = require('../utils/keys');

module.exports = (req, res, next) => {
  if (req.method === 'OPTIONS') {
    return next();
  }

  const bearerToken = req.headers.authorization; // Authorization: Bearer <token>
  if (!bearerToken) {
    return next(new HttpError('Authentication failed!', 401));
  }

  let token;
  try {
    token = bearerToken.split(' ')[1]; // ['Bearer', '<token>']
  } catch (error) {
    return next(new HttpError('Authentication failed!', 401));
  }

  let decodedToken;
  try {
    decodedToken = jwt.verify(token, JWT_SECRET);
    req.userData = { userId: decodedToken.userId };
    next();
  } catch (error) {
    console.log(error);
    return next(new HttpError('Authentication failed!', 401));
  }
};
