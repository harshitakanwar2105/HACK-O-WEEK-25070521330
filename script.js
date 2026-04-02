// Advanced Static Weather Data Presets
// Simulating an API response structure
const weatherPresets = {
    sunny: {
        city: "San Francisco",
        tempC: 24,
        condition: "Sunny and bright",
        feelsLikeC: 25,
        humidity: "40%",
        windSpeed: "15 km/h",
        pressure: "1015 hPa",
        iconClass: "fas fa-sun",
        iconColor: "#FFD700" 
    },
    rainy: {
        city: "London",
        tempC: 13,
        condition: "Heavy Rain",
        feelsLikeC: 11,
        humidity: "88%",
        windSpeed: "22 km/h",
        pressure: "1005 hPa",
        iconClass: "fas fa-cloud-showers-heavy",
        iconColor: "#e0e0e0"
    },
    cloudy: {
        city: "Seattle",
        tempC: 18,
        condition: "Overcast Clouds",
        feelsLikeC: 18,
        humidity: "65%",
        windSpeed: "10 km/h",
        pressure: "1010 hPa",
        iconClass: "fas fa-cloud",
        iconColor: "#ffffff"
    },
    night: {
        city: "Tokyo",
        tempC: 16,
        condition: "Clear Night",
        feelsLikeC: 15,
        humidity: "50%",
        windSpeed: "8 km/h",
        pressure: "1020 hPa",
        iconClass: "fas fa-moon",
        iconColor: "#F5F3CE"
    }
};

// 5-Day forecast preset
const forecastData = [
    { day: "Today", icon: "fas fa-sun", tempC: 24, color: "#FFD700" },
    { day: "Tue", icon: "fas fa-cloud-sun", tempC: 22, color: "#FFD700" },
    { day: "Wed", icon: "fas fa-cloud-showers-heavy", tempC: 18, color: "#e0e0e0" },
    { day: "Thu", icon: "fas fa-cloud", tempC: 20, color: "#ffffff" },
    { day: "Fri", icon: "fas fa-sun", tempC: 26, color: "#FFD700" },
];

let isCelsius = true;
let currentPreset = 'sunny';

// Centralize DOM Selection
const elements = {
    bg: document.getElementById('weather-bg'),
    effects: document.getElementById('weather-effects'),
    city: document.getElementById('city'),
    dateTime: document.getElementById('date-time'),
    temperature: document.getElementById('temperature'),
    tempUnit: document.getElementById('temp-unit'),
    mainIcon: document.getElementById('main-icon'),
    condition: document.getElementById('condition'),
    feelsLike: document.querySelector('#feels-like span'),
    humidity: document.getElementById('humidity'),
    windSpeed: document.getElementById('wind-speed'),
    pressure: document.getElementById('pressure'),
    forecastContainer: document.getElementById('forecast-container'),
    toggleUnitBtn: document.getElementById('toggle-unit')
};

// Main App Logic Object
const app = {
    init() {
        // Start date time interval
        this.updateDateTime();
        setInterval(() => this.updateDateTime(), 1000);
        
        // Attach Event Listeners
        elements.toggleUnitBtn.addEventListener('click', () => this.toggleUnit());
        
        // Initial Mount
        this.setWeather('sunny');
    },

    // Format and tick time
    updateDateTime() {
        const now = new Date();
        const options = { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        elements.dateTime.textContent = now.toLocaleDateString('en-US', options);
    },

    // Core functionality to switch UI states
    setWeather(presetKey) {
        currentPreset = presetKey;
        const data = weatherPresets[presetKey];
        
        // 1. Change Application Background Theme
        elements.bg.className = `weather-bg ${presetKey}`;
        
        // 2. Build Environmental Visual Effects based on theme
        this.generateEffects(presetKey);

        // 3. Set text values
        elements.city.innerHTML = `<i class="fas fa-map-marker-alt"></i> ${data.city}`;
        elements.condition.textContent = data.condition;
        elements.humidity.textContent = data.humidity;
        elements.windSpeed.textContent = data.windSpeed;
        elements.pressure.textContent = data.pressure;

        // 4. Update the main weather icon smoothly
        elements.mainIcon.style.opacity = 0; // Fade out
        setTimeout(() => {
            elements.mainIcon.className = data.iconClass;
            elements.mainIcon.style.color = data.iconColor;
            elements.mainIcon.style.opacity = 1; // Fade in
        }, 300);

        // 5. Update and animate temperatures
        const newTemp = this.getConvertedTemp(data.tempC);
        this.animateValue(elements.temperature, this.getCurrentNumber(elements.temperature.textContent), newTemp, 800);
        
        const newFeelsLike = this.getConvertedTemp(data.feelsLikeC);
        elements.feelsLike.textContent = `${newFeelsLike}°${isCelsius ? 'C' : 'F'}`;
        
        // 6. Keep forecast accurate to units
        this.renderForecast();
    },

    // Helper: Convert unit safely
    getConvertedTemp(celsius) {
        return isCelsius ? celsius : Math.round(celsius * 9/5 + 32);
    },

    // Helper: safely parse current number text
    getCurrentNumber(str) {
        const val = parseInt(str);
        return isNaN(val) ? 0 : val;
    },

    // Switch between Celsius and Fahrenheit
    toggleUnit() {
        isCelsius = !isCelsius;
        elements.tempUnit.textContent = `°${isCelsius ? 'C' : 'F'}`;
        // Re-call the render loop for the current preset to apply unit updates
        this.setWeather(currentPreset);
    },

    // Render the mini 5-day forecast
    renderForecast() {
        elements.forecastContainer.innerHTML = ''; // clear slate
        forecastData.forEach(day => {
            const finalTemp = this.getConvertedTemp(day.tempC);
            const item = document.createElement('div');
            item.className = 'forecast-item glassmorphism-sub';
            item.innerHTML = `
                <span class="day">${day.day}</span>
                <i class="${day.icon}" style="color: ${day.color};"></i>
                <span class="temps">${finalTemp}°</span>
            `;
            elements.forecastContainer.appendChild(item);
        });
    },

    // Animated "count-up" number effect
    animateValue(element, start, end, duration) {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            // Progress represents completion 0-1
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            element.innerHTML = Math.floor(progress * (end - start) + start);
            
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    },

    // Dynamic Engine injecting elements for ambient background effects
    generateEffects(type) {
        elements.effects.innerHTML = ''; // Wipe existing effect elements
        
        if (type === 'sunny') {
            const glow = document.createElement('div');
            glow.className = 'sun-glow';
            elements.effects.appendChild(glow);
        } else if (type === 'rainy') {
            // Drop ~70 rain particles at random x, random speed and delays
            for(let i=0; i<70; i++){
                const drop = document.createElement('div');
                drop.className = 'raindrop';
                drop.style.left = `${Math.random() * 100}vw`;
                drop.style.animationDuration = `${Math.random() * 1.5 + 0.5}s`;
                drop.style.animationDelay = `${Math.random() * 2}s`;
                elements.effects.appendChild(drop);
            }
        } else if (type === 'cloudy') {
            // Render smooth floating clouds
            for(let i=0; i<6; i++){
                const cloud = document.createElement('div');
                cloud.className = 'cloud-shape';
                cloud.style.width = `${Math.random() * 250 + 150}px`;
                cloud.style.height = `${Math.random() * 60 + 40}px`;
                cloud.style.top = `${Math.random() * 50}vh`; // Keep them toward the top half
                cloud.style.left = '-400px'; 
                cloud.style.animationDuration = `${Math.random() * 40 + 20}s`;
                cloud.style.animationDelay = `${Math.random() * 15}s`;
                elements.effects.appendChild(cloud);
            }
        } else if (type === 'night') {
            // Render twinkling stars
            for(let i=0; i<80; i++){
                const star = document.createElement('div');
                star.style.position = 'absolute';
                star.style.width = `${Math.random() * 3 + 1}px`;
                star.style.height = star.style.width;
                star.style.background = '#fff';
                star.style.borderRadius = '50%';
                star.style.left = `${Math.random() * 100}vw`;
                star.style.top = `${Math.random() * 100}vh`;
                star.style.opacity = Math.random();
                star.style.boxShadow = '0 0 5px #fff';
                star.style.animation = `pulseGlow ${Math.random() * 3 + 2}s infinite alternate`;
                star.style.animationDelay = `${Math.random() * 2}s`;
                elements.effects.appendChild(star);
            }
            // Add a subtle moon glow effect
            const moonGlow = document.createElement('div');
            moonGlow.className = 'sun-glow'; 
            moonGlow.style.background = 'radial-gradient(circle, rgba(200,220,255,0.4) 0%, rgba(255,255,255,0) 70%)';
            elements.effects.appendChild(moonGlow);
        }
    }
};

// Bind to global scope so inline onclick handles work (app.setWeather)
window.app = app;

// Bootstrap application once page load finishes
document.addEventListener('DOMContentLoaded', () => {
    app.init();
});
