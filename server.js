"use strict";

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const axios = require("axios");
const app = express();
const PORT = process.env.PORT || 3000;
const MOVIE_API_KEY = process.env.MOVIE_API_KEY;
const MOVIE_ACCESS_TOKEN = process.env.MOVIE_ACCESS_TOKEN;

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
    title,
    overview,
    vote_average,
    vote_count,
    poster_path,
    popularity,
    release_date
  ) {
    this.title = title;
    this.overview = overview;
    this.averageVotes = vote_average;
    this.totalVotes = vote_count;
    this.poster_path = poster_path;
    this.popularity = popularity;
    this.releaseDate = release_date;
    this.baseURL = `https://image.tmdb.org/t/p/w185${poster_path}`;
  }
}
app.get("/movies", getMoviesFromApi);

// async function getMoviesFromApi(request, response) {
//   try {
//     let city = request.query.city;
//     console.log(city);

    // if (!city) {
    //   return response
    //     .status(400)
    //     .json({ error: "Missing required parameters" });
    // }

    // "https://api.themoviedb.org/3/search/movie?query=city&language=en-US&api_key=0816b844abf90d72bc1bd3e3b2baa9eb"

//     let movieURL =
//       "https://api.themoviedb.org/3/search/movie?query=city&language=en-US";
//     if (city) {
//       let movieResponse = await axios.get(movieURL, {
//         params: { query: `${city}`, language: "en-US" },
//         headers: {
//           accept: "application/json",
//           Authorization: `Bearer ${MOVIE_ACCESS_TOKEN}`,
//         },
//       });
//     }

//       if (movieResponse && movieResponse.data && movieResponse.data.results) {
//         const cityMovies = movieResponse.data.results
//           .slice(0, 20)
//           .sort((a, b) => b.popularity - a.popularity);
//         let sortedMovies = cityMovies.map(
//           (movie) =>
//             new Movie(
//               movie.title,
//               movie.overview,
//               movie.vote_average,
//               movie.vote_count,
//               movie.poster_path,
//               movie.popularity,
//               movie.release_date
//             )
//         );

//       console.log(sortedMovies);

//       response.json(sortedMovies);
//       console.log(cityMovies);
//     }
//   } catch (error) {
//     console.error("Error fetching movie data:", error.message);
//     response.status(500).json({ error: "Internal server error" });
//   }
// }

async function getMoviesFromApi(request, response) {
  try {
    let city = request.query.city;
    console.log(city);

    if (!city) {
      return response
        .status(400)
        .json({ error: "Missing required parameters" });
    }

    let movieURL = "https://api.themoviedb.org/3/search/movie?include_adult=false&language=en-US&page=1";
      // let movieResponse;  

    if (city) {
    let  movieResponse = await axios.get( movieURL, {
        params: { query: `${city}` },
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${MOVIE_ACCESS_TOKEN}`,
        },
      });
    

    if (movieResponse && movieResponse.data && movieResponse.data.results) {
      const cityMovies = movieResponse.data.results
        .slice(0, 20)
        .sort((a, b) => b.popularity - a.popularity);
      let sortedMovies = cityMovies.map(
        (movie) =>{
          new Movie(
            movie.title,
            movie.overview,
            movie.vote_average,
            movie.vote_count,
            movie.poster_path,
            movie.popularity,
            movie.release_date
          )
      }  );

      console.log(sortedMovies);

      response.json(sortedMovies);
      console.log(cityMovies);
    
  } catch (error) {
    console.error("Error fetching movie data:", error.message);
    response.status(500).json({ error: "Internal server error" });
  }
}
}


app.get("*", (request, response) => {
  response.status(404).send("Page Not Avaiable");
});

app.use((error, request, response, next) => {
  response.status(500).send(error.message);
});

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
