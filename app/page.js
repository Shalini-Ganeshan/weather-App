"use client"
import axios from 'axios';
import Head from 'next/head';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import {BsSearch} from 'react-icons/bs';
import Weather from './components/Weather';
import Loading from './components/Spinner';

function Home() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState({});
  const [loading, setLoading] = useState(false);
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  
  useEffect(() => {
    fetchWeatherByCity('New Delhi');
    fetchWeatherByCity('Mumbai');
    fetchWeatherByCity('Bangalore');
    fetchWeatherByCity('Kolkata');
    fetchWeatherByCity('Chennai');
  }, []);

  const fetchWeatherByCity = (cityName) => {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=imperial&appid=e658b4c59def5c6933e951dea638e6c0`;

    axios.get(url)
      .then((response) => {
        setWeather(prevState => ({
          ...prevState,
          [cityName]: response.data
        }));
      })
      .catch((error) => {
        console.error(`Error fetching weather data for ${cityName}:`, error);
      });
  };

  const fetchWeather = (e) => {
    e.preventDefault();
    setLoading(true);

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=e658b4c59def5c6933e951dea638e6c0`;

    axios.get(url)
      .then((response) => {
        setWeather({[city]: response.data});
        setCity('');
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching weather data:', error);
        setLoading(false);
      });
  };

  const getCurrentWeather = () => {
    setLoading(true);
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;
      const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=imperial&appid=e658b4c59def5c6933e951dea638e6c0`;

      axios.get(url)
        .then((response) => {
          setWeather({[city]: response.data});
          setLoading(false);
        })
        .catch((error) => {
          console.error('Error fetching current weather data:', error);
          setLoading(false);
        });
    });
  };

  if (loading) {
    return <Loading />;
  } else {
    return (
      <div>
        <Head>
          <title>WeatherMan</title>
          <meta name='description' content='This app was made using Next JS' />
          <link rel='icon' href='/favicon.ico' />
        </Head>
        <div className='absolute top-0 left-0 right-0 bottom-0 bg-black/30 z-[1]' />
        <Image src="https://www.wallpaperflare.com/static/795/510/447/nature-landscape-hdr-field-wallpaper.jpg" alt="Cloudy background weather image" layout='fill' className='object-cover' />
        <div className='relative flex justify-between item-center max-w-[500px] w-full m-auto text-white z-10'>
          <form className='flex mt-4 justify-between items-center w-full m-auto p-3  bg-transparent border border-gray-300 text-white rounded-2xl' onSubmit={fetchWeather}>
            <input className='bg-transparent border-none text-white focus:outline-none text-xl placeholder:text-gray-300' type="text" placeholder='Search City' value={city} onChange={(e) => setCity(e.target.value)} />
            <button type="submit"><BsSearch size={20} /></button>
          </form>
          <button onClick={getCurrentWeather} className="bg-blue-500 text-white px-4 py-2 rounded-lg mt-4">Get My Current Weather</button>
        </div>
        <div>
          {weather[city] && <Weather data={weather[city]} />}
        </div>
     {/* Display top five cities' weather information */}
<div className="hidden lg:flex justify-between items-center mt-8">
  {Object.keys(weather).map(cityName => (
    <div key={cityName}>
      <Image src={`https://source.unsplash.com/100x100/?${cityName}`} alt={cityName} width={100} height={100} />
      <p>{cityName}</p>
      {weather[cityName].main && <Weather data={weather[cityName]} />}
    </div>
  ))}
</div>

        <div className="hidden lg:flex justify-between items-center mt-8">
          {Object.keys(weather).map(cityName => (
            <div key={cityName}>
              <Image src={`https://source.unsplash.com/100x100/?${cityName}`} alt={cityName} width={100} height={100} />
              <p>{cityName}</p>
              {weather[cityName].main && <Weather data={weather[cityName]} />}
            </div>
          ))}
        </div>
      </div>
    );
  }
}

export default Home;


