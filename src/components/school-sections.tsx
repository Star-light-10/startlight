"use client"

import { useState } from "react"

const sections = [
  {
    label: "Nursery School",
    color: "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800",
    activeColor: "bg-blue-100 dark:bg-blue-900/40 border-blue-400",
    icon: "🧒",
    desc: "Our Nursery program offers a nurturing environment where toddlers develop fundamental cognitive, social, and motor skills through play-based learning.",
    features: ["Montessori Approach", "Early Literacy", "Creative Arts", "Safe Play Area"],
  },
  {
    label: "Primary School",
    color: "bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800",
    activeColor: "bg-orange-100 dark:bg-orange-900/40 border-orange-400",
    icon: "✏️",
    desc: "The Primary section focuses on building a strong academic foundation in literacy, numeracy, and basic sciences, fostering curiosity and independence.",
    features: ["Core Subjects Mastery", "Extracurriculars", "ICT Training", "Continuous Assessment"],
  },
  {
    label: "Junior Secondary",
    color: "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800",
    activeColor: "bg-emerald-100 dark:bg-emerald-900/40 border-emerald-400",
    icon: "🔬",
    desc: "Junior Secondary introduces specialized subjects and practical laboratory work, preparing students for the Basic Education Certificate Examination (BECE).",
    features: ["BECE Preparation", "Science Labs", "Pre-Vocational Studies", "Mentorship"],
  },
  {
    label: "Senior Secondary",
    color: "bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800",
    activeColor: "bg-purple-100 dark:bg-purple-900/40 border-purple-400",
    icon: "🎓",
    desc: "Our Senior Secondary provides rigorous academic training in Science, Arts, and Commercial tracks to excel in WAEC, NECO, and JAMB exams.",
    features: ["WAEC/NECO Focus", "Career Guidance", "Advanced Labs", "Leadership Training"],
  },
]

export function SchoolSections() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)

  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="grid grid-cols-2 gap-4">
        {sections.map((level, i) => {
          const isActive = activeIndex === i
          return (
            <button
              key={level.label}
              onClick={() => setActiveIndex(isActive ? null : i)}
              className={`rounded-2xl border-2 p-6 text-center transition-all duration-300 transform hover:scale-105 focus:outline-none ${
                isActive ? level.activeColor : level.color
              }`}
            >
              <div className="text-4xl mb-3">{level.icon}</div>
              <p className="font-bold text-gray-800 dark:text-gray-200 text-sm">
                {level.label}
              </p>
            </button>
          )
        })}
      </div>

      {activeIndex !== null && (
        <div className={`p-6 rounded-2xl border-2 transition-all duration-300 ${sections[activeIndex].activeColor}`}>
          <h3 className="font-black text-xl text-gray-900 dark:text-white mb-2 flex items-center gap-2">
            <span>{sections[activeIndex].icon}</span>
            {sections[activeIndex].label} Details
          </h3>
          <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed mb-4">
            {sections[activeIndex].desc}
          </p>
          
          <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-gray-900/10 dark:border-white/10">
            {sections[activeIndex].features.map((feature, idx) => (
              <div key={idx} className="flex items-center gap-2 text-xs font-semibold text-gray-800 dark:text-gray-200">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FFA500]" />
                {feature}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
