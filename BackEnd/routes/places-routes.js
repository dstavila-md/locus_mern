const express = require('express');

const router = express.Router();

const DUMMY_PLACES = [
  {
    id: 'p1',
    title: 'Empire State Building',
    description: 'One of the most famous places in the world',
    location: {
      lat: 40.7484474,
      lng: -73.9871516,
    },
    address: '20 W 34th St, New York, NY 10001',
    creator: 'u1',
  },
];

router.get('/:placeId', (req, res, next) => {
  const placeId = req.params.placeId;
  const place = DUMMY_PLACES.find((place) => place.id === placeId);
  if (place) {
    return res.send({ place });
  }

  const error = new Error('Could not found a place for the provided place id');
  error.code = 404;
  next(error);
});

router.get('/user/:userId', (req, res, next) => {
  const userId = req.params.userId;
  console.log(userId);
  const place = DUMMY_PLACES.find((place) => place.creator === userId);
  if (place) {
    return res.send({ place });
  }

  const error = new Error('Could not find a place for the provided user id');
  error.code = 404;
  next(error);
});

module.exports = router;
