'use strict';

const h1 = document.querySelector('h1');
const h2 = document.querySelector('h2');
const h3 = document.querySelector('h3');
const temp = document.querySelector('#temp');
const hourParagraph = document.querySelector('.hourParagraph');
const ulHours = document.querySelector('.nextHours');
const ulDays = document.querySelector('.nextDays');
const moreInfo = document.querySelector('.moreInfo');
const temperatures = document.querySelectorAll('.dayTemperatures p');
const humidity = document.querySelector('.humidity p');
const wind = document.querySelectorAll('.wind p');
const sunsetSunrise = document.querySelectorAll('.sunset-sunrise p');
const uv = document.querySelector('.uv p');
const backgroundApp = document.querySelector('.currentWeather');
const buttonMoreInfo = document.querySelector('.button-moreInfo');
const buttonImg = document.querySelector('.button-img');
const lastSection = document.querySelector('.last-section');
const background = document.querySelector('.background');
const containerCurrentInfo = document.querySelector('.container-currentInfo');
const acceptButton = document.querySelector('.accept');
const geolocationDiv = document.querySelector('.geolocation');
const main = document.querySelector('main');
const mainContainer = document.querySelector('.main-container');
const cancelButton = document.querySelector('.cancel');
const geolocationParagraph = document.querySelector('.geolocationParagraph');
const back = document.querySelector('.back');
const input = document.querySelector('input');
const inputContainer = document.querySelector('.input-container');
const geolocButtons = document.querySelector('.geolocButtons');

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const urlApi = 'http://api.weatherapi.com/v1/forecast.json?key=';
const apiKey = '4f63ec3fbf1241a4a72160405231806';
const params = '&days=3&aqi=no&alerts=no&lang=es';
let locationUser = '';
let weatherInfo = {};
let weatherCurrentDay = {};
let nextDays = [];
let weatherPerHours;
let nextHours = [];
let windowMoreInfo = false;

// Creamos un array para poder determinar segun el tiempo que haga el icono que le corresponde
const forecastIcons = [
    {
        name: ['Soleado'],
        img: '../assets/sunny.svg',
        imgBack: '../assets/background/sun.png'
    },
    {
        name: ['Despejado'],
        img: '../assets/moon.svg',
        imgBack: '../assets/background/moon.png'
    },
    {
        name: ['Parcialmente nublado'],
        img: '../assets/daily-cloudy.svg',
        imgBack: '../assets/background/party-cloud.png'
    },
    {
        name: ['Nublado', 'Cielo cubierto'],
        img: '../assets/cloud.svg',
        imgBack: '../assets/background/cloud.png'
    },
    {
        name: ['Neblina', 'Niebla moderada', 'Niebla helada'],
        img: '../assets/fog.svg',
        imgBack: '../assets/background/fog.png'
    },
    {
        name: ['Lluvia  moderada a intervalos', 'Llovizna a intervalos', 'Lluvias ligeras a intervalos', 'Periodos de lluvia moderada',
                'Periodos de fuertes lluvias', 'Ligeras precipitaciones', 'Lluvias fuertes o moderadas', 'Lluvias torrenciales',
                'Ligeros chubascos de aguanieve', 'Chubascos de aguanieve fuertes o moderados'],
        img: '../assets/interval-rain.svg',
        imgBack: '../assets/background/interval-rain.png'
    },
    {
        name: ['Nieve moderada a intervalos en las aproximaciones', 'Aguanieve moderada a intervalos en las aproximaciones', 'Llovizna helada a intervalos en las aproximaciones',
                'Chubascos de nieve', 'Nevadas ligeras a intervalos', 'Nieve moderada a intervalos'],
        img: '../assets/interval-snow.svg',
        imgBack: '../assets/background/interval-snow.png'
    },
    {
        name: ['Cielos tormentosos en las aproximaciones'],
        img: '../assets/thunderstorm.svg',
        imgBack: '../assets/background/storm.png'
    },
    {
        name: ['Ventisca'],
        img: '../assets/wind.svg',
        imgBack: '../assets/background/wind.png'
    },
    {
        name: ['Llovizna', 'Llovizna helada', 'Fuerte llovizna helada', 'Ligeras  lluvias', 'Lluvia moderada', 'Fuertes lluvias', 'Ligeras lluvias heladas', 'Lluvias heladas fuertes o moderadas', 
                'Ligeras precipitaciones de aguanieve', 'Aguanieve fuerte o moderada'],
        img: '../assets/rain.svg',
        imgBack: '../assets/background/rain.png'
    },
    {
        name: ['Nevadas  ligeras', 'Nieve moderada', 'Nevadas intensas', 'Fuertes nevadas', 'Ligeras precipitaciones de nieve', 'Chubascos de nieve fuertes o moderados'],
        img: '../assets/snow.svg',
        imgBack: '../assets/background/snow.png'
    },
    {
        name: ['Granizo', 'Ligeros chubascos acompañados de granizo', 'Chubascos fuertes o moderados acompañados de granizo'],
        img: '../assets/sleet.svg',
        imgBack: '../assets/background/rain.png'
    },
    {
        name: ['Intervalos de lluvias ligeras con tomenta en la región', 'Lluvias con tormenta fuertes o moderadas en la región'],
        img: '../assets/day-storm-rain.svg',
        imgBack: '../assets/background/day-storm-rain.png'
    },
    {
        name: ['Nieve moderada con tormenta en la región', 'Nieve moderada o fuertes nevadas con tormenta en la región'],
        img: '../assets/day-storm-snow.svg',
        imgBack: '../assets/background/day-storm-snow.png'
    }
]

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Funcionalidad de los botones de geolocalizacion
function handleOneKeyUp() {
    const inputValue = input.value;
    acceptButton.removeAttribute('disabled');
    return inputValue;
}

async function handleClickAccept() {
    geolocationDiv.style.display = 'none';
    main.style.display = 'initial';
    mainContainer.style.opacity = 'initial';
    mainContainer.style.backgroundColor = 'initial';
    mainContainer.style.backgroundBlendMode = 'initial';
    locationUser = input.value;
    await weatherApp();
}

function handleClickCancel() {
    geolocationParagraph.textContent = 'Oops! No hemos podido acceder a tu localización';
    geolocationParagraph.classList.add('cancelLocation');
    acceptButton.style.display = 'none';    
    cancelButton.style.display = 'none';
    back.style.display = 'initial';
    input.style.display ='none';
    inputContainer.style.border = 'none';
}

function handleClickBack() {
    geolocationParagraph.textContent = 'Introduce tu ubicación :';
    acceptButton.style.display = 'initial';
    cancelButton.style.display = 'initial';
    back.style.display = 'none';
    input.style.display = 'initial';
    inputContainer.style.borderBottom = '1px solid  #5c557c6b';
    geolocButtons.style.display = 'flex';
}

// Funcionalidad del boton moreInfo
function handleClickButton() {
    windowMoreInfo = !windowMoreInfo;
    if(windowMoreInfo === true) {
        moreInfo.style.display = 'flex';
        buttonImg.setAttribute('src', './assets/expand-less.svg');
        lastSection.style.borderRadius = '0px 0px 0px 0px';
        containerCurrentInfo.style.display = 'none';
   } else {
        moreInfo.style.display = 'none';
        buttonImg.setAttribute('src', './assets/expand-more.svg');
        lastSection.style.borderRadius = '30px 30px 0 0';
        containerCurrentInfo.style.display = 'flex';
        containerCurrentInfo.style.flexDirection = 'column';
   }   
}

// Funcion para pasar las fechas al formato Europeo
function changeDateFormat(date) {
    const newDate = date.split('-');
    return `${newDate[2]}-${newDate[1]}`;
}

// Funcion para añadir los iconos del tiempo a los proximos 3 dias
function addIconsDescription(weather) {
    let matchIcons = [];
    forecastIcons.map((icon) => {
        icon.name.map((description) => {
            if(description === weather) {
                matchIcons.push(icon.img);
            }
        })
    })
    return matchIcons;
};

// Funcion para añadir en el fondo el icono del tiempo actual
function addIconBackground(weather) {
    let iconBackground = '';
    forecastIcons.map((icon) => {
        icon.name.map((description) => {
            if(description === weather) {
                iconBackground = icon.imgBack;
            }
        })
    })
    return iconBackground;
}

// Funcion para obtener los datos de la API
async function getWeatherData() {
        const response = await fetch(urlApi + apiKey + '&q=' + locationUser + params);
        const weatherData = await response.json();
    
        return weatherData;
}

// Obtenemos solo los datos necesarios
async function setImportantInfo() {
    weatherInfo = await getWeatherData();

    // Datos generales del dia actual
    weatherCurrentDay = {
        city: weatherInfo.location.name,
        localtime: weatherInfo.location.localtime.split(' ')[1],
        localdate: changeDateFormat(weatherInfo.location.localtime.split(' ')[0]),
        description: weatherInfo.current.condition.text,
        temp: Math.round(weatherInfo.current.temp_c),
        humidity: weatherInfo.current.humidity,
        windDireccion: weatherInfo.current.wind_dir,
        windKph: weatherInfo.current.wind_kph,
        sunrise: weatherInfo.forecast.forecastday[0].astro.sunrise,
        sunset: weatherInfo.forecast.forecastday[0].astro.sunset,
        maxTemp: weatherInfo.forecast.forecastday[0].day.maxtemp_c,
        minTemp: weatherInfo.forecast.forecastday[0].day.mintemp_c,
        uv: weatherInfo.current.uv,       
    };

    // Datos de los proximos tres dias
    nextDays = [
        {
            date: weatherInfo.forecast.forecastday[0].date,
            weather: weatherInfo.forecast.forecastday[0].day.condition.text,
            maxTemp: Math.round(weatherInfo.forecast.forecastday[0].day.maxtemp_c) + ' °',
            minTemp: Math.round(weatherInfo.forecast.forecastday[0].day.mintemp_c) + ' °',
        },
        {
            date: weatherInfo.forecast.forecastday[1].date,
            weather: weatherInfo.forecast.forecastday[1].day.condition.text,
            maxTemp: Math.round(weatherInfo.forecast.forecastday[1].day.maxtemp_c)  + ' °',
            minTemp: Math.round(weatherInfo.forecast.forecastday[1].day.mintemp_c)  + ' °',
        },
        {
            date: weatherInfo.forecast.forecastday[2].date,
            weather: weatherInfo.forecast.forecastday[2].day.condition.text,
            maxTemp: Math.round(weatherInfo.forecast.forecastday[2].day.maxtemp_c) + ' °',
            minTemp: Math.round(weatherInfo.forecast.forecastday[2].day.mintemp_c) + ' °',
        },
    ];

    // Datos de las proximas cinco horas
    weatherPerHours = weatherInfo.forecast.forecastday[0].hour;
    let counter = 0;
    if(weatherCurrentDay.localtime.split(':')[0] < 10) {
        weatherCurrentDay.localtime = '0' + weatherCurrentDay.localtime;
    }
    for(const hour of weatherPerHours) {
        if(hour.time.split(' ')[1] > weatherCurrentDay.localtime && counter !== 5) {
            const weatherDay = {
                weather: hour.condition.text,
                hour: hour.time,
            };
            nextHours.push(weatherDay);
            counter++;
        }
    }
}

// Funcion para añadir los datos al DOM
async function addDataDOM() {
    // Añadimos ubicacion, fecha y hora
    h1.textContent = weatherCurrentDay.city;
    h2.textContent = weatherCurrentDay.localtime;
    h3.textContent = weatherCurrentDay.localdate;

    // Añadimos el icono de fondo del tiempo actual
    backgroundApp.style.background = `url(${addIconBackground(weatherCurrentDay.description)})`;
    backgroundApp.style.backgroundRepeat = 'no-repeat';
    backgroundApp.style.backgroundPosition = '20% 90%';
    backgroundApp.style.backgroundSize =  '9rem';
    

    // Añadimos la temperatura actual y una breve descripcion del tiempo
    temp.textContent = weatherCurrentDay.temp + ' °C';
    hourParagraph.textContent = weatherCurrentDay.description;

    // Añadimos el tiempo para las 5 horas siguientes a la actual
    const hourFrag = document.createDocumentFragment();

    nextHours.map((nextHour) => {
        const divContainerNextHours = document.createElement('div');
        divContainerNextHours.classList.add('container-next-hours')
        const liNextHours = document.createElement('li');
        
        liNextHours.innerHTML = `
            <p>${nextHour.hour.split(' ')[1]}</p>
            <img src="${addIconsDescription(nextHour.weather)}" alt="Weather Icon"/>
        `;
        divContainerNextHours.append(liNextHours);
        hourFrag.append(divContainerNextHours);
    });

    ulHours.append(hourFrag);

    // Añadimos la informacion de los proximos 3 dias
   const nextDaysFrag = document.createDocumentFragment();
   
   nextDays.map((nextDay) => {
       const liNextDays = document.createElement('li');
       
       liNextDays.innerHTML = `
       <p>${changeDateFormat(nextDay.date).replace('-', '/').split('-')[0]}</p>
       <img src="${addIconsDescription(nextDay.weather)}" alt="Weather Icon"/>
        <p>${nextDay.maxTemp}</p>
        <p>${nextDay.minTemp}</p>
    `;
    nextDaysFrag.append(liNextDays);
   });

   ulDays.append(nextDaysFrag);
   
   // Añadimos la informacion del article de temperaturas
   temperatures[0].textContent = `${Math.round(weatherCurrentDay.maxTemp)} °C`;
   temperatures[1].textContent = `${Math.round(weatherCurrentDay.minTemp)} °C`;
   
   // Añadimos la informacion para el amanecer|anochecer
   sunsetSunrise[0].textContent = `${weatherCurrentDay.sunrise}`;
   sunsetSunrise[1].textContent = `${weatherCurrentDay.sunset}`;

   // Añadimos la informacion relativa a UV
   uv.textContent = `${weatherCurrentDay.uv}`;
   
   // Añadimos la informacion de la humedad
   humidity.textContent = `${weatherCurrentDay.humidity} %`;
   
   // Añadimos los datos relativos al viento
   wind[0].textContent = `${weatherCurrentDay.windKph} Km/h`;
   wind[1].textContent = `${weatherCurrentDay.windDireccion}`;
}

// Listeners
buttonMoreInfo.addEventListener('click', handleClickButton);
acceptButton.addEventListener('click', handleClickAccept);
cancelButton.addEventListener('click', handleClickCancel);
back.addEventListener('click', handleClickBack);

// Funcion principal, llama al resto de funciones y hace que funcione la APP
async function weatherApp() {
    await setImportantInfo();
    await addDataDOM();
}