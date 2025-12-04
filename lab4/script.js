// • przycisk „Pogoda”, po kliknięciu którego wykonywane jest zapytanie asynchroniczne:
//     ◦ do API Current Weather: https://openweathermap.org/current za pomocą XMLHttpRequest
//     ◦ do API 5 day forecast: https://openweathermap.org/forecast5 za pomocą Fetch API
//     • obsługa zwrotki z obu API – wypisanie pogody bieżącej oraz prognoz poniżej pola wyszukiwania
// zrobic klase do obslugi pogody
class WeatherApp {
    constructor(apiKey, currentSelector = '#current-weather', forecastSelector = '#forecast') {
        this.apiKey = apiKey;
        this.currentEl = document.querySelector(currentSelector);
        this.forecastEl = document.querySelector(forecastSelector);
        this.currentUrl = `https://api.openweathermap.org/data/2.5/weather?q={query}&appid=${apiKey}&units=metric&lang=pl`;
        this.forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q={query}&appid=${apiKey}&units=metric&lang=pl`;
        this.forecast = undefined;
        this.currentWeather = undefined;
    }

    getCurrentweather(query) {
        let url = this.currentUrl.replace('{query}', query);
        let req = new XMLHttpRequest();
        req.open('GET', url, true);
        req.addEventListener("load", () => {
            if (req.status !== 200) {
                alert('Podaj prawidlowa nazwe miasta.');
                return;
            }
            console.log(JSON.parse(req.responseText));
            this.currentWeather = JSON.parse(req.responseText);
            this.drawWeather(query);
        });
        req.send();
    }

    getForecast(query) {
        let url = this.forecastUrl.replace('{query}', query);
        fetch(url)
            .then((response) => {
                return response.json();
            })
            .then((data) => {
                if (data.cod !== "200") {
                    return;
                }
                console.log(data);
                this.forecast = data.list;
                this.drawWeather();
            });
    }

    getWeather(query) {
        this.getCurrentweather(query);
        this.getForecast(query);
    }
    drawWeather() {
        this.currentEl.innerHTML = '<h2>Bieżąca pogoda</h2>';
        this.forecastEl.innerHTML = '<h2>Forecast</h2>';
        if (this.currentWeather)
        {
            const date = new Date(this.currentWeather.dt * 1000);
            const weatherBlock = this.createWeatherBlock(
                `${date.toLocaleDateString("pl-PL")} ${date.toLocaleTimeString("pl-PL")}`,
                this.currentWeather.main.temp,
                this.currentWeather.main.feels_like,
                this.currentWeather.weather[0].icon,
                this.currentWeather.weather[0].description
            );
            this.currentEl.appendChild(weatherBlock);
        }

        if (this.forecast) {
            for (let entry of this.forecast) {
                const date = new Date(entry.dt * 1000);
                const weatherBlock = this.createWeatherBlock(
                    `${date.toLocaleDateString("pl-PL")} ${date.toLocaleTimeString("pl-PL")}`,
                    entry.main.temp,
                    entry.main.feels_like,
                    entry.weather[0].icon,
                    entry.weather[0].description
                );
                this.forecastEl.appendChild(weatherBlock);
            }
        }
    }

    createWeatherBlock(datastring, temp, feelsLike, iconName, description) {
        const blk = document.createElement('div');
        blk.className = 'weather-block';

        const left = document.createElement('div');
        left.className = 'weather-left';
        left.innerHTML = datastring;

        const img = document.createElement('img');
        img.className = 'weather-icon';
        img.src = `https://openweathermap.org/img/wn/${iconName}@2x.png`;

        const tempWrapper = document.createElement('div');

        const tempDiv = document.createElement('div');
        tempDiv.className = 'temperature';
        tempDiv.innerHTML = `${temp} &deg;C`;

        const feelsDiv = document.createElement('div');
        feelsDiv.className = 'feels-like';
        feelsDiv.innerHTML = `Odczuwalna: ${feelsLike} &deg;C`;

        tempWrapper.appendChild(tempDiv);
        tempWrapper.appendChild(feelsDiv);

        const descDiv = document.createElement('div');
        descDiv.className = 'weather-description';
        descDiv.innerHTML = description;

        blk.appendChild(left);
        blk.appendChild(img);
        blk.appendChild(tempWrapper);
        blk.appendChild(descDiv);

        return blk;
    }

}

// inicjalizacja i listener
var apiKey = "";

document.weatherApp = new WeatherApp(apiKey, '#current-weather', '#forecast');

var getWeatherBtn = document.querySelector('#get-weather-btn');
var inputField = document.querySelector('#city-input');

function buttonClicked() {
    const query = document.querySelector('#city-input').value;
    if (!query) {
        alert('Proszę wpisać nazwę miasta.');
        return;
    }
    if (apiKey === "") {
        alert('Proszę wpisać klucz API w skrypcie.');
        return;
    }
    document.weatherApp.getWeather(query);
}
getWeatherBtn.addEventListener('click', () => {
    buttonClicked();
});

inputField.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        buttonClicked();
    }
});