# PartyBox (Activity/Tabu MVP)

Mobile-first party game for two teams. One phone is passed around.

## Features
- Start screen with editable team names
- Round duration: 30 / 60 / 90 seconds
- Random mode per round: Pantomime / Malen / Erklären
- Cards from local terms list (no backend)
- Timer with last-5-seconds highlight + beep when time is up
- Scoreboard with active team highlight
- Round end modal, switch to next team

## Run

```bash
cd partybox
npm install
npm run dev -- --host 0.0.0.0 --port 5173
```

Then open on the VPS:
- http://<VPS-IP>:5173/

## Code structure
- `src/App.tsx` – small state machine (start → rounds)
- `src/components/*` – UI components
- `src/data/terms.ts` – local term list
- `src/styles/app.css` – minimal styling

## Next ideas
- Canvas for Malen-mode
- Winner screen
- Categories + custom terms
- localStorage persistence
- QR join / multiplayer
