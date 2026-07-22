import React, { useEffect, useState } from "react";
import { NewsArticle } from "../types";
import { ArrowLeft, Calendar, User, Eye, Share2, Bookmark, Flame, ThumbsUp, MessageSquare } from "lucide-react";

interface ArticleDetailViewProps {
  article: NewsArticle;
  onBack: () => void;
}

export default function ArticleDetailView({ article, onBack }: ArticleDetailViewProps) {
  const [storyContent, setStoryContent] = useState(article.content);

  // Scroll to top when article loads and expand story if snippet is short
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setStoryContent(article.content);

    // If story is a short snippet (< 350 chars or single paragraph), silently expand in background
    if (!article.content || article.content.length < 350 || !article.content.includes("\n\n")) {
      fetch("/api/news/expand", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: article.title,
          content: article.content,
          category: article.category,
          source: article.source
        })
      })
        .then(res => res.json())
        .then(data => {
          if (data.expandedContent) {
            setStoryContent(data.expandedContent);
          }
        })
        .catch(err => console.error("Background expansion error:", err));
    }
  }, [article.id, article.content]);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: article.title,
        text: article.content.substring(0, 100) + "...",
        url: window.location.href,
      }).catch(err => console.log(err));
    } else {
      // Fallback
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard for sharing!");
    }
  };

  return (
    <article className="min-h-screen bg-slate-50 flex flex-col font-sans text-left" id={`article-view-${article.id}`}>
      {/* Top sticky action header */}
      <div className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 py-3.5 px-4 md:px-8 flex items-center justify-between shadow-xs">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-extrabold text-indigo-700 hover:text-indigo-900 bg-indigo-50 hover:bg-indigo-100/80 px-4 py-2 rounded-xl transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Global Portal</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={handleShare}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
            title="Copy Share Link"
          >
            <Share2 className="w-4.5 h-4.5" />
          </button>
          <button className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors" title="Bookmark">
            <Bookmark className="w-4.5 h-4.5" />
          </button>
        </div>
      </div>

      {/* Main visual stage and content */}
      <div className="max-w-3xl w-full mx-auto px-4 md:px-6 py-8 md:py-12 space-y-8 flex-1">
        
        {/* Category & Badge */}
        <div className="flex items-center gap-2.5">
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-indigo-600 text-white shadow-xs">
            {article.category}
          </span>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-50 text-amber-700 border border-amber-100">
            <Flame className="w-3 h-3 text-amber-600 inline" /> Trending Now
          </span>
        </div>

        {/* Display Title */}
        <h1 className="text-2xl md:text-4xl font-black text-slate-900 tracking-tight leading-tight">
          {article.title}
        </h1>

        {/* Author / Source metadata row */}
        <div className="flex items-center justify-between border-y border-slate-200 py-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-indigo-100 border border-indigo-200 flex items-center justify-center font-black text-indigo-700 text-sm font-mono uppercase">
              {article.source.slice(0, 2)}
            </div>
            <div>
              <p className="text-xs font-black text-slate-800 leading-none">{article.source}</p>
              <p className="text-[10px] text-slate-400 mt-1 leading-none font-medium">Verified Correspondent</p>
            </div>
          </div>
          <div className="text-right text-xs text-slate-400 font-medium">
            <div className="flex items-center gap-1 justify-end">
              <Calendar className="w-3.5 h-3.5" />
              <span>{article.time}</span>
            </div>
            <p className="text-[10px] text-slate-400 mt-1">July 2026</p>
          </div>
        </div>

        {/* Dramatic Cover Image with referrerPolicy */}
        <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-md">
          <img
            src={article.imageUrl}
            alt={article.title}
            referrerPolicy="no-referrer"
            className="w-full h-[320px] md:h-[420px] object-cover"
          />
        </div>

        {/* Body content with paragraphs & embedded related media */}
        <div className="text-slate-800 text-base leading-relaxed space-y-6">
          {(storyContent || article.content || "").split("\n\n").map((paragraph, idx) => (
            <React.Fragment key={idx}>
              <p className="text-slate-700 font-normal leading-relaxed text-sm md:text-base">
                {paragraph}
              </p>

              {/* Seamless, beautiful photo embedding between paragraphs */}
              {article.additionalImages && article.additionalImages[idx] && (
                <div className="my-6 rounded-2xl overflow-hidden border border-slate-200 shadow-xs bg-slate-50">
                  <img
                    src={article.additionalImages[idx]}
                    alt={`${article.title} subscene ${idx + 1}`}
                    referrerPolicy="no-referrer"
                    className="w-full h-56 md:h-72 object-cover"
                  />
                  <div className="bg-slate-50 px-4 py-2.5 border-t border-slate-150 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                    <span className="italic">Related Scene coverage via {article.source} satellite feed</span>
                    <span>1080p Streamed</span>
                  </div>
                </div>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Reaction Section (Simulated engagement metrics to enrich layout) */}
        <div className="border-t border-slate-200 pt-6 mt-8 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4 text-slate-500 text-xs font-bold">
            <button className="flex items-center gap-1.5 hover:text-indigo-600 transition-colors">
              <ThumbsUp className="w-4 h-4" />
              <span>421 Likes</span>
            </button>
            <button className="flex items-center gap-1.5 hover:text-indigo-600 transition-colors">
              <MessageSquare className="w-4 h-4" />
              <span>58 Comments</span>
            </button>
          </div>
          <div className="text-[11px] text-slate-400 flex items-center gap-1 font-medium">
            <Eye className="w-3.5 h-3.5" />
            <span>2.4k Views today</span>
          </div>
        </div>

      </div>

      {/* Modern footer with sixbravo branding */}
      <footer className="bg-slate-900 text-slate-400 py-10 px-6 mt-16 text-center border-t border-slate-800">
        <p className="text-xs font-black text-white tracking-widest uppercase mb-2">GLOBAL SMART PORTAL</p>
        <p className="text-[11px] opacity-60">This content is published via Global Editorial Agency feeds. All rights reserved © 2026.</p>
      </footer>
    </article>
  );
}
