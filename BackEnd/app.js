const epxress = require('express');
const bodyParser = require('body-parser');

const placesRoutes = require('./routes/places-routes');

const app = epxress();

app.use(placesRoutes);

app.listen(5000);
