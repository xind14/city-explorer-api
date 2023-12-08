'use strict';

//supporting class
class Weather {
  constructor(date, description, city_name) {
    this.date = date;
    this.description = description;
    this.cityName = city_name;
  }
}
module.exports= Weather;