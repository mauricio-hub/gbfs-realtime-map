import { Injectable } from '@angular/core';
import * as maplibregl from 'maplibre-gl';
import { GeoJSONSource, LngLatLike, Map as MapLibreMap } from 'maplibre-gl';
import { Subject } from 'rxjs';
import { Vehicle } from '../../../core/models/vehicle.model';

const SOURCE_ID = 'vehicles';
const LAYER_VEHICLES = 'layer-vehicles';
const LAYER_SELECTED = 'layer-vehicles-selected';

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

    private readonly _vehicleClick$ = new Subject<string>();
    readonly vehicleClick$ = this._vehicleClick$.asObservable();

    initMap(container: HTMLElement): void {
        maplibregl.setWorkerUrl('assets/maplibre-gl-worker.mjs');
        this.map = new MapLibreMap({
            container,
            style: MAP_STYLE,
            center: [-73.98, 40.75],
            zoom: 12,
        });

        this.map.on('load', () => {
            this.addSource();
            this.addLayers();
            this.bindEvents();
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

        const source = this.map.getSource(SOURCE_ID) as GeoJSONSource | undefined;
        if (!source) return;

        source.setData({
            type: 'FeatureCollection',
            features: vehicles.map((v) => ({
                type: 'Feature',
                id: v.id,
                geometry: { type: 'Point', coordinates: [v.lon, v.lat] },
                properties: { id: v.id, status: v.status },
            })),
        });
    }

    selectVehicle(id: string | null, flyTo = false): void {
        if (!this.map || !this.mapReady) return;

        this.map.setFilter(LAYER_SELECTED, ['==', ['get', 'id'], id ?? '']);

        if (flyTo && id) {
            const features = this.map.querySourceFeatures(SOURCE_ID, {
                filter: ['==', ['get', 'id'], id],
            });
            const geom = features[0]?.geometry;
            if (geom?.type === 'Point') {
                this.map.flyTo({ center: geom.coordinates as LngLatLike, zoom: 15 });
            }
        }
    }

    destroy(): void {
        this.map?.remove();
        this.map = null;
        this.mapReady = false;
    }

    private addSource(): void {
        this.map!.addSource(SOURCE_ID, {
            type: 'geojson',
            data: { type: 'FeatureCollection', features: [] },
        });
    }

    private addLayers(): void {
        this.map!.addLayer({
            id: LAYER_VEHICLES,
            type: 'circle',
            source: SOURCE_ID,
            paint: {
                'circle-radius': 7,
                'circle-color': [
                    'match', ['get', 'status'],
                    'available', '#22c55e',
                    'reserved', '#f59e0b',
                    'disabled', '#ef4444',
                    '#6b7280',
                ],
                'circle-stroke-width': 1,
                'circle-stroke-color': '#ffffff',
            },
        });

        this.map!.addLayer({
            id: LAYER_SELECTED,
            type: 'circle',
            source: SOURCE_ID,
            filter: ['==', ['get', 'id'], ''],
            paint: {
                'circle-radius': 11,
                'circle-color': '#3b82f6',
                'circle-stroke-width': 2,
                'circle-stroke-color': '#ffffff',
            },
        });
    }

    private bindEvents(): void {
        this.map!.on('click', LAYER_VEHICLES, (e) => {
            const id = e.features?.[0]?.properties?.['id'];
            if (id) this._vehicleClick$.next(id);
        });

        this.map!.on('mouseenter', LAYER_VEHICLES, () => {
            this.map!.getCanvas().style.cursor = 'pointer';
        });

        this.map!.on('mouseleave', LAYER_VEHICLES, () => {
            this.map!.getCanvas().style.cursor = '';
        });
    }
}