import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { StarlightLogo } from "@/components/starlight-logo";
import ContactForm from "@/components/contact-form";
import { SchoolSections } from "@/components/school-sections";

export const metadata: Metadata = {
  title: "Starlight Model School | Oke-Medina, Boroboro, Oyo State",
  description:
    "Starlight Model School — A world-class educational institution in Oke-Medina, Boroboro Area, Oyo State, Nigeria. Admissions, academics, and digital learning at its finest.",
};

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 font-sans">
      {/* ===== NAVBAR ===== */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
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
                className="inline-flex items-center px-4 py-2 text-sm font-bold text-white bg-[#FFA500] hover:bg-[#e69400] rounded-full shadow-md hover:shadow-lg transition-all"
              >
                Apply Now →
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* ===== HERO SECTION ===== */}
      <section
        className="relative min-h-screen flex items-center pt-16 overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #000080 0%, #1a1a6e 30%, #0a0a50 60%, #000033 100%)",
        }}
      >
        <Image
          src="/images/school-1.jpg"
          alt="School Background"
          fill
          className="object-cover opacity-10 mix-blend-screen pointer-events-none"
          priority
        />
        {/* Animated Background Circles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 right-10 w-72 h-72 bg-[#FFA500]/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 left-10 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#000080]/20 rounded-full blur-3xl" />
          {/* Stars */}
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full opacity-50"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
              }}
            />
          ))}
        </div>

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-[#FFA500]/20 border border-[#FFA500]/40 text-[#FFA500] text-xs font-bold px-4 py-2 rounded-full mb-6">
            <span>★</span>
            <span>EXCELLENCE IN EDUCATION SINCE 2005</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight mb-4 text-white">
            Starlight Model School
          </h1>
          <p className="text-blue-200 text-base sm:text-lg mb-4 max-w-xl mx-auto">
            Oke-Medina, Boroboro, Oyo State
          </p>

          {/* ── PORTAL LOGIN CARDS ── */}
          <div className="mt-10 grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {[
              { title: "Admin",   desc: "Management &amp; records",        icon: "🏫", href: "/dashboard", bg: "from-[#000080] to-[#1e3a8a]" },
              { title: "Teacher", desc: "Classes &amp; attendance",         icon: "👨\u200d🏫", href: "/login",     bg: "from-[#b45309] to-[#d97706]" },
              { title: "Student", desc: "Results &amp; timetable",          icon: "👨\u200d🎓", href: "/login",     bg: "from-[#065f46] to-[#047857]" },
              { title: "Parent",  desc: "Track child&apos;s progress",    icon: "👨\u200d👩\u200d👧", href: "/login", bg: "from-[#581c87] to-[#7e22ce]" },
            ].map((portal) => (
              <Link
                key={portal.title}
                href={portal.href}
                className={`group bg-gradient-to-br ${portal.bg} rounded-2xl p-5 sm:p-6 text-white text-center shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-200 border border-white/10`}
              >
                <div className="text-3xl sm:text-4xl mb-3">{portal.icon}</div>
                <h2 className="text-base sm:text-lg font-black mb-1">{portal.title} Login</h2>
                <p className="text-xs text-white/70" dangerouslySetInnerHTML={{ __html: portal.desc }} />
                <div className="mt-4 inline-flex items-center gap-1 bg-white/20 hover:bg-white/30 text-white text-xs font-bold px-4 py-2 rounded-full transition-colors">
                  Login →
                </div>
              </Link>
            ))}
          </div>

          {/* Apply CTA */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
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
              { value: "2,000+", label: "Students" },
              { value: "98%",   label: "Pass Rate" },
              { value: "20+",   label: "Years" },
              { value: "150+", label: "Teachers" },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-2xl font-black text-[#FFA500]">{stat.value}</p>
                <p className="text-xs text-blue-200 uppercase tracking-wider">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>



      {/* ===== ABOUT SECTION ===== */}
      <section className="py-24 bg-white dark:bg-gray-950" id="about">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-[#FFA500] font-bold text-sm uppercase tracking-widest">About Us</span>
              <h2 className="mt-2 text-4xl font-black text-gray-900 dark:text-white leading-tight">
                Shaping the Leaders <br /> of Tomorrow
              </h2>
              <p className="mt-6 text-gray-600 dark:text-gray-400 leading-relaxed">
                Starlight Model School was founded with a singular vision: to provide every child with the tools,
                knowledge, and character to excel in a rapidly changing world. Located in Oke-Medina, Boroboro Area,
                Oyo State, we have been the gold standard for education in our community for over two decades.
              </p>
              <div className="mt-8 grid grid-cols-2 gap-6">
                {[
                  { icon: "🎯", title: "Our Mission", desc: "To inspire excellence through quality education, discipline, and innovation." },
                  { icon: "🌟", title: "Our Vision", desc: "To be Africa's most student-centric and technology-driven model school." },
                  { icon: "📚", title: "Curriculum", desc: "Lagos State curriculum with WAEC, NECO, and JUPEB preparation." },
                  { icon: "🏆", title: "Excellence", desc: "Consistent top performances in State & National examinations." },
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
              { src: "/images/school-2.jpg", alt: "Students in class", span: "md:col-span-2 lg:col-span-2 lg:row-span-2" },
              { src: "/images/school-3.jpg", alt: "School building", span: "md:col-span-1" },
              { src: "/images/school-4.jpg", alt: "Science Laboratory", span: "md:col-span-1" },
              { src: "/images/school-5.jpg", alt: "Library", span: "md:col-span-1" },
              { src: "/images/school-6.jpg", alt: "Playground", span: "md:col-span-1 lg:col-span-2" },
              { src: "/images/school-7.jpg", alt: "School Bus", span: "md:col-span-1" },
            ].map((img, i) => (
              <div
                key={i}
                className={`relative group overflow-hidden rounded-3xl shadow-lg border border-gray-200/50 dark:border-gray-700/50 ${img.span} h-64 md:h-auto min-h-[250px]`}
              >
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
            Secure your child's place in one of Oyo State's finest schools. Apply online in minutes — no paper forms needed.
          </p>
          <div className="grid sm:grid-cols-3 gap-6 mb-12">
            {[
              { step: "01", title: "Fill Application", desc: "Complete our simple online form with your child's details." },
              { step: "02", title: "Upload Documents", desc: "Upload birth certificate, passport photo and academic records." },
              { step: "03", title: "Pay & Confirm", desc: "Pay the application fee online and receive your admission letter." },
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
                name: "Mr. & Mrs. Okafor",
                role: "Parent",
                msg: "Starlight School transformed our son's life. The teachers are dedicated and the new digital portal makes it so easy to track his progress.",
              },
              {
                name: "Adaeze Nwosu",
                role: "SS3 Student",
                msg: "I love that I can access my timetable, check my results and submit assignments online. Starlight is truly modern and forward-thinking!",
              },
              {
                name: "Mrs. Fatima Adeleke",
                role: "Class Teacher",
                msg: "The management system has saved me hours every week. I can take attendance, upload notes and generate report cards with just a few clicks.",
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
                  { icon: "📍", label: "Address", value: "Oke-Medina, Boroboro Area, Oyo State, Nigeria" },
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
                  <p className="text-[10px] text-[#FFA500] font-semibold tracking-widest">Oke-Medina, Boroboro, Oyo State</p>
                </div>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed max-w-sm">
                Providing world-class education and nurturing excellence, character, and leadership in every child since 2005.
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
                ELITE COMPUTER TECH LINK
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
