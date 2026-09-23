import type { MapNode } from "../game/data";

type Props = {
  nodes: MapNode[];
  currentId: string;
  onChoose: (id: string) => void;
};

const directionFor = (from: MapNode, to: MapNode) => {
  if (to.col > from.col) return { short: "E", label: "Est", icon: "→" };
  if (to.col < from.col) return { short: "O", label: "Ovest", icon: "←" };
  if (to.row < from.row) return { short: "N", label: "Nord", icon: "↑" };
  return { short: "S", label: "Sud", icon: "↓" };
};

const typeIcon: Record<MapNode["type"], string> = {
  battle: "⚔",
  event: "?",
  treasure: "◆",
  money: "💰",
  rest: "✚",
  boss: "☠",
  fruit: "●",
};

export function GrandLineMap({ nodes, currentId, onChoose }: Props) {
  const current = nodes.find((node) => node.id === currentId) ?? nodes[0];
  const available = nodes.filter((node) => current.links.includes(node.id));
  const maxRow = Math.max(...nodes.map((node) => node.row));
  const maxCol = Math.max(...nodes.map((node) => node.col));
  const pos = (node: MapNode) => ({
    left: 10 + ((node.col - 1) / Math.max(1, maxCol - 1)) * 80,
    top: 6 + ((maxRow - node.row) / Math.max(1, maxRow - 1)) * 88,
  });

  return (
    <div className="grand-map">
      <div className="map-ocean-label">
        <span>偉大なる航路 · GRAND LINE</span>
        <small>LOG POSE / ogni isola mostra la sua attività prima della scelta</small>
      </div>

      <div className="grand-map-stage">
        <svg className="grand-map-svg" viewBox="0 0 640 360" aria-hidden="true">
          <defs>
            <linearGradient id="grandSea" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#173a58" />
              <stop offset="55%" stopColor="#0c2238" />
              <stop offset="100%" stopColor="#071522" />
            </linearGradient>
            <pattern id="waves" width="64" height="28" patternUnits="userSpaceOnUse">
              <path d="M0 14 C10 5 22 5 32 14 S54 23 64 14" fill="none" stroke="#8fc5df" strokeOpacity=".13" strokeWidth="2" />
            </pattern>
          </defs>
          <rect width="640" height="720" rx="24" fill="url(#grandSea)" />
          <rect width="640" height="720" rx="24" fill="url(#waves)" />
          <path d="M18 590 C120 540 170 640 265 560 S430 460 622 540" fill="none" stroke="#b8e7f4" strokeOpacity=".12" strokeWidth="3" strokeDasharray="9 13" />

          {nodes.flatMap((node) =>
            node.links.map((targetId) => {
              const target = nodes.find((item) => item.id === targetId);
              if (!target || nodes.findIndex((item) => item.id === node.id) > nodes.findIndex((item) => item.id === target.id)) return null;
              const x1 = 80 + ((node.col - 1) / Math.max(1, maxCol - 1)) * 480;
              const y1 = 45 + ((maxRow - node.row) / Math.max(1, maxRow - 1)) * 630;
              const x2 = 80 + ((target.col - 1) / Math.max(1, maxCol - 1)) * 480;
              const y2 = 45 + ((maxRow - target.row) / Math.max(1, maxRow - 1)) * 630;
              return (
                <line
                  key={node.id + target.id}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke="#8bc5df"
                  strokeOpacity=".25"
                  strokeWidth="4"
                  strokeDasharray="8 10"
                />
              );
            }),
          )}
          <path d="M22 92 C90 48 122 142 185 92 S285 48 350 102 S470 152 610 72" fill="none" stroke="#d8f1fa" strokeOpacity=".14" strokeWidth="2" />
        </svg>

        {nodes.map((node) => {
          const p = pos(node);
          const isCurrent = node.id === currentId;
          const isAvailable = available.some((item) => item.id === node.id);
          return (
            <button
              key={node.id}
              type="button"
              className={`grand-node ${isCurrent ? "current" : ""} ${isAvailable ? "available" : ""}`}
              style={{ left: `${p.left}%`, top: `${p.top}%` }}
              disabled={!isAvailable}
              onClick={() => onChoose(node.id)}
              aria-label={`${node.label}${isAvailable ? ", rotta " + directionFor(current, node).label : ""}`}
            >
              <span className="node-orbit">{typeIcon[node.type]}</span>
              <strong>{node.label}</strong>
              <small className="node-activity">{node.type==="battle"?"COMBATTIMENTO":node.type==="treasure"?"TESORO":node.type==="money"?"BERRIES":node.type==="event"?"INCOGNITA":node.type==="rest"?"RIPOSO":node.type==="fruit"?"FRUTTO":"BOSS"}</small>
              {isAvailable && <small>{directionFor(current, node).icon} {directionFor(current, node).label}</small>}
            </button>
          );
        })}

        <div
          className="ship-marker"
          style={{
            left: `${pos(current).left}%`,
            top: `${pos(current).top}%`,
          }}
          aria-hidden="true"
        >
          <svg viewBox="0 0 80 56">
            <circle cx="40" cy="28" r="21" fill="#f0b44d" opacity=".16" stroke="#f0b44d" strokeWidth="2" />
            <circle cx="40" cy="28" r="7" fill="#f0b44d" />
          </svg>
        </div>
      </div>

      <div className="map-legend" aria-label="Legenda delle attività">
        <span><b>⚔</b> Combattimento</span>
        <span><b>◆</b> Tesoro</span>
        <span><b>💰</b> Berries</span>
        <span><b>?</b> Incognita</span>
        <span><b>✚</b> Riposo</span>
        <span><b>●</b> Frutto</span>
        <span><b>☠</b> Boss</span>
      </div>

      <div className="navigation-console">
        <div>
          <span className="console-kicker">NAVIGAZIONE</span>
          <strong>Il Log Pose indica più rotte.</strong>
          <small>Scegli una direzione: le altre rotte diventano irraggiungibili in questa run.</small>
        </div>
        <div className="direction-grid">
          {available.map((target) => {
            const direction = directionFor(current, target);
            return (
              <button key={target.id} type="button" onClick={() => onChoose(target.id)} className="direction-button">
                <span>{direction.icon}</span>
                <div>
                  <strong>{direction.label}</strong>
                  <small>{target.label}</small>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
