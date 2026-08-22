import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { StarlightLogo } from "@/components/starlight-logo";
import ContactForm from "@/components/contact-form";
import { SchoolSections } from "@/components/school-sections";

export const metadata: Metadata = {
  title: "Starlight Model School | Exclusive Islamic Education in Oyo",
  description:
    "Starlight Model School — Oyo State's premier Islamic Model School, combining deep-rooted Qur'anic values with cutting-edge technology and academic excellence.",
};

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#020617] text-slate-300 font-sans selection:bg-[#D4AF37] selection:text-black overflow-x-hidden">
      
      {/* ===== GLOBAL STYLES FOR SERIF / PREMIUM FEEL ===== */}
      <style dangerouslySetInnerHTML={{__html: `
        .font-playfair { font-family: 'Playfair Display', Georgia, serif; }
        .text-gold { color: #D4AF37; }
        .bg-gold { background-color: #D4AF37; }
        .border-gold { border-color: #D4AF37; }
        .glass-panel {
          background: rgba(15, 23, 42, 0.4);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.05);
        }
        .glass-panel:hover {
          border: 1px solid rgba(212, 175, 55, 0.3);
          background: rgba(15, 23, 42, 0.6);
        }
      `}} />

      {/* ===== MARQUEE ANNOUNCEMENT ===== */}
      <div className="fixed top-0 left-0 right-0 z-[60] h-9 bg-slate-950/80 backdrop-blur-md flex items-center border-b border-white/5">
        <div className="animate-marquee whitespace-nowrap flex items-center gap-16 text-slate-300 font-medium tracking-[0.2em] text-[10px] uppercase">
          <span className="text-gold">☪</span>
          <span>Admissions Now Open — 2026/2027 Session</span>
          <span className="text-gold">✦</span>
          <span>Islamic Values · Knowledge · Technology · Excellence</span>
          <span className="text-gold">☪</span>
          <span>Starlight Model School — Oyo, Oyo State</span>
          <span className="text-gold">✦</span>
          <span>Nursery, Primary, Junior & Senior Secondary</span>
          <span className="text-gold">☪</span>
          <span>Admissions Now Open — 2026/2027 Session</span>
        </div>
      </div>

      {/* ===== NAVBAR ===== */}
      <header className="fixed top-9 left-0 right-0 z-50 bg-[#020617]/80 backdrop-blur-xl border-b border-white/5 animate-in slide-in-from-top duration-700">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <div className="flex items-center gap-4 hover:opacity-80 transition-opacity">
              <StarlightLogo className="w-10 h-10 drop-shadow-[0_0_10px_rgba(212,175,55,0.3)]" />
              <div>
                <p className="font-playfair font-bold text-white text-lg leading-none tracking-wide">STARLIGHT</p>
                <p className="text-[9px] text-gold font-medium tracking-[0.3em] uppercase mt-1">Model School</p>
              </div>
            </div>

            {/* Nav Links */}
            <nav className="hidden lg:flex items-center gap-10">
              {["About", "Academics", "Admissions", "Campus", "Contact"].map((item) => (
                <Link
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="text-xs font-semibold text-slate-400 hover:text-white uppercase tracking-[0.15em] transition-colors"
                >
                  {item}
                </Link>
              ))}
            </nav>

            {/* CTA */}
            <div className="hidden sm:flex items-center gap-4">
              <Link
                href="/login"
                className="text-xs font-semibold text-slate-300 hover:text-white uppercase tracking-widest transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/admissions"
                className="inline-flex items-center justify-center px-6 py-2.5 text-xs font-bold text-[#020617] bg-gold hover:bg-[#b5952f] transition-all rounded-sm uppercase tracking-widest"
              >
                Apply Now
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* ===== HERO SECTION ===== */}
      <section className="relative min-h-screen flex flex-col justify-center pt-32 pb-20 overflow-hidden">
        {/* Abstract dark gradients */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-0 w-[500px] h-[500px] bg-[#0f172a]/80 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-[rgba(212,175,55,0.03)] rounded-full blur-[100px]" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 w-full">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            
            {/* Left Column: Typography & CTA */}
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-3 border border-white/10 bg-white/5 backdrop-blur-md px-4 py-1.5 rounded-full mb-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
                <span className="w-2 h-2 rounded-full bg-gold animate-pulse"></span>
                <span className="text-[10px] font-semibold tracking-[0.2em] text-slate-300 uppercase">Premium Islamic Education in Oyo</span>
              </div>

              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-playfair text-white leading-[1.1] mb-6 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
                Where <span className="text-gold italic">Deen</span> meets <br />
                Digital Excellence.
              </h1>
              
              <p className="text-lg sm:text-xl text-slate-400 font-light leading-relaxed max-w-xl animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-400">
                Nurturing the next generation with profound Islamic morals, outstanding academic rigor, and a seamlessly integrated technology platform.
              </p>

              <div className="mt-12 flex flex-wrap items-center gap-6 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-500">
                <Link
                  href="/admissions"
                  className="px-8 py-4 bg-gold hover:bg-[#b5952f] text-[#020617] font-bold text-sm tracking-widest uppercase transition-all rounded-sm flex items-center gap-3 group"
                >
                  Begin Enrollment
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </Link>
                <Link
                  href="#about"
                  className="px-8 py-4 border border-white/20 hover:border-gold hover:text-gold text-white font-bold text-sm tracking-widest uppercase transition-all rounded-sm"
                >
                  Discover Starlight
                </Link>
              </div>
            </div>

            {/* Right Column: Hero Image */}
            <div className="hidden lg:block relative h-[550px] w-full animate-in fade-in slide-in-from-right-8 duration-1000 delay-500">
              <div className="absolute inset-0 rounded-2xl overflow-hidden glass-panel p-2 transform rotate-2 hover:rotate-0 transition-transform duration-700 shadow-2xl">
                <div className="relative w-full h-full rounded-xl overflow-hidden">
                  <Image
                    src="/images/school-2.jpg" 
                    alt="Starlight School Children"
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-1000"
                    priority
                  />
                  {/* Subtle dark gradient overlay to blend with background */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-transparent opacity-80" />
                  <div className="absolute inset-0 bg-gradient-to-l from-[#020617]/50 via-transparent to-transparent opacity-50" />
                </div>
              </div>
              
              {/* Floating Badge overlay */}
              <div className="absolute -bottom-6 -left-10 glass-panel px-6 py-4 rounded-2xl shadow-xl animate-bounce-slow border-l-4 border-l-gold">
                <p className="text-3xl font-playfair text-white mb-1">100%</p>
                <p className="text-[10px] text-gold uppercase tracking-widest font-bold">Digital Integration</p>
              </div>
              <div className="absolute top-10 -right-6 glass-panel px-5 py-3 rounded-2xl shadow-xl animate-pulse">
                <p className="text-lg text-white mb-1">🏆</p>
                <p className="text-[9px] text-slate-300 uppercase tracking-widest font-bold">Oyo's Finest</p>
              </div>
            </div>

          </div>

          {/* ── SLEEK PORTAL CARDS ── */}
          <div className="mt-32 grid grid-cols-2 lg:grid-cols-4 gap-4 animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-700">
            {[
              { title: "Administrator",   desc: "Command Center",   icon: "🏛", href: "/login" },
              { title: "Educator",        desc: "Classroom Hub",    icon: "🖋", href: "/login" },
              { title: "Student",         desc: "Learning Portal",  icon: "📚", href: "/login" },
              { title: "Parent",          desc: "Progress Tracker", icon: "🤝", href: "/login" },
            ].map((portal, idx) => (
              <Link
                key={portal.title}
                href={portal.href}
                className="glass-panel group relative p-6 text-left transition-all duration-500 flex flex-col justify-between min-h-[140px] rounded-lg"
              >
                <div className="flex justify-between items-start mb-4">
                  <span className="text-gold text-2xl opacity-80 group-hover:opacity-100 transition-opacity">{portal.icon}</span>
                  <span className="text-slate-600 group-hover:text-gold transition-colors">↗</span>
                </div>
                <div>
                  <h2 className="text-sm font-bold text-white uppercase tracking-widest mb-1">{portal.title}</h2>
                  <p className="text-[10px] text-slate-400 uppercase tracking-widest">{portal.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ===== PRESTIGE STATS ===== */}
      <section className="border-y border-white/5 bg-[#020617]/50 backdrop-blur-xl py-12 relative z-10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-white/5">
            {[
              { value: "500+", label: "Elite Scholars" },
              { value: "98%",  label: "Board Pass Rate" },
              { value: "100%", label: "Digital Integration" },
              { value: "24/7", label: "Global Access" },
            ].map((stat, i) => (
              <div key={i} className="text-center px-4">
                <p className="text-3xl md:text-4xl font-playfair text-white mb-2">{stat.value}</p>
                <p className="text-[9px] text-gold uppercase tracking-[0.2em] font-semibold">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== PHILOSOPHY / ABOUT ===== */}
      <section className="py-32 relative" id="about">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div className="order-2 lg:order-1 relative h-[500px] w-full rounded-lg overflow-hidden glass-panel p-2">
              <div className="relative w-full h-full rounded-md overflow-hidden">
                <Image
                  src="/images/school-1.jpg"
                  alt="Starlight Architecture"
                  fill
                  className="object-cover opacity-60 mix-blend-luminosity hover:mix-blend-normal hover:opacity-100 transition-all duration-1000"
                />
              </div>
            </div>
            
            <div className="order-1 lg:order-2">
              <h4 className="text-gold text-xs font-bold uppercase tracking-[0.2em] mb-4 flex items-center gap-4">
                <span className="w-8 h-[1px] bg-gold"></span>
                Our Philosophy
              </h4>
              <h2 className="text-4xl lg:text-5xl font-playfair text-white leading-tight mb-8">
                A legacy of intellect, <br />
                <span className="text-slate-400 italic">grounded in faith.</span>
              </h2>
              <p className="text-slate-400 leading-relaxed font-light mb-6 text-lg">
                Located in the heart of Oyo State, Starlight Model School redefines modern education for the Muslim child. We fuse strict adherence to Islamic morals with a world-class, technology-driven curriculum.
              </p>
              <blockquote className="border-l-2 border-gold pl-6 py-2 my-10">
                <p className="text-white font-playfair text-xl italic mb-2">
                  "Seek knowledge from the cradle to the grave."
                </p>
                <footer className="text-xs text-gold tracking-widest uppercase">— Prophet Muhammad ﷺ</footer>
              </blockquote>
              
              <div className="grid sm:grid-cols-2 gap-6 mt-12">
                {[
                  { title: "Moral Fortitude", desc: "Uncompromising discipline and Qur'anic values." },
                  { title: "Academic Rigor", desc: "Excellence in WAEC, NECO & BECE standards." },
                  { title: "Digital Mastery", desc: "Fully automated, cloud-based infrastructure." },
                  { title: "Global Vision", desc: "Preparing leaders for tomorrow's challenges." }
                ].map(item => (
                  <div key={item.title}>
                    <h5 className="text-white font-bold text-sm tracking-wide mb-2">{item.title}</h5>
                    <p className="text-slate-500 text-xs leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== THE DIGITAL EXPERIENCE ===== */}
      <section className="py-32 bg-[#050A15] relative border-y border-white/5" id="campus">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h4 className="text-gold text-xs font-bold uppercase tracking-[0.2em] mb-4">The Digital Edge</h4>
            <h2 className="text-4xl md:text-5xl font-playfair text-white mb-6">Unrivaled Platform Architecture</h2>
            <p className="text-slate-400 font-light text-lg">
              Experience a sophisticated ecosystem where every operational detail is precisely engineered for seamless school management.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: "🏛", label: "Paperless Admissions", desc: "A streamlined, zero-friction digital enrollment process." },
              { icon: "📉", label: "Analytics Dashboard", desc: "Real-time metrics on attendance, fees, and academics." },
              { icon: "📑", label: "Automated Grading", desc: "Algorithmic computation of continuous assessments & exams." },
              { icon: "💳", label: "Financial Ledger", desc: "Transparent, secure invoicing and digital payment tracking." },
              { icon: "📜", label: "Smart Archives", desc: "Immutable cloud storage for student dossiers & report cards." },
              { icon: "📡", label: "Instant Comms", desc: "Direct-to-parent alerts via WhatsApp and email integrations." },
            ].map((f) => (
              <div key={f.label} className="glass-panel p-8 rounded-lg group">
                <div className="text-3xl mb-6 text-gold opacity-70 group-hover:opacity-100 group-hover:-translate-y-1 transition-all duration-300">{f.icon}</div>
                <h3 className="text-white font-bold text-sm tracking-wide uppercase mb-3">{f.label}</h3>
                <p className="text-slate-500 text-xs leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <section className="py-32 relative">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <h4 className="text-gold text-xs font-bold uppercase tracking-[0.2em] mb-4">Endorsements</h4>
          <h2 className="text-4xl md:text-5xl font-playfair text-white mb-16">Voices of Prestige</h2>
          
          <div className="grid md:grid-cols-3 gap-8 text-left">
            {[
              {
                name: "Alh. Yusuf Adegoke",
                role: "Parent",
                tag: "Real-Time Tracking",
                msg: "The level of transparency is unprecedented. Receiving live updates on my phone ensures I am always connected to my child's academic journey.",
              },
              {
                name: "Aisha A. Lawal",
                role: "Senior Prefect",
                tag: "Digital Empowerment",
                msg: "Having our results, schedules, and resources available 24/7 on a secure portal places us on par with the most elite institutions globally.",
              },
              {
                name: "Mrs. K. Salawu",
                role: "Educator",
                tag: "Operational Efficiency",
                msg: "The automation of grading and attendance allows us to focus entirely on what matters most: delivering high-quality, impactful teaching.",
              },
            ].map((t) => (
              <div key={t.name} className="glass-panel p-8 rounded-lg flex flex-col justify-between min-h-[300px]">
                <div>
                  <div className="inline-flex text-[9px] text-gold uppercase tracking-widest border border-gold/30 px-3 py-1 rounded-sm mb-6">
                    {t.tag}
                  </div>
                  <p className="text-slate-300 text-sm leading-loose font-light mb-8 font-serif italic">"{t.msg}"</p>
                </div>
                <div className="border-t border-white/10 pt-6">
                  <p className="font-bold text-white text-xs uppercase tracking-widest">{t.name}</p>
                  <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-1">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== ADMISSIONS CTA ===== */}
      <section className="py-32 bg-gold relative overflow-hidden" id="admissions">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-4xl md:text-6xl font-playfair text-[#020617] font-black mb-8 leading-tight">
            Secure their future.<br /> Apply for 2026.
          </h2>
          <p className="text-[#020617]/80 text-lg md:text-xl font-medium mb-12 max-w-2xl mx-auto">
            Join Oyo State's most prestigious Islamic educational institution. The admissions process is entirely digital and strictly merit-based.
          </p>
          <Link
            href="/admissions"
            className="inline-flex items-center justify-center px-10 py-5 bg-[#020617] text-white hover:bg-slate-800 font-bold text-sm tracking-widest uppercase transition-all rounded-sm shadow-2xl"
          >
            Commence Application
          </Link>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="bg-[#020617] pt-24 pb-12 border-t border-white/10" id="contact">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-12 mb-16">
            <div className="col-span-2">
              <div className="flex items-center gap-4 mb-6">
                <StarlightLogo className="w-8 h-8 opacity-80" />
                <div>
                  <p className="font-playfair font-bold text-white tracking-wide">STARLIGHT</p>
                  <p className="text-[8px] text-gold tracking-[0.3em] uppercase">Model School</p>
                </div>
              </div>
              <p className="text-slate-400 text-xs leading-loose max-w-md">
                An institution of uncompromising standards. Delivering premium Islamic education and technological excellence to the elite families of Oyo town.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-xs text-white uppercase tracking-[0.2em] mb-6">Headquarters</h4>
              <ul className="space-y-4 text-slate-400 text-xs">
                <li>Oyo, Oyo State, Nigeria</li>
                <li>0813 896 7797</li>
                <li>0805 680 9200</li>
                <li>starlightmodelschool10@gmail.com</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-xs text-white uppercase tracking-[0.2em] mb-6">Systems</h4>
              <ul className="space-y-4 text-slate-400 text-xs">
                {["Admin Portal", "Educator Access", "Student Hub", "Parent Dashboard"].map(l => (
                  <li key={l}><Link href="/login" className="hover:text-gold transition-colors">{l}</Link></li>
                ))}
              </ul>
            </div>
          </div>
          <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-slate-600 text-[10px] uppercase tracking-widest">© {new Date().getFullYear()} Starlight Model School. Exclusive Rights Reserved.</p>
            <p className="text-slate-600 text-[10px] uppercase tracking-widest">
              Engineered by <span className="text-slate-400">Elite Computer Technological & Consultation Ltd</span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
