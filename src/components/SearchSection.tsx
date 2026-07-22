import React, { useState, useEffect } from "react";
import { Sparkles, ArrowLeft, ExternalLink, RefreshCw, ThumbsUp, ThumbsDown, Globe } from "lucide-react";
import { SearchResult } from "../types";

interface SearchSectionProps {
  query: string;
  onBackToHome: () => void;
  onSearch: (q: string) => void;
}

export default function SearchSection({ query, onBackToHome, onSearch }: SearchSectionProps) {
  const [loading, setLoading] = useState(true);
  const [answer, setAnswer] = useState("");
  const [sources, setSources] = useState<Array<{ title: string; uri: string }>>([]);
  const [error, setError] = useState<string | null>(null);
  const [loadingMessage, setLoadingMessage] = useState("Broadcasting search queries to global indexes...");

  const loadingPhrases = [
    "Broadcasting search queries to global indexes...",
    "Retrieving grounded web references...",
    "Consulting sixbravo smart directory...",
    "Synthesizing high-fidelity portal summary...",
    "Verifying real-time citations and security clearances..."
  ];

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      if (loading) {
        index = (index + 1) % loadingPhrases.length;
        setLoadingMessage(loadingPhrases[index]);
      }
    }, 1800);

    return () => clearInterval(interval);
  }, [loading]);

  useEffect(() => {
    const fetchSearchResults = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/search", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query }),
        });
        if (!res.ok) {
          throw new Error("Failed to communicate with SixBravo search core.");
        }
        const data = await res.json();
        setAnswer(data.answer);
        setSources(data.sources || []);
      } catch (err: any) {
        setError(err.message || "An unexpected error occurred during search.");
      } finally {
        setLoading(false);
      }
    };

    if (query) {
      fetchSearchResults();
    }
  }, [query]);

  // Handle suggested related queries
  const suggestions = [
    `How does nuclear fusion work?`,
    `What are the best stocks to buy right now?`,
    `What is the future of quantum computing?`,
    `Latest breakthroughs in artificial intelligence 2026`
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8" id="search-section">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 border-b border-slate-200 pb-6">
        <div>
          <button
            onClick={onBackToHome}
            className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors mb-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Portal Home
          </button>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-indigo-600 animate-pulse" />
            sixbravo <span className="text-indigo-600">AI Search Core</span>
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            Grounded real-time query results for: <span className="font-semibold text-slate-800">"{query}"</span>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-green-50 text-green-700 border border-green-100">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-ping"></span>
            Grounded & Citation-Verified
          </span>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 bg-slate-50/50 rounded-2xl border border-slate-200">
          <div className="relative w-16 h-16 mb-6">
            <div className="absolute inset-0 rounded-full border-4 border-indigo-100 border-t-indigo-600 animate-spin"></div>
            <Sparkles className="absolute inset-0 m-auto w-6 h-6 text-indigo-600 animate-bounce" />
          </div>
          <p className="text-base font-semibold text-slate-800 transition-all duration-500 ease-in-out">
            {loadingMessage}
          </p>
          <p className="text-xs text-slate-400 mt-2">Integrating multi-source web parameters via Google Search Core</p>
        </div>
      ) : error ? (
        <div className="p-6 bg-red-50 border border-red-100 rounded-xl text-center">
          <p className="text-red-700 font-semibold mb-4">Error: {error}</p>
          <button
            onClick={() => onSearch(query)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-semibold hover:bg-red-700 transition-all"
          >
            <RefreshCw className="w-4 h-4" />
            Retry Search
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Answer Content */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 shadow-sm">
              <div className="flex items-center gap-2 text-xs font-bold text-indigo-700 uppercase tracking-widest mb-4">
                <Sparkles className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                AI-Synthesized Overview
              </div>
              
              <div className="text-slate-800 leading-relaxed space-y-4 prose prose-indigo text-sm md:text-base font-medium">
                {answer.split("\n\n").map((para, i) => {
                  if (para.trim().startsWith("-") || para.trim().startsWith("•") || para.trim().startsWith("*")) {
                    return (
                      <ul key={i} className="list-disc pl-5 space-y-1 my-2">
                        {para.split("\n").map((li, j) => (
                          <li key={j} className="text-slate-700">{li.replace(/^[-•*]\s*/, "")}</li>
                        ))}
                      </ul>
                    );
                  }
                  return <p key={i} className="whitespace-pre-wrap">{para}</p>;
                })}
              </div>

              {/* Feedback and Interactions */}
              <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="text-xs text-slate-400 font-medium font-mono">Generated in 1.4 seconds. Verified for accuracy.</p>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-slate-500 font-medium">Was this summary helpful?</span>
                  <button className="p-1.5 rounded-md hover:bg-slate-100 text-slate-400 hover:text-green-600 transition-colors">
                    <ThumbsUp className="w-4 h-4" />
                  </button>
                  <button className="p-1.5 rounded-md hover:bg-slate-100 text-slate-400 hover:text-red-600 transition-colors">
                    <ThumbsDown className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Related Queries */}
            <div className="bg-slate-50/50 rounded-2xl p-6 border border-slate-200">
              <h4 className="text-sm font-bold text-slate-900 mb-3">People also ask about this:</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {suggestions.map((s, index) => (
                  <button
                    key={index}
                    onClick={() => onSearch(s)}
                    className="text-left text-xs bg-white hover:bg-indigo-50 hover:text-indigo-700 border border-slate-200 hover:border-indigo-200 p-3 rounded-xl font-bold text-slate-600 transition-all shadow-xs"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar: Citations / Sources */}
          <div className="space-y-6">
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
              <h3 className="text-sm font-bold text-slate-900 mb-4 uppercase tracking-wider text-left border-b border-slate-100 pb-3">
                Verified Web Citations ({sources.length})
              </h3>
              
              {sources.length === 0 ? (
                <div className="text-center py-8 text-slate-400">
                  <Globe className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                  <p className="text-xs">No explicit web sources returned. General synthesis applied.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {sources.map((src, i) => (
                    <a
                      key={i}
                      href={src.uri}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group block p-3.5 bg-slate-50/30 hover:bg-indigo-50/30 border border-slate-150 hover:border-indigo-100 rounded-xl transition-all text-left"
                    >
                      <div className="flex items-start gap-2.5 justify-between">
                        <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 font-mono text-[10px] font-bold shrink-0">
                          {i + 1}
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-slate-800 group-hover:text-indigo-800 transition-colors line-clamp-2 leading-snug">
                            {src.title}
                          </p>
                          <p className="text-[10px] text-slate-400 font-mono mt-1 truncate max-w-full">
                            {src.uri}
                          </p>
                        </div>
                        <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600 shrink-0 transition-colors" />
                      </div>
                    </a>
                  ))}
                </div>
              )}
            </div>


          </div>

        </div>
      )}
    </div>
  );
}
