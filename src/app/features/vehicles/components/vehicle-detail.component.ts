import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { VehicleStore } from '../../../core/state/vehicle.store';

@Component({
  selector: 'app-vehicle-detail',
  standalone: true,
  imports: [DecimalPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (store.selectedVehicle(); as vehicle) {
      <div class="detail-panel">
        <div class="detail-header">
          <span class="dot" [attr.data-status]="vehicle.status"></span>
          <h3>{{ vehicle.id }}</h3>
          <button class="close" (click)="store.select(null)">✕</button>
        </div>

        <div class="detail-body">
          <div class="field">
            <span class="label">Status</span>
            <span class="value status" [attr.data-status]="vehicle.status">
              {{ vehicle.status }}
            </span>
          </div>
          <div class="field">
            <span class="label">Latitude</span>
            <span class="value">{{ vehicle.lat | number:'1.5-5' }}</span>
          </div>
          <div class="field">
            <span class="label">Longitude</span>
            <span class="value">{{ vehicle.lon | number:'1.5-5' }}</span>
          </div>
          @if (vehicle.vehicleTypeId) {
            <div class="field">
              <span class="label">Type</span>
              <span class="value">{{ vehicle.vehicleTypeId }}</span>
            </div>
          }
        </div>
      </div>
    }
  `,
  styles: [`
    .detail-panel {
      border-top: 1px solid #313244;
      background: #181825;
    }
    .detail-header {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 12px 16px;
      border-bottom: 1px solid #313244;
    }
    h3 { font-size: 13px; font-weight: 600; margin: 0; flex: 1; }
    .close {
      background: none;
      border: none;
      color: #a6adc8;
      cursor: pointer;
      font-size: 14px;
      padding: 0;
    }
    .close:hover { color: #cdd6f4; }
    .dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      flex-shrink: 0;
    }
    .dot[data-status="available"] { background: #22c55e; }
    .dot[data-status="reserved"]  { background: #f59e0b; }
    .dot[data-status="disabled"]  { background: #ef4444; }
    .detail-body { padding: 12px 16px; display: flex; flex-direction: column; gap: 10px; }
    .field { display: flex; justify-content: space-between; align-items: center; }
    .label { font-size: 11px; color: #a6adc8; text-transform: uppercase; letter-spacing: 0.5px; }
    .value { font-size: 12px; font-weight: 500; }
    .status { text-transform: capitalize; }
    .status[data-status="available"] { color: #22c55e; }
    .status[data-status="reserved"]  { color: #f59e0b; }
    .status[data-status="disabled"]  { color: #ef4444; }
  `],
})
export class VehicleDetailComponent {
  readonly store = inject(VehicleStore);
}