export type NodeType = "battle"|"event"|"treasure"|"money"|"rest"|"boss"|"fruit";
export type Role = "DPS"|"Support"|"Tank"|"Ranged"|"Healer"|"Control";
export type Character={id:string;name:string;role:Role;rarity:number;maxHp:number;attack:number;defense:number;speed:number;ability:string;tags:string[]};
export type DevilFruit={id:string;name:string;type:"Paramecia"|"Zoan"|"Logia";effect:string;attack:number;maxHp:number};
export type Enemy={id:string;name:string;maxHp:number;attack:number;defense:number;reward:number;boss?:boolean};
export type PassiveItem={id:string;name:string;description:string;effect:"hp"|"attack"|"defense"|"speed"|"heal"};
export type IslandTheme = "mountain"|"desert"|"jungle"|"snow"|"sky"|"water7"|"city"|"mangrove"|"underwater"|"palace"|"gate";
export type MapNode={id:string;type:NodeType;label:string;description:string;row:number;col:number;links:string[];theme:IslandTheme};

export const CHARACTERS:Character[]=[
{id:"luffy",name:"Luffy",role:"DPS",rarity:5,maxHp:920,attack:128,defense:76,speed:96,ability:"Gum-Gum Pistol",tags:["straw_hat","pirate","paramecia"]},
{id:"zoro",name:"Zoro",role:"DPS",rarity:5,maxHp:820,attack:142,defense:84,speed:82,ability:"Oni Giri",tags:["straw_hat","swordsman","monster_trio"]},
{id:"nami",name:"Nami",role:"Support",rarity:4,maxHp:560,attack:92,defense:50,speed:108,ability:"Thunder Tempo",tags:["straw_hat","support"]},
{id:"sanji",name:"Sanji",role:"DPS",rarity:5,maxHp:790,attack:134,defense:78,speed:112,ability:"Diable Jambe",tags:["straw_hat","monster_trio"]},
{id:"usopp",name:"Usopp",role:"Ranged",rarity:4,maxHp:590,attack:105,defense:54,speed:88,ability:"Kabuto Shot",tags:["straw_hat","ranged"]},
{id:"chopper",name:"Chopper",role:"Healer",rarity:4,maxHp:670,attack:76,defense:64,speed:74,ability:"Emergency Medicine",tags:["straw_hat","healer"]},
{id:"robin",name:"Robin",role:"Control",rarity:4,maxHp:650,attack:112,defense:62,speed:79,ability:"Clutch",tags:["straw_hat","control"]},
{id:"smoker",name:"Smoker",role:"Control",rarity:4,maxHp:760,attack:116,defense:82,speed:84,ability:"White Out",tags:["marine","logia"]},
];
export const FRUITS:DevilFruit[]=[
{id:"mera",name:"Mera Mera no Mi",type:"Logia",effect:"Burn: +15 danni a ogni attacco.",attack:22,maxHp:0},
{id:"ope",name:"Ope Ope no Mi",type:"Paramecia",effect:"ROOM: +12% probabilità di critico.",attack:12,maxHp:40},
{id:"tori",name:"Tori Tori no Mi",type:"Zoan",effect:"Phoenix: recupera 8% HP dopo ogni vittoria.",attack:8,maxHp:120},
{id:"suna",name:"Suna Suna no Mi",type:"Logia",effect:"Sand Trap: -12% attacco nemico.",attack:15,maxHp:20},
];
export const ITEMS:PassiveItem[]=[
{id:"vitality",name:"Vivre Card",description:"+70 HP massimi a ogni membro.",effect:"hp"},
{id:"battle_sake",name:"Battle Sake",description:"+10 attacco a ogni membro.",effect:"attack"},
{id:"seastone_plate",name:"Seastone Plate",description:"+8 difesa a ogni membro.",effect:"defense"},
{id:"log_pose",name:"Log Pose",description:"+6 velocità a ogni membro.",effect:"speed"},
{id:"doctor_bag",name:"Doctor's Bag",description:"Le cure ricevute aumentano del 20%.",effect:"heal"},
];
export const ENEMIES:Enemy[]=[
{id:"marine",name:"Marine Patrol",maxHp:480,attack:62,defense:34,reward:120},
{id:"pirates",name:"Rival Pirates",maxHp:560,attack:68,defense:38,reward:150},
{id:"fishmen",name:"Fishmen",maxHp:680,attack:76,defense:48,reward:190},
{id:"warlord",name:"Warlord Crew",maxHp:820,attack:88,defense:56,reward:260},
{id:"arlong",name:"Arlong",maxHp:1450,attack:108,defense:70,reward:1000,boss:true},
];
export const MAP:MapNode[]=[
{id:"n1",type:"battle",label:"Reverse Mountain",description:"La porta d'ingresso alla Grand Line: correnti impossibili e montagne che stringono la rotta.",row:1,col:2,links:["n2","n4"],theme:"mountain"},
{id:"n2",type:"money",label:"Whiskey Peak",description:"Un porto nel deserto dove una deviazione può riempire la cassa prima del prossimo scontro.",row:2,col:1,links:["n3","n5"],theme:"desert"},
{id:"n4",type:"treasure",label:"Jaya",description:"Un'isola selvaggia e rumorosa, punto di passaggio verso le leggende del cielo.",row:2,col:3,links:["n5","n7"],theme:"jungle"},
{id:"n3",type:"battle",label:"Little Garden",description:"Una giungla primordiale dove la ciurma può trovare combattimenti feroci e creature enormi.",row:3,col:1,links:["n6","n8"],theme:"jungle"},
{id:"n5",type:"rest",label:"Drum Island",description:"Montagne innevate e un porto sicuro per rimettere in piedi la ciurma.",row:3,col:2,links:["n6","n9"],theme:"snow"},
{id:"n7",type:"fruit",label:"Skypiea",description:"Una rotta verticale conduce nel cielo: nuvole, rovine e un frutto raro.",row:3,col:3,links:["n9"],theme:"sky"},
{id:"n6",type:"battle",label:"Alabasta",description:"Il grande regno del deserto: dune, palazzi e una guerra che blocca la rotta.",row:4,col:1,links:["n10"],theme:"desert"},
{id:"n9",type:"treasure",label:"Enies Lobby",description:"Un'isola giudiziaria sospesa sul mare: superare il passaggio può portare a una ricompensa rara.",row:4,col:2,links:["n10"],theme:"city"},
{id:"n8",type:"battle",label:"Water 7",description:"Canali, cantieri e maree trasformano ogni combattimento in una battaglia urbana.",row:4,col:3,links:["n10"],theme:"water7"},
{id:"n10",type:"battle",label:"Sabaody",description:"Mangrovie giganti e bolle segnano l'ultima grande tappa prima della discesa negli abissi.",row:5,col:2,links:["n11"],theme:"mangrove"},
{id:"n11",type:"rest",label:"Fish-Man Island",description:"Un regno sottomarino dove preparare la ciurma prima della soglia del Nuovo Mondo.",row:6,col:2,links:["n12"],theme:"underwater"},
{id:"n12",type:"boss",label:"New World Gate",description:"L'ultima porta della Grand Line. Oltre questo punto inizia una nuova fase della run.",row:7,col:2,links:[],theme:"gate"},
];
export const SYNERGIES=[
{id:"straw_hat",name:"Straw Hat Crew",required:["straw_hat","straw_hat","straw_hat"],description:"+8% HP e +8% attacco alla squadra."},
{id:"monster_trio",name:"Monster Trio",required:["monster_trio","monster_trio"],description:"+15% attacco a Luffy, Zoro e Sanji."},
{id:"healer",name:"Medical Support",required:["healer"],description:"+5% cura ricevuta per ogni healer."},
];