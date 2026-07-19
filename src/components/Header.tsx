import React, { useState, useEffect } from "react";
import { Search, CloudSun, User, Sparkles, Clock, Globe } from "lucide-react";

interface HeaderProps {
  onSearch: (query: string) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  currentCity: string;
  currentTemp: number;
}

export default function Header({ onSearch, activeTab, setActiveTab, currentCity, currentTemp }: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [timeStr, setTimeStr] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(
        now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit" })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearch(searchQuery);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm" id="sixbravo-header">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20 gap-4">
          
          {/* Logo Section */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab("home")}>
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full overflow-hidden shadow-xs border border-indigo-100 flex-shrink-0 bg-slate-50">
              <img 
                src="/src/assets/images/sixbravo_logo_1784459740369.jpg" 
                alt="sixbravo logo" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="flex flex-col text-left">
              <h1 className="text-2xl sm:text-3xl font-black text-indigo-700 tracking-tighter italic hover:text-indigo-800 transition-colors leading-none">
                sixbravo
              </h1>
              <span className="text-[8px] font-mono tracking-widest text-indigo-400 uppercase font-black pl-0.5 mt-0.5">
                smart portal
              </span>
            </div>
          </div>

          {/* Search Bar Section */}
          <form onSubmit={handleSearchSubmit} className="flex-1 max-w-2xl" id="sixbravo-search-form">
            <div className="flex w-full">
              <div className="relative flex-grow">
                <input
                  type="text"
                  placeholder="Search for news, symbols, or AI prompts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full border-2 border-indigo-700 rounded-l-full py-2 px-6 focus:outline-none text-sm sm:text-base bg-white text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-indigo-200"
                />
              </div>
              <button
                type="submit"
                className="bg-indigo-700 text-white font-bold px-6 sm:px-8 rounded-r-full hover:bg-indigo-800 transition-colors flex items-center gap-1.5 shrink-0 text-sm"
              >
                <Sparkles className="w-4 h-4 text-yellow-300 fill-yellow-300" />
                <span className="hidden sm:inline">Search</span>
              </button>
            </div>
          </form>

          {/* Right Header Side Widgets */}
          <div className="flex items-center gap-4">
            
            {/* Live Clock */}
            <div className="hidden md:flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200" title="Local System Time">
              <Clock className="w-3.5 h-3.5 text-slate-500" />
              <span className="text-xs font-mono text-slate-700 font-bold">{timeStr}</span>
            </div>

            {/* Quick Weather */}
            <button
              onClick={() => setActiveTab("weather")}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-left transition-all ${
                activeTab === "weather"
                  ? "bg-indigo-50 border-indigo-200 text-indigo-700"
                  : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
              }`}
              id="header-weather-btn"
            >
              <CloudSun className="w-4 h-4 text-amber-500" />
              <div className="hidden sm:block leading-none">
                <p className="text-[10px] font-medium text-slate-400 uppercase">Weather</p>
                <p className="text-xs font-bold">{currentCity}: {currentTemp}°C</p>
              </div>
            </button>



          </div>

        </div>
      </div>
    </header>
  );
}
