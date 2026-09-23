import { useMemo, useState } from "react";

type NodeType = "battle" | "event" | "treasure" | "rest" | "boss";
type Character = {
  id: string; name: string; role: string; rarity: number;
  hp: number; attack: number; ability: string;
};
type CrewMember = Character & { currentHp: number };
type MapNode = {
  id: string; type: NodeType; label: string; description: string; row: number; col: number;
};

const characters: Character[] = [
  { id:"luffy", name:"Luffy", role:"DPS", rarity:5, hp:920, attack:128, ability:"Gum-Gum Pistol" },
  { id:"zoro", name:"Zoro", role:"DPS", rarity:5, hp:820, attack:142, ability:"Oni Giri" },
  { id:"nami", name:"Nami", role:"Support", rarity:4, hp:560, attack:92, ability:"Thunder Tempo" },
  { id:"sanji", name:"Sanji", role:"DPS", rarity:5, hp:790, attack:134, ability:"Diable Jambe" },
  { id:"usopp", name:"Usopp", role:"Ranged", rarity:4, hp:590, attack:105, ability:"Kabuto Shot" },
  { id:"chopper", name:"Chopper", role:"Healer", rarity:4, hp:670, attack:76, ability:"Emergency Medicine" },
];

const nodes: MapNode[] = [
  {id:"n1",type:"battle",label:"Marine Patrol",description:"Una pattuglia della Marina blocca il passaggio.",row:1,col:1},
  {id:"n2",type:"event",label:"Mysterious Island",description:"Una piccola isola nasconde un incontro inatteso.",row:1,col:2},
  {id:"n3",type:"battle",label:"Pirate Crew",description:"Una ciurma rivale ha avvistato la tua nave.",row:1,col:3},
  {id:"n4",type:"treasure",label:"Treasure",description:"Un forziere galleggia tra le onde.",row:2,col:1},
  {id:"n5",type:"rest",label:"Tavern",description:"Un posto sicuro per recuperare le forze.",row:2,col:2},
  {id:"n6",type:"battle",label:"Fishmen",description:"Un gruppo di uomini-pesce difende il porto.",row:2,col:3},
  {id:"n7",type:"event",label:"Merchant",description:"Un mercante propone merci rare.",row:3,col:1},
  {id:"n8",type:"battle",label:"Warlord Crew",description:"Una ciurma al servizio di un potente pirata.",row:3,col:2},
  {id:"n9",type:"boss",label:"Arlong",description:"La strada finisce davanti al parco di Arlong.",row:3,col:3},
];

const icons: Record<NodeType,string> = {battle:"⚔️",event:"❓",treasure:"💰",rest:"❤️",boss:"👑"};
const startCrew: CrewMember[] = characters.slice(0,3).map(c => ({...c,currentHp:c.hp}));

function App() {
  const [crew,setCrew]=useState(startCrew);
  const [berries,setBerries]=useState(350);
  const [currentNode,setCurrentNode]=useState("n1");
  const [selected,setSelected]=useState("luffy");
  const [enemyHp,setEnemyHp]=useState(480);
  const [log,setLog]=useState(["Benvenuto nella Grand Line.","Scegli un nodo."]);

  const node=useMemo(()=>nodes.find(n=>n.id===currentNode) ?? nodes[0],[currentNode]);
  const battle=node.type==="battle" || node.type==="boss";
  const maxEnemyHp=node.type==="boss"?1400:480;
  const selectedHero=crew.find(c=>c.id===selected) ?? crew[0];

  function write(message:string){ setLog(old=>[message,...old].slice(0,6)); }

  function chooseNode(next:MapNode){
    setCurrentNode(next.id);
    if(next.type==="battle"){setEnemyHp(480);write(`⚔️ ${next.label}: prepara la ciurma.`);}
    if(next.type==="boss"){setEnemyHp(1400);write("👑 Arlong è davanti a te.");}
    if(next.type==="treasure"){setBerries(v=>v+250);write("💰 Hai trovato 250 Berries.");}
    if(next.type==="event"){setBerries(v=>v+120);write("❓ L'evento porta 120 Berries.");}
    if(next.type==="rest"){setCrew(old=>old.map(c=>({...c,currentHp:c.hp})));write("❤️ La ciurma recupera.");}
  }

  function attack(){
    if(enemyHp<=0)return;
    const damage=selectedHero.attack+Math.floor(Math.random()*30);
    const next=Math.max(0,enemyHp-damage);
    setEnemyHp(next);
    if(next===0){
      setBerries(v=>v+(node.type==="boss"?1000:320));
      write(`🏆 ${selectedHero.name} vince! +Berries.`);
    } else write(`⚡ ${selectedHero.name} usa ${selectedHero.ability}: -${damage} HP.`);
  }

  function heal(){
    setCrew(old=>old.map(c=>c.id===selected?{...c,currentHp:Math.min(c.hp,c.currentHp+100)}:c));
    write(`❤️ ${selectedHero.name} recupera 100 HP.`);
  }

  return <div className="app-shell">
    <header className="topbar">
      <div><div className="eyebrow">ONE PIECE ROGUE</div><h1>Grand Line</h1></div>
      <div className="currency">💰 {berries.toLocaleString("it-IT")} Berries</div>
    </header>
    <main className="layout">
      <section className="panel map-panel">
        <div className="panel-title"><span>MAPPA</span><span className="small-label">East Blue · Run 01</span></div>
        <div className="map">
          {nodes.map(n=><button key={n.id} className={`map-node ${n.id===currentNode?"selected":""}`} style={{gridColumn:n.col,gridRow:n.row}} onClick={()=>chooseNode(n)}>
            <span>{icons[n.type]}</span><small>{n.label}</small>
          </button>)}
        </div>
        <div className="node-detail">
          <span className="node-type">{icons[node.type]} {node.type.toUpperCase()}</span>
          <h2>{node.label}</h2><p>{node.description}</p>
          {battle && <div className="enemy-card"><div className="enemy-heading"><strong>{node.label}</strong><span>{enemyHp} HP</span></div><div className="health"><span style={{width:`${(enemyHp/maxEnemyHp)*100}%`}}/></div></div>}
        </div>
      </section>
      <aside className="panel crew-panel">
        <div className="panel-title"><span>YOUR CREW</span><span className="small-label">{crew.length}/6</span></div>
        <div className="crew-list">
          {crew.map(c=><button key={c.id} className={`crew-card ${selected===c.id?"active":""}`} onClick={()=>setSelected(c.id)}>
            <div className="avatar">{c.name[0]}</div>
            <div className="crew-copy"><div className="crew-name">{c.name}</div><div className="crew-role">{c.role} · ★{c.rarity}</div><div className="health mini"><span style={{width:`${(c.currentHp/c.hp)*100}%`}}/></div></div>
            <span className="hp">{c.currentHp}</span>
          </button>)}
        </div>
        {battle && <div className="actions"><button className="primary" onClick={attack} disabled={enemyHp===0}>⚔️ Attacca</button><button className="secondary" onClick={heal}>❤️ Cura</button></div>}
        <div className="log"><div className="panel-title"><span>LOG</span></div>{log.map((x,i)=><p key={i}>{x}</p>)}</div>
      </aside>
    </main>
  </div>;
}
export default App;