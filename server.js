'use strict';

// Pull data from a file (this will eventually be an API call...)
// let suppliesList = require("./data/supplies.json");
// let foodList = require("./data/food.json");
let weatherData = require('./data/weather.json');

// Use a library called "dotenv" to "read" my .env file
// this library lets us access our .env file
// And put all of the "key/value" pairs into an object called process.env
require('dotenv').config();

// Bring in the "express" library
const express = require('express');

// Bring in the "cors" library to let us have more open access to the server
// library that determines who is allowed to speak to our server
const cors = require('cors');

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

// http://localhost:5176?type=weatherData

// app.get('/weather', (request, response) => {
//   let type = request.query.type;
//   if (weatherData[type]) {
//     response.json(weatherData[type]);
//   } else {
//     throw new Error("No Such Weather");
//   }
// });

//initial version
// app.get('/weather', (request, response) => {
//   let userLat = request.query.latitude;
//   let userLon = request.query.longitude;

//   if (userLat && userLon) {
//     const cityData = weatherData.find(city => city.lat === userLat && city.lon === userLon);

//     if (cityData) {
//       response.json(cityData);
//     } else {
//       throw new Error("No Such Weather");
//     }
//   }
// });

//chatgpt version

//http://localhost:3002/weather?latitude=47.6038321&longitude=-122.330062

class Forecast {
  constructor(date, description) {
    this.date = date;
    this.description = description;
  }
}

app.get('/weather', (request, response) => {
  let inputCity = request.query.searchQuery;

  if (inputCity) {
    // Search by city name
    inputCity = inputCity.toLowerCase();
    let cityData = weatherData.find((city) => city.city_name.toLowerCase() === inputCity);

    if (cityData) {
      console.log('cityData', cityData);

      let cityWeather = cityData.data.map((day) => {
        return new Forecast(
          day.valid_date,
          `Low of ${day.low_temp}, high of ${day.max_temp} with ${day.weather.description}`
        );
      });

      console.log('City weather:', cityWeather);

      // Include latitude and longitude in the response
      response.json({
        city_name: cityData.city_name,
        latitude: cityData.lat,
        longitude: cityData.lon,
        forecast: cityWeather
      });
    } else {
      console.log('City not found in the dataset');
      response.status(404).json({ error: 'City not found in the dataset' });
    }
  } else {
    throw new Error('cityName is a required parameter');
  }
});






// app.get('/weather', (request, response) => {
//   let lat = request.query.latitude;
//   let lon = request.query.longitude;

  // console.log("Request:", request);
  // console.log("userLat:", userLat);
  // console.log("userLon:", userLon);

  // if (lat && lon) {
  //   let cityData = weatherData.find(
  //     (city) => city.lat === lat && city.lon === lon
  //   );

  //   console.log('cityData', cityData.data);

  //   if (cityData) {
  //     console.log('cityData', cityData.data);
  //     let cityWeather = cityData.data.map((day) => {
  //       // let cityForecast = day.weather;
  //       return new Forecast(
  //         day.valid_date,
  //         `Low of ${day.low_temp}, high of ${day.max_temp} with ${day.weather.description}`
  //       );
  //     });

      // console.log("City data found:", cityData.city_name);
      // response.json(cityData.data[0]);

      // let cityForecast = cityWeather.map(
      //   (day) => new Forecast(day.valid_date, day.weather.description)
      // );

//       console.log('City weather:', cityWeather);
//       response.json(cityWeather);
//     } else {
//       // If cityData is not found, handle the error gracefully
//       console.log('City data not found');
//       response.status(404).json({ error: 'City data not found' });
//     }
//   } else {
//     throw new Error('Both latitude and longitude are required parameters');
//   }
// });

// app.get("/weather", (request, response) => {
//   let userLat = request.query.latitude;
//   let userLon = request.query.longitude;
//     let cityWeather= cityData.data;
//     console.log("cityData", cityData.data);

//   console.log("Request:", request);
//   console.log("userLat:", userLat);
//   console.log("userLon:", userLon);

//   if (userLat && userLon) {
//     const cityData = weatherData.find(
//       (city) => city.lat === userLat && city.lon === userLon
//     );

//     if (cityData) {
//             console.log("City data found:", cityData.city_name);

//       let cityName = cityData.city_name
//       response.json(cityData.data[0]);
//        let cityWeather = cityData.data.map(
//         (day) => new Forecast(day.valid_date, day.weather.description)
//       );
//       console.log("Mapped city weather:", cityWeather);
//     } else {
//       console.log("No city data found");
//       throw new Error("No Such Weather");
//     }
//   } else {
//     console.log("Latitude or longitude missing");
//     throw new Error("Both latitude and longitude are required parameters");
//   }
// });

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
