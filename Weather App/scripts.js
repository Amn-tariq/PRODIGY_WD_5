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
searchBtn.addEventListener("click", async () => {
  const city = locationInput.value.trim(); // Get city name from input
  if (city) {
    try {
      // Fetch latitude and longitude using Open-Meteo's geocoding API
      const geoResponse = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${city}`);
      if (!geoResponse.ok) throw new Error("Failed to fetch location data");
      
      const geoData = await geoResponse.json();
      
      if (!geoData.results || geoData.results.length === 0) {
        showError("City not found. Please try again.");
        return;
      }
      
      const { latitude, longitude } = geoData.results[0]; // Extract latitude and longitude
      fetchWeather(latitude, longitude); // Fetch weather data using lat/lon
    } catch (err) {
      showError(err.message);
    }
  } else {
    showError("Please enter a city name"); // Show error if input is empty
  }
});


// Location Button Click
locationBtn.addEventListener("click", fetchWeatherByLocation);


