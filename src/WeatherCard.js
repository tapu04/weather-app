import React from 'react';

const WeatherCard = ({ weather }) => {
    const {
        name,
        main: { temp, humidity },
        weather: [details],
        wind: { speed },
    } = weather;

    return (
        <div>
            <h3>{name}</h3>
            <img
                src={`https://openweathermap.org/img/wn/${details.icon}@2x.png`}
                alt={details.description}
            />
            <h1>{Math.round(temp)}°C</h1>
            <p>{details.main} - {details.description}</p>
            <p>Humidity: {humidity}%</p>
            <p>Wind Speed: {speed} m/s</p>
        </div>
    );
};

export default WeatherCard;
