const express = require('express');

const {
  getPlaceById,
  getPlaceByUserId,
  createPlace,
  updatePlaceById,
  deletePlaceById,
} = require('../controllers/places-controllers');

// Base path ->  '/api/places'

const router = express.Router();

router.get('/:placeId', getPlaceById);

router.get('/user/:userId', getPlaceByUserId);

router.post('/', createPlace);

router.patch('/:placeId', updatePlaceById);

router.delete('/:placeId', deletePlaceById);

module.exports = router;
