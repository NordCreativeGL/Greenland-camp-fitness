# TEKNISK REFERENCE — Grønland Camp Fitness

## Infrastruktur

- **Repo:** `NordCreativeGL/Greenland-camp-fitness` (GitHub), lokal mappe `greenland-camp-fitness`. Remote `origin` peger på `https://github.com/NordCreativeGL/Greenland-camp-fitness.git`.
- **Vercel-projekt:** ikke konfigureret i repoet — der findes hverken `vercel.json` eller en `.vercel/`-mappe, og ingen fil i repoet nævner Vercel. Deploy-target er derfor **ubekræftet** ud fra kodebasen alene; hvis appen allerede er koblet til Vercel, sker det via projektets dashboard-indstillinger, ikke via commits i dette repo.
- **Build system:** ingen. `package.json` har intet `build`-script (kun en placeholder `test`-kommando der fejler med det samme). Ingen bundler, ingen framework — statiske filer (`index.html`, `css/`, `js/`) serveres direkte.
- **Afhængigheder** (`package.json` → `dependencies`): `@fontsource/ibm-plex-mono`, `@fontsource/ibm-plex-sans`, `@fontsource/oswald` (kilden til de selv-hostede `.woff2`-filer i `fonts/` — men de indlæses direkte fra `fonts/` via `@font-face` i `css/style.css`, ikke fra `node_modules` ved runtime).
- **Git-workflow (CLAUDE.md):** enhver `git commit` efterfølges automatisk af `git push -u origin main`, uden bekræftelse, medmindre der eksplicit bedes om at undlade push for den specifikke ændring.

## Designtokens / systemvalg

Alle værdier kopieret verbatim fra `:root` i `css/style.css`:

```css
:root {
  --color-bg: #0B1116;
  --color-panel: #131C24;
  --color-panel-alt: #1B2833;
  --color-border: #24323D;
  --color-text: #E5EDF0;
  --color-text-muted: #5C7080;
  --color-accent-ice: #8FD8E0;
  --color-accent-flare: #E8543A;
  --font-display: 'Oswald', sans-serif;
  --font-body: 'IBM Plex Sans', sans-serif;
  --font-mono: 'IBM Plex Mono', monospace;
  --fs-display: 2rem;
  --fs-h1: 1.5rem;
  --fs-h2: 1.125rem;
  --fs-body: 1rem;
  --fs-small: 0.875rem;
  --fs-mono-data: 1.25rem;
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 16px;
  --space-4: 24px;
  --space-5: 32px;
  --radius: 6px;
  --tabbar-height: 64px;
}
```

**Fonts:** selv-hostet via `@font-face` (ingen Google Fonts/eksterne links) — Oswald 400 & 600, IBM Plex Sans 400 & 500, IBM Plex Mono 400 & 500, alle som `.woff2` i `fonts/`.

**Farvesemantik (låst regel, dokumenteret som kommentar øverst i `css/style.css` lige efter `:root`):**
> `--color-accent-flare` = "done / active / selected" — brugt konsekvent til: udfyldte set-knapper, den valgte RPE-segment, dagens kolonne i ugeoversigten, samt de oprindelige brug (let-dag-banner, start-knap).
> `--color-accent-ice` = neutral/default interaktiv farve — kanter, mono data-aflæsninger, ikke-valgte tilstande, hjørne-accenter på `.card--bracket`.

Reglen er eksplicit skrevet ind i stylesheetet for at signalere at splittet er tilsigtet, ikke tilfældigt — nye komponenter skal følge samme logik.

## Status pr. skærm/feature

| Skærm/feature | Status | Låst? |
|---|---|---|
| Trænings-visning — single-mode rendering | Implementeret, browser-verificeret | Ja |
| Trænings-visning — alternating-mode rendering (Push-Pull A & B, superset-runder) | Implementeret, browser-verificeret | Ja |
| Trænings-visning — lightDay-rendering (dag 7) | Implementeret, browser-verificeret | Ja |
| Ugeoversigt (7-kolonne strip øverst i trænings-visning) | Implementeret, browser-verificeret | Ja |
| RPE-kontrol (Svært/Forventet/Let, én rad med interne delere) | Implementeret, browser-verificeret | Ja |
| `card--bracket` primær/sekundær-distinktion (hjørne-accenter på primær, dæmpet panel på sekundær) | Implementeret, browser-verificeret | Ja |
| KOST-fane | Død stub — tom `<main id="view-food">`, ingen render-funktion, ingen data | Nej |
| LOG-fane | Ikke påbegyndt — ingen fane, ingen DOM-sektion, ingen wiring | Nej |

## Låste komponenter og værdier

**Baseline-styrketal** (fra `GCF-Traeningsprogram-6uger.md` §0, "låst fra handover"):

| Baseline | Værdi |
|---|---|
| Strikte pull-ups | 12 |
| Ring dips | 10 |
| Væg-håndstand hold | 60s |
| Fuld L-sit hold | 15-20s |
| Push-ups | 40 |

Konsekvens (låst designbeslutning): med disse baseline-tal er standard push-ups/dips intet reelt stimulus — programmet starter direkte på avancerede varianter (paralette- og ring-baserede) i stedet for at opvarme gennem lettere niveauer.

**Udstyr** (afledt af øvelsesbiblioteket i §4): elastikker/modstandsbånd i tre relative niveauer — tynd/medium/tyk, kalibreres i uge 1 (§7) — gymnastikringe, paralletter, samt væg (håndstand).

**Ugentligt volumen-loft** (§6, beregnet ved uge 3): Push 20 sæt/uge, Pull 20 sæt/uge, Legs quad 15 sæt/uge, Legs hinge 15 sæt/uge — alt inden for det angivne 10-20-sæt/uge/mønster-loft. Push/pull-volumen er uændret fra en tidligere sekventiel struktur — kun leveringsformen (superset frem for separate sessioner) er ændret.

**Primær/sekundær + alternerende-par som arkitektonisk låst beslutning:** Push+PullVertical og Dips+PullRow trænes IKKE i separate sessioner — de alterneres runde-for-runde i samme session (§2). Dette er en bevidst ændring i forhold til handoverets oprindelige antagelse om at genbruge et uændret variants-array (§10, dokumentets afsluttende note) — datamodellen kræver derfor både et sekundær-felt og et flag for "alternerende par", implementeret i `js/data/schedule.js` (`mode: 'alternating'`) og `js/program.js` (`buildAlternatingSession`).

**Primær/sekundær visuel vægt som låst designbeslutning:** primære øvelser får `.card--bracket` (hjørne-accenter i `--color-accent-ice`, `--color-panel-alt`-baggrund, fuld padding/heading-størrelse); sekundære øvelser får `.exercise-card--secondary` (ingen hjørne-accenter, `--color-panel`-baggrund, stiplet ramme, mindre padding — men samme heading-størrelse som primær, jf. commit 8ec8c64). Enkelt-øvelse-kategorierne `legsQuad` og `legsHinge` har intet `secondary`-felt i `js/data/exercises.js` og renderer derfor altid med brackets. Rationale i én linje: primær er sessionens visuelle fokuspunkt, sekundær er bevidst mere tilbagetrukket.

**Andre låste programbeslutninger:**
- Uge 4-deload er obligatorisk, ikke valgfri, selv ved god form (§9).
- Dag 7 er aktiv restitution, IKKE en nul-dag — eksplicit låst beslutning fra handover (§8).
- Core/Skill A uge 6: L-sit-hold er **straddle 15s** (restSeconds: 75) — ikke fuld 24s-varianten som §5's tabel nævnte som alternativ. Bekræftet og implementeret i `js/data/exercises.js`.

## Verificerede fakta

Al verifikation kørt via en headless-Chrome-driver (`playwright-core` + systemets Google Chrome, `channel: 'chrome'`) mod den lokale dev-server (`python3 -m http.server`), viewport 420×1400 (mobil-bredde), da appen registrerer en service worker og derfor skal serveres over HTTP, ikke `file://`.

- **Fase 3-verifikation** (data-lag → rendering-omskrivning): dag 3 (single-mode: legsQuad/handstand/conditioning), dag 1 (alternating Push-Pull A), dag 2 (alternating Push-Pull B + finisher), dag 7 (lightDay) — alle renderede korrekt, 0 konsol-fejl, skærmbilleder visuelt inspiceret.
- **42-dages smoke test:** dag 1-42 gennemløbet uden fejl (efter rettelse af en off-by-one-fejl i selve testloopet, ikke i appen).
- **Design-system-verifikation** (ugeoversigt, RPE-omstyling, `card--bracket`): samme fire cases genkørt efter styling-ændringerne — 0 konsol-fejl, ugeoversigtens "i dag"-kolonne korrekt fremhævet med flare-farve på alle fire testede dage, korrekt kort-antal og bracket/ikke-bracket-fordeling.
- **Sekundær-kort-vægt-refinement:** dag 1 og dag 2 sanity-checket — 4 primære (`.card--bracket`) kort og 3 sekundære (`.exercise-card--secondary`) kort på begge dage, matcher forventet fordeling fra sessionsstrukturen (alternating morgen = 2 primær + 2 sekundær på tværs af to kategorier, plus single-mode sessioner), 0 konsol-fejl.

## Kendte begrænsninger og faldgruber i DETTE projekt

- App-navnet er bevidst "React" (ikke JS-frameworket) — rør det ikke.
- L-sit uge 6 er løst til straddle 15s, ikke fuld 24s.
- PWA service worker-caching betyder at pushede ændringer muligvis ikke vises med det samme uden hård genindlæsning. `sw.js` bruger en navngivet cache (`CACHE_NAME = 'campapp-v3'`) — for at tvinge klienter til at hente nye filer skal denne værdi bumpes ved fremtidige ændringer af app-shell-filerne.
- **Fundet ved gennemlæsning af `sw.js`:** `APP_SHELL`-listen mangler `./js/config.js` (den indlæses af `index.html`, men caches ikke af service workeren). Hvis en bruger er offline ved allerførste besøg efter en cache-opdatering, kan dette teoretisk give en fejlende `CURRENT_PROFILE_ID`/`PROGRAM_VERSION`-reference. Ikke rettet endnu — bør tilføjes til `APP_SHELL` næste gang `sw.js` alligevel røres.
- Ingen Google Fonts eller eksterne font-links tilladt — kun selv-hostede `.woff2`-filer via `@font-face`.
- Kun `localStorage`, ingen foto-/blob-lagring endnu — kræver IndexedDB når daglige billeder skal bygges.

## Åbne opgaver

1. Log-fane
2. Fremgangsgrafer
3. Daglige billeder (kræver IndexedDB)
4. Vægt/kropsmål-log
