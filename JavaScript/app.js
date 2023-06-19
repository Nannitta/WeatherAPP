'use strict';

const urlApi = 'http://api.weatherapi.com/v1/forecast.json?key=';
const apiKey = '4f63ec3fbf1241a4a72160405231806';
const params = '&days=3&aqi=no&alerts=no&lang=es';
let locationUser = '&q=';
let weatherInfo = {};

// Funcion para geolocalizacion del usuario
function getUserLocation() {
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition((position) => {
            locationUser = `${locationUser}${position.coords.latitude},${position.coords.longitude}`;
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

    const myWeatherInfo = {
        city: weatherInfo.location.name,
        localtime: weatherInfo.location.localtime,
        description: weatherInfo.current.condition.text,
        temp: weatherInfo.current.temp_c,
        humidity: weatherInfo.current.humidity,
        windDireccion: weatherInfo.current.wind_dir,
        windKph: weatherInfo.current.wind_kph,
    };
    console.log(myWeatherInfo);
    console.log(weatherInfo);   
}

setImportantInfo();