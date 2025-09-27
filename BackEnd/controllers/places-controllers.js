const { v4: uuidv4 } = require('uuid');
const { validationResult } = require('express-validator');

const HttpError = require('../models/http-error');
const getCoordsForAddress = require('../utils/location');
const Place = require('../models/place');

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

const getPlaceById = async (req, res, next) => {
  const placeId = req.params.placeId;

  let place;
  try {
    place = await Place.findById(placeId).exec();
  } catch (error) {
    return next(
      new HttpError('Something went wrong, could not find a place', 500)
    );
  }

  if (!place) {
    return next(
      new HttpError('Could not found a place for the provided place id', 404)
    );
  }

  return res.send({ place: place.toObject({ getters: true }) });
};

const getPlacesByUserId = (req, res, next) => {
  const userId = req.params.userId;
  const places = DUMMY_PLACES.filter((place) => place.creator === userId);
  if (places && places.length > 0) {
    return res.send({ places });
  }

  next(new HttpError('Could not find places for the provided user id', 404));
};

const createPlace = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError('Invalid inputs passed, please check your data.', 422)
    );
  }

  const { title, description, address, creator, image } = req.body;

  let coordinates;
  try {
    coordinates = await getCoordsForAddress(address);
  } catch (error) {
    return next(error);
  }

  const createdPlace = new Place({
    title,
    description,
    address,
    location: coordinates,
    image: image || 'https://picsum.photos/200',
    creator,
  });

  try {
    await createdPlace.save();
  } catch (error) {
    return next(error);
  }

  res.status(201).json({ place: createdPlace });
};

const updatePlaceById = (req, res, next) => {
  const placeId = req.params.placeId;
  const { title, description } = req.body;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);

    throw new HttpError('Invalid inputs passed, please check your data.', 422);
  }

  const updatedPlace = {
    ...DUMMY_PLACES.find((place) => place.id === placeId),
  };
  const placeIndex = DUMMY_PLACES.findIndex((place) => place.id === placeId);

  if (!placeIndex) {
    throw new HttpError('Invalid place id', 422);
  }

  updatedPlace.title = title;
  updatedPlace.description = description;
  DUMMY_PLACES[placeIndex] = updatedPlace;
  res.status(200).json({ place: updatedPlace });
};

const deletePlaceById = (req, res, next) => {
  const placeId = req.params.placeId;
  const placeIndex = DUMMY_PLACES.findIndex((place) => place.id === placeId);

  if (!placeIndex) {
    throw new HttpError('Could not find a place for that id', 422);
  }

  DUMMY_PLACES.splice(placeIndex, 1);
  res.status(200).json({ message: 'Place deleted' });
};

module.exports = {
  getPlaceById,
  getPlacesByUserId,
  createPlace,
  updatePlaceById,
  deletePlaceById,
};
