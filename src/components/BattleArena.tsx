import type { Enemy } from "../game/data";
import type { MemberState } from "../game/engine";
import { CharacterAvatar } from "./CharacterAvatar";

type Props = {
  crew: MemberState[];
  enemy: Enemy;
  enemyHp: number;
  enemyMax: number;
  leaderId: string;
  pulse: boolean;
  messages: string[];
};

export function BattleArena({ crew, enemy, enemyHp, enemyMax, leaderId, pulse, messages }: Props) {
  const living = crew.filter((member) => member.currentHp > 0).slice(0, 4);
  const enemyPercent = enemyMax > 0 ? (enemyHp / enemyMax) * 100 : 0;

  return (
    <div className={"battle-screen " + (pulse ? "battle-pulse" : "")}>
      <div className="battle-arena">
        <div className="arena-backdrop" aria-hidden="true">
          <div className="arena-sky" />
          <div className="arena-ground" />
        </div>

        <div className="battle-side allies">
          <div className="battle-side-title">LA TUA CIURMA</div>
          <div className="battle-avatars">
            {living.map((member, index) => (
              <div className={"fighter fighter-" + index} key={member.id}>
                <CharacterAvatar
                  character={member}
                  size="battle"
                  active={member.id === leaderId}
                />
                <div className="fighter-name">{member.name}</div>
                <div className="health mini">
                  <span style={{ width: (member.currentHp / member.maxHp) * 100 + "%" }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="combat-vs">
          <span>VS</span>
          <small>ROUND AUTO</small>
        </div>

        <div className={"enemy-fighter " + (pulse ? "hit" : "")}>
          <div className="enemy-sprite">
            <svg viewBox="0 0 150 180" aria-hidden="true">
              <ellipse cx="75" cy="168" rx="48" ry="8" fill="#000" opacity=".28" />
              <path d="M35 165 Q38 105 75 91 Q112 105 115 165Z" fill="#26384d" stroke="#101924" strokeWidth="5" />
              <circle cx="75" cy="65" r="39" fill="#8c604e" stroke="#101924" strokeWidth="5" />
              <path d="M35 56 Q41 18 75 22 Q109 18 115 56 Q94 43 75 43 Q56 43 35 56Z" fill="#161d27" />
              <circle cx="60" cy="68" r="4" fill="#f2c14f" />
              <circle cx="90" cy="68" r="4" fill="#f2c14f" />
              <path d="M55 86 Q75 99 95 86" fill="none" stroke="#101924" strokeWidth="4" />
            </svg>
          </div>
          <strong>{enemy.name}</strong>
          <small>{enemyHp} / {enemyMax} HP</small>
          <div className="health large">
            <span style={{ width: enemyPercent + "%" }} />
          </div>
        </div>
      </div>

      <div className="battle-status">
        ⚡ La battaglia è visibile e automatica.
        <div className="battle-feed">{messages.slice(-3).map((message, index) => <span key={index}>{message}</span>)}</div>
      </div>
    </div>
  );
}
