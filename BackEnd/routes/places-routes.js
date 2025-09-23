const express = require('express');

const {
  getPlaceById,
  getPlaceByUserId,
  createPlace,
} = require('../controllers/places-controllers');

const router = express.Router();

router.get('/:placeId', getPlaceById);

router.get('/user/:userId', getPlaceByUserId);

router.post('/', createPlace);

module.exports = router;
