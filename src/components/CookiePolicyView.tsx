import React, { useEffect } from "react";
import { ArrowLeft } from "lucide-react";

interface CookiePolicyViewProps {
  onBack: () => void;
}

export default function CookiePolicyView({ onBack }: CookiePolicyViewProps) {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <article className="min-h-screen bg-slate-50 flex flex-col font-sans text-left" id="cookie-policy-view">
      <div className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 py-3.5 px-4 md:px-8 flex items-center justify-between shadow-xs">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-extrabold text-indigo-700 hover:text-indigo-900 bg-indigo-50 hover:bg-indigo-100/80 px-4 py-2 rounded-xl transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>
      </div>

      <header className="px-5 md:px-12 pt-10 pb-6 border-b border-slate-200 bg-white">
        <div className="flex items-center gap-2 text-[10px] font-black tracking-[0.2em] text-indigo-600 uppercase mb-3">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-600"></span>
          Legal
        </div>
        <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight mb-3">
          Cookie Policy
        </h1>
        <div className="flex items-center gap-4 text-xs text-slate-500 font-semibold">
          <span>Effective Date: July 2026</span>
        </div>
      </header>

      <div className="px-5 md:px-12 py-10 space-y-10 bg-white flex-grow">
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-slate-900">What Are Cookies</h2>
          <p className="text-slate-700 font-normal leading-relaxed text-sm md:text-base">
            Cookies are small pieces of text sent by your web browser by a website you visit. A cookie file is stored in your web browser and allows the Service or a third-party to recognize you and make your next visit easier and the Service more useful to you.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold text-slate-900">How We Use Cookies</h2>
          <p className="text-slate-700 font-normal leading-relaxed text-sm md:text-base">
            When you use and access the Service, we may place a number of cookies files in your web browser.
          </p>
          <p className="text-slate-700 font-normal leading-relaxed text-sm md:text-base">
            We use cookies for the following purposes:
          </p>
          <ul className="list-disc pl-5 text-slate-700 font-normal leading-relaxed text-sm md:text-base space-y-2">
            <li>To enable certain functions of the Service</li>
            <li>To provide analytics</li>
            <li>To store your preferences</li>
            <li>To enable advertisements delivery, including behavioral advertising</li>
          </ul>
        </section>

        <section className="space-y-4">
            <h2 className="text-xl font-bold text-slate-900">Contact Us</h2>
            <p className="text-slate-700 font-normal leading-relaxed text-sm md:text-base">
                If you have any questions about this Cookie Policy, please contact us at:
            </p>
            <p className="text-slate-700 font-normal leading-relaxed text-sm md:text-base font-mono">
                sixbravo1@yahoo.com
            </p>
        </section>
      </div>

      <footer className="bg-slate-900 text-slate-400 py-10 px-6 mt-auto text-center border-t border-slate-800">
        <p className="text-xs font-black text-white tracking-widest uppercase mb-2">GLOBAL SMART PORTAL</p>
        <p className="text-[11px] opacity-60">© 2026 Sixbravo.</p>
      </footer>
    </article>
  );
}
