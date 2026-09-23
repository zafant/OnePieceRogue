export function GoingMerry({ compact = false }: { compact?: boolean }) {
  return (
    <svg className={compact ? "going-merry compact" : "going-merry"} viewBox="0 0 220 150" role="img" aria-label="Going Merry">
      <defs>
        <linearGradient id="merry-hull" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fff0c8" />
          <stop offset=".48" stopColor="#d7a85d" />
          <stop offset="1" stopColor="#7b4a35" />
        </linearGradient>
        <linearGradient id="merry-sail" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fff7d6" />
          <stop offset="1" stopColor="#d8b46c" />
        </linearGradient>
      </defs>
      <g filter="drop-shadow(0 8px 7px rgba(0,0,0,.45))">
        <path d="M39 91 Q105 108 185 85 L169 118 Q106 137 54 115Z" fill="url(#merry-hull)" stroke="#4c3028" strokeWidth="4" />
        <path d="M52 91 Q111 104 180 84" fill="none" stroke="#f6d88c" strokeWidth="5" />
        <path d="M98 88 V27" stroke="#5c3a2d" strokeWidth="6" />
        <path d="M101 29 L157 49 L101 66Z" fill="url(#merry-sail)" stroke="#6a4936" strokeWidth="3" />
        <path d="M96 32 L51 50 L96 62Z" fill="#f2e3b4" stroke="#6a4936" strokeWidth="3" />
        <path d="M157 49 L172 62 L157 67Z" fill="#b64e3f" stroke="#64352f" strokeWidth="3" />
        <path d="M38 90 L24 80 L31 101 L50 100Z" fill="#d7a85d" stroke="#4c3028" strokeWidth="4" />
        <path d="M29 79 Q20 66 31 56 Q41 47 49 57 Q55 69 42 80Z" fill="#efe2bc" stroke="#4c3028" strokeWidth="4" />
        <path d="M24 57 Q18 46 28 42 L34 51 L40 42 Q47 46 43 56" fill="#d4a75d" stroke="#4c3028" strokeWidth="3" />
        <circle cx="32" cy="61" r="3" fill="#4c3028" />
        <circle cx="43" cy="61" r="3" fill="#4c3028" />
        <path d="M31 69 Q37 75 44 68" fill="none" stroke="#4c3028" strokeWidth="3" />
        <path d="M143 97 L154 76 L165 98" fill="#d8a95d" stroke="#5a3c2e" strokeWidth="3" />
        <path d="M65 99 L70 88 L75 99 M79 102 L84 91 L89 102" stroke="#5a3c2e" strokeWidth="3" />
      </g>
    </svg>
  );
}
