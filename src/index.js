let weather = {
  paris: {
    temp: 19.7,
    humidity: 80,
  },
  tokyo: {
    temp: 17.3,
    humidity: 50,
  },
  lisbon: {
    temp: 30.2,
    humidity: 20,
  },
  "san francisco": {
    temp: 20.9,
    humidity: 100,
  },
  moscow: {
    temp: -5,
    humidity: 20,
  },
};

/* let chosenCity = prompt("Enter a city");

const result = weather[chosenCity];

if (result === undefined) {
  alert(
    `Sorry, we don't know the weather for this city, try going to https://www.google.com/search?q=weather+${chosenCity.toLowerCase()}`
  );
} else {
  let fahrenheit = result.temp * (9 / 5) + 32;
  alert(
    `It is currently ${Math.round(result.temp)}°C (${Math.round(
      fahrenheit
    )}°F) in ${chosenCity} with a humidity of ${result.humidity}%.`
  );
} */

let now = new Date();
let hour = now.getHours();

if (hour.toString().length === 1) {
  hour = "0" + hour;
}

let minute = now.getMinutes();

if (minute.toString().length === 1) {
  minute = "0" + minute;
}

let days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

let day = days[now.getDay()];

let currentDate = document.querySelector("#current-date");
currentDate.innerHTML = `${day} ${hour}:${minute}`;

let search = document.querySelector("#search-form");
let city = document.querySelector("h1");
let apiKey = "c4b4eb71226a8aa7e7735dea09da11f4";

function enterCity(event) {
  event.preventDefault();
  let citySearch = document.querySelector("#city");
  city.innerHTML = citySearch.value;
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${citySearch.value}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(showTemp);
}

function showTemp(response) {
  currentMaxValue = Math.round(response.data.main.temp_max);
  currentMinValue = Math.round(response.data.main.temp_min);
  currentMax.innerHTML = currentMaxValue + " ºC";
  currentMin.innerHTML = currentMinValue + " ºC";
  city.innerHTML = response.data.name;
}

search.addEventListener("submit", enterCity);

let currentMax = document.querySelector("#current-max");
let currentMaxValue = currentMax.innerHTML.replace("ºC", "").replace("ºF", "");
let currentMin = document.querySelector("#current-min");
let currentMinValue = currentMin.innerHTML.replace("ºC", "").replace("ºF", "");

let celsiusButton = document.querySelector("#celsius");

function getCelsiusTemp(event) {
  event.preventDefault();
  if (currentMin.innerHTML.charAt(currentMin.innerHTML.length - 1) === "F") {
    currentMinValue = Math.round((currentMinValue - 32) / (9 / 5));
    currentMin.innerHTML = currentMinValue + " ºC";
    currentMaxValue = Math.round((currentMaxValue - 32) / (9 / 5));
    currentMax.innerHTML = currentMaxValue + " ºC";
  }
}

celsiusButton.addEventListener("click", getCelsiusTemp);

let fahrenheitButton = document.querySelector("#fahrenheit");

function getFahrenheitTemp(event) {
  event.preventDefault();
  if (currentMin.innerHTML.charAt(currentMin.innerHTML.length - 1) === "C") {
    currentMinValue = Math.round(currentMinValue * (9 / 5) + 32);
    currentMin.innerHTML = currentMinValue + " ºF";
    currentMaxValue = Math.round(currentMaxValue * (9 / 5) + 32);
    currentMax.innerHTML = currentMaxValue + " ºF";
  }
}

fahrenheitButton.addEventListener("click", getFahrenheitTemp);

let searchButton = document.querySelector("#search-addon");
searchButton.addEventListener("click", enterCity);

function myPosition(position) {
  let lat = position.coords.latitude;
  let lon = position.coords.longitude;
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(showTemp);
}

function getCurrentLocation() {
  navigator.geolocation.getCurrentPosition(myPosition);
}

getCurrentLocation();

let currentLocation = document.querySelector("#current-location");

currentLocation.addEventListener("click", getCurrentLocation);
