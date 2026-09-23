import { CHARACTERS, ENEMIES, ITEMS, SYNERGIES, type Character, type DevilFruit, type Enemy, type PassiveItem } from "./data";

export type MemberState=Character & {currentHp:number;fruit?:DevilFruit};
export type RunState={seed:number;stage:number;berries:number;currentNode:string;crew:MemberState[];inventory:string[];badges:string[];log:string[];victory:boolean;gameOver:boolean};

export function makeRun(seed=Math.floor(Math.random()*999999)):RunState{
 const crew=CHARACTERS.slice(0,3).map(c=>({...c,currentHp:c.maxHp}));
 return {seed,stage:0,berries:350,currentNode:"n1",crew,inventory:[],badges:[],log:["La tua avventura nella Grand Line comincia."],victory:false,gameOver:false};
}
export function enemyForNode(nodeId:string){const map:Record<string,string>={n1:"marine",n3:"pirates",n6:"fishmen",n8:"warlord",n10:"pirates",n12:"arlong"};const id=map[nodeId];return id?ENEMIES.find(e=>e.id===id):undefined;}
export function synergyBonus(crew:MemberState[]){const tags=crew.flatMap(c=>c.tags);return SYNERGIES.filter(s=>s.required.every((tag,i)=>tags.filter(t=>t===tag).length>i));}
export function attackDamage(actor:MemberState,enemy:Enemy,crew:MemberState[]){
 const monster=synergyBonus(crew).some(s=>s.id==="monster_trio"&&["luffy","zoro","sanji"].includes(actor.id))?1.15:1;
 const straw=synergyBonus(crew).some(s=>s.id==="straw_hat")?1.08:1;
 const crit=actor.fruit?.id==="ope"&&Math.random()<.12?1.6:1;
 const burn=actor.fruit?.id==="mera"?15:0;
 return Math.max(1,Math.floor(actor.attack*monster*straw*crit-enemy.defense*.45)+Math.floor(Math.random()*12)+burn);
}
export function enemyDamage(target:MemberState,enemy:Enemy,crew:MemberState[]){
 const reduction=crew.some(c=>c.fruit?.id==="suna")?0.88:1;
 return Math.max(1,Math.floor(enemy.attack*reduction-target.defense*.35)+Math.floor(Math.random()*8));
}
export function applyPassiveItem(crew:MemberState[],item:PassiveItem){
 return crew.map(c=>{
  if(item.effect==="hp")return {...c,maxHp:c.maxHp+70,currentHp:c.currentHp+70};
  if(item.effect==="attack")return {...c,attack:c.attack+10};
  if(item.effect==="defense")return {...c,defense:c.defense+8};
  if(item.effect==="speed")return {...c,speed:c.speed+6};
  return c;
 });
}
export function healAmount(amount:number,inventory:string[]){return Math.floor(amount*(inventory.includes("doctor_bag")?1.2:1));}
export function resolveRound(crew:MemberState[],enemy:Enemy,enemyHp:number){
 let hp=enemyHp;const next=crew.map(c=>({...c}));const messages:string[]=[];
 const alive=next.filter(c=>c.currentHp>0).sort((a,b)=>b.speed-a.speed);
 for(const actor of alive){if(hp<=0)break;const damage=attackDamage(actor,enemy,next);hp=Math.max(0,hp-damage);messages.push(actor.name+" infligge "+damage);}
 if(hp<=0)return {crew:next,enemyHp:0,messages,won:true,lost:false};
 const target=next.find(c=>c.currentHp>0);
 if(target){const damage=enemyDamage(target,enemy,next);target.currentHp=Math.max(0,target.currentHp-damage);messages.push(enemy.name+" colpisce "+target.name+" per "+damage);}
 return {crew:next,enemyHp:hp,messages,won:false,lost:next.every(c=>c.currentHp<=0)};
}
export function victoryHeal(crew:MemberState[]){return crew.map(c=>c.currentHp>0&&c.fruit?.id==="tori"?{...c,currentHp:Math.min(c.maxHp,c.currentHp+Math.floor(c.maxHp*.08))}:c);}
export function uniqueChoices<T extends {id:string}>(items:T[],count:number){const pool=[...items];const out:T[]=[];while(pool.length&&out.length<count){out.push(pool.splice(Math.floor(Math.random()*pool.length),1)[0]);}return out;}
export const passiveItemById=(id:string)=>ITEMS.find(i=>i.id===id);
