# PartyBox — Product + Tech Roadmap (Vision → #1 Party Game)

This roadmap is optimized for:
- instant fun in groups (party)
- surprisingly good solo loop
- shareability/virality without backend
- later app-store quality (PWA now; native wrapper later)

## North Star
**A 60-second setup, 10-minute laugh loop, and a 10-second shareable recap.**

## Principles
- Mobile-first, thumb-first
- Zero friction: no accounts required
- Deterministic fairness (no repeats, seeded decks)
- “Moments”: countdown, reveals, streaks, recaps
- Offline-first (airplane party)

## Milestones

### M0 (Now) — “Playable, feels like a game”
**Done / in progress:**
- DE/EN
- Countdown 3-2-1
- Sticky bottom CTAs
- Correct micro-delight
- Handoff screen

Success criteria:
- 5+ rounds without confusion
- No obvious UI bugs on iOS Safari


### M1 (v1.0) — “Party-ready” (shareable + configurable)
**Goal:** make every session end with a share.

Features:
1) **Packs**
   - Classic, Movies, Internet, Kids, Hard
   - Pack preview (sample cards)

2) **Twists (modifiers)**
   - Random small rule each round (optional toggle)
   - Example: “No gestures”, “Only questions”, “One-word clues”, etc.

3) **Round Recap**
   - After each round: points gained, streak, funniest words
   - One-tap **Copy recap**
   - Optional: **Share image** (canvas)

4) **Session Stats**
   - team win streaks
   - average words/round

Success criteria:
- People ask: “send me that game”
- 30% of sessions trigger a share action


### M2 (v1.5) — “Solo loop that doesn’t suck”
Features:
- Solo Speedrun
- Daily Challenge (seeded deck) + personal best
- Training mode (skip/flag words)

Success criteria:
- A player can enjoy 5 minutes alone


### M3 (v2.0) — “Creator mode” (growth engine)
Features:
- Create custom pack locally
- Share pack via URL (encoded + short) OR QR
- Import pack

Success criteria:
- Community-driven content without servers


### M4 (v3.0) — “App-store grade distribution”
Options:
- PWA install polish
- Native wrapper (Capacitor) for store release
- Better audio/haptics + background music toggle

Success criteria:
- Store build passes review
- Performance budgets met


## Metrics
- Time-to-first-round (TTFR): < 20s
- Round start rate after first view: > 75%
- Shares per session: > 0.3
- 7-day return (solo): > 15%


## Risks
- Content quality (words/packs) can cap retention → invest early
- Too many rules → keep Twists optional
- No backend limits analytics → use privacy-safe local stats + optional opt-in later
