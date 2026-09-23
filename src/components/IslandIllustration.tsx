import type { CSSProperties } from "react";

type Props = { theme: string; active?: boolean };

const palette: Record<string, { land: string; dark: string; accent: string; sky: string }> = {
  mountain: { land:"#8b6b52", dark:"#4c3b34", accent:"#f0b44d", sky:"#8cc9e8" },
  desert: { land:"#d6ad62", dark:"#8a5c37", accent:"#f5d98c", sky:"#d99a54" },
  jungle: { land:"#3d7d58", dark:"#183f35", accent:"#a7d66d", sky:"#5ca4a1" },
  snow: { land:"#cde7ef", dark:"#55778a", accent:"#ffffff", sky:"#8bb7cf" },
  sky: { land:"#e9d29a", dark:"#6f5d48", accent:"#fff1ae", sky:"#7ec8ee" },
  water7: { land:"#7b916b", dark:"#344c47", accent:"#7bc9d8", sky:"#7ebbd1" },
  city: { land:"#a77a57", dark:"#533b35", accent:"#f0b44d", sky:"#a7c8d4" },
  mangrove: { land:"#d3b46a", dark:"#735b3e", accent:"#f5dd8a", sky:"#74c3cb" },
  underwater: { land:"#4d88a1", dark:"#21445a", accent:"#8ce0d3", sky:"#1c607e" },
  palace: { land:"#c49a64", dark:"#5e4638", accent:"#e8c979", sky:"#dca86c" },
  gate: { land:"#b65b46", dark:"#4b2930", accent:"#f0b44d", sky:"#536b7c" },
};

export function IslandIllustration({ theme, active = false }: Props) {
  const p = palette[theme] ?? palette.mountain;
  const glow: CSSProperties = active ? { filter: "drop-shadow(0 0 9px rgba(240,180,77,.45))" } : {};
  return (
    <svg className="island-art" viewBox="0 0 180 112" style={glow} role="img" aria-label="Illustrazione dell'isola">
      <defs>
        <linearGradient id={`island-sky-${theme}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={p.sky} stopOpacity=".95" />
          <stop offset="1" stopColor="#0b1b2b" stopOpacity=".8" />
        </linearGradient>
        <linearGradient id={`island-ground-${theme}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={p.land} />
          <stop offset="1" stopColor={p.dark} />
        </linearGradient>
      </defs>
      <rect width="180" height="112" rx="16" fill={`url(#island-sky-${theme})`} />
      <circle cx="148" cy="23" r="13" fill={p.accent} opacity=".72" />
      <path d="M0 82 C26 70 38 77 58 69 S98 75 120 67 S156 75 180 63 V112 H0Z" fill={`url(#island-ground-${theme})`} />
      <path d="M0 92 C30 83 55 99 84 87 S133 96 180 82 V112 H0Z" fill="#061522" opacity=".52" />
      {theme === "desert" && <>
        <path d="M18 82 C38 55 62 57 77 82Z" fill="#b8894b" />
        <path d="M42 76 L47 49 L52 76Z" fill="#7e5135" />
        <path d="M54 76 L59 55 L64 76Z" fill="#7e5135" />
        <path d="M126 79 L126 49 L138 49 L138 79Z" fill="#9b6a3f" />
        <path d="M121 49 L132 37 L143 49Z" fill="#d8bb75" />
      </>}
      {theme === "snow" && <>
        <path d="M5 80 L45 35 L72 80Z" fill="#55778a" />
        <path d="M26 57 L45 35 L55 50 L45 45Z" fill="#fff" />
        <path d="M54 82 L93 31 L125 82Z" fill="#4b6878" />
        <path d="M75 54 L93 31 L105 49 L93 44Z" fill="#fff" />
        <path d="M145 76 C139 58 149 51 157 76Z" fill="#fff" opacity=".75" />
      </>}
      {theme === "jungle" && <>
        {[18,42,67,101,128,153].map((x,i)=><g key={x}><path d={`M${x} 83 V48`} stroke="#4c3b2f" strokeWidth="5"/><circle cx={x} cy={43-(i%2)*5} r="15" fill={i%2?"#5d9d55":"#2f704e"}/><circle cx={x+8} cy={48} r="11" fill="#3f8350"/></g>)}
        <ellipse cx="92" cy="71" rx="28" ry="11" fill="#a7d66d" opacity=".35" />
      </>}
      {theme === "sky" && <>
        <path d="M35 78 Q90 43 145 78 Q90 98 35 78Z" fill="#e9d29a" />
        <path d="M53 76 Q90 92 127 76 L118 102 Q90 111 62 102Z" fill="#8b7459" />
        <path d="M71 70 L71 49 L83 49 L83 70 M98 70 L98 43 L110 43 L110 70" stroke="#5e4b3d" strokeWidth="4" />
        <path d="M61 43 C43 33 31 46 44 53 C52 58 62 52 66 47 C73 55 87 50 84 41 C81 32 67 35 61 43Z" fill="#fff" opacity=".8" />
      </>}
      {theme === "water7" && <>
        <path d="M0 92 C28 72 53 91 75 73 S122 88 180 68 V112 H0Z" fill="#1f5361" />
        <path d="M20 77 L34 42 L47 77 M57 75 L73 34 L88 75 M102 78 L117 39 L132 78" stroke="#b57b50" strokeWidth="8" fill="none" />
        <path d="M27 53 L34 42 L41 53 M66 45 L73 34 L81 46 M110 50 L117 39 L125 51" fill="#d7a36a" />
        <path d="M0 93 Q35 86 70 94 T140 92 T180 95" fill="none" stroke="#7bc9d8" strokeWidth="3" opacity=".7" />
      </>}
      {theme === "city" && <>
        <path d="M27 80 V49 H47 V80 M55 80 V38 H77 V80 M86 80 V53 H108 V80 M118 80 V43 H143 V80" fill="#8e674e" stroke="#4e3b35" strokeWidth="2" />
        <path d="M51 49 L62 38 L73 49 M113 53 L130 37 L147 53" fill="#d8b06d" />
        <path d="M0 92 Q45 82 90 94 T180 90" fill="none" stroke="#7bc9d8" strokeWidth="4" />
      </>}
      {theme === "mangrove" && <>
        {[20,48,78,108,140,164].map((x,i)=><g key={x}><path d={`M${x} 86 C${x-7} 65 ${x+8} 48 ${x+2} 32`} fill="none" stroke="#72583f" strokeWidth="7"/><circle cx={x+3} cy="28" r={17-(i%3)*2} fill="#d3b46a" opacity=".9"/><circle cx={x-7} cy="34" r="11" fill="#e2c578" opacity=".75"/></g>)}
        <circle cx="90" cy="49" r="4" fill="#f4e7b1" opacity=".7" />
      </>}
      {theme === "underwater" && <>
        <path d="M18 98 Q24 62 30 98 M37 101 Q45 50 53 101 M144 101 Q151 58 158 101" stroke="#8ce0d3" strokeWidth="5" fill="none" />
        <circle cx="84" cy="71" r="7" fill="#f0b44d" opacity=".7" />
        <path d="M105 76 q14-10 27 0 q-13 10-27 0Z" fill="#8ce0d3" />
        <circle cx="127" cy="73" r="3" fill="#21445a" />
      </>}
      {theme === "palace" && <>
        <path d="M48 82 V55 H132 V82Z" fill="#c49a64" stroke="#5e4638" strokeWidth="3" />
        <path d="M42 55 L90 28 L138 55Z" fill="#e2c079" stroke="#5e4638" strokeWidth="3" />
        <path d="M78 82 V62 H102 V82Z" fill="#5e4638" />
        <path d="M58 56 V73 M70 56 V73 M110 56 V73 M122 56 V73" stroke="#f0d59b" strokeWidth="5" />
      </>}
      {theme === "gate" && <>
        <path d="M48 84 V48 H64 V84 M116 84 V48 H132 V84 M40 49 H140" stroke="#b65b46" strokeWidth="9" />
        <path d="M48 48 Q90 16 132 48" fill="none" stroke="#f0b44d" strokeWidth="7" />
        <path d="M90 20 V84" stroke="#7a3e39" strokeWidth="5" />
      </>}
      {theme === "mountain" && <>
        <path d="M8 86 L45 30 L70 68 L101 18 L172 86Z" fill="#6f584c" />
        <path d="M45 30 L55 48 L43 44 L35 57 M101 18 L115 42 L102 37 L91 54" fill="#d9e8ed" opacity=".9" />
        <path d="M0 91 C35 77 53 99 82 88 S137 99 180 84" fill="none" stroke="#74b8c9" strokeWidth="5" />
      </>}
    </svg>
  );
}
