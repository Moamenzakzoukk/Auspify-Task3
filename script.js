const searchBtn = document.getElementById('searchBtn');
const cityInput = document.getElementById('cityInput');
const statusMessage = document.getElementById('statusMessage');
const weatherDetails = document.getElementById('weatherDetails');

const cityName = document.getElementById('cityName');
const temperature = document.getElementById('temperature');
const weatherCondition = document.getElementById('weatherCondition');
const windSpeed = document.getElementById('windSpeed');
const humidity = document.getElementById('humidity');

// Open-Meteo Geocoding & Weather API (Free & Public API)
async function fetchWeather(city) {
    if (!city.trim()) return;

    // 1. Show Loading State
    statusMessage.textContent = 'Fetching weather data...';
    statusMessage.className = 'status-message';
    weatherDetails.classList.add('hidden');

    try {
        // Step A: Geocoding (Get Lat & Long from City Name)
        const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`;
        const geoResponse = await fetch(geoUrl);
        const geoData = await geoResponse.json();

        if (!geoData.results || geoData.results.length === 0) {
            throw new Error('City not found. Please check the spelling.');
        }

        const { latitude, longitude, name, country } = geoData.results[0];

        // Step B: Fetch Real-time Weather using Lat & Long
        const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&hourly=relativehumidity_2m`;
        const weatherResponse = await fetch(weatherUrl);
        const weatherData = await weatherResponse.json();

        const currentWeather = weatherData.current_weather;
        const currentHumidity = weatherData.hourly.relativehumidity_2m[0] || 60;

        // Step C: Update UI Dynamically
        cityName.textContent = `${name}, ${country}`;
        temperature.textContent = Math.round(currentWeather.temperature);
        windSpeed.textContent = `${currentWeather.windspeed} km/h`;
        humidity.textContent = `${currentHumidity}%`;
        weatherCondition.textContent = getWeatherDescription(currentWeather.weathercode);

        // 2. Hide Loading, Show Weather Details
        statusMessage.textContent = '';
        weatherDetails.classList.remove('hidden');

    } catch (error) {
        // 3. Handle Error State
        statusMessage.textContent = error.message;
        statusMessage.className = 'status-message error';
    }
}

// Convert WMO Weather Codes to Human-Readable Conditions
function getWeatherDescription(code) {
    const weatherCodes = {
        0: 'Clear Sky ☀️',
        1: 'Mainly Clear 🌤️',
        2: 'Partly Cloudy ⛅',
        3: 'Overcast ☁️',
        45: 'Foggy 🌫️',
        61: 'Slight Rain 🌧️',
        63: 'Moderate Rain 🌧️',
        95: 'Thunderstorm 🌩️'
    };
    return weatherCodes[code] || 'Weather condition updated';
}

// Event Listeners
searchBtn.addEventListener('click', () => {
    fetchWeather(cityInput.value);
});

cityInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        fetchWeather(cityInput.value);
    }
});

// Initial Fetch on Load
fetchWeather('Nagpur');