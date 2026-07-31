import { Injectable } from '@angular/core';
import * as maplibregl from 'maplibre-gl';
import { Map as MapLibreMap, Marker } from 'maplibre-gl';
import { Subject } from 'rxjs';
import { Vehicle, VehicleStatus } from '../../../core/models/vehicle.model';
import { DEFAULT_FEED } from '../../../core/config/feeds.config';

const STATUS_COLOR: Record<VehicleStatus, string> = {
  available: '#22c55e',
  reserved:  '#f59e0b',
  disabled:  '#ef4444',
};

const MAP_STYLE: maplibregl.StyleSpecification = {
  version: 8,
  sources: {
    osm: {
      type: 'raster',
      tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
      tileSize: 256,
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    },
  },
  layers: [{ id: 'osm-tiles', type: 'raster', source: 'osm' }],
};

@Injectable({ providedIn: 'root' })
export class MapService {
  private map: MapLibreMap | null = null;
  private mapReady = false;
  private pendingVehicles: Vehicle[] | null = null;

  // Reuse markers — never recreate on each tick
  private readonly markers = new Map<string, Marker>();

  private readonly _vehicleClick$ = new Subject<string>();
  readonly vehicleClick$ = this._vehicleClick$.asObservable();

  initMap(container: HTMLElement): void {
    maplibregl.setWorkerUrl('assets/maplibre-gl-worker.mjs');
    this.map = new MapLibreMap({
      container,
      style: MAP_STYLE,
      center: DEFAULT_FEED.center,
      zoom: DEFAULT_FEED.zoom,
    });

    this.map.on('load', () => {
      this.mapReady = true;
      if (this.pendingVehicles) {
        this.updateVehicles(this.pendingVehicles);
        this.pendingVehicles = null;
      }
    });
  }

  updateVehicles(vehicles: Vehicle[]): void {
    if (!this.map || !this.mapReady) {
      this.pendingVehicles = vehicles;
      return;
    }

    const incomingIds = new Set(vehicles.map(v => v.id));

    // Remove markers no longer in the feed
    for (const [id, marker] of this.markers) {
      if (!incomingIds.has(id)) {
        marker.remove();
        this.markers.delete(id);
      }
    }

    // Add new markers or update existing ones (no recreation)
    for (const vehicle of vehicles) {
      const existing = this.markers.get(vehicle.id);
      if (existing) {
        existing.setLngLat([vehicle.lon, vehicle.lat]);
      } else {
        const el = this.createMarkerEl(vehicle);
        const marker = new Marker({ element: el })
          .setLngLat([vehicle.lon, vehicle.lat])
          .addTo(this.map!);
        this.markers.set(vehicle.id, marker);
      }
    }
  }

  selectVehicle(id: string | null, flyTo = false): void {
    for (const [markerId, marker] of this.markers) {
      const el = marker.getElement();
      const isSelected = markerId === id;
      el.style.width  = isSelected ? '18px' : '14px';
      el.style.height = isSelected ? '18px' : '14px';
      el.style.backgroundColor = isSelected
        ? '#3b82f6'
        : STATUS_COLOR[el.dataset['status'] as VehicleStatus] ?? '#6b7280';
      el.style.zIndex = isSelected ? '1' : '0';
    }

    if (flyTo && id) {
      const marker = this.markers.get(id);
      if (marker) {
        this.map!.flyTo({ center: marker.getLngLat(), zoom: 15 });
      }
    }
  }

  flyTo(center: [number, number], zoom: number): void {
    this.map?.flyTo({ center, zoom });
  }

  destroy(): void {
    this.markers.forEach(m => m.remove());
    this.markers.clear();
    this.map?.remove();
    this.map = null;
    this.mapReady = false;
  }

  private createMarkerEl(vehicle: Vehicle): HTMLElement {
    const el = document.createElement('div');
    el.dataset['id'] = vehicle.id;
    el.dataset['status'] = vehicle.status;
    el.style.cssText = `
      width: 14px;
      height: 14px;
      border-radius: 50%;
      background-color: ${STATUS_COLOR[vehicle.status]};
      border: 2px solid #ffffff;
      cursor: pointer;
      box-shadow: 0 1px 4px rgba(0,0,0,0.4);
      transition: width 0.15s, height 0.15s;
    `;
    el.addEventListener('click', () => this._vehicleClick$.next(vehicle.id));
    return el;
  }
}
