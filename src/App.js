import React, { useState } from 'react';
import WeatherCard from './WeatherCard';

const App = () => {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);

  const API_KEY = process.env.REACT_APP_WEATHER_API_KEY;

  const fetchWeather = async () => {
    if (!city) return;
    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
      );
      const data = await res.json();
      if (data.cod === 200) {
        setWeather(data);
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error(error);
      alert("Error fetching weather data.");
    }
  };

  return (
    <div className="container">
      <h2>Weather App</h2>
      <input
        type="text"
        placeholder="Enter city..."
        value={city}
        onChange={(e) => setCity(e.target.value)}
        onKeyPress={(e) => e.key === 'Enter' && fetchWeather()}
      />
      {weather && <WeatherCard weather={weather} />}
    </div>
  );
};

export default App;
