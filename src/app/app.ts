import { Component, inject, effect, ChangeDetectionStrategy } from '@angular/core';
import { MapComponent } from './features/map/components/map.component';
import { VehicleStore } from './core/state/vehicle.store';

@Component({
  selector: 'app-root',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MapComponent],
  template: `
    <div class="app-layout">
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