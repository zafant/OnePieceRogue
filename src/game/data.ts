export type NodeType = "battle"|"event"|"treasure"|"rest"|"boss"|"fruit";
export type Role = "DPS"|"Support"|"Tank"|"Ranged"|"Healer"|"Control";
export type Character={id:string;name:string;role:Role;rarity:number;maxHp:number;attack:number;defense:number;speed:number;ability:string;tags:string[]};
export type DevilFruit={id:string;name:string;type:"Paramecia"|"Zoan"|"Logia";effect:string;attack:number;maxHp:number};
export type Enemy={id:string;name:string;maxHp:number;attack:number;defense:number;reward:number;boss?:boolean};
export type PassiveItem={id:string;name:string;description:string;effect:"hp"|"attack"|"defense"|"speed"|"heal"};
export type MapNode={id:string;type:NodeType;label:string;description:string;row:number;col:number;links:string[]};

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
{id:"mera",name:"Mera Mera no Mi",type:"Logia",effect:"Burn: +15 danni ai prossimi 3 attacchi.",attack:22,maxHp:0},
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
{id:"n1",type:"battle",label:"Marine Patrol",description:"Una pattuglia della Marina blocca il passaggio.",row:1,col:1,links:["n2","n4"]},
{id:"n2",type:"event",label:"Mysterious Island",description:"Un'isola nasconde un incontro inatteso.",row:1,col:2,links:["n3","n5"]},
{id:"n3",type:"battle",label:"Rival Pirates",description:"Una ciurma rivale ha avvistato la tua nave.",row:1,col:3,links:["n6"]},
{id:"n4",type:"treasure",label:"Treasure",description:"Un forziere galleggia tra le onde.",row:2,col:1,links:["n5","n7"]},
{id:"n5",type:"rest",label:"Tavern",description:"Un posto sicuro per recuperare le forze.",row:2,col:2,links:["n6","n8"]},
{id:"n6",type:"battle",label:"Fishmen",description:"Un gruppo di uomini-pesce difende il porto.",row:2,col:3,links:["n9"]},
{id:"n7",type:"fruit",label:"Devil Fruit",description:"Un frutto misterioso è custodito su una piccola isola.",row:3,col:1,links:["n8"]},
{id:"n8",type:"battle",label:"Warlord Crew",description:"Una ciurma al servizio di un potente pirata.",row:3,col:2,links:["n9"]},
{id:"n9",type:"boss",label:"Arlong Park",description:"La strada finisce davanti al parco di Arlong.",row:3,col:3,links:[]},
];
export const SYNERGIES=[
{id:"straw_hat",name:"Straw Hat Crew",required:["straw_hat","straw_hat","straw_hat"],description:"+8% HP e +8% attacco alla squadra."},
{id:"monster_trio",name:"Monster Trio",required:["monster_trio","monster_trio"],description:"+15% attacco a Luffy, Zoro e Sanji."},
{id:"healer",name:"Medical Support",required:["healer"],description:"+5% cura ricevuta per ogni healer."},
];