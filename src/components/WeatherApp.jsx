// src/components/WeatherApp.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';

const API_KEY = process.env.REACT_APP_WEATHER_API_KEY;

export default function WeatherApp() {
    const [city, setCity] = useState('');
    const [weather, setWeather] = useState(null);
    const [forecast, setForecast] = useState([]);
    const [error, setError] = useState(null);
    const [darkMode, setDarkMode] = useState(false);

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                const { latitude, longitude } = position.coords;
                fetchWeatherByCoords(latitude, longitude);
            });
        }
    }, []);

    const fetchWeather = async () => {
        try {
            setError(null);
            const res = await axios.get(
                `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
            );
            const forecastRes = await axios.get(
                `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`
            );
            setWeather(res.data);
            setForecast(forecastRes.data.list.slice(0, 5));
        } catch (err) {
            setWeather(null);
            setForecast([]);
            setError('City not found');
        }
    };

    const fetchWeatherByCoords = async (lat, lon) => {
        try {
            const res = await axios.get(
                `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
            );
            const forecastRes = await axios.get(
                `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
            );
            setWeather(res.data);
            setForecast(forecastRes.data.list.slice(0, 5));
        } catch (err) {
            setError('Unable to fetch location-based weather');
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') fetchWeather();
    };

    return (
        <div className={`min-h-screen flex flex-col items-center justify-center transition duration-500 p-4 ${darkMode ? 'bg-gray-900 text-white' : 'bg-gradient-to-r from-blue-400 to-purple-500 text-black'}`}>
            <Card className="w-full max-w-md rounded-2xl shadow-lg">
                <CardContent className="flex flex-col items-center gap-4 p-6">
                    <h1 className="text-2xl font-bold">Weather App</h1>
                    <div className="flex items-center gap-2">
                        <span>Light</span>
                        <Switch checked={darkMode} onCheckedChange={() => setDarkMode(!darkMode)} />
                        <span>Dark</span>
                    </div>
                    <Input
                        className="w-full"
                        placeholder="Enter city"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        onKeyDown={handleKeyPress}
                    />
                    <Button className="w-full" onClick={fetchWeather}>
                        Get Weather
                    </Button>
                    {error && <p className="text-red-500">{error}</p>}

                    {weather && (
                        <div className="text-center">
                            <h2 className="text-xl font-semibold">{weather.name}, {weather.sys.country}</h2>
                            <img
                                src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
                                alt="weather icon"
                                className="mx-auto"
                            />
                            <p className="capitalize">{weather.weather[0].description}</p>
                            <p className="text-3xl font-bold">{Math.round(weather.main.temp)}°C</p>
                        </div>
                    )}

                    {forecast.length > 0 && (
                        <div className="mt-4 w-full">
                            <h3 className="text-lg font-medium mb-2">Next Hours Forecast</h3>
                            <div className="grid grid-cols-2 gap-4">
                                {forecast.map((f, index) => (
                                    <div
                                        key={index}
                                        className="p-2 bg-white dark:bg-gray-800 rounded-xl shadow-md text-center"
                                    >
                                        <p className="text-sm">{new Date(f.dt_txt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                        <img
                                            src={`http://openweathermap.org/img/wn/${f.weather[0].icon}.png`}
                                            alt={f.weather[0].description}
                                            className="mx-auto"
                                        />
                                        <p className="text-sm">{Math.round(f.main.temp)}°C</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
