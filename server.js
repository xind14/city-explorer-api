"use strict";

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const axios = require("axios");
const app = express();
const PORT = process.env.PORT || 3000;



app.use(cors());

app.get("/", (request, response) => {
  let data = { message: "Goodbye World" };
  response.json(data);
});

app.get("/broken", (request, response) => {
  throw new Error("Something is totally broken");
});

//chatgpt version

//http://localhost:3002/weather?latitude=47.6038321&longitude=-122.330062

class Forecast {
  constructor(date, description) {
    this.date = date;
    this.description = description;
  }
}

app.get("/weather", getWeatherFromApi);

async function getWeatherFromApi(request, response) {
  try {
    let lat = request.query.latitude;
    let lon = request.query.longitude;

    if (!lat || !lon) {
      return response
        .status(400)
        .json({ error: "Missing required parameters" });
    }

    let axiosResponse = await axios.get(
      `https://api.weatherbit.io/v2.0/forecast/daily`,
      {
        params: {
          key: process.env.WEATHER_API_KEY,
          lat: lat,
          lon: lon,
          // day: 7,
        },
      }
    );

    let cityWeather = axiosResponse.data.data.map((day) => {
      return new Forecast(
        day.valid_date,
        `Low of ${day.low_temp}, high of ${day.max_temp} with ${day.weather.description}`
      );
    });
    console.log("City Weather:", cityWeather);
    response.json({
      city_name: axiosResponse.data.city_name,
      latitude: axiosResponse.data.lat,
      longitude: axiosResponse.data.lon,
      forecast: cityWeather,
    });
  } catch (error) {
    console.error("Error fetching weather data:", error.message);
    response.status(500).json({ error: "Internal server error" });
  }
}




class Movie {
  constructor(
    title, overview, vote_average, vote_count, poster_path, popularity, release_date
  ) {
    this.title = title;
    this.overview = overview;
    this.averageVotes = vote_average;
    this.totalVotes = vote_count;
    this.image_url = poster_path;
    this.popularity = popularity;
    this.releaseDate = release_date;
  }
}
app.get("/movies", getMoviesFromApi);

async function getMoviesFromApi(request, response) {
  try {
    let city = request.query.city;
    console.log(city);

    if (!city) {
      return response
        .status(400)
        .json({ error: "Missing required parameters" });
    }

    // https://api.themoviedb.org/3/search/movie?query=city&language=en-US&page=1

    let movieResponse = await axios.get(
      `https://api.themoviedb.org/3/search/movie`,
      {
        params: {query: `${city}`},
        headers: {
            accept: 'application/json',
            Authorization: `Bearer ${process.env.MOVIE_ACCESS_TOKEN}`
        }
    });

    let cityMovies = movieResponse.data.results.map((movie) => {
      return new Movie(
        movie.title,
        movie.overview,
        movie.vote_average,
        movie.vote_count,
        movie.poster_path,
        movie.popularity,
        movie.release_date
      );
    });
    console.log(movie);

    response.json(
      cityMovies,
    );
    console.log(cityMovies);
  } catch (error) {
    console.error("Error fetching movie data:", error.message);
    response.status(500).json({ error: "Internal server error" });
  }
}

app.get("*", (request, response) => {
  response.status(404).send("Page Not Avaiable");
});

app.use((error, request, response, next) => {
  response.status(500).send(error.message);
});

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
