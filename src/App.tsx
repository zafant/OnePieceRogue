import { useEffect, useMemo, useState } from "react";
import { CHARACTERS, FRUITS, ITEMS, MAP, type NodeType } from "./game/data";
import { applyPassiveItem, enemyDamage, enemyForNode, healAmount, makeRun, resolveRound, synergyBonus, uniqueChoices, victoryHeal, type RunState } from "./game/engine";
import { clearRun, loadRun, saveRun } from "./game/storage";

const icons:Record<NodeType,string>={battle:"⚔️",event:"❓",treasure:"💰",rest:"❤️",boss:"👑",fruit:"🍈"};

function App(){
 const [run,setRun]=useState<RunState>(()=>loadRun()??makeRun());
 const [enemyHp,setEnemyHp]=useState(0);
 const [enemyMax,setEnemyMax]=useState(0);
 const [selected,setSelected]=useState("luffy");
 const [screen,setScreen]=useState<"map"|"battle"|"reward">("map");
 const [reward,setReward]=useState<"item"|"fruit"|"victory"|null>(null);
 const [itemChoices,setItemChoices]=useState(ITEMS.slice(0,3));
 const [fruitChoice,setFruitChoice]=useState<string|null>(null);
 const node=useMemo(()=>MAP.find(n=>n.id===run.currentNode)??MAP[0],[run.currentNode]);
 const enemy=enemyForNode(run.currentNode);
 const selectedMember=run.crew.find(c=>c.id===selected)??run.crew[0];
 const synergies=synergyBonus(run.crew);
 const leader=run.crew.find(c=>c.currentHp>0)??run.crew[0];

 useEffect(()=>{saveRun(run)},[run]);

 useEffect(()=>{
  if(screen!=="battle"||!enemy||enemyHp<=0)return;
  const timer=window.setTimeout(()=>{
   const result=resolveRound(run.crew,enemy,enemyHp);
   const messages=result.messages.length?result.messages.join(" · "):"La battaglia continua.";
   if(result.lost){
    setRun(r=>({...r,crew:result.crew,gameOver:true,log:["☠️ La ciurma è stata sconfitta.",messages,...r.log].slice(0,8)}));
    setEnemyHp(0);
    return;
   }
   if(result.won){
    const healed=victoryHeal(result.crew);
    const badge=enemy.boss?"Arlong Park":null;
    setRun(r=>({...r,crew:healed,berries:r.berries+enemy.reward,badges:badge&&!r.badges.includes(badge)?[...r.badges,badge]:r.badges,victory:!!enemy.boss,log:[enemy.boss?"👑 Arlong Park conquistato!":"🏆 "+enemy.name+" sconfitto!","+"+enemy.reward+" Berries.",messages,...r.log].slice(0,8)}));
    setEnemyHp(0);
    setReward(enemy.boss?"victory":"item");
    setItemChoices(uniqueChoices(ITEMS,3));
    setScreen("reward");
    return;
   }
   setRun(r=>({...r,crew:result.crew,log:[messages,...r.log].slice(0,8)}));
   setEnemyHp(result.enemyHp);
  },850);
  return()=>window.clearTimeout(timer);
 },[screen,enemyHp,run.crew,run.currentNode]);

 function chooseNode(id:string){
  const next=MAP.find(n=>n.id===id);const current=MAP.find(n=>n.id===run.currentNode);
  if(!next||!current||id===current.id||!current.links.includes(id))return;
  setRun(r=>({...r,currentNode:id,stage:r.stage+1}));
  if(next.type==="battle"||next.type==="boss"){const e=enemyForNode(id);if(e){setEnemyHp(e.maxHp);setEnemyMax(e.maxHp);setScreen("battle");}return;}
  if(next.type==="treasure"){setRun(r=>({...r,berries:r.berries+250,log:["💰 Tesoro: +250 Berries.",...r.log].slice(0,8)}));setItemChoices(uniqueChoices(ITEMS,3));setReward("item");setScreen("reward");return;}
  if(next.type==="event"){setRun(r=>({...r,berries:r.berries+180,log:["❓ Evento: +180 Berries. La taverna del porto offre nuove opportunità.",...r.log].slice(0,8)}));return;}
  if(next.type==="rest"){setRun(r=>({...r,crew:r.crew.map(c=>({...c,currentHp:c.maxHp})),log:["❤️ La ciurma è completamente guarita.",...r.log].slice(0,8)}));return;}
  if(next.type==="fruit"){const fruit=FRUITS[Math.floor(Math.random()*FRUITS.length)];setFruitChoice(fruit.id);setReward("fruit");setScreen("reward");}
 }

 function takeItem(id:string){
  const item=ITEMS.find(i=>i.id===id);if(!item||run.inventory.includes(item.id))return;
  setRun(r=>({...r,crew:applyPassiveItem(r.crew,item),inventory:[...r.inventory,item.id],log:["🎒 "+item.name+": "+item.description,...r.log].slice(0,8)}));
  setReward(null);setScreen("map");
 }
 function takeFruit(id:string){
  const fruit=FRUITS.find(f=>f.id===id);if(!fruit)return;
  setRun(r=>({...r,crew:r.crew.map(c=>c.id===selectedMember.id?{...c,maxHp:c.maxHp+fruit.maxHp,currentHp:Math.min(c.maxHp+fruit.maxHp,c.currentHp+fruit.maxHp),attack:c.attack+fruit.attack,fruit}:c),inventory:[...r.inventory,fruit.id],log:["🍈 "+fruit.name+": "+fruit.effect,...r.log].slice(0,8)}));
  setFruitChoice(null);setReward(null);setScreen("map");
 }
 function recruit(id:string){
  const c=CHARACTERS.find(x=>x.id===id);if(!c||run.crew.length>=6||run.crew.some(x=>x.id===id)||run.berries<220)return;
  setRun(r=>({...r,berries:r.berries-220,crew:[...r.crew,{...c,currentHp:c.maxHp}],log:["🏴‍☠️ "+c.name+" si unisce alla ciurma per 220 Berries.",...r.log].slice(0,8)}));
 }
 function moveMember(id:string,direction:-1|1){
  setRun(r=>{const index=r.crew.findIndex(c=>c.id===id);const next=index+direction;if(index<0||next<0||next>=r.crew.length)return r;const crew=[...r.crew];[crew[index],crew[next]]=[crew[next],crew[index]];return {...r,crew,log:["🔁 Ordine della ciurma aggiornato: "+crew.map(c=>c.name).join(" → "),...r.log].slice(0,8)}});
 }
 function healSelected(){
  if(!selectedMember)return;
  const amount=healAmount(110,run.inventory);
  setRun(r=>({...r,crew:r.crew.map(c=>c.id===selectedMember.id?{...c,currentHp:Math.min(c.maxHp,c.currentHp+amount)}:c),log:["❤️ "+selectedMember.name+" recupera "+amount+" HP.",...r.log].slice(0,8)}));
 }
 function newRun(){clearRun();setRun(makeRun());setEnemyHp(0);setReward(null);setFruitChoice(null);setScreen("map");}

 if(run.gameOver)return <div className="game-over"><div className="eyebrow">GRAND LINE</div><h1>La ciurma è caduta</h1><p>Run {run.seed} terminata al capitolo {run.stage}.</p><button className="primary big" onClick={newRun}>🏴‍☠️ Nuova Run</button></div>;

 return <div className="app-shell">
  <header className="topbar"><div><div className="eyebrow">ONE PIECE ROGUE</div><h1>Grand Line</h1></div><div className="top-actions"><span className="currency">💰 {run.berries.toLocaleString("it-IT")}</span><span className="run-chip">🏅 {run.badges.length}</span><button className="ghost" onClick={newRun}>Nuova Run</button></div></header>
  <main className="layout">
   <section className="panel map-panel">
    <div className="panel-title"><span>{screen==="battle"?"AUTOBATTLE":screen==="reward"?"RICOMPENSA":"MAPPA"}</span><span className="small-label">East Blue · Seed {run.seed} · Nodo {run.stage}</span></div>
    {screen==="map"&&<><div className="map">{MAP.map(n=>{const current=n.id===run.currentNode;const available=!current&&MAP.find(x=>x.id===run.currentNode)?.links.includes(n.id);return <button key={n.id} disabled={!available} className={"map-node "+(current?"selected ":"")+(available?"available":"")} style={{gridColumn:n.col,gridRow:n.row}} onClick={()=>chooseNode(n.id)}><span>{icons[n.type]}</span><small>{n.label}</small></button>})}</div><div className="node-detail"><span className="node-type">{icons[node.type]} {node.type.toUpperCase()}</span><h2>{node.label}</h2><p>{node.description}</p><p className="route">Scegli il prossimo nodo: la rotta chiusa non può essere recuperata.</p></div></>}
    {screen==="battle"&&enemy&&<div className="battle-screen"><div className="battle-party"><div className="party-title">LA TUA CIURMA · AUTO</div>{run.crew.map((c,i)=><div className={"battle-member "+(c.id===leader.id?"leader":"")} key={c.id}><span>{i+1}</span><strong>{c.name}</strong><small>{c.currentHp} HP</small></div>)}</div><div className="versus">VS</div><div className="battle-enemy"><span>{enemy.boss?"👑":"☠️"}</span><strong>{enemy.name}</strong><small>{enemyHp} / {enemyMax} HP</small><div className="health large"><span style={{width:(enemyHp/enemyMax*100)+"%"}}/></div><small>Round automatico · il primo membro vivo assorbe il colpo</small></div><div className="battle-status">⚡ La battaglia si risolve da sola. Preparazione, ordine e sinergie decidono l'esito.</div></div>}
    {screen==="reward"&&<div className="reward-screen">{reward==="victory"?<><div className="reward-icon">🏆</div><h2>{enemy?.boss?"Badge: Arlong Park":"Vittoria!"}</h2><p>Il checkpoint è superato. La run ora entra nella fase successiva.</p><button className="primary big" onClick={()=>{setReward(null);setScreen("map")}}>Continua</button></>:reward==="item"?<><div className="reward-icon">🎒</div><h2>Scegli un Passive Item</h2><p>Resta nella borsa per il resto della run e modifica permanentemente la squadra.</p><div className="choice-grid">{itemChoices.map(item=><button className="choice-card" key={item.id} disabled={run.inventory.includes(item.id)} onClick={()=>takeItem(item.id)}><strong>{item.name}</strong><small>{item.description}</small></button>)}</div><button className="secondary big" onClick={()=>{setReward(null);setScreen("map")}}>Salta</button></>:reward==="fruit"&&fruitChoice?<><div className="reward-icon">🍈</div><h2>{FRUITS.find(f=>f.id===fruitChoice)?.name}</h2><p>{FRUITS.find(f=>f.id===fruitChoice)?.effect}</p><div className="choice-grid"><button className="choice-card" onClick={()=>takeFruit(fruitChoice)}>Assegna a {selectedMember.name}</button><button className="choice-card" onClick={()=>{setReward(null);setFruitChoice(null);setScreen("map")}}>Lascia il frutto</button></div></>:null}</div>}
   </section>
   <aside className="panel crew-panel"><div className="panel-title"><span>YOUR CREW</span><span className="small-label">{run.crew.length}/6</span></div>
    <p className="hint">Il primo membro vivo è il bersaglio dei nemici. Usa ↑ ↓ per preparare l'ordine prima del prossimo scontro.</p>
    <div className="crew-list">{run.crew.map((c,i)=><div className={"crew-row "+(selected===c.id?"active":"")} key={c.id}><button className="crew-card" onClick={()=>setSelected(c.id)}><div className="avatar">{c.name[0]}</div><div><div className="crew-name">{c.name}</div><div className="crew-role">{c.role} · ★{c.rarity}{c.fruit?" · 🍈":""}</div><div className="health mini"><span style={{width:(c.currentHp/c.maxHp*100)+"%"}}/></div></div><span className="hp">{c.currentHp}</span></button><div className="order-actions"><button onClick={()=>moveMember(c.id,-1)} disabled={i===0}>↑</button><button onClick={()=>moveMember(c.id,1)} disabled={i===run.crew.length-1}>↓</button></div></div>)}</div>
    <div className="quick-action"><button className="secondary" onClick={healSelected}>❤️ Cura {selectedMember.name}</button><span>+{healAmount(110,run.inventory)} HP · fuori dal combattimento</span></div>
    <div className="synergies"><div className="panel-title"><span>SINERGIE</span></div>{synergies.length?synergies.map(s=><div className="synergy" key={s.id}><strong>{s.name}</strong><small>{s.description}</small></div>):<p className="muted">Aggiungi membri per attivare bonus.</p>}</div>
    <div className="recruit"><div className="panel-title"><span>RECLUTAMENTO · 220 💰</span></div>{CHARACTERS.filter(c=>!run.crew.some(m=>m.id===c.id)).slice(0,4).map(c=><button className="recruit-row" key={c.id} disabled={run.crew.length>=6||run.berries<220} onClick={()=>recruit(c.id)}><span>＋</span><div><strong>{c.name}</strong><small>{c.role} · ★{c.rarity}</small></div></button>)}</div>
    <div className="inventory"><div className="panel-title"><span>BAG</span><span className="small-label">{run.inventory.length}</span></div>{run.inventory.length?<div className="tag-list">{run.inventory.map(id=><span key={id}>{ITEMS.find(i=>i.id===id)?.name??FRUITS.find(f=>f.id===id)?.name}</span>)}</div>:<p className="muted">Nessun oggetto permanente.</p>}</div>
    <div className="log"><div className="panel-title"><span>LOG</span></div>{run.log.map((x,i)=><p key={i}>{x}</p>)}</div>
   </aside>
  </main>
 </div>;
}
export default App;
