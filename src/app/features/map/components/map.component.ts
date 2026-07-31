import {
  Component,
  OnDestroy,
  AfterViewInit,
  ChangeDetectionStrategy,
  inject,
  effect,
  ElementRef,
  viewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MapService } from '../services/map.service';
import { VehicleStore } from '../../../core/state/vehicle.store';
import { VehicleBannerComponent } from '../../vehicles/components/vehicle-banner.component';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [VehicleBannerComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="map-host">
      <div #mapContainer class="map-container"></div>
      <app-vehicle-banner />
    </div>
  `,
  styles: [`
    :host {
      display: block;
      flex: 1;
      height: 100%;
    }
    .map-host {
      position: relative;
      width: 100%;
      height: 100%;
    }
    .map-container {
      width: 100%;
      height: 100%;
    }
  `],
})
export class MapComponent implements AfterViewInit, OnDestroy {
  private readonly mapService = inject(MapService);
  private readonly store = inject(VehicleStore);
  private readonly mapContainer = viewChild.required<ElementRef>('mapContainer');

  constructor() {
    effect(() => {
      this.mapService.updateVehicles(this.store.vehicles());
    });

    effect(() => {
      this.mapService.selectVehicle(this.store.selectedId());
    });

    this.mapService.vehicleClick$
      .pipe(takeUntilDestroyed())
      .subscribe((id) => this.store.select(id));
  }

  ngAfterViewInit(): void {
    this.mapService.initMap(this.mapContainer().nativeElement);
  }

  ngOnDestroy(): void {
    this.mapService.destroy();
  }
}