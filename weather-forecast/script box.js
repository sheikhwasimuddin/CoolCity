// API Configuration
const API_KEY = '173a9ec92eb89930b24525d30ebedf23'; // Replace with your actual API key
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

// DOM Elements
const cityInput = document.getElementById('city-input');
const searchBtn = document.getElementById('search-btn');
const locationBtn = document.getElementById('location-btn');
const currentCity = document.getElementById('current-city');
const currentDate = document.getElementById('current-date');
const currentTemp = document.getElementById('current-temp');
const weatherDescription = document.getElementById('weather-description');
const humidity = document.getElementById('humidity');
const windSpeed = document.getElementById('wind-speed');
const pressure = document.getElementById('pressure');
const weatherIcon = document.getElementById('weather-icon');
const forecastContainer = document.getElementById('forecast');
const celsiusBtn = document.getElementById('celsius-btn');
const fahrenheitBtn = document.getElementById('fahrenheit-btn');

// State
let currentUnit = 'celsius';

// Event Listeners
searchBtn.addEventListener('click', () => {
    const city = cityInput.value.trim();
    if (city) {
        getWeatherData(city);
    }
});

locationBtn.addEventListener('click', getLocationWeather);

cityInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const city = cityInput.value.trim();
        if (city) {
            getWeatherData(city);
        }
    }
});

celsiusBtn.addEventListener('click', () => {
    if (currentUnit !== 'celsius') {
        currentUnit = 'celsius';
        celsiusBtn.classList.add('active');
        fahrenheitBtn.classList.remove('active');
        updateTemperatureDisplay();
    }
});

fahrenheitBtn.addEventListener('click', () => {
    if (currentUnit !== 'fahrenheit') {
        currentUnit = 'fahrenheit';
        fahrenheitBtn.classList.add('active');
        celsiusBtn.classList.remove('active');
        updateTemperatureDisplay();
    }
});

// Functions
async function getWeatherData(city) {
    try {
        // Get current weather
        const currentResponse = await fetch(`${BASE_URL}/weather?q=${city}&appid=${API_KEY}&units=metric`);
        const currentData = await currentResponse.json();
        
        if (currentData.cod !== 200) {
            throw new Error(currentData.message);
        }
        
        // Get forecast
        const forecastResponse = await fetch(`${BASE_URL}/forecast?q=${city}&appid=${API_KEY}&units=metric&cnt=40`);
        const forecastData = await forecastResponse.json();
        
        displayCurrentWeather(currentData);
        displayForecast(forecastData);
        
        // Save to localStorage
        localStorage.setItem('lastCity', city);
    } catch (error) {
        alert(`Error: ${error.message}`);
        console.error('Error fetching weather data:', error);
    }
}

function getLocationWeather() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;
                try {
                    // Get current weather
                    const currentResponse = await fetch(`${BASE_URL}/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`);
                    const currentData = await currentResponse.json();
                    
                    // Get forecast
                    const forecastResponse = await fetch(`${BASE_URL}/forecast?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric&cnt=40`);
                    const forecastData = await forecastResponse.json();
                    
                    displayCurrentWeather(currentData);
                    displayForecast(forecastData);
                    
                    // Update input field
                    cityInput.value = currentData.name;
                    
                    // Save to localStorage
                    localStorage.setItem('lastCity', currentData.name);
                } catch (error) {
                    alert(`Error: ${error.message}`);
                    console.error('Error fetching weather data:', error);
                }
            },
            (error) => {
                alert(`Error getting location: ${error.message}`);
                console.error('Geolocation error:', error);
            }
        );
    } else {
        alert('Geolocation is not supported by your browser.');
    }
}

function displayCurrentWeather(data) {
    currentCity.textContent = `${data.name}, ${data.sys.country}`;
    
    // Format current date
    const now = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    currentDate.textContent = now.toLocaleDateString('en-US', options);
    
    currentTemp.dataset.celsius = Math.round(data.main.temp);
    currentTemp.dataset.fahrenheit = Math.round((data.main.temp * 9/5) + 32);
    updateTemperatureDisplay();
    
    weatherDescription.textContent = data.weather[0].description;
    humidity.textContent = data.main.humidity;
    windSpeed.textContent = Math.round(data.wind.speed * 3.6); // Convert m/s to km/h
    pressure.textContent = data.main.pressure;
    
    const iconCode = data.weather[0].icon;
    weatherIcon.src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
    weatherIcon.alt = data.weather[0].description;
}

function displayForecast(data) {
    // Clear previous forecast
    forecastContainer.innerHTML = '';
    
    // Group forecast by day
    const dailyForecast = {};
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    
    data.list.forEach(item => {
        const date = new Date(item.dt * 1000);
        const dayKey = date.toDateString();
        
        if (!dailyForecast[dayKey]) {
            dailyForecast[dayKey] = {
                date: date,
                temps: [],
                weather: [],
                icons: []
            };
        }
        
        dailyForecast[dayKey].temps.push(item.main.temp);
        dailyForecast[dayKey].weather.push(item.weather[0].description);
        dailyForecast[dayKey].icons.push(item.weather[0].icon);
    });
    
    // Get the next 5 days (skip today)
    const forecastDays = Object.keys(dailyForecast).slice(1, 6);
    
    forecastDays.forEach(dayKey => {
        const dayData = dailyForecast[dayKey];
        const dayName = daysOfWeek[dayData.date.getDay()];
        const formattedDate = dayData.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        const maxTemp = Math.max(...dayData.temps);
        const minTemp = Math.min(...dayData.temps);
        const mostCommonWeather = getMostCommonElement(dayData.weather);
        const mostCommonIcon = getMostCommonElement(dayData.icons);
        
        const forecastCard = document.createElement('div');
        forecastCard.className = 'card forecast-card';
        forecastCard.innerHTML = `
            <div class="forecast-day">${dayName}</div>
            <div class="forecast-date">${formattedDate}</div>
            <img class="forecast-icon" src="https://openweathermap.org/img/wn/${mostCommonIcon}.png" alt="${mostCommonWeather}">
            <div class="weather-desc">${mostCommonWeather}</div>
            <div class="forecast-temp">
                <span class="max-temp">${Math.round(maxTemp)}°</span>
                <span class="min-temp">${Math.round(minTemp)}°</span>
            </div>
        `;
        
        forecastContainer.appendChild(forecastCard);
    });
}

function getMostCommonElement(arr) {
    const counts = {};
    arr.forEach(item => {
        counts[item] = (counts[item] || 0) + 1;
    });
    return Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b);
}

function updateTemperatureDisplay() {
    if (currentUnit === 'celsius') {
        currentTemp.textContent = currentTemp.dataset.celsius;
    } else {
        currentTemp.textContent = currentTemp.dataset.fahrenheit;
    }
}

// Initialize app
function init() {
    const lastCity = localStorage.getItem('lastCity');
    if (lastCity) {
        cityInput.value = lastCity;
        getWeatherData(lastCity);
    } else {
        // Default city
        getWeatherData('New York');
    }
}

init();