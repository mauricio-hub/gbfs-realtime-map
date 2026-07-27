import { computed, inject, Injectable, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Vehicle } from '../models/vehicle.model';
import { VehicleDataService } from '../services/vehicle-data.service';

export type LoadingState = 'idle' | 'loading' | 'error';

@Injectable({ providedIn: 'root' })
export class VehicleStore {
  private readonly dataService = inject(VehicleDataService);

  /* state */
  private readonly _vehicles = signal<Vehicle[]>([]);
  private readonly _selectedId = signal<string | null>(null);
  private readonly _status = signal<LoadingState>('loading');

 
  readonly vehicles = this._vehicles.asReadonly();
  readonly selectedId = this._selectedId.asReadonly();
  readonly status = this._status.asReadonly();

  readonly selectedVehicle = computed(() =>
    this._vehicles().find((v) => v.id === this._selectedId()) ?? null
  );

  constructor() {
    this.dataService.vehicles$
      .pipe(takeUntilDestroyed())
      .subscribe({
        next: (vehicles) => {
          this._vehicles.set(vehicles);
          this._status.set('idle');
        },
        error: () => this._status.set('error'),
      });
  }

  select(id: string | null): void {
    this._selectedId.set(id);
  }
}