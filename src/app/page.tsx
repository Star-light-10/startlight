import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { StarlightLogo } from "@/components/starlight-logo";
import ContactForm from "@/components/contact-form";
import { SchoolSections } from "@/components/school-sections";
import { HeroAudio } from "@/components/hero-audio";

export const metadata: Metadata = {
  title: "Starlight Model School | Oyo, Oyo State",
  description:
    "Starlight Model School — A trusted community school serving Yoruba families in Oyo, Oyo State, Nigeria. Nursery, Primary, Junior & Senior Secondary education with a digital management system.",
};

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 font-sans">
      {/* ===== MARQUEE ANNOUNCEMENT ===== */}
      <div className="fixed top-0 left-0 right-0 z-[60] h-10 bg-[#000080] overflow-hidden flex items-center border-b border-[#FFA500]/30 shadow-md">
        <div className="animate-marquee whitespace-nowrap flex items-center gap-16 text-white font-bold tracking-[0.2em] text-sm">
          <span className="text-[#FFA500] text-xl">★</span>
          <span>ADMISSIONS NOW OPEN FOR 2026/2027 ACADEMIC SESSION</span>
          <span className="text-[#FFA500] text-xl">★</span>
          <span>NURSERY, PRIMARY, JUNIOR & SENIOR SECONDARY</span>
          <span className="text-[#FFA500] text-xl">★</span>
          <span>APPLY ONLINE TODAY OR VISIT OUR CAMPUS</span>
          <span className="text-[#FFA500] text-xl">★</span>
          <span>EXCELLENCE IN EDUCATION</span>
          <span className="text-[#FFA500] text-xl">★</span>
          <span>ADMISSIONS NOW OPEN FOR 2026/2027 ACADEMIC SESSION</span>
        </div>
      </div>

      {/* ===== NAVBAR ===== */}
      <header className="fixed top-10 left-0 right-0 z-50 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 animate-in slide-in-from-top duration-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-3 hover:scale-105 transition-transform duration-300">
              <StarlightLogo className="w-10 h-10 drop-shadow-lg" />
              <div>
                <p className="font-black text-[#000080] dark:text-white text-sm leading-none">STARLIGHT</p>
                <p className="text-[10px] text-[#FFA500] font-semibold tracking-widest uppercase">Model School</p>
              </div>
            </div>

            {/* Nav Links */}
            <nav className="hidden lg:flex items-center gap-8">
              {["About", "Academics", "Admissions", "Facilities", "News", "Contact"].map((item) => (
                <Link
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-[#000080] dark:hover:text-[#FFA500] transition-colors"
                >
                  {item}
                </Link>
              ))}
            </nav>

            {/* CTA Buttons */}
            <div className="flex items-center gap-2">
              <Link
                href="/admissions"
                className="inline-flex items-center px-4 py-2 text-sm font-bold text-white bg-[#FFA500] hover:bg-[#e69400] rounded-full shadow-[0_0_15px_rgba(255,165,0,0.4)] hover:shadow-[0_0_25px_rgba(255,165,0,0.6)] transition-all hover:scale-105"
              >
                Apply Now →
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* ===== HERO SECTION ===== */}
      <section
        className="relative min-h-screen flex items-center pt-26 overflow-hidden perspective-1000"
        style={{
          background: "linear-gradient(135deg, #000080 0%, #1a1a6e 30%, #0a0a50 60%, #000033 100%)",
        }}
      >
        <Image
          src="/images/school-1.jpg"
          alt="School Background"
          fill
          className="object-cover opacity-10 mix-blend-screen pointer-events-none animate-in fade-in duration-[2000ms] zoom-in-110"
          priority
        />
        {/* Animated Background Circles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 right-10 w-72 h-72 bg-[#FFA500]/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 left-10 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#000080]/20 rounded-full blur-3xl" />
          {/* Stars */}
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full opacity-50"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animation: `pulse ${2 + Math.random() * 3}s infinite`,
                animationDelay: `${Math.random() * 3}s`,
              }}
            />
          ))}
        </div>

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-[#FFA500]/20 border border-[#FFA500]/40 text-[#FFA500] text-xs font-bold px-4 py-2 rounded-full mb-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <span className="animate-spin-slow">★</span>
            <span className="tracking-widest">EXCELLENCE IN EDUCATION SINCE 2005</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black leading-tight mb-4 text-white animate-in fade-in zoom-in-95 slide-in-from-bottom-8 duration-1000 delay-100 fill-mode-both drop-shadow-2xl">
            Starlight Model School
          </h1>
          <p className="text-blue-200 text-base sm:text-xl font-medium mb-4 max-w-xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300 fill-mode-both tracking-wide">
            Oyo, Oyo State — Yoruba Community School
          </p>

          {/* ── PORTAL LOGIN CARDS ── */}
          <div className="mt-14 grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-500 fill-mode-both">
            {[
              { title: "Admin",   desc: "Management &amp; records",        icon: "🏫", href: "/login", bg: "from-[#000080] to-[#1e3a8a]" },
              { title: "Teacher", desc: "Classes &amp; attendance",         icon: "👨‍🏫", href: "/login", bg: "from-[#b45309] to-[#d97706]" },
              { title: "Student", desc: "Results &amp; timetable",          icon: "👨‍🎓", href: "/login", bg: "from-[#065f46] to-[#047857]" },
              { title: "Parent",  desc: "Track child's progress",    icon: "👨‍👩‍👧", href: "/login", bg: "from-[#581c87] to-[#7e22ce]" },
            ].map((portal, idx) => (
              <Link
                key={portal.title}
                href={portal.href}
                className={`group relative bg-gradient-to-br ${portal.bg} rounded-2xl p-5 sm:p-6 text-white text-center shadow-xl hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)] hover:-translate-y-2 hover:scale-105 transition-all duration-300 border border-white/10 overflow-hidden`}
                style={{ animationDelay: `${600 + (idx * 100)}ms` }}
              >
                <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="text-3xl sm:text-4xl mb-3 transform group-hover:scale-110 transition-transform duration-300">{portal.icon}</div>
                <h2 className="text-base sm:text-lg font-black mb-1">{portal.title} Login</h2>
                <p className="text-xs text-white/70" dangerouslySetInnerHTML={{ __html: portal.desc }} />
                <div className="mt-4 inline-flex items-center gap-1 bg-white/20 group-hover:bg-white text-white group-hover:text-[#000080] text-xs font-bold px-4 py-2 rounded-full transition-colors duration-300">
                  Login →
                </div>
              </Link>
            ))}
          </div>

          {/* Apply CTA */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-700 fill-mode-both">

            <Link
              href="/admissions"
              className="inline-flex items-center gap-2 px-8 py-4 bg-[#FFA500] hover:bg-[#e69400] text-white font-black rounded-full shadow-xl hover:shadow-[#FFA500]/30 hover:shadow-2xl transition-all transform hover:-translate-y-1"
            >
              Apply for Admission 2026/2027 →
            </Link>
            <Link
              href="#about"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-bold rounded-full border border-white/30 transition-all"
            >
              Learn More
            </Link>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-8 mt-12 pt-10 border-t border-white/10">
            {[
              { value: "500+", label: "Students" },
              { value: "98%",   label: "Pass Rate" },
              { value: "10+",   label: "Years" },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-2xl font-black text-[#FFA500]">{stat.value}</p>
                <p className="text-xs text-blue-200 uppercase tracking-wider">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
        <HeroAudio />
      </section>



      {/* ===== ABOUT SECTION ===== */}
      <section className="py-24 bg-white dark:bg-gray-950" id="about">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-[#FFA500] font-bold text-sm uppercase tracking-widest">About Us</span>
              <h2 className="mt-2 text-4xl font-black text-gray-900 dark:text-white leading-tight">
                Shaping the Leaders <br /> of Oyo Tomorrow
              </h2>
              <p className="mt-6 text-gray-600 dark:text-gray-400 leading-relaxed">
                Starlight Model School was founded with a singular vision: to provide every child in Oyo town and its
                surrounding communities with the tools, knowledge, and moral character to excel. Located in the heart
                of Oyo, Oyo State, we serve Yoruba families who believe in the power of quality education blended with
                strong Islamic and cultural values.
              </p>
              <div className="mt-8 grid grid-cols-2 gap-6">
                {[
                  { icon: "🎯", title: "Our Mission", desc: "To inspire excellence through quality education, discipline, and Yoruba cultural pride." },
                  { icon: "🌟", title: "Our Vision", desc: "To be Oyo State's most trusted and technology-driven community school." },
                  { icon: "📚", title: "Curriculum", desc: "Oyo State curriculum with WAEC, NECO and BECE preparation." },
                  { icon: "🏆", title: "Excellence", desc: "Consistent top performances in Local, State & National examinations." },
                ].map((item) => (
                  <div key={item.title} className="flex gap-3">
                    <span className="text-2xl flex-shrink-0">{item.icon}</span>
                    <div>
                      <h4 className="font-bold text-gray-900 dark:text-white text-sm">{item.title}</h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex w-full">
              <SchoolSections />
            </div>
          </div>
        </div>
      </section>

      {/* ===== CAMPUS LIFE GALLERY ===== */}
      <section className="py-24 bg-gray-50 dark:bg-gray-900" id="gallery">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-[#FFA500] font-bold text-sm uppercase tracking-widest">Campus Life</span>
            <h2 className="mt-2 text-3xl md:text-4xl font-black text-gray-900 dark:text-white">
              Experience Starlight
            </h2>
            <p className="mt-4 text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
              A glimpse into our vibrant school environment, state-of-the-art facilities, and the daily lives of our brilliant students.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { src: "/images/grad-1.jpg",    alt: "Graduation Ceremony",  span: "md:col-span-2 lg:col-span-2 lg:row-span-2 border-4 border-[#FFA500]/50 hover:border-[#FFA500]", isSpecial: true },
              { src: "/images/school-2.jpg",  alt: "Our Bright Students",  span: "md:col-span-1 border-4 border-[#000080]/50 hover:border-[#000080]", isSpecial: true },
              { src: "/images/school-3.jpg",  alt: "School Activities",    span: "md:col-span-1 border border-gray-200/50" },
              { src: "/images/school-4.jpg",  alt: "School Community",     span: "md:col-span-1 border border-gray-200/50" },
              { src: "/images/school-5.jpg",  alt: "Student Life",         span: "md:col-span-1 lg:col-span-2 border border-gray-200/50" },
              { src: "/images/school-6.jpg",  alt: "Campus",               span: "md:col-span-1 border border-gray-200/50" },
            ].map((img, i) => (
              <div
                key={i}
                className={`relative group overflow-hidden rounded-3xl shadow-xl dark:border-gray-700/50 ${img.span} h-64 md:h-auto min-h-[250px] ${img.isSpecial ? "bg-gradient-to-br from-[#000080]/10 to-[#FFA500]/10 p-2" : ""}`}
              >
                <div className={`relative w-full h-full rounded-2xl overflow-hidden shadow-inner ${img.isSpecial ? "ring-2 ring-white/50" : ""}`}>
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110 saturate-[1.1] contrast-[1.05]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-6 left-6 right-6 text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                      <p className="font-bold text-lg">{img.alt}</p>
                      <p className="text-sm text-[#FFA500]">Starlight Model School</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== ADMISSIONS SECTION ===== */}
      <section
        className="py-24"
        id="admissions"
        style={{ background: "linear-gradient(135deg, #000080 0%, #0a0a50 100%)" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-[#FFA500] font-bold text-sm uppercase tracking-widest">Admissions</span>
          <h2 className="mt-2 text-4xl font-black text-white mb-4">Now Enrolling for 2026/2027</h2>
          <p className="text-blue-200 mb-12 max-w-xl mx-auto">
            Secure your child's place in one of Oyo State's finest schools. The process is completely online and highly simplified.
          </p>
          <div className="grid sm:grid-cols-3 gap-6 mb-12">
            {[
              { step: "01", title: "Fill The Online Form", desc: "Click the 'Apply' button below and quickly enter the child's details." },
              { step: "02", title: "Upload A Photo", desc: "Upload the child's passport photograph directly from your phone." },
              { step: "03", title: "Submit Application", desc: "Click submit. Once approved by the school, you will receive login details!" },
            ].map((step) => (
              <div key={step.step} className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 text-left">
                <span className="text-[#FFA500] font-black text-3xl">{step.step}</span>
                <h3 className="text-white font-bold mt-2 mb-1">{step.title}</h3>
                <p className="text-blue-200 text-sm">{step.desc}</p>
              </div>
            ))}
          </div>
          <Link
            href="/admissions"
            className="inline-flex items-center gap-2 px-10 py-4 bg-[#FFA500] hover:bg-[#e69400] text-white font-black text-lg rounded-full shadow-2xl hover:shadow-[#FFA500]/40 transition-all transform hover:-translate-y-1"
          >
            Start Your Application →
          </Link>
        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <section className="py-24 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-[#FFA500] font-bold text-sm uppercase tracking-widest">Testimonials</span>
          <h2 className="mt-2 text-4xl font-black text-gray-900 dark:text-white mb-12">What Our Community Says</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                name: "Alhaji & Alhaja Yusuf Adegoke",
                role: "Parent — Oyo Town",
                msg: "Ẹ jẹ ki omo wa kọ! Starlight School ti yi igbesi aye ọmọ wa pada. Awọn olukọ wa ni igbẹkẹle ati ẹbun, ati pẹlu portal oni-nọmba titun, o rọrun pupọ lati tọpa ilọsiwaju rẹ lati ile.",
              },
              {
                name: "Aisha Abdullahi Lawal",
                role: "SS3 Student — Oyo, Oyo State",
                msg: "I love that I can check my results, see my timetable and track my fees right from my phone. As a student from Oyo, I am proud that our school is this modern!",
              },
              {
                name: "Mrs. Khadijat Salawu",
                role: "Class Teacher — Oyo, Oyo State",
                msg: "This system has saved me so much time. Taking attendance, uploading results and generating report cards for our Oyo children is now just a few clicks. Ẹ o péré!",
              },
            ].map((t) => (
              <div key={t.name} className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700 text-left">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => <span key={i} className="text-[#FFA500]">★</span>)}
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-6">"{t.msg}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#000080] to-[#4169E1] flex items-center justify-center text-white font-bold text-sm">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 dark:text-white text-sm">{t.name}</p>
                    <p className="text-xs text-gray-500">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CONTACT SECTION ===== */}
      <section className="py-24 bg-white dark:bg-gray-950" id="contact">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-[#FFA500] font-bold text-sm uppercase tracking-widest">Contact Us</span>
              <h2 className="mt-2 text-4xl font-black text-gray-900 dark:text-white mb-6">Get in Touch</h2>
              <div className="space-y-4">
                {[
                  { icon: "📍", label: "Address", value: "Oyo, Oyo State, Nigeria" },
                  { icon: "📞", label: "Phone", value: "08138967797, 08056809200" },
                  { icon: "📧", label: "Email", value: "starlightmodelschool10@gmail.com" },
                  { icon: "🕐", label: "Office Hours", value: "Monday – Friday: 8:00 AM – 4:00 PM" },
                ].map((c) => (
                  <div key={c.label} className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-xl">
                    <span className="text-2xl flex-shrink-0">{c.icon}</span>
                    <div>
                      <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">{c.label}</p>
                      <p className="text-gray-800 dark:text-gray-200 font-medium">{c.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-900 rounded-3xl p-8">
              <h3 className="font-bold text-gray-900 dark:text-white text-xl mb-6">Send a Message</h3>
              <ContactForm />
            </div>
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="bg-gray-950 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div className="col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <StarlightLogo className="w-10 h-10 drop-shadow-lg" />
                <div>
                  <p className="font-black text-white text-sm">STARLIGHT MODEL SCHOOL</p>
                  <p className="text-[10px] text-[#FFA500] font-semibold tracking-widest">Oyo, Oyo State</p>
                </div>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed max-w-sm">
                Serving Yoruba families in Oyo town with quality education rooted in excellence, discipline, and strong moral values since 2005.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-sm mb-4 text-[#FFA500]">Quick Links</h4>
              <ul className="space-y-2">
                {["About Us", "Admissions", "Academics", "Facilities", "News", "Contact"].map((l) => (
                  <li key={l}><a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">{l}</a></li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-sm mb-4 text-[#FFA500]">Portals</h4>
              <ul className="space-y-2">
                {[
                  { name: "Admin Login", path: "/login" },
                  { name: "Teacher Login", path: "/login" },
                  { name: "Student Login", path: "/login" },
                  { name: "Parent Login", path: "/login" },
                  { name: "CBT Portal", path: "/login" },
                  { name: "Library", path: "/login" }
                ].map((l) => (
                  <li key={l.name}><a href={l.path} className="text-gray-400 hover:text-white text-sm transition-colors">{l.name}</a></li>
                ))}
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-gray-500 text-xs">© {new Date().getFullYear()} Starlight Model School. All rights reserved.</p>
            <p className="text-gray-500 text-xs">Powered by{" "}
              <a
                href="https://www.elitecomputer.com.ng"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#FFA500] font-semibold hover:text-white transition-colors"
              >
                ELITE COMPUTER TECHNOLOGICAL AND CONSULTATION LIMITED OYO
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
