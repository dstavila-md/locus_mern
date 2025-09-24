const express = require('express');
const { check } = require('express-validator');

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

router.post(
  '/',
  [
    check('title').not().isEmpty(),
    check('description').isLength({ min: 5 }, check('address').not().isEmpty()),
  ],
  createPlace
);

router.patch('/:placeId', updatePlaceById);

router.delete('/:placeId', deletePlaceById);

module.exports = router;
