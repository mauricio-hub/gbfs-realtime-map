# GBFS Realtime Map

An Angular 21 app that visualizes bikes and scooters from a GBFS feed on an interactive map.

## Features

- Real-time vehicle positions from the Citi Bike GBFS feed (auto-refreshes every 30 seconds)
- Interactive map powered by MapLibre GL + OpenStreetMap tiles
- Click a vehicle on the map or list to select it and fly to its location
- Filter vehicles by status: All / Available / Reserved / Disabled
- Loading and error states in the sidebar

## Getting started

```bash
npm install
ng serve
```

Open `http://localhost:4200`

## Running tests

```bash
npx vitest run
```

## Architecture

```
src/app/
  core/
    adapters/   # Translates raw GBFS JSON → domain Vehicle[]
    models/     # Vehicle interface and types
    services/   # HTTP polling service (timer + switchMap, 30s interval)
    state/      # VehicleStore — signals, computed filters, selection
    mocks/      # Dev-only mock data (used when API returns 0 vehicles)
  features/
    map/        # MapLibre map component and service (HTML markers, no worker)
    vehicles/   # Sidebar list, detail panel, filter buttons
  __tests__/    # Unit tests (Vitest)
```

## Key decisions

**MapLibre HTML Markers over GeoJSON layers** — avoids the MapLibre worker dependency, which caused rendering issues in the Angular build pipeline.

**OpenStreetMap raster tiles** — no API key required, works out of the box.

**Angular Signals** — used throughout instead of RxJS subjects for UI state. Simpler, no manual subscription management.

**OnPush change detection** — all components use `ChangeDetectionStrategy.OnPush` for better performance.

**Dev mock data** — when the Citi Bike API returns an empty feed (docked system, bikes rarely appear in `free_bike_status`), the app falls back to 10 mock vehicles near Central Park so the UI is always demonstrable.

## AI usage

AI tools were used during development as a reference and learning aid (documentation lookup, syntax guidance, and debugging support). All architectural decisions, code structure, and implementation were driven by the developer.