import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { VehicleStore, StatusFilter } from '../../../core/state/vehicle.store';

const FILTERS: { label: string; value: StatusFilter }[] = [
  { label: 'All',       value: 'all'       },
  { label: 'Available', value: 'available' },
  { label: 'Reserved',  value: 'reserved'  },
  { label: 'Disabled',  value: 'disabled'  },
];

@Component({
  selector: 'app-vehicle-filter',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="filters">
      @for (f of filters; track f.value) {
        <button
          class="filter-btn"
          [class.active]="store.filter() === f.value"
          (click)="store.setFilter(f.value)"
        >
          {{ f.label }}
        </button>
      }
    </div>
  `,
  styles: [`
    .filters {
      display: flex;
      gap: 6px;
      padding: 10px 16px;
      border-bottom: 1px solid #313244;
      flex-wrap: wrap;
    }
    .filter-btn {
      padding: 4px 12px;
      border-radius: 12px;
      border: 1px solid #45475a;
      background: transparent;
      color: #a6adc8;
      font-size: 11px;
      cursor: pointer;
      transition: all 0.15s;
    }
    .filter-btn:hover  { border-color: #cdd6f4; color: #cdd6f4; }
    .filter-btn.active { background: #cdd6f4; color: #1e1e2e; border-color: #cdd6f4; }
  `],
})
export class VehicleFilterComponent {
  readonly store   = inject(VehicleStore);
  readonly filters = FILTERS;
}
