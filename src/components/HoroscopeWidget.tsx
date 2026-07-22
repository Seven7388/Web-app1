import React, { useState, useEffect } from "react";
import { ZODIAC_SIGNS } from "../mockData";
import { Sparkles, Compass, RefreshCw, Star } from "lucide-react";

export default function HoroscopeWidget() {
  const [selectedSign, setSelectedSign] = useState(() => {
    const saved = localStorage.getItem("sixbravo_zodiac_sign");
    return saved || "Capricorn";
  });
  
  const [loading, setLoading] = useState(false);
  const [prediction, setPrediction] = useState("");

  const fetchHoroscope = async (sign: string) => {
    setLoading(true);
    try {
      const res = await fetch("/api/horoscope", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sign })
      });
      const data = await res.json();
      setPrediction(data.prediction);
    } catch (err) {
      setPrediction("The celestial alignment is highly positive. Your lucky numbers: 7, 18, 33. Focus on digital blueprints and full-stack deployments today.");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectSign = (sign: string) => {
    setSelectedSign(sign);
    localStorage.setItem("sixbravo_zodiac_sign", sign);
    fetchHoroscope(sign);
  };

  useEffect(() => {
    fetchHoroscope(selectedSign);
  }, []);

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm text-left" id="horoscope-widget">
      <div className="flex items-center justify-between gap-4 border-b border-slate-100 pb-3 mb-3">
        <div className="flex items-center gap-2">
          <Compass className="w-5 h-5 text-indigo-600 animate-spin-slow animate-pulse" />
          <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">
            Global Horoscope
          </h4>
        </div>
        
        {/* Sign Dropdown */}
        <select
          value={selectedSign}
          onChange={(e) => handleSelectSign(e.target.value)}
          className="p-1 border border-slate-200 rounded-lg text-[10px] font-bold focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-slate-50 text-slate-700"
        >
          {ZODIAC_SIGNS.map(sign => (
            <option key={sign} value={sign}>{sign}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="space-y-2 py-4">
          <div className="h-3 bg-slate-100 rounded-full animate-pulse"></div>
          <div className="h-3 bg-slate-100 rounded-full w-5/6 animate-pulse"></div>
          <div className="h-3 bg-slate-100 rounded-full w-2/3 animate-pulse"></div>
        </div>
      ) : (
        <div className="text-xs text-slate-600 leading-relaxed font-sans font-semibold whitespace-pre-wrap">
          {prediction}
        </div>
      )}

      <div className="mt-4 pt-3.5 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400 font-mono">
        <span>Zodiac sign: {selectedSign}</span>
        <button
          onClick={() => fetchHoroscope(selectedSign)}
          disabled={loading}
          className="flex items-center gap-1 hover:text-indigo-600 font-bold"
        >
          <RefreshCw className={`w-3 h-3 ${loading ? "animate-spin" : ""}`} />
          Refresh Alignment
        </button>
      </div>
    </div>
  );
}
