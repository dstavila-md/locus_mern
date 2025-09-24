const express = require('express');

const { getUsers, signup, login } = require('../controllers/users-controllers');

// Base path ->  '/api/users'

const router = express.Router();

router.get('/', getUsers);
router.post('/login', login);
router.post('/signup', signup);

module.exports = router;
