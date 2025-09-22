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

router.get('/', (req, res, next) => {
  console.log('GET Request in Places');
  res.json({ message: 'It works!' });
});

router.get('/:placeId', (req, res, next) => {
  const placeId = req.params.placeId;
  const place = DUMMY_PLACES.find((place) => place.id === placeId);
  if (place) {
    res.send({ place });
  } else {
    res.status(404).send({ place: 'Not found' });
  }
});

router.get('/user/:userId', (req, res, next) => {
  const userId = req.params.userId;
  console.log(userId);
  const place = DUMMY_PLACES.find((place) => place.creator === userId);
  if (place) {
    res.send({ place });
  } else {
    res.status(404).send({ place: 'Not found' });
  }
});

module.exports = router;
