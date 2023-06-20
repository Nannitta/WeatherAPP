'use strict';

const urlApi = 'http://api.weatherapi.com/v1/forecast.json?key=';
const apiKey = '4f63ec3fbf1241a4a72160405231806';
const params = '&days=3&aqi=no&alerts=no&lang=es';
let locationUser = '';
let weatherInfo = {};
let weatherCurrentDay = {};
let nextDays = [];
let weatherPerHours;
let nextHours = [];

// Funcion para geolocalizacion del usuario
function getUserLocation() {
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition((position) => {
            locationUser = `&q=${position.coords.latitude},${position.coords.longitude}`;
            resolve();
    }, reject);
    });
}

// Funcion para obtener los datos de la API
async function getWeatherData() {
    await getUserLocation();
    const response = await fetch(urlApi + apiKey + locationUser + params);
    const weatherData = await response.json();

    return weatherData;
}

// Obtenemos solo los datos necesarios
async function setImportantInfo() {
    weatherInfo = await getWeatherData();

    // Datos generales del dia actual
    weatherCurrentDay = {
        city: weatherInfo.location.name,
        localtime: weatherInfo.location.localtime,
        description: weatherInfo.current.condition.text,
        temp: weatherInfo.current.temp_c,
        humidity: weatherInfo.current.humidity,
        windDireccion: weatherInfo.current.wind_dir,
        windKph: weatherInfo.current.wind_kph,
        sunrise: weatherInfo.forecast.forecastday[0].astro.sunrise,
        sunset: weatherInfo.forecast.forecastday[0].astro.sunset,
        maxTemp: weatherInfo.forecast.forecastday[0].day.maxtemp_c,
        minTemp: weatherInfo.forecast.forecastday[0].day.mintemp_c,       
    };

    // Datos de los proximos dos dias
    nextDays = [
        {
            date: weatherInfo.forecast.forecastday[0].date,
            weather: weatherInfo.forecast.forecastday[0].day.condition.text,
            maxTemp: weatherInfo.forecast.forecastday[0].day.maxtemp_c,
            minTemp: weatherInfo.forecast.forecastday[0].day.mintemp_c,
        },
        {
            date: weatherInfo.forecast.forecastday[1].date,
            weather: weatherInfo.forecast.forecastday[1].day.condition.text,
            maxTemp: weatherInfo.forecast.forecastday[1].day.maxtemp_c,
            minTemp: weatherInfo.forecast.forecastday[1].day.mintemp_c,
        },
        {
            date: weatherInfo.forecast.forecastday[2].date,
            weather: weatherInfo.forecast.forecastday[2].day.condition.text,
            maxTemp: weatherInfo.forecast.forecastday[2].day.maxtemp_c,
            minTemp: weatherInfo.forecast.forecastday[2].day.mintemp_c,
        },
    ];

    // Datos de las proximas 5 horas
    weatherPerHours = weatherInfo.forecast.forecastday[0].hour;
    let counter = 0;
    for(const hour of weatherPerHours) {
        if(hour.time > weatherInfo.location.localtime && counter !== 5) {
            const weatherDay = {
                weather: hour.condition.text,
                hour: hour.time,
            };
            nextHours.push(weatherDay);
            counter++;
        }
    }


    console.log(weatherCurrentDay);
    console.log(nextDays);
    console.log(nextHours);
}

setImportantInfo();