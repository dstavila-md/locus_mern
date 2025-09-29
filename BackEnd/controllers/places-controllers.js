const { validationResult } = require('express-validator');
const mongoose = require('mongoose');

const HttpError = require('../models/http-error');
const getCoordsForAddress = require('../utils/location');
const Place = require('../models/place');
const User = require('../models/user');

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

const getPlacesByUserId = async (req, res, next) => {
  const userId = req.params.userId;

  let mongoPlaces;
  try {
    mongoPlaces = await Place.find({ creator: userId }).exec();
    // mongoPlaces = await User.findById(userId).populate('places');
  } catch (error) {
    return next(
      new HttpError('Something went wrong, could not find places', 500)
    );
  }

  if (mongoPlaces && mongoPlaces.length > 0) {
    return res.json({
      places: mongoPlaces.map((place) => place.toObject({ getters: true })),
    });
  }

  return next(
    new HttpError('Could not find places for the provided user id', 404)
  );
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

  let user;
  try {
    user = await User.findById(creator).exec();
  } catch (err) {
    const error = new HttpError('Creating place failed, please try again', 500);
    return next(error);
  }
  if (user) {
    try {
      const session = await mongoose.startSession();
      session.startTransaction();
      await createdPlace.save({ session });
      user.places.push(createdPlace);
      await user.save({ session });
      await session.commitTransaction();
    } catch (err) {
      const error = new HttpError(
        'Creating place failed, please try again',
        500
      );
      return next(error);
    }

    res.status(201).json({ place: createdPlace });
  } else {
    return next(new HttpError('Could not find user for provided id', 404));
  }
};

const updatePlaceById = async (req, res, next) => {
  const placeId = req.params.placeId;
  const { title, description } = req.body;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);

    return next(
      new HttpError('Invalid inputs passed, please check your data.', 422)
    );
  }

  let place;
  try {
    place = await Place.findById(placeId).exec();
  } catch (error) {
    return next(
      new HttpError('Something went wrong, could not find a place', 500)
    );
  }

  if (!place) {
    return next(new HttpError('Could not find a place for that id', 404));
  }

  place.title = title;
  place.description = description;

  try {
    await place.save();
  } catch (error) {
    return next(
      new HttpError('Something went wrong, could not update place', 500)
    );
  }

  // Places.findByIdAndUpdate(placeId, { title, description}, { new: true, runValidators: true}

  res.status(200).json({ place: place.toObject({ getters: true }) });
};

const deletePlaceById = async (req, res, next) => {
  const placeId = req.params.placeId;

  let place;
  // let creatorId;
  try {
    place = await Place.findById(placeId).populate('creator').exec();
    // place = await Place.findById(placeId).exec();
  } catch (error) {
    return next(
      new HttpError('Something went wrong, could not delete place', 500)
    );
  }

  if (!place) {
    return next(new HttpError('Could not find place for this id', 404));
  }
  // creatorId = place.creator;
  creator = place.creator;

  try {
    const session = await mongoose.startSession();
    session.startTransaction();

    creator.places.pull(place);
    await creator.save({ session });

    // await User.findByIdAndUpdate(
    //   { _id: creatorId },
    //   { $pull: { places: placeId } },
    //   { session }
    // ).exec();
    // await Place.deleteOne({ _id: placeId }, { session }).exec();
    await place.deleteOne({ session });
    await session.commitTransaction();
  } catch (error) {
    console.log(error);
    return next(
      new HttpError('Something went wrong, could not delete place', 500)
    );
  }

  res.status(200).json({
    message: 'Place deleted',
  });
};

module.exports = {
  getPlaceById,
  getPlacesByUserId,
  createPlace,
  updatePlaceById,
  deletePlaceById,
};
