"use strict";

//chatgpt version
//test link
//http://localhost:3002/weather?latitude=47.6038321&longitude=-122.330062

//3rd party dependencies
const axios = require("axios");

//internal dependencies
const Weather = require("../data-models/Weather.js");

//actual route handlers
async function handleWeather(request, response) {
  try {
    let lat = request.query.latitude;
    let lon = request.query.longitude;

    if (!lat || !lon) {
      return response
        .status(400)
        .json({ error: "Missing required parameters" });
    }

    let weatherResponse = await axios.get(
      `https://api.weatherbit.io/v2.0/forecast/daily`,
      {
        params: {
          key: process.env.WEATHER_API_KEY,
          lat: lat,
          lon: lon,
        },
      }
    );

    let cityWeather = weatherResponse.data.data.map((day) => {
      return new Weather(
        day.valid_date,
        `Low of ${day.low_temp}, high of ${day.max_temp} with ${day.weather.description}`
      );
    });
    console.log("City Weather:", cityWeather);
    response.json({
      city_name: weatherResponse.data.city_name,
      latitude: weatherResponse.data.lat,
      longitude: weatherResponse.data.lon,
      forecast: cityWeather,
    });
  } catch (error) {
    console.error("Error fetching weather data:", error.message);
    response.status(500).json({ error: "Internal server error" });
  }
}

module.exports = handleWeather;
