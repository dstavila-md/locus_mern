const express = require('express');

const {
  getPlaceById,
  getPlacesByUserId,
  createPlace,
  updatePlaceById,
  deletePlaceById,
} = require('../controllers/places-controllers');

// Base path ->  '/api/places'

const router = express.Router();

router.get('/:placeId', getPlaceById);

router.get('/user/:userId', getPlacesByUserId);

router.post('/', createPlace);

router.patch('/:placeId', updatePlaceById);

router.delete('/:placeId', deletePlaceById);

module.exports = router;
