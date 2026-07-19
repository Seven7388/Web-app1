import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import SearchSection from "./components/SearchSection";
import NewsSection from "./components/NewsSection";
import FinanceSection from "./components/FinanceSection";
import WeatherSection from "./components/WeatherSection";
import BriefingWidget from "./components/BriefingWidget";
import HoroscopeWidget from "./components/HoroscopeWidget";
import ArticleDetailView from "./components/ArticleDetailView";
import { INITIAL_NEWS, INITIAL_STOCKS } from "./mockData";
import { StockInfo } from "./types";
import { Home, Newspaper, TrendingUp, CloudSun, Sparkles, User, Settings, ArrowUpRight, ArrowDownRight, Info } from "lucide-react";

export default function App() {
  const [activeTab, setActiveTab] = useState<string>("home");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const [activeArticleId, setActiveArticleId] = useState<string | null>(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get("article");
  });

  useEffect(() => {
    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search);
      setActiveArticleId(params.get("article"));
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const handleOpenArticle = (id: string) => {
    setActiveArticleId(id);
    const params = new URLSearchParams(window.location.search);
    params.set("article", id);
    window.history.pushState(null, "", "?" + params.toString());
  };

  const handleCloseArticle = () => {
    setActiveArticleId(null);
    const url = new URL(window.location.href);
    url.searchParams.delete("article");
    window.history.pushState(null, "", url.pathname + url.search);
  };
  
  // Shared Weather state
  const [currentCity, setCurrentCity] = useState<string>(() => {
    return localStorage.getItem("sixbravo_weather_city") || "London";
  });
  const [currentTemp, setCurrentTemp] = useState<number>(() => {
    const saved = localStorage.getItem("sixbravo_weather_temp");
    return saved ? parseInt(saved) : 18;
  });
  const [currentCondition, setCurrentCondition] = useState<string>("Rainy");

  // Shared Stocks index state
  const [stocks, setStocks] = useState<StockInfo[]>(() => {
    const saved = localStorage.getItem("sixbravo_stocks_index");
    return saved ? JSON.parse(saved) : INITIAL_STOCKS;
  });

  useEffect(() => {
    localStorage.setItem("sixbravo_weather_city", currentCity);
    localStorage.setItem("sixbravo_weather_temp", currentTemp.toString());
  }, [currentCity, currentTemp]);

  useEffect(() => {
    localStorage.setItem("sixbravo_stocks_index", JSON.stringify(stocks));
  }, [stocks]);

  const currentArticle = INITIAL_NEWS.find(a => a.id === activeArticleId);

  if (currentArticle) {
    return (
      <ArticleDetailView
        article={currentArticle}
        onBack={handleCloseArticle}
      />
    );
  }



  const handleSearchTrigger = (query: string) => {
    setSearchQuery(query);
    setActiveTab("search");
  };

  const handleChangeWeather = (city: string, temp: number) => {
    setCurrentCity(city);
    setCurrentTemp(temp);
    // Rough condition mapping based on standard city hash
    const normalized = city.toLowerCase();
    if (normalized.includes("london") || normalized.includes("rain")) {
      setCurrentCondition("Rainy");
    } else if (normalized.includes("tokyo") || normalized.includes("clear") || normalized.includes("sun")) {
      setCurrentCondition("Sunny");
    } else {
      setCurrentCondition("Partly Cloudy");
    }
  };

  // Nav categories
  const navItems = [
    { id: "home", label: "Dashboard", icon: Home },
    { id: "news", label: "Newsroom", icon: Newspaper },
    { id: "finance", label: "Finance & Markets", icon: TrendingUp },
    { id: "weather", label: "Weather Radar", icon: CloudSun }
  ];

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans" id="sixbravo-app">
      
      {/* Top Global Bar */}
      <div className="bg-indigo-900 text-white text-[11px] px-4 py-1.5 flex justify-between items-center z-50">
        <div className="flex space-x-4">
          <span className="font-bold cursor-pointer hover:opacity-100" onClick={() => setActiveTab("news")}>News</span>
          <span className="opacity-80 cursor-pointer hover:opacity-100" onClick={() => setActiveTab("finance")}>Finance</span>
          <span className="opacity-80 cursor-pointer hover:opacity-100" onClick={() => setActiveTab("weather")}>Weather Radar</span>
          <span className="opacity-60 hidden sm:inline">Sports</span>
          <span className="opacity-60 hidden sm:inline">Entertainment</span>
          <span className="opacity-60 hidden md:inline">Life</span>
          <span className="opacity-60 hidden md:inline">Shopping</span>
          <span className="text-yellow-400 font-bold">★ More</span>
        </div>
        <div className="flex space-x-4">
          <span className="opacity-80 hover:underline cursor-pointer">Help</span>
          <span className="opacity-80 hover:underline cursor-pointer">Settings</span>
        </div>
      </div>

      {/* Dynamic sticky header */}
      <Header
        onSearch={handleSearchTrigger}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentCity={currentCity}
        currentTemp={currentTemp}
      />

      {/* Main Container Grid */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col md:flex-row gap-6">
        
        {/* Left Side Tab Navigation (Hidden on small screens, sidebar on MD+) */}
        <aside className="hidden md:block w-52 shrink-0 text-left">
          <nav className="space-y-1 bg-white border border-slate-200 rounded-2xl p-4 sticky top-24 shadow-sm">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block px-3 mb-2">
              Discover
            </span>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isSelected = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setSearchQuery("");
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    isSelected
                      ? "bg-indigo-50 text-indigo-700 font-extrabold shadow-xs"
                      : "text-slate-600 hover:bg-slate-200 hover:text-slate-950"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{item.label}</span>
                  </div>
                </button>
              );
            })}

            {/* Vibrant Indigo/Purple Pro Plan Card */}
            <div className="mt-4 p-4 bg-gradient-to-br from-indigo-600 to-purple-700 rounded-xl text-white">
              <div className="text-[9px] font-bold tracking-wider text-indigo-200">PRO PLAN</div>
              <div className="text-xs font-bold leading-tight mt-1">Upgrade your experience.</div>
              <button className="mt-3 bg-white text-indigo-700 text-[10px] font-bold py-1 px-3 rounded-full hover:bg-indigo-50 transition-colors w-full">
                Try Free
              </button>
            </div>

            <div className="pt-4 border-t border-slate-100 mt-4 px-3 text-[10px] text-slate-400 font-medium space-y-1">
              <p>© 2026 sixbravo Inc.</p>
            </div>
          </nav>
        </aside>

        {/* Core Tab View Renderer */}
        <main className="flex-1 min-w-0">
          {activeTab === "home" && (
            <div className="space-y-6" id="dashboard-tab">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Left col span: Personalized AI Briefing and Headline Stories */}
                <div className="lg:col-span-2 space-y-6">
                  
                  {/* Centralized AI Personalized Daily Briefing */}
                  <BriefingWidget
                    currentCity={currentCity}
                    currentTemp={currentTemp}
                    currentCondition={currentCondition}
                    watchlist={stocks}
                  />

                  {/* Concise News Preview inside Home Tab */}
                  <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm">
                    <div className="flex items-center justify-between gap-4 border-b border-slate-100 pb-3.5 mb-4">
                      <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest text-left">
                        World News Bulletins
                      </h4>
                      <button
                        onClick={() => setActiveTab("news")}
                        className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
                      >
                        Enter Newsroom
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <NewsSection articles={INITIAL_NEWS} onSelectArticle={handleOpenArticle} />
                  </div>
                </div>

                {/* Right col span: Weather Radar, Markets Watchlist, Horoscope */}
                <div className="space-y-6">
                  
                  {/* 1. Horoscope Prediction */}
                  <HoroscopeWidget />

                  {/* 2. Mini Stock Market watchlist panel */}
                  <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm text-left">
                    <div className="flex items-center justify-between gap-4 border-b border-slate-100 pb-3 mb-3">
                      <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">
                        Markets quick-look
                      </h4>
                      <button
                        onClick={() => setActiveTab("finance")}
                        className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
                      >
                        Finance Desk
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="space-y-2.5">
                      {stocks.slice(0, 4).map(stk => {
                        const isUp = stk.change >= 0;
                        return (
                          <div
                            key={stk.symbol}
                            onClick={() => setActiveTab("finance")}
                            className="flex items-center justify-between p-2.5 bg-slate-50/50 hover:bg-indigo-50/20 rounded-xl cursor-pointer transition-colors border border-transparent hover:border-indigo-100"
                          >
                            <div>
                              <p className="text-xs font-black text-gray-950 font-mono leading-none">{stk.symbol}</p>
                              <p className="text-[9px] text-slate-400 mt-1 leading-none truncate max-w-[120px]">{stk.name}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-xs font-bold text-gray-950 font-mono leading-none">${stk.price.toFixed(2)}</p>
                              <span className={`inline-flex items-center gap-0.5 text-[9px] font-extrabold px-1.5 py-0.5 rounded-md mt-1 ${
                                isUp ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
                              }`}>
                                {isUp ? "+" : ""}{stk.changePercent.toFixed(2)}%
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* 3. Small Info Block */}
                  <div className="p-4 bg-indigo-50/30 border border-indigo-100/50 rounded-2xl flex items-start gap-3 text-left">
                    <Info className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                    <div>
                      <h5 className="text-xs font-extrabold text-indigo-900 leading-none">Did you know?</h5>
                      <p className="text-[10px] text-indigo-700/80 leading-relaxed mt-1.5">
                        SixBravo's Search is fully grounded with Google Search Core on the server, meaning it fetches live current parameters instead of relying purely on historical weights.
                      </p>
                    </div>
                  </div>

                </div>

              </div>
            </div>
          )}

          {activeTab === "news" && (
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm" id="news-tab">
              <div className="border-b border-slate-150 pb-4 mb-6 text-left">
                <h3 className="text-xl font-black text-slate-900 tracking-tight">sixbravo Editorial News</h3>
                <p className="text-xs text-slate-400 mt-1 font-medium">Real-time global reporting across politics, tech, finance, and entertainment.</p>
              </div>
              <NewsSection articles={INITIAL_NEWS} onSelectArticle={handleOpenArticle} />
            </div>
          )}

          {activeTab === "finance" && (
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm" id="finance-tab">
              <div className="border-b border-slate-150 pb-4 mb-6 text-left">
                <h3 className="text-xl font-black text-slate-900 tracking-tight">sixbravo Financial Markets</h3>
                <p className="text-xs text-slate-400 mt-1 font-medium">Live market tickers, interactive stock charts, and paper portfolio trading.</p>
              </div>
              <FinanceSection stocks={stocks} onUpdateStocks={setStocks} />
            </div>
          )}

          {activeTab === "weather" && (
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm" id="weather-tab">
              <WeatherSection currentCity={currentCity} onChangeCity={handleChangeWeather} />
            </div>
          )}



          {activeTab === "search" && (
            <SearchSection
              query={searchQuery}
              onBackToHome={() => setActiveTab("home")}
              onSearch={handleSearchTrigger}
            />
          )}
        </main>

      </div>

      {/* Bottom Ticker */}
      <div className="bg-indigo-700 py-2.5 px-6 flex items-center z-30 overflow-hidden shrink-0 hidden md:flex">
        <div className="bg-indigo-900 text-white text-[10px] px-2 py-0.5 rounded-md mr-4 font-black tracking-wider shrink-0">
          LATEST ON SIXBRAVO
        </div>
        <div className="text-white text-xs italic truncate">
          Breaking: Sixbravo expands its digital footprint into new regions... Tech: Next generation of portals features secure AI models as standard... Markets: Active securities hit multi-week highs as volume rises...
        </div>
      </div>

      {/* Bottom Navigation Rail (Sticky on mobile only) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-40 px-3 py-2 flex justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isSelected = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                setSearchQuery("");
              }}
              className={`relative flex flex-col items-center justify-center p-1.5 rounded-xl transition-all ${
                isSelected ? "text-indigo-600 scale-105 font-bold" : "text-slate-400"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[9px] font-bold mt-1 leading-none">{item.label.split(" ")[0]}</span>
            </button>
          );
        })}
      </div>

    </div>
  );
}
