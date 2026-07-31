import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { DecimalPipe, SlicePipe } from '@angular/common';
import { VehicleStore } from '../../../core/state/vehicle.store';

@Component({
  selector: 'app-vehicle-banner',
  standalone: true,
  imports: [DecimalPipe, SlicePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (store.selectedVehicle(); as vehicle) {
      <div class="banner">
        <span class="dot" [attr.data-status]="vehicle.status"></span>
        <span class="field">
          <span class="label">ID</span>
          <span class="value">{{ vehicle.id | slice:0:16 }}…</span>
        </span>
        <span class="sep">·</span>
        <span class="field">
          <span class="label">Status</span>
          <span class="value status" [attr.data-status]="vehicle.status">{{ vehicle.status }}</span>
        </span>
        <span class="sep">·</span>
        <span class="field">
          <span class="label">Lat</span>
          <span class="value">{{ vehicle.lat | number:'1.4-4' }}</span>
        </span>
        <span class="sep">·</span>
        <span class="field">
          <span class="label">Lon</span>
          <span class="value">{{ vehicle.lon | number:'1.4-4' }}</span>
        </span>
        @if (vehicle.vehicleTypeId) {
          <span class="sep">·</span>
          <span class="field">
            <span class="label">Type</span>
            <span class="value">{{ vehicle.vehicleTypeId | slice:0:8 }}…</span>
          </span>
        }
        <button class="close" (click)="store.select(null)">✕</button>
      </div>
    }
  `,
  styles: [`
    .banner {
      position: absolute;
      top: 16px;
      left: 50%;
      transform: translateX(-50%);
      z-index: 10;
      display: flex;
      align-items: center;
      gap: 12px;
      background: rgba(30, 30, 46, 0.92);
      backdrop-filter: blur(8px);
      border: 1px solid #45475a;
      border-radius: 10px;
      padding: 10px 16px;
      color: #cdd6f4;
      font-size: 12px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.4);
      animation: slide-down 0.2s ease;
      white-space: nowrap;
    }
    @keyframes slide-down {
      from { opacity: 0; transform: translateX(-50%) translateY(-8px); }
      to   { opacity: 1; transform: translateX(-50%) translateY(0); }
    }
    .dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      flex-shrink: 0;
    }
    .dot[data-status="available"] { background: #22c55e; }
    .dot[data-status="reserved"]  { background: #f59e0b; }
    .dot[data-status="disabled"]  { background: #ef4444; }
    .field { display: flex; gap: 5px; align-items: center; }
    .label { color: #585b70; text-transform: uppercase; font-size: 10px; letter-spacing: 0.5px; }
    .value { font-weight: 500; }
    .status[data-status="available"] { color: #22c55e; }
    .status[data-status="reserved"]  { color: #f59e0b; }
    .status[data-status="disabled"]  { color: #ef4444; }
    .sep { color: #45475a; }
    .close {
      margin-left: 4px;
      background: none;
      border: none;
      color: #585b70;
      cursor: pointer;
      font-size: 13px;
      padding: 0;
      line-height: 1;
    }
    .close:hover { color: #cdd6f4; }
  `],
})
export class VehicleBannerComponent {
  readonly store = inject(VehicleStore);
}
