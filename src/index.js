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

  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  let day = days[now.getDay()];
  let date = now.getDate();
  let months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  let month = months[now.getMonth()];

  return `${day} ${date} ${month} `;
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
    let minForecast = forecast.main.temp_min;
    let maxForecast = forecast.main.temp_max;
    forecastElement.innerHTML += `
    <div class="col-2 forecast">
        <p>
          ${formatHours(forecast.dt * 1000)}
        </p>
        <img src="https://openweathermap.org/img/wn/${
          forecast.weather[0].icon
        }@2x.png" width="100%" />
        <div><span class="min-hourly-degrees">
            ${Math.round(
              minForecast
            )}<span>° <span class="max-hourly-degrees">${Math.round(
      maxForecast
    )}</span>°
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

function changeForecastToFarenheit(event) {
  event.preventDefault();
  let forecastItems = document.querySelectorAll(".min-hourly-degrees, .max-hourly-degrees");
  forecastItems.forEach(function(item) {
  let currentTemp = item.innerHTML;
    item.innerHTML = `${Math.round((currentTemp * 9) / 5 + 32)}`
  });

function changeToFarenheit(event) {
  event.preventDefault();
  let farenhenheitDegrees = document.querySelector(".degrees");
  celsiusLink.classList.remove("active");
  farenheitLink.classList.add("active");
  let fTemp = Math.round((celsiusTemperature * 9) / 5 + 32);
  farenhenheitDegrees.innerHTML = `${fTemp}`;

  changeForecastToFarenheit();
}

let celsiusTemperature = null;
let minForecast = null;


let farenheitLink = document.querySelector("#fahrenheit-link");
farenheitLink.addEventListener("click", changeToFarenheit);

// farenheit > celsius conversion

function changeForecastToCelsius(event) {
  event.preventDefault();
  let forecastItems = document.querySelectorAll(".min-hourly-degrees, .max-hourly-degrees");
  forecastItems.forEach(function (item) {
    let currentTemp = item.innerHTML;
    item.innerHTML = `${currentTemp}`;
  }
  );

function changeToCelsius(event) {
  event.preventDefault();
  let celsiusDegrees = document.querySelector(".degrees");
  farenheitLink.classList.remove("active");
  celsiusLink.classList.add("active");
  celsiusDegrees.innerHTML = Math.round(celsiusTemperature);
  changeForecastToCelsius();
}

let celsiusLink = document.querySelector("#celsius-link");
celsiusLink.addEventListener("click", changeToCelsius);
