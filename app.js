// ===== WEATHER APP - SIMPLE BEGINNER-FRIENDLY CODE =====
// This app gets weather data from OpenWeatherMap API and shows it on the webpage

// My API key for OpenWeatherMap (you can get your own free at openweathermap.org)
const API_KEY = 'c08550f8a1ed2392b40ace218104831f';

// API URLs - these are the web addresses we use to get weather data
const WEATHER_API_URL = 'https://api.openweathermap.org/data/2.5/weather';
const WEATHER_ICON_URL = 'https://openweathermap.org/img/wn/';

// ===== GETTING HTML ELEMENTS =====
// These are all the parts of our webpage that we need to control

// Input and button elements
const cityInput = document.getElementById('city-input');
const searchButton = document.getElementById('search-btn');
const weatherForm = document.getElementById('weather-form');

// Elements to show results
const errorDiv = document.getElementById('error-message');
const weatherDiv = document.getElementById('weather-result');

// Elements to display weather information
const cityNameElement = document.getElementById('city-name');
const dateElement = document.getElementById('current-date');
const temperatureElement = document.getElementById('temperature');
const descriptionElement = document.getElementById('description');
const feelsLikeElement = document.getElementById('feels-like');
const weatherIconElement = document.getElementById('weather-icon');

// Elements to display detailed weather info
const humidityElement = document.getElementById('humidity');
const windSpeedElement = document.getElementById('wind-speed');
const windDirectionElement = document.getElementById('wind-direction');
const visibilityElement = document.getElementById('visibility');
const pressureElement = document.getElementById('pressure');
const cloudinessElement = document.getElementById('cloudiness');

// ===== MAIN FUNCTION - SEARCH FOR WEATHER =====
function searchWeather() {
    // Get the city name that user typed
    const cityName = cityInput.value.trim();
    
    // Check if user actually typed something
    if (cityName === '') {
        showError('Please enter a city name!');
        return;
    }
    
    // Show loading animation
    showLoading();
    
    // Hide any previous error messages
    hideError();
    
    // Hide previous weather results
    hideWeatherResults();
    
    // Get weather data from the internet
    getWeatherFromAPI(cityName);
}

// ===== FUNCTION TO GET WEATHER DATA FROM INTERNET =====
function getWeatherFromAPI(cityName) {
    // Create the complete URL to ask for weather data
    const completeURL = `${WEATHER_API_URL}?q=${cityName}&appid=${API_KEY}&units=metric`;
    
    // Ask the internet for weather data
    fetch(completeURL)
        .then(response => {
            // Check if we got a good response
            if (!response.ok) {
                // Handle different types of errors
                if (response.status === 404) {
                    throw new Error(`City "${cityName}" not found. Check spelling and try again.`);
                } else if (response.status === 401) {
                    throw new Error('API key problem. Please check the API key.');
                } else {
                    throw new Error('Something went wrong. Please try again.');
                }
            }
            // Convert response to JSON (JavaScript Object)
            return response.json();
        })
        .then(weatherData => {
            // If everything is good, show the weather data
            displayWeatherData(weatherData);
            hideLoading();
        })
        .catch(error => {
            // If something went wrong, show error message
            showError(error.message);
            hideLoading();
        });
}

// ===== FUNCTION TO DISPLAY WEATHER DATA ON WEBPAGE =====
function displayWeatherData(data) {
    // Show city name and country
    cityNameElement.textContent = `${data.name}, ${data.sys.country}`;
    
    // Show current date and time
    dateElement.textContent = getCurrentDateTime();
    
    // Show temperature (rounded to whole number)
    temperatureElement.textContent = Math.round(data.main.temp);
    
    // Show weather description (like "sunny", "cloudy", etc.)
    descriptionElement.textContent = data.weather[0].description;
    
    // Show "feels like" temperature
    feelsLikeElement.textContent = `Feels like ${Math.round(data.main.feels_like)}°C`;
    
    // Show weather icon
    const iconCode = data.weather[0].icon;
    weatherIconElement.src = `${WEATHER_ICON_URL}${iconCode}@2x.png`;
    weatherIconElement.alt = data.weather[0].description;
    
    // Show detailed weather information
    humidityElement.textContent = `${data.main.humidity}%`;
    windSpeedElement.textContent = `${data.wind.speed} m/s`;
    windDirectionElement.textContent = `${data.wind.deg}°`;
    visibilityElement.textContent = `${(data.visibility / 1000).toFixed(1)} km`;
    pressureElement.textContent = `${data.main.pressure} hPa`;
    cloudinessElement.textContent = `${data.clouds.all}%`;
    
    // Show the weather results section
    showWeatherResults();
}

// ===== HELPER FUNCTIONS =====

// Function to get current date and time in nice format
function getCurrentDateTime() {
    const now = new Date();
    const options = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    return now.toLocaleDateString('en-US', options);
}

// Function to show loading animation
function showLoading() {
    searchButton.disabled = true;
    searchButton.querySelector('.btn-text').style.display = 'none';
    searchButton.querySelector('.loading-spinner').style.display = 'inline';
}

// Function to hide loading animation
function hideLoading() {
    searchButton.disabled = false;
    searchButton.querySelector('.btn-text').style.display = 'inline';
    searchButton.querySelector('.loading-spinner').style.display = 'none';
}

// Function to show error message
function showError(message) {
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
    // Hide error after 5 seconds
    setTimeout(hideError, 5000);
}

// Function to hide error message
function hideError() {
    errorDiv.style.display = 'none';
}

// Function to show weather results
function showWeatherResults() {
    weatherDiv.style.display = 'block';
}

// Function to hide weather results
function hideWeatherResults() {
    weatherDiv.style.display = 'none';
}

// ===== EVENT LISTENERS - WHAT HAPPENS WHEN USER CLICKS OR TYPES =====

// When user clicks the search button
searchButton.addEventListener('click', function(event) {
    event.preventDefault(); // Stop form from submitting normally
    searchWeather();
});

// When user presses Enter in the input field
cityInput.addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        event.preventDefault(); // Stop form from submitting normally
        searchWeather();
    }
});

// When user submits the form
weatherForm.addEventListener('submit', function(event) {
    event.preventDefault(); // Stop form from submitting normally
    searchWeather();
});

// ===== NICE TOUCHES FOR BETTER USER EXPERIENCE =====

// When user clicks on input field, show example cities
cityInput.addEventListener('focus', function() {
    if (cityInput.value === '') {
        cityInput.placeholder = 'Try: London, New York, Tokyo, Paris...';
    }
});

// When user clicks away from input field, show normal placeholder
cityInput.addEventListener('blur', function() {
    cityInput.placeholder = 'Enter city name...';
});

// ===== THAT'S IT! =====
// This is a complete weather app that:
// 1. Takes a city name from user
// 2. Gets weather data from OpenWeatherMap API
// 3. Shows the weather information on the webpage
// 4. Handles errors nicely
// 5. Has a good user experience with loading animations
