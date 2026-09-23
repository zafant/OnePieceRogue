import { RunState } from "./engine";
const KEY="one-piece-rogue:run:v1";
export function loadRun():RunState|null{try{const raw=localStorage.getItem(KEY);return raw?JSON.parse(raw) as RunState:null}catch{return null}}
export function saveRun(run:RunState){localStorage.setItem(KEY,JSON.stringify(run))}
export function clearRun(){localStorage.removeItem(KEY)}