//yesterday

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

const axios = require('axios');






//chat
class Forecast {
  constructor(date, description) {
    this.date = date;
    this.description = description;
  }
}

app.get("/weather", getWeatherFromApi);

async function getWeatherFromApi(request, response) {
  try {
    let inputCity = request.query.searchQuery;

    if (!inputCity) {
      return response.status(400).json({ error: 'Missing required parameter: searchQuery' });
    }

    // Convert city name to lowercase
    inputCity = inputCity.toLowerCase();

    // Make a request to the weather API
    const axiosResponse = await axios.get('https://api.weatherapi.com/v1/forecast.json', {
      params: {
        key: process.env.WEATHER_API_KEY,
        q: inputCity,
        days: 7, // You can adjust the number of forecast days
      },
    });

    const cityData = axiosResponse.data;
    
    let cityWeather = cityData.forecast.forecastday.map((day) => {
      return new Forecast(
        day.date,
        `Low of ${day.day.mintemp_c}, high of ${day.day.maxtemp_c} with ${day.day.condition.text}`
      );
    });

    // Include latitude and longitude in the response
    response.json({
      city_name: cityData.location.name,
      latitude: cityData.location.lat,
      longitude: cityData.location.lon,
      forecast: cityWeather,
    });

  } catch (error) {
    console.error('Error fetching weather data:', error.message);
    response.status(500).json({ error: 'Internal server error' });
  }
}



// https://api.themoviedb.org/3/search/movie?language=en-US&page=1&query=Dallas 

class Movie {
  constructor(
    title,
    overview,
    averageVotes,
    totalVotes,
    image_url,
    popularity,
    releaseDate
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
// https://api.themoviedb.org/3/search/movie?query=dallas&page=1
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
    let movieResponse = await axios.get(
      "https://api.themoviedb.org/3/search/movie",
      {
        params: {
          key: process.env.MOVIE_API_KEY,

          query: city,
          page: 1,
        },
      }
    );

    let cityMovies = movieResponse.data.results.map((movie) => {
      return new Movies(
        movie.title,
        movie.overview,
        movie.vote_average,
        movie.vote_count,
        movie.poster_path,
        // `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
        movie.popularity,
        movie.release_date
      );
    });

    response.json({
      movies: cityMovies,
    });
    console.log(cityMovies);
  } catch (error) {
    console.error("Error fetching movie data:", error.message);
    response.status(500).json({ error: "Internal server error" });
  }
}





//current

class Forecast {
  constructor(date, description) {
    this.date = date;
    this.description = description;
  }
}

app.get('/weather', getWeatherFromApi);

async function getWeatherFromApi(request, response) {
  try {
    let inputCity = request.query.searchQuery;

    if (inputCity) {
      inputCity = inputCity.toLowerCase();

      let axiosResponse = await axios.get(
        'https://api.weatherbit.io/v2.0/forecast/daily',
        {
          params: {
            key: process.env.WEATHER_API_KEY,
            lat: lat, 
            lon: lon,
          },
        }
      );

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
    } else {
      console.log('City not found in the dataset');
      response.status(404).json({ error: 'City not found in the dataset' });
    }
  } catch (error) {
    console.error('Error fetching weather data:', error.message);
    response.status(500).json({ error: 'Internal server error' });
  }
}








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
      "https://api.weatherbit.io/v2.0/forecast/daily",
      {
        params: {
          key: process.env.WEATHER_API_KEY,
          lat: lat,
          lon: lon,
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
