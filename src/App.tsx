import { useEffect, useMemo, useState } from "react";
import { CHARACTERS, FRUITS, MAP, type NodeType } from "./game/data";
import { attackDamage, enemyDamage, enemyForNode, makeRun, synergyBonus, type RunState } from "./game/engine";
import { clearRun, loadRun, saveRun } from "./game/storage";

const icons:Record<NodeType,string>={battle:"⚔️",event:"❓",treasure:"💰",rest:"❤️",boss:"👑",fruit:"🍈"};

function App(){
 const [run,setRun]=useState<RunState>(()=>loadRun()??makeRun());
 const [enemyHp,setEnemyHp]=useState(0);
 const [enemyMax,setEnemyMax]=useState(0);
 const [selected,setSelected]=useState("luffy");
 const [screen,setScreen]=useState<"map"|"battle"|"reward">("map");
 const [reward,setReward]=useState<string|null>(null);
 const node=useMemo(()=>MAP.find(n=>n.id===run.currentNode)??MAP[0],[run.currentNode]);
 const enemy=enemyForNode(run.currentNode);
 const hero=run.crew.find(c=>c.id===selected)??run.crew[0];
 const synergies=synergyBonus(run.crew);

 useEffect(()=>{saveRun(run)},[run]);

 function log(message:string){setRun(r=>({...r,log:[message,...r.log].slice(0,8)}))}
 function chooseNode(id:string){
   const next=MAP.find(n=>n.id===id); const current=MAP.find(n=>n.id===run.currentNode);
   if(!next||!current||id===current.id||!current.links.includes(id))return;
   setRun(r=>({...r,currentNode:id,stage:r.stage+1}));
   if(next.type==="battle"||next.type==="boss"){const e=enemyForNode(id);if(e){setEnemyHp(e.maxHp);setEnemyMax(e.maxHp);setScreen("battle");}return;}
   if(next.type==="treasure")setRun(r=>({...r,berries:r.berries+250,log:["💰 Tesoro: +250 Berries.",...r.log].slice(0,8)}));
   if(next.type==="event")setRun(r=>({...r,berries:r.berries+120,log:["❓ Evento: +120 Berries.",...r.log].slice(0,8)}));
   if(next.type==="rest")setRun(r=>({...r,crew:r.crew.map(c=>({...c,currentHp:c.maxHp})),log:["❤️ La ciurma è completamente guarita.",...r.log].slice(0,8)}));
   if(next.type==="fruit"){setReward(FRUITS[Math.floor(Math.random()*FRUITS.length)].id);setScreen("reward");}
 }
 function attack(){
   if(!enemy||enemyHp<=0)return;
   const damage=attackDamage(hero,enemy,run.crew); const next=Math.max(0,enemyHp-damage); setEnemyHp(next);
   if(next===0){setRun(r=>({...r,berries:r.berries+enemy.reward,log:["🏆 "+hero.name+" ha sconfitto "+enemy.name+"! +"+enemy.reward+" Berries.",...r.log].slice(0,8)}));setReward("victory");setScreen("reward");return;}
   const target=run.crew[Math.floor(Math.random()*run.crew.length)]; const retaliation=enemyDamage(target,enemy); const hp=Math.max(0,target.currentHp-retaliation);
   setRun(r=>({...r,crew:r.crew.map(c=>c.id===target.id?{...c,currentHp:hp}:c),log:["⚡ "+hero.name+" infligge "+damage+". "+enemy.name+" contrattacca "+target.name+" per "+retaliation+".",...r.log].slice(0,8),gameOver:hp===0&&r.crew.every(c=>c.id===target.id||c.currentHp===0)}));
 }
 function heal(){setRun(r=>({...r,crew:r.crew.map(c=>c.id===hero.id?{...c,currentHp:Math.min(c.maxHp,c.currentHp+110)}:c),log:["❤️ "+hero.name+" recupera 110 HP.",...r.log].slice(0,8)}))}
 function recruit(id:string){const c=CHARACTERS.find(x=>x.id===id);if(!c||run.crew.length>=6||run.crew.some(x=>x.id===id))return;setRun(r=>({...r,crew:[...r.crew,{...c,currentHp:c.maxHp}],log:["🏴‍☠️ "+c.name+" si unisce alla ciurma.",...r.log].slice(0,8)}));}
 function takeFruit(id:string){const fruit=FRUITS.find(x=>x.id===id);if(!fruit)return;setRun(r=>({...r,crew:r.crew.map(c=>c.id===hero.id?{...c,maxHp:c.maxHp+fruit.maxHp,currentHp:Math.min(c.maxHp+fruit.maxHp,c.currentHp+fruit.maxHp),attack:c.attack+fruit.attack,fruit}:c),inventory:[...r.inventory,fruit.id],log:["🍈 "+fruit.name+": "+fruit.effect,...r.log].slice(0,8)}));setReward(null);setScreen("map");}
 function newRun(){clearRun();setRun(makeRun());setEnemyHp(0);setReward(null);setScreen("map");}

 if(run.gameOver)return <div className="game-over"><div className="eyebrow">GRAND LINE</div><h1>La ciurma è caduta</h1><p>Run {run.seed} terminata al capitolo {run.stage}.</p><button className="primary big" onClick={newRun}>🏴‍☠️ Nuova Run</button></div>;

 return <div className="app-shell">
  <header className="topbar"><div><div className="eyebrow">ONE PIECE ROGUE</div><h1>Grand Line</h1></div><div className="top-actions"><span className="currency">💰 {run.berries.toLocaleString("it-IT")}</span><button className="ghost" onClick={newRun}>Nuova Run</button></div></header>
  <main className="layout">
   <section className="panel map-panel">
    <div className="panel-title"><span>{screen==="battle"?"BATTAGLIA":screen==="reward"?"RICOMPENSA":"MAPPA"}</span><span className="small-label">East Blue · Seed {run.seed}</span></div>
    {screen==="map"&&<><div className="map">{MAP.map(n=>{const current=n.id===run.currentNode;const available=current||MAP.find(x=>x.id===run.currentNode)?.links.includes(n.id);return <button key={n.id} disabled={!available} className={"map-node "+(current?"selected ":"")+(available?"available":"")} style={{gridColumn:n.col,gridRow:n.row}} onClick={()=>chooseNode(n.id)}><span>{icons[n.type]}</span><small>{n.label}</small></button>})}</div><div className="node-detail"><span className="node-type">{icons[node.type]} {node.type.toUpperCase()}</span><h2>{node.label}</h2><p>{node.description}</p></div></>}
    {screen==="battle"&&enemy&&<div className="battle-screen"><div className="battle-hero"><span>🏴‍☠️</span><strong>{hero.name}</strong><small>{hero.ability}</small></div><div className="versus">VS</div><div className="battle-enemy"><span>{enemy.boss?"👑":"☠️"}</span><strong>{enemy.name}</strong><small>{enemyHp} / {enemyMax} HP</small><div className="health large"><span style={{width:(enemyHp/enemyMax*100)+"%"}}/></div></div><div className="battle-actions"><button className="primary big" onClick={attack}>⚔️ Attacca</button><button className="secondary big" onClick={heal}>❤️ Cura</button></div></div>}
    {screen==="reward"&&<div className="reward-screen">{reward==="victory"?<><div className="reward-icon">🏆</div><h2>Vittoria!</h2><p>Hai superato il nodo. Torna alla mappa e scegli il prossimo percorso.</p><button className="primary big" onClick={()=>{setReward(null);setScreen("map")}}>Continua</button></>:reward?<><div className="reward-icon">🍈</div><h2>{FRUITS.find(f=>f.id===reward)?.name}</h2><p>{FRUITS.find(f=>f.id===reward)?.effect}</p><button className="primary big" onClick={()=>takeFruit(reward)}>Dai il frutto a {hero.name}</button><button className="secondary big" onClick={()=>{setReward(null);setScreen("map")}}>Lascia perdere</button></>:null}</div>}
   </section>
   <aside className="panel crew-panel"><div className="panel-title"><span>YOUR CREW</span><span className="small-label">{run.crew.length}/6</span></div>
    <div className="crew-list">{run.crew.map(c=><button key={c.id} className={"crew-card "+(selected===c.id?"active":"")} onClick={()=>setSelected(c.id)}><div className="avatar">{c.name[0]}</div><div><div className="crew-name">{c.name}</div><div className="crew-role">{c.role} · ★{c.rarity}{c.fruit?" · 🍈":""}</div><div className="health mini"><span style={{width:(c.currentHp/c.maxHp*100)+"%"}}/></div></div><span className="hp">{c.currentHp}</span></button>)}</div>
    <div className="synergies"><div className="panel-title"><span>SINERGIE</span></div>{synergies.length?synergies.map(s=><div className="synergy" key={s.id}><strong>{s.name}</strong><small>{s.description}</small></div>):<p className="muted">Aggiungi membri per attivare bonus.</p>}</div>
    <div className="recruit"><div className="panel-title"><span>RECLUTAMENTO</span></div>{CHARACTERS.filter(c=>!run.crew.some(m=>m.id===c.id)).slice(0,3).map(c=><button className="recruit-row" key={c.id} disabled={run.crew.length>=6} onClick={()=>recruit(c.id)}><span>＋</span><div><strong>{c.name}</strong><small>{c.role} · ★{c.rarity}</small></div></button>)}</div>
    <div className="log"><div className="panel-title"><span>LOG</span></div>{run.log.map((x,i)=><p key={i}>{x}</p>)}</div>
   </aside>
  </main>
 </div>;
}
export default App;