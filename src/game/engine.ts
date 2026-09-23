import { Character, DevilFruit, Enemy, SYNERGIES } from "./data";

export type MemberState=Character & { currentHp:number; fruit?:DevilFruit };
export type RunState={seed:number;stage:number;berries:number;currentNode:string;crew:MemberState[];inventory:string[];log:string[];victory:boolean;gameOver:boolean};

export function makeRun(seed=Math.floor(Math.random()*999999)):RunState{
 const crew=CHARACTER_START.map(c=>({...c,currentHp:c.maxHp}));
 return {seed,stage:0,berries:350,currentNode:"n1",crew,inventory:[],log:["La tua avventura nella Grand Line comincia."],victory:false,gameOver:false};
}
const CHARACTER_START:Character[]=[
{id:"luffy",name:"Luffy",role:"DPS",rarity:5,maxHp:920,attack:128,defense:76,speed:96,ability:"Gum-Gum Pistol",tags:["straw_hat","pirate","paramecia"]},
{id:"zoro",name:"Zoro",role:"DPS",rarity:5,maxHp:820,attack:142,defense:84,speed:82,ability:"Oni Giri",tags:["straw_hat","swordsman"]},
{id:"nami",name:"Nami",role:"Support",rarity:4,maxHp:560,attack:92,defense:50,speed:108,ability:"Thunder Tempo",tags:["straw_hat","support"]},
];

export function enemyForNode(nodeId:string):Enemy|undefined{
 const map:Record<string,string>={n1:"marine",n3:"pirates",n6:"fishmen",n8:"warlord",n9:"arlong"};
 const id=map[nodeId]; return id?({marine:{id:"marine",name:"Marine Patrol",maxHp:480,attack:62,defense:34,reward:120},pirates:{id:"pirates",name:"Rival Pirates",maxHp:560,attack:68,defense:38,reward:150},fishmen:{id:"fishmen",name:"Fishmen",maxHp:680,attack:76,defense:48,reward:190},warlord:{id:"warlord",name:"Warlord Crew",maxHp:820,attack:88,defense:56,reward:260},arlong:{id:"arlong",name:"Arlong",maxHp:1450,attack:108,defense:70,reward:1000,boss:true}} as Record<string,Enemy>)[id]:undefined;
}
export function synergyBonus(crew:MemberState[]){const tags=crew.flatMap(c=>c.tags);const active=SYNERGIES.filter(s=>s.required.every((tag,i)=>tags.filter(t=>t===tag).length>i));return active;}
export function attackDamage(actor:MemberState,enemy:Enemy,crew:MemberState[]){
 const bonus=synergyBonus(crew).some(s=>s.id==="monster_trio"&&["luffy","zoro","sanji"].includes(actor.id))?1.15:1;
 return Math.max(1,Math.floor((actor.attack*bonus)-enemy.defense*.45)+Math.floor(Math.random()*18));
}
export function enemyDamage(actor:MemberState,enemy:Enemy){return Math.max(1,Math.floor(enemy.attack-actor.defense*.35)+Math.floor(Math.random()*10));}