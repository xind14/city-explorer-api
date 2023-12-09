'use strict';

//3rd party dependencies
const axios = require("axios");

const MOVIE_API_KEY = process.env.MOVIE_API_KEY;
const MOVIE_ACCESS_TOKEN = process.env.MOVIE_ACCESS_TOKEN;

//internal dependencies
const Movies = require("../data-models/Movies.js");

const movieCache = {};


//actual route handlers
async function handleMovies(request, response) {
  try {
    let city = request.query.city;
    console.log(city);

    if (!city) {
      return response
        .status(400)
        .json({ error: "Missing required parameters" });
    }

    const movieKey = 'movies-' + city;

    if (movieCache[movieKey] && (Date.now() - movieCache[movieKey].timestamp < 50000)) {
      console.log('Cache hit');
      return response.json(movieCache[movieKey].data);
    } else {
      console.log('Cache miss');
      movieCache[movieKey] = {};
      movieCache[movieKey].timestamp = Date.now();
      let movieURL = `https://api.themoviedb.org/3/search/movie`;

       //chat gpt advice// Declare movieResponse outside the if block
      let movieResponse;

      if (city) {
        movieResponse = await axios.get(movieURL, {
          params: { query: `${city}`, include_adult: 'false' },
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
            new Movies(
              movie.title,
              movie.overview,
              movie.vote_average,
              movie.vote_count,
              movie.poster_path,
              movie.popularity,
              movie.release_date
            )
        );
        movieCache[movieKey].data = sortedMovies;

        return response.json(sortedMovies);
      }
    }
  } catch (error) {
    console.error("Error fetching movie data:", error.message);
    response.status(500).json({ error: "Internal server error" });
  }
}

module.exports = handleMovies;
