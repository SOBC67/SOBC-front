'use client';

import { useState } from 'react';

export default function WeatherPage() {
  const [province, setProvince] = useState('');
  const [amphoe, setAmphoe] = useState('');
  const [tambon, setTambon] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchWeather = async () => {
    setLoading(true);
    setError(null);
  
    const provinceEncoded = encodeURIComponent(province);
    const amphoeEncoded = encodeURIComponent(amphoe);
    const tambonEncoded = encodeURIComponent(tambon);
  
    const url = `https://api-ipb1.khiwqqkubb.uk/weather?province=${provinceEncoded}&amphoe=${amphoeEncoded}&tambon=${tambonEncoded}`;
  
    try {
      const res = await fetch(url);
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.detail || 'Unknown error');
      }
      const data = await res.json();
      setWeatherData(data);
    } catch (err: any) {
      console.error('Fetch error:', err);
      setError(err.message);
      setWeatherData(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Check Weather</h1>

      <input
        className="border p-2 w-full mb-2"
        type="text"
        placeholder="Province"
        value={province}
        onChange={(e) => setProvince(e.target.value)}
      />
      <input
        className="border p-2 w-full mb-2"
        type="text"
        placeholder="Amphoe"
        value={amphoe}
        onChange={(e) => setAmphoe(e.target.value)}
      />
      <input
        className="border p-2 w-full mb-4"
        type="text"
        placeholder="Tambon"
        value={tambon}
        onChange={(e) => setTambon(e.target.value)}
      />

      <button
        className="bg-blue-500 text-white px-4 py-2 rounded"
        onClick={fetchWeather}
        disabled={loading}
      >
        {loading ? 'Loading...' : 'Get Weather'}
      </button>

      {error && (
        <div className="mt-4 text-red-600 font-semibold">
          ⚠️ Error: {error}
        </div>
      )}

      {weatherData && (
        <div className="mt-6 border p-4 rounded bg-gray-50">
          <h2 className="text-xl font-semibold mb-2">Weather Info</h2>
          <p><strong>Date:</strong> {weatherData.date}</p>
          <p><strong>Latitude:</strong> {weatherData.latitude}</p>
          <p><strong>Longitude:</strong> {weatherData.longitude}</p>
          <p><strong>Temperature (°C):</strong> {weatherData["temperature (c)"]}</p>
          <p><strong>Humidity (%):</strong> {weatherData["humidity (%)"]}</p>
          <p><strong>Rain (mm):</strong> {weatherData["rain (mm)"]}</p>
          <p><strong>Pressure (slp):</strong> {weatherData.slp}</p>
          <p><strong>Condition:</strong> {weatherData.condition}</p>
        </div>
      )}
    </div>
  );
}
