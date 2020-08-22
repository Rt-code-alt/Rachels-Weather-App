function displayWeather(response) {
  //let weatherIcon = document.querySelector("#todayWeatherIcon");
  //weatherIcon.innerHTML = `https://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`;

  let currentWeatherIcon = document.querySelector("#current-weather-icon");
  currentWeatherIcon.setAttribute(
    "src",
    `https://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
  );
  currentWeatherIcon.setAttribute("alt", response.data.weather[0].description);

  let temperature = Math.round(response.data.main.temp);
  let degrees = document.querySelector(".degrees");
  degrees.innerHTML = `${temperature}`;

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

  // to find any other variable I want to show console.log(response.data);
}

// location search engine

function search(event) {
  event.preventDefault();
  let cityInput = document.querySelector("#form-control");
  let cityChosen = `${cityInput.value}`;
  let h2 = document.querySelector("#city-name");
  h2.innerHTML = cityChosen;
  let apiKey = "9323723efb08066b7b3d194977c6162d";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityChosen}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayWeather);
  axios.get(apiUrl).then(displayDate);
}

let form = document.querySelector("#location-search");
form.addEventListener("submit", search);

// current location

function showPosition(position) {
  let latitude = position.coords.latitude;
  let longitude = position.coords.longitude;
  let apiEndpoint = "https://api.openweathermap.org/data/2.5/weather";
  let apiKey = "9323723efb08066b7b3d194977c6162d";
  let apiUrl = `${apiEndpoint}?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayWeather);
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
  let fTemp = Math.round((farenhenheitDegrees.innerHTML * 9) / 5 + 32);
  farenhenheitDegrees.innerHTML = `${fTemp}`;
}

let farenheit = document.querySelector("#fahrenheit-link");
farenheit.addEventListener("click", changeToFarenheit);

// farenheit > celsius conversion
function changeToCelsius(event) {
  event.preventDefault();
  let celsiusDegrees = document.querySelector(".degrees");
  let cTemp = Math.round(((celsiusDegrees.innerHTML - 32) * 5) / 9);
  celsiusDegrees.innerHTML = `${cTemp}`;
}

let celsius = document.querySelector("#celsius-link");
celsius.addEventListener("click", changeToCelsius);

// time and date

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
  let hours = now.getHours();
  if (hours < 10) {
    hours = `0${hours}`;
  }
  let minutes = now.getMinutes();
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

  return `${day} ${date}th ${month} ${hours}:${minutes} ${tt}`;
}

function displayDate(response) {
  let dateElement = document.querySelector("#time-and-date");
  dateElement.innerHTML = formatDate(response.data.dt * 1000);
}
