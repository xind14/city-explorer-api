"use strict";

//supporting class
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
module.exports = Movie;
