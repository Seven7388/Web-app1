import React, { useEffect } from "react";
import { ArrowLeft } from "lucide-react";

interface PrivacyPolicyViewProps {
  onBack: () => void;
}

export default function PrivacyPolicyView({ onBack }: PrivacyPolicyViewProps) {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <article className="min-h-screen bg-slate-50 flex flex-col font-sans text-left" id="privacy-policy-view">
      <div className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 py-3.5 px-4 md:px-8 flex items-center justify-between shadow-xs">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-extrabold text-indigo-700 hover:text-indigo-900 bg-indigo-50 hover:bg-indigo-100/80 px-4 py-2 rounded-xl transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>
      </div>

      <div className="max-w-3xl w-full mx-auto px-4 md:px-6 py-8 md:py-12 space-y-8 flex-1">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight leading-tight">Privacy Policy</h1>
        
        <section className="space-y-4">
            <h2 className="text-xl font-bold text-slate-900">Introduction</h2>
            <p className="text-slate-700 font-normal leading-relaxed text-sm md:text-base">
                Welcome to sixbravo ("we," "us," or "our"). This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website sixbravo.qzz.io (the "Site"). Please read this policy carefully. By using the Site, you agree to the practices described here. If you do not agree, please discontinue use of the Site.
            </p>
        </section>

        <section className="space-y-4">
            <h2 className="text-xl font-bold text-slate-900">Information We Collect</h2>
            <p className="text-slate-700 font-normal leading-relaxed text-sm md:text-base">
                We may collect information about you in the following ways:
            </p>
            <p className="text-slate-700 font-normal leading-relaxed text-sm md:text-base">
                Information you provide directly: When you sign up for our newsletter or leave a comment on an article, we collect the information you submit, such as your name and email address.
            </p>
            <p className="text-slate-700 font-normal leading-relaxed text-sm md:text-base">
                Automatically collected information: When you visit the Site, certain information is collected automatically through cookies and similar tracking technologies, including your IP address, browser type, device information, pages visited, and time spent on the Site.
            </p>
            <p className="text-slate-700 font-normal leading-relaxed text-sm md:text-base">
                Advertising and analytics data: We use Google services, including Google AdSense and Google Analytics, which may collect information about your visits to this and other websites in order to provide advertisements and analyze site traffic.
            </p>
        </section>

        <section className="space-y-4">
            <h2 className="text-xl font-bold text-slate-900">How We Use Your Information</h2>
            <p className="text-slate-700 font-normal leading-relaxed text-sm md:text-base">
                We use the information we collect to:
            </p>
            <p className="text-slate-700 font-normal leading-relaxed text-sm md:text-base">
                Operate, maintain, and improve the Site and its content. Send newsletter updates to subscribers who have opted in. Respond to comments and inquiries. Display relevant advertising through third-party ad networks. Analyze site traffic and user behavior to improve our content and services. Monitor and prevent fraudulent or unauthorized use of the Site.
            </p>
        </section>

        <section className="space-y-4">
            <h2 className="text-xl font-bold text-slate-900">Cookies and Tracking Technologies</h2>
            <p className="text-slate-700 font-normal leading-relaxed text-sm md:text-base">
                Like most websites, sixbravo uses cookies and similar tracking technologies to enhance your experience. Cookies are small data files stored on your device that help us recognize repeat visitors, understand site usage, and serve relevant advertisements.
            </p>
            <p className="text-slate-700 font-normal leading-relaxed text-sm md:text-base">
                You can control or disable cookies through your browser settings. Please note that disabling cookies may affect certain features of the Site.
            </p>
        </section>
        
        <section className="space-y-4">
            <h2 className="text-xl font-bold text-slate-900">Google AdSense and Advertising</h2>
            <p className="text-slate-700 font-normal leading-relaxed text-sm md:text-base">
                This Site may display advertisements served by Google AdSense and other third-party advertising networks. These companies may use cookies, web beacons, or similar technologies to collect information about your visits to this and other websites in order to provide advertisements about goods and services that may interest you.
            </p>
            <p className="text-slate-700 font-normal leading-relaxed text-sm md:text-base">
                Google's use of advertising cookies enables it and its partners to serve ads based on your visits to this Site and other sites on the Internet. You may opt out of personalized advertising by visiting Google's Ads Settings at https://adssettings.google.com.
            </p>
        </section>

        <section className="space-y-4">
            <h2 className="text-xl font-bold text-slate-900">Google Analytics</h2>
            <p className="text-slate-700 font-normal leading-relaxed text-sm md:text-base">
                We use Google Analytics to help us understand how visitors engage with the Site. Google Analytics collects information anonymously and reports website trends without identifying individual visitors. You can learn more about how Google collects and processes data at https://policies.google.com/technologies/partner-sites, and you may opt out of Google Analytics tracking by installing the Google Analytics Opt-out Browser Add-on.
            </p>
        </section>

        <section className="space-y-4">
            <h2 className="text-xl font-bold text-slate-900">Newsletter and Comments</h2>
            <p className="text-slate-700 font-normal leading-relaxed text-sm md:text-base">
                If you subscribe to our newsletter, we will use your email address solely to send you updates, articles, and announcements from sixbravo. You may unsubscribe at any time using the link provided in every email we send.
            </p>
            <p className="text-slate-700 font-normal leading-relaxed text-sm md:text-base">
                If you leave a comment on an article, the information you submit, including your name and comment content, may be publicly visible on the Site. Please avoid sharing sensitive personal information in comments.
            </p>
        </section>

        <section className="space-y-4">
            <h2 className="text-xl font-bold text-slate-900">Third-Party Links</h2>
            <p className="text-slate-700 font-normal leading-relaxed text-sm md:text-base">
                Our Site may contain links to third-party websites, including affiliate links and advertisements. We are not responsible for the privacy practices or content of these external sites. We encourage you to review the privacy policies of any third-party site you visit.
            </p>
        </section>

        <section className="space-y-4">
            <h2 className="text-xl font-bold text-slate-900">Data Security</h2>
            <p className="text-slate-700 font-normal leading-relaxed text-sm md:text-base">
                We take reasonable measures to protect the information we collect from unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet or electronic storage is completely secure, and we cannot guarantee absolute security.
            </p>
        </section>

        <section className="space-y-4">
            <h2 className="text-xl font-bold text-slate-900">Children's Privacy</h2>
            <p className="text-slate-700 font-normal leading-relaxed text-sm md:text-base">
                sixbravo is not directed at children under the age of 13, and we do not knowingly collect personal information from children under 13. If you believe a child has provided us with personal information, please contact us so we can remove it.
            </p>
        </section>

        <section className="space-y-4">
            <h2 className="text-xl font-bold text-slate-900">Changes to This Privacy Policy</h2>
            <p className="text-slate-700 font-normal leading-relaxed text-sm md:text-base">
                We may update this Privacy Policy from time to time to reflect changes in our practices or for legal, operational, or regulatory reasons. The updated version will be indicated by a revised date at the top of this page. We encourage you to review this policy periodically.
            </p>
        </section>

        <section className="space-y-4">
            <h2 className="text-xl font-bold text-slate-900">Contact Us</h2>
            <p className="text-slate-700 font-normal leading-relaxed text-sm md:text-base">
                If you have any questions or concerns about this Privacy Policy or our data practices, please contact us at:
            </p>
            <p className="text-slate-700 font-normal leading-relaxed text-sm md:text-base font-mono">
                sixbravo1@yahoo.com
            </p>
        </section>

      </div>

      <footer className="bg-slate-900 text-slate-400 py-10 px-6 mt-16 text-center border-t border-slate-800">
        <p className="text-xs font-black text-white tracking-widest uppercase mb-2">GLOBAL SMART PORTAL</p>
        <p className="text-[11px] opacity-60">© 2026 Sixbravo.</p>
      </footer>
    </article>
  );
}
