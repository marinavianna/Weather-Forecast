let search = document.querySelector("#search-form");
let city = document.querySelector("h1");
let apiKey = "c4b4eb71226a8aa7e7735dea09da11f4";
let currentIcon = document.querySelector(".current-weather");
let weatherIcon = "";
let lon;
let lat;
let forecast = document.querySelector("#forecast");
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
celsiusButton.addEventListener("click", getCelsiusTemp);
let fahrenheitButton = document.querySelector("#fahrenheit");
fahrenheitButton.addEventListener("click", getFahrenheitTemp);
let searchButton = document.querySelector("#search-addon");
searchButton.addEventListener("click", enterCity);
getCurrentLocation();
let currentLocation = document.querySelector("#current-location");
currentLocation.addEventListener("click", getCurrentLocation);
let now;
let hour;
let minute;
let days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
let day;

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
  currentTempValue = Math.round(response.data.main.temp);
  tempText.innerHTML = response.data.weather[0].description;
  windSpeed.innerHTML = `Wind speed: ${Math.round(
    response.data.wind.speed * 3.6
  )} km/h`;
  currentMax.innerHTML = currentMaxValue + "ºC/";
  currentMin.innerHTML = currentMinValue + "ºC";
  currentTemp.innerHTML = currentTempValue + "ºC";
  city.innerHTML = response.data.name + ", " + response.data.sys.country;
  weatherIcon = response.data.weather[0].icon;
  currentIcon.innerHTML = chooseIcon(weatherIcon);
  lon = response.data.coord.lon;
  lat = response.data.coord.lat;
  getDates(response);
  getForecast(lon, lat);
}

function getForecast(lon, lat) {
  let apiUrl;
  if (currentMin.innerHTML.charAt(currentMin.innerHTML.length - 1) === "F") {
    apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`;
  } else {
    apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
  }
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

function showForecast(response) {
  let forecastHTML = "";
  let forecastDays = response.data.daily.slice(1, 6);
  if (currentMin.innerHTML.charAt(currentMin.innerHTML.length - 1) === "F") {
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
            )}ºF</strong>/${Math.round(daydata.temp.min)}ºF</span>
          </div>
        </div>`;
    });
  } else {
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
  }
  forecast.innerHTML = forecastHTML;
}

function getCelsiusTemp(event) {
  event.preventDefault();
  if (currentMin.innerHTML.charAt(currentMin.innerHTML.length - 1) === "F") {
    currentMinValue = Math.round((currentMinValue - 32) / (9 / 5));
    currentMin.innerHTML = currentMinValue + "ºC";
    currentMaxValue = Math.round((currentMaxValue - 32) / (9 / 5));
    currentMax.innerHTML = currentMaxValue + "ºC/";
    currentTempValue = Math.round((currentTempValue - 32) / (9 / 5));
    currentTemp.innerHTML = currentTempValue + "ºC";
    getForecast(lon, lat);
  }
}

function getFahrenheitTemp(event) {
  event.preventDefault();
  if (currentMin.innerHTML.charAt(currentMin.innerHTML.length - 1) === "C") {
    currentMinValue = Math.round(currentMinValue * (9 / 5) + 32);
    currentMin.innerHTML = currentMinValue + "ºF";
    currentMaxValue = Math.round(currentMaxValue * (9 / 5) + 32);
    currentMax.innerHTML = currentMaxValue + "ºF/";
    currentTempValue = Math.round(currentTempValue * (9 / 5) + 32);
    currentTemp.innerHTML = currentTempValue + "ºF";
    getForecast(lon, lat);
  }
}

function myPosition(position) {
  let mylat = position.coords.latitude;
  let mylon = position.coords.longitude;
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${mylat}&lon=${mylon}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(showTemp);
}

function getCurrentLocation() {
  navigator.geolocation.getCurrentPosition(myPosition);
}

function getDates(response) {
  now = new Date(response.data.dt * 1000);
  hour = now.getHours();

  if (hour.toString().length === 1) {
    hour = "0" + hour;
  }

  minute = now.getMinutes();

  if (minute.toString().length === 1) {
    minute = "0" + minute;
  }

  day = days[now.getDay()];

  let currentDate = document.querySelector("#current-date");
  currentDate.innerHTML = `Last updated: ${day} ${hour}:${minute}`;
}
