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

    let movieURL = `https://api.themoviedb.org/3/search/movie`;

    //chat gpt advice
    let movieResponse; // Declare movieResponse outside the if block

    if (city) {
      movieResponse = await axios.get(movieURL, {
        params: { query: `${city}`, include_adult: "false" },
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${MOVIE_ACCESS_TOKEN}`,
        },
      });
    }
    console.log(movieResponse.data.results);
    if (movieResponse && movieResponse.data && movieResponse.data.results) {
      const cityMovies = movieResponse.data.results
        .slice(0, 20)
        .sort((a, b) => b.popularity - a.popularity);
      let sortedMovies = cityMovies.map(
        (movie) =>
          new Movie(
            movie.title,
            movie.overview,
            movie.vote_average,
            movie.vote_count,
            movie.poster_path,
            movie.popularity,
            movie.release_date
          )
      );

      console.log(sortedMovies);

      response.json(sortedMovies);
      console.log(cityMovies);
    }
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


function errorHandler(error, request, response, next) {
  response.status(500).send('An error occurred');
}

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
