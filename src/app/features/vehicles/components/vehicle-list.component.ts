import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { VehicleStore } from '../../../core/state/vehicle.store';
import { MapService } from '../../map/services/map.service';
import { VehicleDetailComponent } from './vehicle-detail.component';

@Component({
  selector: 'app-vehicle-list',
  standalone: true,
  imports: [VehicleDetailComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="panel">
      <div class="panel-header">
        <h2>Vehicles</h2>
        <span class="count">{{ store.vehicles().length }}</span>
      </div>

      <div class="list">
        @for (vehicle of store.vehicles(); track vehicle.id) {
          <div
            class="list-item"
            [class.selected]="store.selectedId() === vehicle.id"
            (click)="select(vehicle.id)"
          >
            <span class="dot" [attr.data-status]="vehicle.status"></span>
            <div class="info">
              <span class="id">{{ vehicle.id }}</span>
              <span class="status">{{ vehicle.status }}</span>
            </div>
          </div>
        }

        @if (store.vehicles().length === 0) {
          <p class="empty">No vehicles available</p>
        }
      </div>
      <app-vehicle-detail />
    </div>
  `,
  styles: [`
    .panel {
      width: 280px;
      height: 100%;
      background: #1e1e2e;
      color: #cdd6f4;
      display: flex;
      flex-direction: column;
      flex-shrink: 0;
    }
    .panel-header {
      padding: 16px;
      border-bottom: 1px solid #313244;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    h2 { font-size: 16px; font-weight: 600; margin: 0; }
    .count {
      background: #313244;
      border-radius: 12px;
      padding: 2px 10px;
      font-size: 13px;
    }
    .list { overflow-y: auto; flex: 1; }
    .list-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 16px;
      cursor: pointer;
      border-bottom: 1px solid #313244;
      transition: background 0.15s;
    }
    .list-item:hover { background: #313244; }
    .list-item.selected { background: #45475a; }
    .dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      flex-shrink: 0;
    }
    .dot[data-status="available"] { background: #22c55e; }
    .dot[data-status="reserved"]  { background: #f59e0b; }
    .dot[data-status="disabled"]  { background: #ef4444; }
    .info { display: flex; flex-direction: column; gap: 2px; }
    .id { font-size: 13px; font-weight: 500; }
    .status { font-size: 11px; color: #a6adc8; text-transform: capitalize; }
    .empty { padding: 24px 16px; color: #a6adc8; font-size: 13px; }
  `],
})
export class VehicleListComponent {
  readonly store = inject(VehicleStore);
  private readonly mapService = inject(MapService);

  select(id: string): void {
    this.store.select(id);
    this.mapService.selectVehicle(id, true);
  }
}