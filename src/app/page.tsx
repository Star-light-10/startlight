import type { Metadata } from "next";
import Link from "next/link";
import { StarlightLogo } from "@/components/starlight-logo";

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
            <div className="flex items-center gap-3">
              <Link
                href="/login"
                className="hidden sm:inline-flex items-center px-4 py-2 text-sm font-medium text-[#000080] dark:text-[#FFA500] border border-[#000080] dark:border-[#FFA500] rounded-full hover:bg-[#000080] hover:text-white dark:hover:bg-[#FFA500] dark:hover:text-black transition-all"
              >
                Login
              </Link>
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

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-white">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 bg-[#FFA500]/20 border border-[#FFA500]/40 text-[#FFA500] text-xs font-bold px-4 py-2 rounded-full mb-6">
                <span>★</span>
                <span>EXCELLENCE IN EDUCATION SINCE 2005</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight mb-6">
                Where Stars
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#FFA500] to-[#FFD700]">
                  Are Born
                </span>
              </h1>

              <p className="text-lg text-blue-100 leading-relaxed mb-8 max-w-xl">
                Starlight Model School, Oke-Medina, Boroboro, Oyo State — providing world-class education
                that nurtures excellence, character, and leadership in every child.
              </p>

              <div className="flex flex-wrap gap-4">
                <Link
                  href="/admissions"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-[#FFA500] hover:bg-[#e69400] text-white font-bold rounded-full shadow-xl hover:shadow-[#FFA500]/30 hover:shadow-2xl transition-all transform hover:-translate-y-1"
                >
                  Start Admission
                  <span>→</span>
                </Link>
                <Link
                  href="#about"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-bold rounded-full border border-white/30 backdrop-blur-sm transition-all"
                >
                  Learn More
                </Link>
              </div>

              {/* Stats */}
              <div className="flex gap-8 mt-12 pt-12 border-t border-white/10">
                {[
                  { value: "2,000+", label: "Students" },
                  { value: "98%", label: "Pass Rate" },
                  { value: "20+", label: "Years" },
                  { value: "150+", label: "Teachers" },
                ].map((stat) => (
                  <div key={stat.label}>
                    <p className="text-2xl font-black text-[#FFA500]">{stat.value}</p>
                    <p className="text-xs text-blue-200 uppercase tracking-wider">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Hero Visual */}
            <div className="hidden lg:flex justify-center">
              <div className="relative">
                <div className="w-80 h-80 rounded-3xl bg-gradient-to-br from-[#FFA500]/20 to-[#000080]/50 backdrop-blur-xl border border-white/20 shadow-2xl flex flex-col items-center justify-center gap-4 p-8">
                  <StarlightLogo className="w-20 h-20 drop-shadow-2xl" />
                  <p className="text-white font-black text-xl text-center">STARLIGHT MODEL SCHOOL</p>
                  <p className="text-blue-200 text-sm text-center">Oke-Medina, Boroboro Area, Oyo State, Nigeria</p>
                  <div className="w-full h-px bg-white/20 my-2" />
                  <div className="grid grid-cols-2 gap-3 w-full">
                    {["Portal Login", "Pay Fees", "Check Result", "Apply Now"].map((item) => (
                      <div
                        key={item}
                        className="bg-white/10 rounded-xl p-3 text-center text-white text-xs font-semibold hover:bg-white/20 cursor-pointer transition-all"
                      >
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
                {/* Floating cards */}
                <div className="absolute -top-4 -right-4 bg-[#FFA500] text-white text-xs font-bold px-3 py-2 rounded-xl shadow-lg">
                  🏆 Best School 2024
                </div>
                <div className="absolute -bottom-4 -left-4 bg-white text-[#000080] text-xs font-bold px-3 py-2 rounded-xl shadow-lg">
                  📱 Digital First
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== PORTAL LOGIN SECTION ===== */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900" id="portals">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-2">Access Your Portal</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-12">Login to manage your school experience digitally</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "Admin Portal", desc: "School management & records", icon: "🏫", href: "/dashboard", color: "from-[#000080] to-[#4169E1]" },
              { title: "Teacher Portal", desc: "Classes, results & attendance", icon: "👨‍🏫", href: "/teacher", color: "from-[#FFA500] to-[#FFD700]" },
              { title: "Student Portal", desc: "Results, timetable & fees", icon: "👨‍🎓", href: "/student", color: "from-emerald-500 to-teal-500" },
              { title: "Parent Portal", desc: "Track your child's progress", icon: "👨‍👩‍👧", href: "/parent", color: "from-purple-500 to-pink-500" },
            ].map((portal) => (
              <Link
                key={portal.title}
                href={portal.href}
                className="group bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl border border-gray-100 dark:border-gray-700 transition-all hover:-translate-y-1"
              >
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${portal.color} flex items-center justify-center text-2xl mx-auto mb-4 shadow-md group-hover:scale-110 transition-transform`}>
                  {portal.icon}
                </div>
                <h3 className="font-bold text-gray-900 dark:text-white mb-1">{portal.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{portal.desc}</p>
                <div className="mt-4 text-[#000080] dark:text-[#FFA500] text-sm font-semibold group-hover:translate-x-1 transition-transform inline-block">
                  Login →
                </div>
              </Link>
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
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "Nursery School", color: "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800" },
                { label: "Primary School", color: "bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800" },
                { label: "Junior Secondary", color: "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800" },
                { label: "Senior Secondary", color: "bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800" },
              ].map((level) => (
                <div key={level.label} className={`rounded-2xl border-2 p-6 text-center ${level.color}`}>
                  <div className="text-4xl mb-3">🎓</div>
                  <p className="font-bold text-gray-800 dark:text-gray-200 text-sm">{level.label}</p>
                </div>
              ))}
            </div>
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
          <h2 className="mt-2 text-4xl font-black text-white mb-4">Now Enrolling for 2025/2026</h2>
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
              <form className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <input type="text" placeholder="First Name" className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#000080]" />
                  <input type="text" placeholder="Last Name" className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#000080]" />
                </div>
                <input type="email" placeholder="Email Address" className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#000080]" />
                <textarea rows={4} placeholder="Your Message" className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#000080] resize-none" />
                <button type="submit" className="w-full py-3 bg-[#000080] hover:bg-[#000066] text-white font-bold rounded-xl transition-colors">
                  Send Message
                </button>
              </form>
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
                {["Admin Login", "Teacher Login", "Student Login", "Parent Login", "CBT Portal", "Library"].map((l) => (
                  <li key={l}><a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">{l}</a></li>
                ))}
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-gray-500 text-xs">© 2025 Starlight Model School. All rights reserved.</p>
            <p className="text-gray-500 text-xs">Powered by <span className="text-[#FFA500] font-semibold">Starlight EduTech SaaS</span></p>
          </div>
        </div>
      </footer>
    </div>
  );
}
