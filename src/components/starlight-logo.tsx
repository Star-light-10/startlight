export function StarlightLogo({ className = "w-10 h-10" }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 120" className={className} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="shield-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#000080" />
          <stop offset="100%" stopColor="#4169E1" />
        </linearGradient>
        <linearGradient id="star-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFA500" />
          <stop offset="100%" stopColor="#FFD700" />
        </linearGradient>
      </defs>
      {/* Shield */}
      <path d="M60 8 L108 28 L108 65 Q108 95 60 115 Q12 95 12 65 L12 28 Z" fill="url(#shield-gradient)" />
      {/* Inner shield */}
      <path d="M60 16 L100 33 L100 64 Q100 90 60 107 Q20 90 20 64 L20 33 Z" fill="#0a0a5c" />
      {/* Crescent and Star */}
      <path d="M 55 25 A 22 22 0 1 0 77 47 A 26 26 0 1 1 55 25 Z" fill="url(#star-gradient)" />
      <polygon points="70,35 73,43 81,43 74,48 77,56 70,51 63,56 66,48 59,43 67,43" fill="url(#star-gradient)" transform="scale(0.8) translate(25, 10)" />
      {/* Book */}
      <path d="M38 82 L60 76 L82 82 L82 95 L60 89 L38 95 Z" fill="white" opacity="0.9" />
      <line x1="60" y1="76" x2="60" y2="89" stroke="#000080" strokeWidth="1" />
      {/* Rays */}
      <line x1="60" y1="20" x2="60" y2="14" stroke="#FFA500" strokeWidth="2" opacity="0.8" />
      <line x1="45" y1="23" x2="42" y2="18" stroke="#FFA500" strokeWidth="1.5" opacity="0.6" />
      <line x1="75" y1="23" x2="78" y2="18" stroke="#FFA500" strokeWidth="1.5" opacity="0.6" />
    </svg>
  )
}
