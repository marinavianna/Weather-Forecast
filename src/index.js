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
currentDate.innerHTML = `Last updated: ${day} ${hour}:${minute}`;

let search = document.querySelector("#search-form");
let city = document.querySelector("h1");
let apiKey = "c4b4eb71226a8aa7e7735dea09da11f4";
let currentIcon = document.querySelector(".current-weather");

function enterCity(event) {
  event.preventDefault();
  let citySearch = document.querySelector("#city");
  city.innerHTML = citySearch.value;
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${citySearch.value}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(showTemp);
}

let weatherIcon = "";

function showTemp(response) {
  currentMaxValue = Math.round(response.data.main.temp_max);
  currentMinValue = Math.round(response.data.main.temp_min);
  currentTempValue = Math.round(response.data.main.temp);
  tempText.innerHTML = response.data.weather[0].description;
  windSpeed.innerHTML = `Wind speed: ${Math.round(
    response.data.wind.speed * 3.6
  )} km/h`;
  currentMax.innerHTML = currentMaxValue + "ºC";
  currentMin.innerHTML = currentMinValue + "ºC";
  currentTemp.innerHTML = currentTempValue + "ºC";
  city.innerHTML = response.data.name;
  weatherIcon = response.data.weather[0].icon;
  currentIcon.innerHTML = chooseIcon(weatherIcon);
  let lon = response.data.coord.lon;
  let lat = response.data.coord.lat;
  getForecast(lon, lat);
}

function getForecast(lon, lat) {
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(showForecast);
}

function chooseIcon(icon) {
  switch (icon.slice(0, 2)) {
    case "01":
      return "☀️";
    case "02":
      return "🌤";
    case "03":
      return "⛅️";
    case "04":
      return "☁️";
    case "09":
      return "🌧";
    case "10":
      return "🌦";
    case "11":
      return "🌩";
    case "13":
      return "❄️";
    case "50":
      return "🌫";
  }
}

let forecast = document.querySelector("#forecast");

function showForecast(response) {
  let forecastHTML = "";
  let forecastDays = response.data.daily.slice(1, 6);
  forecastDays.forEach(function (daydata) {
    forecastHTML += `<div class="col" id="tempcard">
          <div class="row" id="day">${
            days[new Date(daydata.dt * 1000).getDay()]
          }</div>
          <div class="row" id="symbol">${chooseIcon(
            daydata.weather[0].icon
          )}</div>
          <div class="row" id="temp">
            <span><strong>${Math.round(
              daydata.temp.max
            )}ºC</strong>/${Math.round(daydata.temp.min)}ºC</span>
          </div>
        </div>`;
  });
  forecast.innerHTML = forecastHTML;
}

search.addEventListener("submit", enterCity);

let currentMax = document.querySelector("#current-max");
let currentMaxValue = currentMax.innerHTML.replace("ºC", "").replace("ºF", "");
let currentMin = document.querySelector("#current-min");
let currentMinValue = currentMin.innerHTML.replace("ºC", "").replace("ºF", "");
let currentTemp = document.querySelector("#current-temp");
let currentTempValue = currentTemp.innerHTML
  .replace("ºC", "")
  .replace("ºF", "");
let tempText = document.querySelector("#temp-text");
let windSpeed = document.querySelector("#wind-speed");

let celsiusButton = document.querySelector("#celsius");

function getCelsiusTemp(event) {
  event.preventDefault();
  if (currentMin.innerHTML.charAt(currentMin.innerHTML.length - 1) === "F") {
    currentMinValue = Math.round((currentMinValue - 32) / (9 / 5));
    currentMin.innerHTML = currentMinValue + "ºC";
    currentMaxValue = Math.round((currentMaxValue - 32) / (9 / 5));
    currentMax.innerHTML = currentMaxValue + "ºC";
    currentTempValue = Math.round((currentTempValue - 32) / (9 / 5));
    currentTemp.innerHTML = currentTempValue + "ºC";
  }
}

celsiusButton.addEventListener("click", getCelsiusTemp);

let fahrenheitButton = document.querySelector("#fahrenheit");

function getFahrenheitTemp(event) {
  event.preventDefault();
  if (currentMin.innerHTML.charAt(currentMin.innerHTML.length - 1) === "C") {
    currentMinValue = Math.round(currentMinValue * (9 / 5) + 32);
    currentMin.innerHTML = currentMinValue + "ºF";
    currentMaxValue = Math.round(currentMaxValue * (9 / 5) + 32);
    currentMax.innerHTML = currentMaxValue + "ºF";
    currentTempValue = Math.round(currentTempValue * (9 / 5) + 32);
    currentTemp.innerHTML = currentTempValue + "ºF";
  }
}

fahrenheitButton.addEventListener("click", getFahrenheitTemp);

let searchButton = document.querySelector("#search-addon");
searchButton.addEventListener("click", enterCity);

function myPosition(position) {
  let mylat = position.coords.latitude;
  let mylon = position.coords.longitude;
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${mylat}&lon=${mylon}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(showTemp);
}

function getCurrentLocation() {
  navigator.geolocation.getCurrentPosition(myPosition);
}

getCurrentLocation();

let currentLocation = document.querySelector("#current-location");

currentLocation.addEventListener("click", getCurrentLocation);
