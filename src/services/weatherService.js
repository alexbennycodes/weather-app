import { DateTime } from "luxon";

const API_KEY = "eb1eba69a132523decbbc1174779230d";
const BASE_URL = "https://api.openweathermap.org/data/2.5";

// https://api.openweathermap.org/data/3.0/onecall?lat={lat}&lon={lon}&exclude={part}&appid={API key}

const getWeatherData = async (infoType, searchParams) => {
  const url = new URL(BASE_URL + "/" + infoType);
  url.search = new URLSearchParams({ ...searchParams, appid: API_KEY });
  const data = await fetch(url);
  const parsedData = data.json();
  return parsedData;
};

// export default getWeatherData;

const formatCurrentWeather = (data) => {
  const {
    coord: { lat, lon },
    main: { temp, feels_like, temp_min, temp_max, humidity },
    wind: { speed },
    name,
    dt,
    sys: { country, sunrise, sunset },
    weather,
  } = data;

  const { main: details, icon } = weather[0];

  return {
    lat,
    lon,
    temp,
    feels_like,
    temp_min,
    temp_max,
    humidity,
    speed,
    name,
    dt,
    country,
    sunrise,
    sunset,
    details,
    icon,
  };
};

const formatForecastWeather = (data) => {
  let { timezone, daily, hourly } = data;
  daily = daily.slice(1, 6).map((d) => {
    return {
      title: formatToLocalTime(d.dt, timezone, "ccc"),
      temp: d.temp.day,
      icon: d.weather[0].icon,
    };
  });
  hourly = hourly.slice(1, 6).map((d) => {
    return {
      title: formatToLocalTime(d.dt, timezone, "hh:mm a"),
      temp: d.temp,
      icon: d.weather[0].icon,
    };
  });
  return { timezone, daily, hourly };
};

const getFormattedWeatherData = async (searchParams) => {
  // Current
  const currentWeather = await getWeatherData("weather", searchParams);
  const formattedCurrenWeather = await formatCurrentWeather(currentWeather);

  const { lat, lon } = formattedCurrenWeather;

  //   Forecast
  const forecastWeather = await getWeatherData("onecall", {
    lat,
    lon,
    exclude: "current, minutely,alert",
    units: searchParams.units,
  });
  const formattedForecastWeather = await formatForecastWeather(forecastWeather);

  return { ...formattedCurrenWeather, ...formattedForecastWeather };
};

const formatToLocalTime = (
  secs,
  zone,
  format = "ccc, dd LLL yyyy' | Local Time: 'hh:mm a"
) => DateTime.fromSeconds(secs).setZone(zone).toFormat(format);

const iconUrlFromCode = (code) =>
  `http://openweathermap.org/img/wn/${code}@2x.png`;

export default getFormattedWeatherData;

export { formatToLocalTime, iconUrlFromCode };
