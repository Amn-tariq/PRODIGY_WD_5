// Elements
const locationInput = document.getElementById("location-input");
const searchBtn = document.getElementById("search-btn");
const locationBtn = document.getElementById("location-btn");
const cityName = document.getElementById("city-name");
const temp = document.getElementById("temp");
const wind = document.getElementById("wind");
const error = document.getElementById("error");

// Fetch Weather by Lat/Lon
async function fetchWeather(lat, lon) {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`;
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Failed to fetch weather data");
    const data = await response.json();
    displayWeather(data.current_weather, lat, lon);
  } catch (err) {
    showError(err.message);
  }
}

// Display Weather Data
function displayWeather(data, lat, lon) {
  error.textContent = ""; // Clear error
  cityName.textContent = `Latitude: ${lat}, Longitude: ${lon}`;
  temp.textContent = data.temperature;
  wind.textContent = data.windspeed;
}

// Get Weather for User's Location
function fetchWeatherByLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      position => {
        const { latitude, longitude } = position.coords;
        fetchWeather(latitude, longitude);
      },
      () => showError("Location access denied")
    );
  } else {
    showError("Geolocation is not supported by your browser");
  }
}

// Show Error
function showError(message) {
  error.textContent = message;
}

// Search Button Click
searchBtn.addEventListener("click", () => {
  const city = locationInput.value.trim();
  if (city) {
    // Use a geocoding service to convert city to lat/lon (e.g., OpenCage, PositionStack).
    showError("Geocoding not implemented. Use location button for now.");
  } else {
    showError("Please enter a city name");
  }
});

// Location Button Click
locationBtn.addEventListener("click", fetchWeatherByLocation);


// Add this in `displayWeather`
const iconUrl = `https://open-meteo.com/icons/${data.weathercode}.png`;
