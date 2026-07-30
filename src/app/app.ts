import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { MapComponent } from './features/map/components/map.component';
import { VehicleListComponent } from './features/vehicles/components/vehicle-list.component';
import { VehicleStore } from './core/state/vehicle.store';

@Component({
  selector: 'app-root',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MapComponent, VehicleListComponent],
  template: `
    <div class="app-layout">
      <app-vehicle-list />
      <app-map />
    </div>
  `,
  styles: [`
    .app-layout {
      width: 100vw;
      height: 100vh;
      display: flex;
    }
  `],
})
export class App {
  readonly store = inject(VehicleStore);
}