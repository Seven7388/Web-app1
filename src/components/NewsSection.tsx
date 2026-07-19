import React, { useState } from "react";
import { NewsArticle } from "../types";
import { CATEGORIES } from "../mockData";
import { Sparkles, Calendar, User, Eye, X, RefreshCw, MessageSquare } from "lucide-react";

interface NewsSectionProps {
  articles: NewsArticle[];
  onSelectArticle?: (id: string) => void;
}

export default function NewsSection({ articles, onSelectArticle }: NewsSectionProps) {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [activeArticle, setActiveArticle] = useState<NewsArticle | null>(null);

  const filteredArticles = selectedCategory === "All"
    ? articles
    : articles.filter(a => a.category === selectedCategory);

  const featuredArticle = filteredArticles[0];
  const listArticles = filteredArticles.slice(1);

  const handleOpenArticle = (art: NewsArticle) => {
    if (onSelectArticle) {
      onSelectArticle(art.id);
    } else {
      setActiveArticle(art);
    }
  };

  return (
    <div className="space-y-6" id="news-section">
      
      {/* Category Nav Pill Row */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none border-b border-slate-150">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 ${
              selectedCategory === cat
                ? "bg-indigo-700 text-white shadow-sm shadow-indigo-100"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {filteredArticles.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <p>No news articles currently loaded in this category.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Hero Featured Story (Left 2 columns on desktop) */}
          {featuredArticle && (
            <div className="lg:col-span-2 space-y-4">
              <div
                onClick={() => handleOpenArticle(featuredArticle)}
                className="group relative h-96 rounded-2xl overflow-hidden cursor-pointer shadow-sm border border-slate-200 flex flex-col justify-end p-6 transition-all hover:shadow-md"
              >
                {/* Absolute positioned image with referrerPolicy to prevent broken images */}
                <img
                  src={featuredArticle.imageUrl}
                  alt={featuredArticle.title}
                  referrerPolicy="no-referrer"
                  className="absolute inset-0 w-full h-full object-cover z-0 group-hover:scale-102 transition-transform duration-500"
                />
                
                {/* Gradient overlay on top of image */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10 z-10" />

                <div className="absolute top-4 left-4 bg-indigo-700 text-white text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-md shadow-xs z-20">
                  {featuredArticle.category}
                </div>
                
                <div className="space-y-2 z-20">
                  <div className="flex items-center gap-3 text-xs text-indigo-200">
                    <span className="font-semibold">{featuredArticle.source}</span>
                    <span>•</span>
                    <span>{featuredArticle.time}</span>
                  </div>
                  <h3 className="text-xl md:text-2xl font-extrabold text-white group-hover:text-indigo-200 transition-colors tracking-tight leading-snug">
                    {featuredArticle.title}
                  </h3>
                  <p className="text-sm text-gray-200 line-clamp-2 leading-relaxed">
                    {featuredArticle.content}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Right Column News List / Widgets */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider text-left pl-1">
              Trending Stories
            </h4>
            <div className="space-y-3.5 max-h-[384px] overflow-y-auto pr-1">
              {listArticles.slice(0, 4).map(art => (
                <div
                  key={art.id}
                  onClick={() => handleOpenArticle(art)}
                  className="flex items-center gap-3.5 p-2 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-100 cursor-pointer transition-all"
                >
                  <img
                    src={art.imageUrl}
                    alt={art.title}
                    referrerPolicy="no-referrer"
                    className="w-18 h-18 object-cover rounded-lg shrink-0 border border-slate-200"
                  />
                  <div className="flex-1 min-w-0 text-left">
                    <span className="text-[10px] font-extrabold text-indigo-600 uppercase tracking-widest">
                      {art.category}
                    </span>
                    <h5 className="text-xs font-bold text-slate-900 line-clamp-2 leading-snug hover:text-indigo-700 transition-colors mt-0.5">
                      {art.title}
                    </h5>
                    <div className="flex items-center gap-2 text-[10px] text-gray-400 mt-1">
                      <span>{art.source}</span>
                      <span>•</span>
                      <span>{art.time}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* Grid of Remaining Articles */}
      {filteredArticles.length > 2 && (
        <div className="pt-4 border-t border-slate-150">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider text-left pl-1 mb-4">
            More News For You
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredArticles.slice(1).map(art => (
              <div
                key={art.id}
                onClick={() => handleOpenArticle(art)}
                className="group flex flex-col bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs hover:shadow-md hover:border-indigo-150 cursor-pointer transition-all text-left"
              >
                <div className="relative h-44 overflow-hidden">
                  <img
                    src={art.imageUrl}
                    alt={art.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-xs text-indigo-700 text-[10px] font-extrabold px-2 py-0.5 rounded-md">
                    {art.category}
                  </span>
                </div>
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-[10px] text-slate-400">
                      <span className="font-semibold text-slate-500">{art.source}</span>
                      <span>•</span>
                      <span>{art.time}</span>
                    </div>
                    <h5 className="text-sm font-extrabold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-2 leading-snug">
                      {art.title}
                    </h5>
                    <p className="text-xs text-gray-500 line-clamp-3 leading-relaxed mt-1">
                      {art.content}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Full Article Modal Overlay */}
      {activeArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-xs animate-fade-in" id="news-modal">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto shadow-2xl border border-gray-100 flex flex-col">
            
            {/* Modal Header */}
            <div className="sticky top-0 z-10 bg-white border-b border-slate-150 px-6 py-4 flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-extrabold uppercase bg-indigo-50 text-indigo-700 border border-indigo-100">
                {activeArticle.category} News
              </span>
              <button
                onClick={() => setActiveArticle(null)}
                className="p-1.5 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6 text-left">
              
              {/* Cover Image */}
              <div className="h-56 md:h-64 rounded-xl overflow-hidden border border-gray-100">
                <img
                  src={activeArticle.imageUrl}
                  alt={activeArticle.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Title & Metadata */}
              <div className="space-y-2">
                <h3 className="text-lg md:text-xl font-black text-gray-900 tracking-tight leading-snug">
                  {activeArticle.title}
                </h3>
                <div className="flex flex-wrap items-center gap-4 text-xs text-gray-400">
                  <div className="flex items-center gap-1">
                    <User className="w-3.5 h-3.5" />
                    <span className="font-semibold text-gray-500">{activeArticle.source}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{activeArticle.time}</span>
                  </div>
                </div>
              </div>
            

              {/* Full Article Content with Paragraphs and Additional Images */}
              <div className="text-slate-800 text-sm leading-relaxed font-sans space-y-4">
                {activeArticle.content.split("\n\n").map((paragraph, idx) => (
                  <React.Fragment key={idx}>
                    <p className="font-medium text-slate-700 leading-relaxed">{paragraph}</p>
                    
                    {/* Embed additional images beautifully between paragraphs */}
                    {activeArticle.additionalImages && activeArticle.additionalImages[idx] && (
                      <div className="my-5 rounded-xl overflow-hidden border border-slate-150 shadow-xs bg-slate-50">
                        <img
                          src={activeArticle.additionalImages[idx]}
                          alt={`${activeArticle.title} detail ${idx + 1}`}
                          referrerPolicy="no-referrer"
                          className="w-full h-48 md:h-64 object-cover"
                        />
                        <p className="bg-slate-50 text-[10px] text-slate-400 px-3 py-2 font-mono italic border-t border-slate-100">
                          Related coverage scene: {activeArticle.source} exclusive feed
                        </p>
                      </div>
                    )}
                  </React.Fragment>
                ))}
              </div>

            </div>

            {/* Modal Footer */}
            <div className="border-t border-gray-100 px-6 py-4 bg-gray-50 flex items-center justify-between text-xs text-gray-400">
              <span className="flex items-center gap-1">
                <Eye className="w-3.5 h-3.5 text-gray-400" />
                Verified Agency Feed
              </span>
              <span>© 2026 sixbravo Media Corp.</span>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
