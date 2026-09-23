import { RunState } from "./engine";
const KEY="one-piece-rogue:run:v2";
export function loadRun():RunState|null{try{const raw=localStorage.getItem(KEY);if(!raw)return null;const run=JSON.parse(raw) as RunState;return {...run,badges:run.badges??[]}}catch{return null}}
export function saveRun(run:RunState){localStorage.setItem(KEY,JSON.stringify(run))}
export function clearRun(){localStorage.removeItem(KEY)}
