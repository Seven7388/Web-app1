import React, { useState, useEffect } from "react";
import { WeatherData } from "../types";
import { CloudSun, Cloud, Sun, CloudRain, CloudSnow, Wind, Droplets, Search, MapPin, Sparkles, RefreshCw } from "lucide-react";

interface WeatherSectionProps {
  currentCity: string;
  onChangeCity: (city: string, temp: number) => void;
}

// Simple lookup helper to generate realistic mock data for unknown searched cities
function generateWeatherData(city: string): WeatherData {
  const normalized = city.toLowerCase().trim();
  let temp = 20;
  let condition = "Sunny";
  let humidity = 60;
  let windSpeed = 12;

  if (normalized.includes("london")) {
    temp = 18; condition = "Rainy"; humidity = 85; windSpeed = 18;
  } else if (normalized.includes("york")) {
    temp = 24; condition = "Partly Cloudy"; humidity = 65; windSpeed = 14;
  } else if (normalized.includes("tokyo")) {
    temp = 26; condition = "Sunny"; humidity = 55; windSpeed = 8;
  } else if (normalized.includes("sydney")) {
    temp = 15; condition = "Windy"; humidity = 50; windSpeed = 22;
  } else if (normalized.includes("nairobi")) {
    temp = 22; condition = "Clear"; humidity = 45; windSpeed = 10;
  } else {
    // Random but realistic weather based on character hashing
    const code = city.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
    temp = 12 + (code % 20);
    const conds = ["Sunny", "Partly Cloudy", "Cloudy", "Rainy", "Windy"];
    condition = conds[code % conds.length];
    humidity = 40 + (code % 50);
    windSpeed = 5 + (code % 20);
  }

  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const todayIdx = new Date().getDay();
  const forecast = Array.from({ length: 5 }, (_, i) => {
    const dayName = days[(todayIdx + i + 1) % 7];
    const offset = (i * 1.5) - 3;
    const fTemp = Math.round(temp + offset + (Math.sin(i) * 2));
    
    let fCond = condition;
    if (i > 1 && condition === "Sunny") fCond = "Partly Cloudy";
    if (i > 3 && condition === "Rainy") fCond = "Cloudy";

    return {
      day: dayName,
      temp: fTemp,
      condition: fCond
    };
  });

  return {
    city: city.charAt(0).toUpperCase() + city.slice(1),
    temp,
    condition,
    humidity,
    windSpeed,
    forecast
  };
}

export default function WeatherSection({ currentCity, onChangeCity }: WeatherSectionProps) {
  const [searchCity, setSearchCity] = useState("");
  const [weather, setWeather] = useState<WeatherData>(() => generateWeatherData(currentCity));
  const [loadingTip, setLoadingTip] = useState(false);
  const [aiTip, setAiTip] = useState("");
  
  // LocalStorage Search History
  const [history, setHistory] = useState<string[]>(() => {
    const saved = localStorage.getItem("sixbravo_weather_history");
    return saved ? JSON.parse(saved) : ["London", "New York", "Tokyo", "Nairobi"];
  });

  const fetchAiTip = async (data: WeatherData) => {
    setLoadingTip(true);
    try {
      const res = await fetch("/api/weather", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          city: data.city,
          temp: data.temp,
          condition: data.condition
        })
      });
      const resJson = await res.json();
      setAiTip(resJson.aiTip);
    } catch (err) {
      setAiTip(`Have a great day in ${data.city}! Perfect opportunity to step outside.`);
    } finally {
      setLoadingTip(false);
    }
  };

  useEffect(() => {
    fetchAiTip(weather);
  }, [weather.city]);

  const handleSearch = (cityToLoad: string) => {
    if (!cityToLoad.trim()) return;
    const formattedCity = cityToLoad.trim();
    const data = generateWeatherData(formattedCity);
    
    setWeather(data);
    onChangeCity(data.city, data.temp);

    // Save history
    setHistory(prev => {
      const filtered = prev.filter(c => c.toLowerCase() !== formattedCity.toLowerCase());
      const updated = [data.city, ...filtered].slice(0, 5);
      localStorage.setItem("sixbravo_weather_history", JSON.stringify(updated));
      return updated;
    });
    setSearchCity("");
  };

  const getWeatherIcon = (cond: string) => {
    const c = cond.toLowerCase();
    if (c.includes("sun") || c.includes("clear")) {
      return <Sun className="w-12 h-12 text-amber-500 animate-spin-slow" />;
    }
    if (c.includes("rain") || c.includes("shower")) {
      return <CloudRain className="w-12 h-12 text-blue-500" />;
    }
    if (c.includes("snow") || c.includes("freeze")) {
      return <CloudSnow className="w-12 h-12 text-teal-400" />;
    }
    if (c.includes("wind")) {
      return <Wind className="w-12 h-12 text-gray-500" />;
    }
    if (c.includes("cloud") && c.includes("part")) {
      return <CloudSun className="w-12 h-12 text-amber-400" />;
    }
    return <Cloud className="w-12 h-12 text-gray-400" />;
  };

  return (
    <div className="space-y-6" id="weather-section">
      
      {/* Search Header Row */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between border-b border-slate-100 pb-6">
        <div className="text-left w-full md:w-auto">
          <span className="text-[10px] font-extrabold text-indigo-600 uppercase tracking-widest bg-indigo-50 px-2.5 py-1 rounded-md">
            World Meteorological feed
          </span>
          <h3 className="text-xl font-black text-slate-900 tracking-tight mt-1.5 flex items-center gap-1.5">
            <MapPin className="w-5 h-5 text-indigo-600" />
            sixbravo Weather Radar
          </h3>
        </div>

        {/* City Input Search */}
        <div className="relative w-full md:max-w-xs group">
          <input
            type="text"
            placeholder="Search city (e.g. Paris)..."
            value={searchCity}
            onChange={(e) => setSearchCity(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch(searchCity)}
            className="w-full pl-9 pr-10 py-1.5 border border-slate-200 rounded-xl text-xs bg-slate-50/50 hover:bg-slate-50 focus:bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
          <button
            onClick={() => handleSearch(searchCity)}
            className="absolute right-2 top-1.5 bottom-1.5 px-2 bg-indigo-700 hover:bg-indigo-800 text-white rounded-lg text-[10px] font-bold"
          >
            Go
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Large Weather Display and AI Tip */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Main Weather Information Display Card */}
          <div className="bg-gradient-to-br from-indigo-600 via-indigo-700 to-indigo-950 text-white rounded-3xl p-6 md:p-8 shadow-md relative overflow-hidden text-left">
            <div className="absolute right-0 top-0 translate-y-4 translate-x-4 opacity-5">
              <CloudSun className="w-64 h-64" />
            </div>

            <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-4">
              <div>
                <h4 className="text-2xl font-black tracking-tight">{weather.city}</h4>
                <p className="text-xs text-indigo-100 font-medium">Local Condition Report • Current Session</p>
                
                <div className="flex items-baseline gap-2 mt-6">
                  <span className="text-6xl font-black font-mono tracking-tighter">{weather.temp}°C</span>
                  <span className="text-lg font-bold text-indigo-100">{weather.condition}</span>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10 self-center sm:self-start">
                {getWeatherIcon(weather.condition)}
              </div>
            </div>

            {/* Humidity and Wind Readings */}
            <div className="grid grid-cols-2 gap-4 mt-8 pt-6 border-t border-white/10">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-white/15 rounded-xl">
                  <Droplets className="w-5 h-5 text-indigo-200" />
                </div>
                <div>
                  <p className="text-[10px] text-indigo-200 font-bold uppercase tracking-wider leading-none">Humidity</p>
                  <p className="text-sm font-extrabold mt-1 font-mono">{weather.humidity}%</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-white/15 rounded-xl">
                  <Wind className="w-5 h-5 text-indigo-200" />
                </div>
                <div>
                  <p className="text-[10px] text-indigo-200 font-bold uppercase tracking-wider leading-none">Wind Velocity</p>
                  <p className="text-sm font-extrabold mt-1 font-mono">{weather.windSpeed} km/h</p>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive AI Recommendation Widget */}
          <div className="bg-amber-50/50 border border-amber-200 rounded-2xl p-5 text-left space-y-3">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <div className="p-1 bg-amber-500 rounded-lg text-white">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h5 className="text-xs font-black text-amber-800 uppercase tracking-wider">sixbravo AI Weather intelligence</h5>
                  <p className="text-[10px] text-amber-600">Dynamic lifestyle analysis for {weather.city}</p>
                </div>
              </div>
              
              {loadingTip && <RefreshCw className="w-4 h-4 text-amber-600 animate-spin shrink-0" />}
            </div>

            <div className="bg-white border border-amber-200/50 rounded-xl p-4 text-xs font-medium text-gray-700 leading-relaxed shadow-xs">
              {loadingTip ? "Analyzing microclimate parameters and clothing indices..." : aiTip}
            </div>
          </div>

        </div>

        {/* Right 1 Col: Quick Cities & 5-Day Forecast */}
        <div className="space-y-6 text-left">
          
          {/* 5-Day Forecast */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
            <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3.5 border-b border-slate-100 pb-2">
              5-Day Climate Outlook
            </h4>
            <div className="space-y-3">
              {weather.forecast.map((fc, i) => (
                <div key={i} className="flex items-center justify-between py-1 border-b border-slate-100 last:border-0 last:pb-0">
                  <span className="text-xs font-extrabold text-slate-600 w-12">{fc.day}</span>
                  <div className="flex items-center gap-1.5 text-slate-400 shrink-0">
                    <CloudSun className="w-4 h-4 text-amber-400 shrink-0" />
                    <span className="text-[10px] font-medium text-slate-500">{fc.condition}</span>
                  </div>
                  <span className="text-xs font-black text-slate-900 font-mono text-right w-12">{fc.temp}°C</span>
                </div>
              ))}
            </div>
          </div>

          {/* Location Quick Links */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
            <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">
              Searched Locations
            </h4>
            <div className="flex flex-wrap gap-2">
              {history.map((c, i) => (
                <button
                  key={i}
                  onClick={() => handleSearch(c)}
                  className={`text-xs px-3 py-1.5 rounded-xl border font-bold transition-colors ${
                    weather.city.toLowerCase() === c.toLowerCase()
                      ? "bg-indigo-50 text-indigo-700 border-indigo-200"
                      : "bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-150"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
