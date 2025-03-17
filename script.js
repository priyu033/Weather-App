document.addEventListener("DOMContentLoaded", function () {
  setCompletelyRandomBackground(); // 🌟 Show a new image every time the page loads
  showRandomWeatherFact(); // Show facts while loading
  getUserLocation(); // Ask for location on page load
});

// 🌟 Fetch a new Unsplash image every time the page loads
async function setCompletelyRandomBackground() {
  const ACCESS_KEY = "2W57kezLohoZjhQ5nsYqD6fEdg8rOTfVFKA-_35yoVk";
  const url = `https://api.unsplash.com/photos/random?query=nature,sky,landscape&orientation=landscape&client_id=${ACCESS_KEY}&timestamp=${new Date().getTime()}`;

  try {
      const response = await fetch(url);
      if (!response.ok) throw new Error("Unsplash API error");

      const data = await response.json();
      document.body.style.backgroundImage = `url('${data.urls.regular}')`;
  } catch (error) {
      console.error("Error fetching random Unsplash image:", error);
      document.body.style.backgroundImage = "url('https://images.unsplash.com/photo-1502082553048-f009c37129b9')";
  }
}

// 🌟 Fetch a new background from Unsplash based on city & weather
async function updateBackground(city, weather) {
  const ACCESS_KEY = "2W57kezLohoZjhQ5nsYqD6fEdg8rOTfVFKA-_35yoVk";
  const query = `${city} ${weather}`;
  const url = `https://api.unsplash.com/photos/random?query=${query}&orientation=landscape&client_id=${ACCESS_KEY}&timestamp=${new Date().getTime()}`;

  try {
      const response = await fetch(url);
      if (!response.ok) throw new Error("Unsplash API error");

      const data = await response.json();
      document.body.style.backgroundImage = `url('${data.urls.regular}')`;
  } catch (error) {
      console.error("Error fetching weather-based Unsplash image:", error);
  }
}

// 🌟 Fun weather facts while loading
const weatherFacts = [
  "Did you know? The highest temperature ever recorded was 56.7°C in Death Valley!",
  "Lightning is 5 times hotter than the surface of the sun!",
  "Antarctica is the driest, windiest, and coldest continent on Earth.",
  "The coldest temperature ever recorded was -89.2°C in Antarctica.",
  "Raindrops can fall at speeds of up to 22 mph (35 km/h)!",
  "Snowflakes are actually translucent, not white!",
  "The fastest recorded wind speed on Earth was 372 km/h (231 mph) in Mount Washington, USA!"
];

// 🌟 Show a random weather fact while loading
function showRandomWeatherFact() {
  const fact = weatherFacts[Math.floor(Math.random() * weatherFacts.length)];
  document.querySelector(".weather").innerHTML = `
      <div class="loading-animation"></div>
      <p class="loading-text">Loading...</p>
      <p class="loading-fact">${fact}</p>
  `;
}

// 🌟 Get user's location
function getUserLocation() {
  if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      weather.fetchWeather("Jaipur"); // Default to Jaipur if location not allowed
      return;
  }

  navigator.geolocation.getCurrentPosition(
      (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          fetchWeatherByCoords(lat, lon);
      },
      () => {
          weather.fetchWeather("Jaipur"); // If user denies location, show Jaipur
      }
  );
}

// 🌟 Fetch weather by coordinates
function fetchWeatherByCoords(lat, lon) {
  fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${weather.apiKey}`
  )
      .then((response) => response.json())
      .then((data) => weather.displayWeather(data));
}

// 🌟 Weather object
let weather = {
  apiKey: "5598488442dd5891f6233cdcabdfe9d2",

  fetchWeather: function (city) {
      showRandomWeatherFact(); // Show a fact while fetching
      fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${this.apiKey}`
      )
          .then((response) => response.json())
          .then((data) => this.displayWeather(data));
  },

  displayWeather: function (data) {
      const { name } = data;
      const { icon, description } = data.weather[0];
      const { temp, humidity } = data.main;
      const { speed } = data.wind;

      // Hide loading facts and show weather info
      const weatherDiv = document.querySelector(".weather");
      weatherDiv.classList.remove("loading"); // Remove loading class

      weatherDiv.innerHTML = `
          <h2 class="city">Weather in ${name}</h2>
          <h1 class="temp">${temp}°C</h1>
          <img class="weather-icon" src="https://openweathermap.org/img/wn/${icon}.png">
          <p class="description">${description}</p>
          <p class="humidity">Humidity: ${humidity}%</p>
          <p class="wind">Wind Speed: ${speed} km/h</p>
      `;

      // Extract first word of weather description (e.g., "Cloudy", "Rain")
      let weatherCondition = description.split(" ")[0];

      // Update background based on city + weather condition
      updateBackground(name, weatherCondition);
  },

  search: function () {
      const city = document.querySelector(".search-bar").value.trim();
      if (city !== "") {
          weather.fetchWeather(city);
          document.querySelector(".search-bar").value = ""; // Clear search bar after search
      }
  },
};

// 🌟 Handle search button click
document.querySelector(".search button").addEventListener("click", function () {
  weather.search();
});

// 🌟 Handle "Enter" key in search bar
document.querySelector(".search-bar").addEventListener("keyup", function (event) {
  if (event.key === "Enter") {
      weather.search();
  }
});


