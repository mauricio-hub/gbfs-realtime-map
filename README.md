# GBFS Realtime Map

An Angular 21 app that visualizes bikes and scooters from a GBFS feed on an interactive map.

## Features

- Real-time vehicle positions from multiple GBFS feeds (auto-refreshes every 30 seconds)
- Interactive map powered by MapLibre GL + OpenStreetMap tiles
- City/operator search — switch between Spin, Lime, Citi Bike and more
- Click a vehicle on the map or list to select it and fly to its location
- Filter vehicles by status: All / Available / Reserved / Disabled
- Floating info banner on vehicle selection
- Loading and error states in the sidebar

## Environment requirements

- Node.js 20+
- Angular CLI 21: `npm install -g @angular/cli`

## Getting started

```bash
npm install
ng serve
```

Open `http://localhost:4200`

## Build

```bash
ng build
```

## Running tests

```bash
npx vitest run
```

## Deploy

Deployed on Vercel. Connect the repo and set output directory to `dist/gbfs-realtime-map/browser`.

## Architecture

```
src/app/
  core/
    adapters/   # Translates raw GBFS JSON → domain Vehicle[]
    config/     # GBFS feed list with coordinates per city/operator
    models/     # Vehicle interface and types
    services/   # HTTP polling service (timer + switchMap, 30s interval)
    state/      # VehicleStore — signals, computed filters, selection
    mocks/      # Dev-only mock data (used when API returns 0 vehicles)
  features/
    map/        # MapLibre map component and service (HTML markers, no worker)
    vehicles/   # Sidebar list, filter buttons, feed search, banner
  __tests__/    # Unit tests (Vitest)
```

## Key decisions and trade-offs

**MapLibre HTML Markers over GeoJSON layers** — the MapLibre worker failed to load in the Angular build pipeline. HTML markers are DOM-based and require no worker. Trade-off: no built-in clustering, but marker reuse (diff via `Map<string, Marker>`) keeps performance acceptable for the current dataset size.

**OpenStreetMap raster tiles** — no API key required, works out of the box. Trade-off: heavier than vector tiles, no style customization.

**Angular Signals over RxJS for UI state** — simpler mental model, no manual subscription management, automatic OnPush invalidation. RxJS is still used where it belongs (HTTP, polling).

**OnPush change detection** — all components use `ChangeDetectionStrategy.OnPush` for better performance.

**Adapter pattern** — `gbfs.adapter.ts` isolates the raw GBFS schema from the rest of the app. Switching providers only requires updating the adapter and the feed config, not touching the UI.

**Multi-feed architecture** — `feeds.config.ts` holds all city/operator URLs with center coordinates. The data service accepts a dynamic URL via `BehaviorSubject`, so switching cities restarts the polling stream without recreating the service.

## Known limitations and improvements

- **Clustering** — not implemented. With 3000+ vehicles, clustering would improve readability at low zoom levels.
- **CORS** — some GBFS feeds block browser requests. Feeds that return empty data may be CORS-restricted rather than truly empty.
- **Docked systems** — Citi Bike rarely has free-floating vehicles; dev mock data is used as fallback.
- **No virtual scrolling** — the sidebar list renders all vehicles. At 3000+ items this works but could be optimized with CDK virtual scroll.
- **Responsive layout** — the layout is desktop-first; mobile layout not implemented.
- **E2E tests** — only unit tests are included. Cypress/Playwright coverage would strengthen the test suite.

## Time invested

Approximately 10–12 hours, exceeding the suggested 4–6 hours. Additional time was spent on MapLibre worker debugging, multi-feed architecture, and UX polish beyond the base requirements.

## AI usage

AI tools were used during development as a learning and productivity aid — specifically for Angular syntax guidance (first Angular project, prior experience in React/Next.js), debugging compiler errors, and exploring the GBFS ecosystem to identify public feed URLs. Core decisions around architecture, component design, state management with signals, and the multi-feed feature concept were driven by the developer. All code was read, understood, and validated before being integrated. See `AGENTS.md` for full detail.

## Attribution

- Map rendering: [MapLibre GL JS](https://maplibre.org/) (BSD 3-Clause)
- Map tiles: © [OpenStreetMap](https://www.openstreetmap.org/copyright) contributors
- Vehicle data: [Citi Bike GBFS](https://gbfs.citibikenyc.com/gbfs/en/free_bike_status.json), [Spin](https://www.spin.app/), [Lime](https://www.li.me/), [Razor](https://www.razor.com/) — all public GBFS feeds
