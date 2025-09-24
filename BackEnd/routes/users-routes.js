const express = require('express');
const { check } = require('express-validator');

const { getUsers, signup, login } = require('../controllers/users-controllers');

// Base path ->  '/api/users'

const router = express.Router();

router.get('/', getUsers);
router.post('/login', [check('email').normalizeEmail()], login);
router.post(
  '/signup',
  [
    check('name').not().isEmpty(),
    check('email').normalizeEmail().isEmail(),
    check('password').isLength({ min: 6 }),
  ],
  signup
);

module.exports = router;
