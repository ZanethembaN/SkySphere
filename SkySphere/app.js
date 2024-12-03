const apiKey = "012c37a81427166fc7b5ef9e6e183457";

const weatherDataEl = document.getElementById("weather-data");
const cityInputEl = document.getElementById("city-input");
const formEl = document.querySelector("form");
const unitToggle = document.getElementById("unit-toggle");

let units = "metric"; // Default to Celsius

formEl.addEventListener("submit", (event) => {
    event.preventDefault();
    const cityValue = cityInputEl.value.trim();
    if (cityValue) {
        getWeatherData(cityValue);
    } else {
        weatherDataEl.innerHTML = "<p>Please enter a city name.</p>";
    }
});

unitToggle.addEventListener("change", () => {
    units = unitToggle.checked ? "imperial" : "metric";
    const cityValue = cityInputEl.value.trim();
    if (cityValue) getWeatherData(cityValue);
});

async function getWeatherData(cityValue) {
    weatherDataEl.innerHTML = '<div class="spinner"></div>'; // Show loading spinner
    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${cityValue}&appid=${apiKey}&units=${units}`
        );

        if (!response.ok) {
            throw new Error("City not found. Please try again.");
        }

        const data = await response.json();
        displayWeatherData(data);
    } catch (error) {
        weatherDataEl.innerHTML = `<p>${error.message}</p>`;
    }
}

function displayWeatherData(data) {
    const temperature = Math.round(data.main.temp);
    const description = data.weather[0].description;
    const icon = data.weather[0].icon;
    const details = [
        `Feels like: ${Math.round(data.main.feels_like)}°${units === "metric" ? "C" : "F"}`,
        `Humidity: ${data.main.humidity}%`,
        `Wind speed: ${data.wind.speed} ${units === "metric" ? "m/s" : "mph"}`,
    ];

    updateBackground(description); // Update background based on weather
    weatherDataEl.innerHTML = `
        <div class="icon">
            <img src="/weather_icon.png" alt="${description}">
        </div>
        <div class="temperature">${temperature}°${units === "metric" ? "C" : "F"}</div>
        <div class="description">${description}</div>
        <div class="details">
            ${details.map((detail) => `<div>${detail}</div>`).join("")}
        </div>
    `;
}

function updateBackground(description) {
    if (description.includes("rain")) {
        document.body.style.background = "lightblack";
    } else if (description.includes("clear")) {
        document.body.style.background = "#FFFFED";
    } else {
        document.body.style.background = "#f7f7f7"; // Default background
    }
}
