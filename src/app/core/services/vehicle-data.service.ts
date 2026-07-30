import { inject, Injectable, isDevMode } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, timer } from 'rxjs';
import { catchError, map, retry, switchMap } from 'rxjs/operators';
import { Vehicle } from '../models/vehicle.model';
import { adaptGbfsFeed, GbfsFeedResponse } from '../adapters/gbfs.adapter';
import { MOCK_VEHICLES } from '../mocks/vehicles.mock';

const FEED_URL = 'https://gbfs.citibikenyc.com/gbfs/en/free_bike_status.json';
const POLL_INTERVAL_MS = 30_000;

@Injectable({ providedIn: 'root' })
export class VehicleDataService {
  private readonly http = inject(HttpClient);

  readonly vehicles$: Observable<Vehicle[]> = timer(0, POLL_INTERVAL_MS).pipe(
    switchMap(() =>
      this.http.get<GbfsFeedResponse>(FEED_URL).pipe(
        map(adaptGbfsFeed),
        // Citi Bike is a docked system — free_bike_status returns 0 free-floating
        // vehicles during off-peak hours. In dev mode we fall back to mock data
        // so the UI can be developed and tested. Real data takes priority always.
        map(vehicles => isDevMode() && vehicles.length === 0 ? MOCK_VEHICLES : vehicles),
        catchError(() => of(isDevMode() ? MOCK_VEHICLES : [])),
        retry({ count: 3, delay: 5_000 })
      )
    )
  );
}
