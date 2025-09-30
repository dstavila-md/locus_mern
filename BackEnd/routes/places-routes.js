const express = require('express');
const { check } = require('express-validator');

const checkAuth = require('../middleware/check-auth');
const fileUpload = require('../middleware/file-upload');

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

router.use(checkAuth);

router.post(
  '/',
  fileUpload.single('image'),
  [
    check('title').not().isEmpty(),
    check('description').isLength({ min: 5 }, check('address').not().isEmpty()),
  ],
  createPlace
);

router.patch(
  '/:placeId',
  [
    check('title').not().isEmpty(),
    check('description').isLength({ min: 5 }, check('address').not().isEmpty()),
  ],
  updatePlaceById
);

router.delete('/:placeId', deletePlaceById);

module.exports = router;
