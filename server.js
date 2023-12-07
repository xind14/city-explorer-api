'use strict';

// Pull data from a file (this will eventually be an API call...)
// let suppliesList = require("./data/supplies.json");
// let foodList = require("./data/food.json");
// let weatherData = require('./data/weather.json');

// Use a library called "dotenv" to "read" my .env file
// this library lets us access our .env file
// And put all of the "key/value" pairs into an object called process.env
require('dotenv').config();

// Bring in the "express" library
const express = require('express');

// Bring in the "cors" library to let us have more open access to the server
// library that determines who is allowed to speak to our server
const cors = require('cors');
const axios =require('axios');
// Initialize my express application
// initalizes the express library
const app = express();

// Activate "cors"
// this settting says that everyone is allowed to speak to our server
app.use(cors());

// Should be in the "enviornment"
// we are getting the port variable from the .env file.
const PORT = process.env.PORT || 3000;

// Route Handler
// this is a route. if you turn the server on and go to http://localhost:3001/ (or whatever port you specified in your .env), you will see 'hello from the home route'
// "/" is the "route"
// (request, response) => {} is the handler callback
app.get('/', (request, response) => {
  let data = { message: 'Goodbye World' };
  response.json(data);
});

// Pretend we have an error ...
// e.g. tried to an API call and the API was not available
// or database didn't find the username
app.get('/broken', (request, response) => {
  throw new Error('Something is totally broken');
});


//chatgpt version

//http://localhost:3002/weather?latitude=47.6038321&longitude=-122.330062


class Forecast {
  constructor(date, description) {
    this.date = date;
    this.description = description;
  }
}

app.get('/weather', getWeatherFromApi);

async function getWeatherFromApi(request, response) {
  try {
    let lat = request.query.latitude;
    let lon = request.query.longitude;

    if (!lat || !lon) {
      return response.status(400).json({ error: 'Missing required parameters' });
    }

    let axiosResponse = await axios.get('https://api.weatherbit.io/v2.0/forecast/daily', {
      params: {
        key: process.env.WEATHER_API_KEY,
        lat: lat,
        lon: lon,
      },
    });

    let cityWeather = axiosResponse.data.data.map((day) => {
      return new Forecast(
        day.valid_date,
        `Low of ${day.low_temp}, high of ${day.max_temp} with ${day.weather.description}`
      );
    });
    console.log('City Weather:', cityWeather);
    response.json({
      city_name: axiosResponse.data.city_name, 
      latitude: axiosResponse.data.lat,
      longitude: axiosResponse.data.lon,
      forecast: cityWeather,
    });
  } catch (error) {
    console.error('Error fetching weather data:', error.message);
    response.status(500).json({ error: 'Internal server error' });
  }
}






app.get('*', (request, response) => {
  response.status(404).send('Page Not Avaiable');
});

// Error Handler - 4 parameters to the callback
// Express automatically calls this when an error is "Thrown"
app.use((error, request, response, next) => {
  response.status(500).send(error.message);
});

// Start up the web server
app.listen(PORT, () => console.log(`Listening on port ${PORT}`));


// 200 success
// 500 broken
// 404 not found
// 403 forbidden api wrong