# OnePieceRogue

Roguelike web game prototype inspired by the node/run structure of Pokelike and themed around One Piece.

## Current gameplay

- Persistent run saved locally with `localStorage`
- Seeded run state
- Branching East Blue map with gated next nodes
- Battle loop with player attack + enemy retaliation
- Crew HP, defeat and Game Over
- Recruitable characters, up to 6 crew members
- Devil Fruit reward nodes with permanent-in-run stat modifiers
- Crew synergies
- Berries economy and combat rewards
- Treasure, event, rest and boss nodes
- Arlong boss encounter
- Responsive UI for desktop and mobile

## Stack

- React
- TypeScript
- Vite
- GitHub
- Cloudflare

No paid backend is required for the current MVP.

## Development

```bash
npm install
npm run dev
npm run build
```

## CI

GitHub Actions runs `npm run build` on pushes and pull requests targeting `main`.

## Roadmap

1. Expand the combat engine with turn order, status effects and abilities.
2. Convert the fixed East Blue graph into seeded procedural maps.
3. Add equipment, Haki and relics.
4. Add permanent meta-progression and unlocks.
5. Add more islands, enemies and bosses.
6. Add audio/animation/assets after the core loop is stable.
