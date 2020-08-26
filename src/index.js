// time and date

function formatHours(timestamp) {
  let date = new Date(timestamp);
  let hours = date.getHours();
  if (hours < 10) {
    hours = `0${hours}`;
  }

  let minutes = date.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  minutes = minutes < 10 ? "0" + minutes : minutes;
  let tt = "";
  if (hours >= 12) {
    tt = "PM";
  } else {
    tt = "AM";
  }
  return `${hours}:${minutes} ${tt}`;
}

function formatDate(timestamp) {
  let now = new Date(timestamp);

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
  let date = now.getDate();
  let months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  let month = months[now.getMonth()];

  return `${day} ${date} ${month}`;
}

function displayWeather(response) {
  let currentWeatherIcon = document.querySelector("#current-weather-icon");
  currentWeatherIcon.setAttribute(
    "src",
    `https://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
  );
  currentWeatherIcon.setAttribute("alt", response.data.weather[0].description);

  let degrees = document.querySelector(".degrees");
  celsiusTemperature = response.data.main.temp;
  degrees.innerHTML = Math.round(celsiusTemperature);

  let description = document.querySelector("#description");
  let updateDescription = response.data.weather[0].main;
  description.innerHTML = ` ${updateDescription} `;

  let tempMin = document.querySelector("#temperatureTodayMin");
  tempMin.innerHTML = Math.round(response.data.main.temp_min);

  let tempMax = document.querySelector("#temperatureTodayMax");
  tempMax.innerHTML = Math.round(response.data.main.temp_max);

  let windSpeed = document.querySelector("#windSpeedToday");
  windSpeed.innerHTML = Math.round(response.data.wind.speed);

  document.querySelector(
    "#humidityToday"
  ).innerHTML = `${response.data.main.humidity}`;

  let country = document.querySelector("#country");
  country.innerHTML = `${response.data.sys.country}`;

  let cityName = document.querySelector("#city-name");
  cityName.innerHTML = response.data.name;

  let dateElement = document.querySelector("#date");
  dateElement.innerHTML = formatDate(response.data.dt * 1000);

  let timeElement = document.querySelector("#time");
  timeElement.innerHTML = formatHours(response.data.dt * 1000);
}

// forecasted weather

function displayForecast(response) {
  let forecastElement = document.querySelector("#hourly-forecast");
  forecastElement.innerHTML = null;
  let forecast = null;

  for (let index = 0; index < 6; index++) {
    forecast = response.data.list[index];
    forecastElement.innerHTML += `
    <div class="col-2">
        <p>
          ${formatHours(forecast.dt * 1000)}
        </p>
        <img src="https://openweathermap.org/img/wn/${
          forecast.weather[0].icon
        }@2x.png" />
        <div class="weather-forecast-temp">
            ${Math.round(forecast.main.temp_min)}° <strong>${Math.round(
      forecast.main.temp_max
    )}°</strong>
        </div>
    </div>`;
  }
}

// location search engine

function search(city) {
  let apiKey = "9323723efb08066b7b3d194977c6162d";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayWeather);

  apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayForecast);
}

function handleSubmit(event) {
  event.preventDefault();
  let cityInput = document.querySelector(".form-control");
  search(cityInput.value);
}

let form = document.querySelector("#location-search");
form.addEventListener("submit", handleSubmit);

// current location

function showPosition(position) {
  let latitude = position.coords.latitude;
  let longitude = position.coords.longitude;
  let apiEndpoint = "https://api.openweathermap.org/data/2.5/weather";
  let apiKey = "9323723efb08066b7b3d194977c6162d";
  let apiUrl = `${apiEndpoint}?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayWeather);

  apiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayForecast);
}

function localPosition(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(showPosition);
}

let currentLocationButton = document.querySelector("#current-location");
currentLocationButton.addEventListener("click", localPosition);

// celsius > fareinheit conversion
function changeToFarenheit(event) {
  event.preventDefault();
  let farenhenheitDegrees = document.querySelector(".degrees");
  celsiusLink.classList.remove("active");
  farenheitLink.classList.add("active");
  let fTemp = Math.round((celsiusTemperature * 9) / 5 + 32);
  farenhenheitDegrees.innerHTML = `${fTemp}`;
}

let celsiusTemperature = null;

let farenheitLink = document.querySelector("#fahrenheit-link");
farenheitLink.addEventListener("click", changeToFarenheit);

// farenheit > celsius conversion
function changeToCelsius(event) {
  event.preventDefault();
  let celsiusDegrees = document.querySelector(".degrees");
  farenheitLink.classList.remove("active");
  celsiusLink.classList.add("active");
  celsiusDegrees.innerHTML = Math.round(celsiusTemperature);
}

let celsiusLink = document.querySelector("#celsius-link");
celsiusLink.addEventListener("click", changeToCelsius);
