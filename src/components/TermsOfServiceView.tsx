import { ArrowLeft } from "lucide-react";

interface TermsOfServiceViewProps {
  onBack: () => void;
}

export default function TermsOfServiceView({ onBack }: TermsOfServiceViewProps) {
  return (
    <article className="max-w-4xl mx-auto bg-white min-h-screen border-x border-gray-100 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-xl border-b border-gray-100 px-6 py-4 flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Global Portal</span>
        </button>
      </div>

      <header className="px-6 md:px-12 pt-12 pb-8 border-b border-gray-100">
        <div className="flex items-center gap-2 text-xs font-bold tracking-widest text-indigo-600 uppercase mb-4">
          <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
          Legal
        </div>
        <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight mb-4">
          Terms of Service
        </h1>
        <div className="flex items-center gap-4 text-sm text-slate-500 font-medium">
          <span>Effective Date: July 2026</span>
        </div>
      </header>

      <div className="px-6 md:px-12 py-12 space-y-10">
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-slate-900">1. Acceptance of Terms</h2>
          <p className="text-slate-700 font-normal leading-relaxed text-sm md:text-base">
            By accessing and using this website ("Site"), you agree to be bound by these Terms of Service. If you do not agree with any of these terms, you are prohibited from using or accessing this site.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold text-slate-900">2. Use License</h2>
          <p className="text-slate-700 font-normal leading-relaxed text-sm md:text-base">
            Permission is granted to temporarily download one copy of the materials (information or software) on the Site for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
          </p>
          <ul className="list-disc pl-5 text-slate-700 font-normal leading-relaxed text-sm md:text-base space-y-2">
            <li>modify or copy the materials;</li>
            <li>use the materials for any commercial purpose, or for any public display (commercial or non-commercial);</li>
            <li>attempt to decompile or reverse engineer any software contained on the Site;</li>
            <li>remove any copyright or other proprietary notations from the materials; or</li>
            <li>transfer the materials to another person or "mirror" the materials on any other server.</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold text-slate-900">3. Disclaimer</h2>
          <p className="text-slate-700 font-normal leading-relaxed text-sm md:text-base">
            The materials on the Site are provided on an 'as is' basis. We make no warranties, expressed or implied, and hereby disclaim and negate all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold text-slate-900">4. Limitations</h2>
          <p className="text-slate-700 font-normal leading-relaxed text-sm md:text-base">
            In no event shall we or our suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on the Site.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold text-slate-900">5. Accuracy of Materials</h2>
          <p className="text-slate-700 font-normal leading-relaxed text-sm md:text-base">
            The materials appearing on the Site could include technical, typographical, or photographic errors. We do not warrant that any of the materials on the Site are accurate, complete or current. We may make changes to the materials contained on the Site at any time without notice.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold text-slate-900">6. Links</h2>
          <p className="text-slate-700 font-normal leading-relaxed text-sm md:text-base">
            We have not reviewed all of the sites linked to our website and are not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by us of the site. Use of any such linked website is at the user's own risk.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold text-slate-900">7. Modifications</h2>
          <p className="text-slate-700 font-normal leading-relaxed text-sm md:text-base">
            We may revise these terms of service for the Site at any time without notice. By using this website you are agreeing to be bound by the then current version of these terms of service.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold text-slate-900">8. Contact Us</h2>
          <p className="text-slate-700 font-normal leading-relaxed text-sm md:text-base">
            If you have any questions about these Terms, please contact us at:
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
