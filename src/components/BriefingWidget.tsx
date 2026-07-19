import React, { useState, useEffect } from "react";
import { Sparkles, RefreshCw, Calendar, Eye, HelpCircle } from "lucide-react";
import { StockInfo } from "../types";

interface BriefingWidgetProps {
  currentCity: string;
  currentTemp: number;
  currentCondition: string;
  watchlist: StockInfo[];
}

export default function BriefingWidget({ currentCity, currentTemp, currentCondition, watchlist }: BriefingWidgetProps) {
  const [loading, setLoading] = useState(false);
  const [briefing, setBriefing] = useState("");
  const [dateStr, setDateStr] = useState("");

  useEffect(() => {
    const today = new Date();
    setDateStr(today.toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric", year: "numeric" }));
  }, []);

  const fetchBriefing = async () => {
    setLoading(true);
    try {
      const topStocks = watchlist.slice(0, 3).map(s => `${s.symbol} ($${s.price.toFixed(2)})`);
      const res = await fetch("/api/briefing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userName: "User",
          weatherCity: currentCity,
          weatherTemp: currentTemp,
          weatherCondition: currentCondition,
          topStocks: topStocks
        })
      });
      const data = await res.json();
      setBriefing(data.briefing);
    } catch (err) {
      setBriefing(`Welcome back! Enjoy your custom sixbravo briefing:\n\n☀️ **Weather:** It is currently ${currentTemp}°C and ${currentCondition} in ${currentCity}.\n📈 **Finance:** Your primary watchlist tracks ${watchlist.length} active securities. Have a magnificent day!`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBriefing();
  }, [currentCity, currentTemp]);

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm relative overflow-hidden text-left" id="briefing-widget">
      
      {/* Accent Background Glow */}
      <div className="absolute right-0 top-0 w-32 h-32 bg-indigo-100/30 rounded-full blur-3xl -translate-y-4 translate-x-4 pointer-events-none"></div>

      <div className="flex items-center justify-between gap-4 border-b border-slate-100 pb-4 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 bg-indigo-700 text-white rounded-xl shadow-md shadow-indigo-100">
            <Sparkles className="w-4 h-4 text-yellow-300 fill-yellow-300" />
          </div>
          <div>
            <h4 className="text-sm font-black text-slate-900 tracking-tight leading-none">sixbravo AI Daily Brief</h4>
            <span className="text-[10px] text-slate-400 font-mono mt-1 block">{dateStr}</span>
          </div>
        </div>
        <button
          onClick={fetchBriefing}
          disabled={loading}
          className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-indigo-600 transition-colors"
          title="Regenerate Brief"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
        </button>
      </div>

      {loading ? (
        <div className="space-y-3 py-6">
          <div className="h-3.5 bg-slate-100 rounded-full w-3/4 animate-pulse"></div>
          <div className="h-3.5 bg-slate-100 rounded-full w-5/6 animate-pulse"></div>
          <div className="h-3.5 bg-slate-100 rounded-full w-2/3 animate-pulse"></div>
          <p className="text-[10px] font-mono font-bold text-indigo-500 text-center animate-bounce pt-2">Synthesizing personalized executive digest...</p>
        </div>
      ) : (
        <div className="text-slate-700 text-xs md:text-sm leading-relaxed space-y-3">
          {briefing.split("\n\n").map((para, i) => {
            if (para.trim().startsWith("-") || para.trim().startsWith("•") || para.trim().startsWith("*")) {
              return (
                <ul key={i} className="list-disc pl-5 space-y-1 my-1.5">
                  {para.split("\n").map((li, j) => (
                    <li key={j} className="text-slate-600 font-medium">{li.replace(/^[-•*]\s*/, "")}</li>
                  ))}
                </ul>
              );
            }
            return <p key={i} className="whitespace-pre-wrap font-medium">{para}</p>;
          })}
        </div>
      )}

      <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400 font-mono">
        <span className="flex items-center gap-1">
          <Eye className="w-3.5 h-3.5 text-indigo-500" />
          Personalized view
        </span>
        <span>Secure model token • standard 1s</span>
      </div>

    </div>
  );
}
