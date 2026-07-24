import { useState, useEffect } from "react";
import { X } from "lucide-react";

export default function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const hasAcceptedCookies = localStorage.getItem("global_portal_cookies_accepted");
    if (!hasAcceptedCookies) {
      // Slight delay for better UX
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("global_portal_cookies_accepted", "true");
    setIsVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem("global_portal_cookies_accepted", "false");
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[100] p-4 animate-in slide-in-from-bottom-8 duration-500">
      <div className="max-w-4xl mx-auto bg-slate-900 text-white rounded-2xl shadow-2xl overflow-hidden border border-slate-800">
        <div className="p-6 md:px-8 flex flex-col md:flex-row items-center gap-6 justify-between">
          <div className="flex-1 space-y-2">
            <h3 className="text-base font-bold tracking-tight">We value your privacy</h3>
            <p className="text-sm text-slate-300 font-medium leading-relaxed">
              We use cookies to enhance your browsing experience, serve personalized ads or content, and analyze our traffic. By clicking "Accept All", you consent to our use of cookies.
            </p>
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto flex-shrink-0">
            <button 
              onClick={handleDecline}
              className="flex-1 md:flex-none px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
            >
              Decline
            </button>
            <button 
              onClick={handleAccept}
              className="flex-1 md:flex-none px-5 py-2.5 rounded-xl text-sm font-bold bg-indigo-600 text-white hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-900/50"
            >
              Accept All
            </button>
          </div>
          <button 
            onClick={() => setIsVisible(false)}
            className="absolute top-4 right-4 text-slate-400 hover:text-white md:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
