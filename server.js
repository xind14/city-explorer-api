'use strict';

//3rd party dependencies
require('dotenv').config();
const PORT = process.env.PORT || 3000;

//internal dependencies
const express = require('express');
const cors = require('cors');
const handleWeather = require('./handlers/weather');
const handleMovies = require('./handlers/movies');

//app initializer
const app = express();


//middleware
app.use(cors());

//route handlers
app.get('/', handleHomePage);

app.get('/weather', handleWeather);
app.get('/movies', handleMovies);
app.get('*', handleNotFound);
app.use(errorHandler);

// handler functions

function handleHomePage(request, response) {
  response.status(200).send('Welcome Home');
}
function handleNotFound(request, response) {
  response.status(404).send('Page Not Available');
}
function errorHandler(error, request, response, next) {
  response.status(500).send('An error occurred');
}

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
