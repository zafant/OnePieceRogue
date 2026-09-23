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
  rest: "✚",
  boss: "☠",
  fruit: "●",
};

export function GrandLineMap({ nodes, currentId, onChoose }: Props) {
  const current = nodes.find((node) => node.id === currentId) ?? nodes[0];
  const available = nodes.filter((node) => current.links.includes(node.id));
  const pos = (node: MapNode) => ({
    left: 8 + ((node.col - 1) / 3) * 84,
    top: 12 + ((3 - node.row) / 2) * 70,
  });

  return (
    <div className="grand-map">
      <div className="map-ocean-label">
        <span>偉大なる航路 · GRAND LINE</span>
        <small>LOG POSE / rotta selezionabile</small>
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
          <rect width="640" height="360" rx="24" fill="url(#grandSea)" />
          <rect width="640" height="360" rx="24" fill="url(#waves)" />
          <path d="M18 305 C120 270 170 330 265 286 S430 220 622 270" fill="none" stroke="#b8e7f4" strokeOpacity=".12" strokeWidth="3" strokeDasharray="9 13" />

          {nodes.flatMap((node) =>
            node.links.map((targetId) => {
              const target = nodes.find((item) => item.id === targetId);
              if (!target || node.id > target.id) return null;
              const x1 = 80 + (node.col - 1) * 160;
              const y1 = 290 - (node.row - 1) * 120;
              const x2 = 80 + (target.col - 1) * 160;
              const y2 = 290 - (target.row - 1) * 120;
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
          <path d="M22 62 C90 28 122 92 185 56 S285 28 350 62 S470 94 610 46" fill="none" stroke="#d8f1fa" strokeOpacity=".14" strokeWidth="2" />
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
            <path d="M10 35 L66 35 L57 47 L22 47 Z" fill="#9a5a2e" stroke="#f5d79d" strokeWidth="2" />
            <path d="M18 34 L31 11 L43 34 Z" fill="#f4e2b6" stroke="#26384d" strokeWidth="2" />
            <path d="M43 34 L43 6" stroke="#e7c58d" strokeWidth="3" />
            <path d="M43 7 L62 16 L43 22 Z" fill="#d44f43" />
            <circle cx="29" cy="30" r="5" fill="#e7c58d" />
          </svg>
        </div>
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
