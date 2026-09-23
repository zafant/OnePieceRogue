import type { MemberState } from "../game/engine";

type Props = { character: MemberState; size?: "small"|"battle"|"large"; active?: boolean };

const palettes:Record<string,{skin:string;shirt:string;accent:string}> = {
 luffy:{skin:"#c98c67",shirt:"#d84d3f",accent:"#f0c34d"},
 zoro:{skin:"#b97958",shirt:"#4c8b63",accent:"#cfd8dc"},
 nami:{skin:"#d6a078",shirt:"#e08b46",accent:"#65b7d8"},
 sanji:{skin:"#c98c67",shirt:"#27344b",accent:"#e0c07b"},
 usopp:{skin:"#b87955",shirt:"#c9893e",accent:"#5d9b65"},
 chopper:{skin:"#a86f52",shirt:"#cf5c5c",accent:"#7bb7df"},
 robin:{skin:"#d3a17c",shirt:"#493e78",accent:"#c98eb8"},
 smoker:{skin:"#c68d69",shirt:"#f1f1e8",accent:"#8ea4b9"},
};

export function CharacterAvatar({character,size="battle",active=false}:Props){
 const p=palettes[character.id]??palettes.luffy;
 return <div className={"character-avatar avatar-"+size+(active?" is-active":"")} aria-label={character.name}>
  <svg viewBox="0 0 120 150" role="img">
   <defs>
    <linearGradient id={"body-"+character.id} x1="0" x2="1">
     <stop offset="0" stopColor={p.shirt}/><stop offset="1" stopColor={p.accent}/>
    </linearGradient>
   </defs>
   <ellipse cx="60" cy="140" rx="39" ry="7" fill="#000" opacity=".28"/>
   <path d="M28 139 Q30 99 43 86 L77 86 Q91 101 93 139Z" fill={"url(#body-"+character.id+")"} stroke="#101924" strokeWidth="3"/>
   <path d="M43 88 Q60 99 77 88 L72 116 Q60 124 48 116Z" fill={p.accent} opacity=".7"/>
   <circle cx="60" cy="60" r="29" fill={p.skin} stroke="#101924" strokeWidth="3"/>
   <path d={character.id==="zoro"?"M31 53 Q60 23 89 53 L82 41 Q60 18 38 40Z":character.id==="sanji"?"M31 48 Q48 17 82 35 Q91 42 88 54 Q77 42 66 42 Q51 45 42 58Z":"M31 45 Q38 22 60 23 Q82 22 89 45 Q77 37 60 37 Q43 37 31 45Z"} fill="#17202b"/>
   <circle cx="49" cy="62" r="3" fill="#101924"/><circle cx="71" cy="62" r="3" fill="#101924"/>
   <path d="M52 76 Q60 80 68 76" fill="none" stroke="#101924" strokeWidth="2" strokeLinecap="round"/>
   {character.id==="luffy"&&<path d="M36 37 Q60 27 84 37" fill="none" stroke="#f0c34d" strokeWidth="6" strokeLinecap="round"/>}
   {character.id==="nami"&&<path d="M33 46 Q17 61 32 92" fill="none" stroke="#e69a55" strokeWidth="12" strokeLinecap="round"/>}
   {character.id==="robin"&&<path d="M31 48 Q18 75 31 94" fill="none" stroke="#493e78" strokeWidth="12" strokeLinecap="round"/>}
   {character.id==="smoker"&&<path d="M82 52 Q104 44 91 74" fill="none" stroke="#dbe4eb" strokeWidth="9" strokeLinecap="round"/>}
  </svg>
 </div>
}
