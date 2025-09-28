const epxress = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const HttpError = require('./models/http-error');
const placesRoutes = require('./routes/places-routes');
const userRoutes = require('./routes/users-routes');

const { mongoURI: MONGO_URI } = require('./utils/keys');

const app = epxress();

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Content-Type, Accept, Origin, X-Requested-With, Authorization'
  );
  next();
});

app.use('/api/places', placesRoutes);
app.use('/api/users', userRoutes);

app.use((req, res, next) => {
  const error = new HttpError('Could not find this route.', 404);
  throw error;
});

app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }

  res.status(error.code || 500);
  res.json({ message: error.message || 'An unknown error occured.' });
});

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('Connection successful - starting the server');
    app.listen(5000);
  })
  .catch((err) => console.log(err));
