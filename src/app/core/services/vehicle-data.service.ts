import { inject, Injectable, isDevMode } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, switchMap, timer } from 'rxjs';
import { catchError, map, retry } from 'rxjs/operators';
import { Vehicle } from '../models/vehicle.model';
import { adaptGbfsFeed, GbfsFeedResponse } from '../adapters/gbfs.adapter';
import { MOCK_VEHICLES } from '../mocks/vehicles.mock';
import { DEFAULT_FEED } from '../config/feeds.config';

const POLL_INTERVAL_MS = 30_000;

@Injectable({ providedIn: 'root' })
export class VehicleDataService {
  private readonly http = inject(HttpClient);

  private readonly feedUrl$ = new BehaviorSubject<string>(DEFAULT_FEED.url);

  // Call this to switch to a different GBFS feed
  setFeedUrl(url: string): void {
    this.feedUrl$.next(url);
  }

  readonly vehicles$: Observable<Vehicle[]> = this.feedUrl$.pipe(
    switchMap(url =>
      timer(0, POLL_INTERVAL_MS).pipe(
        switchMap(() =>
          this.http.get<GbfsFeedResponse>(url).pipe(
            map(adaptGbfsFeed),
            // Citi Bike is a docked system — free_bike_status returns 0 free-floating
            // vehicles during off-peak hours. In dev mode we fall back to mock data
            // so the UI can be developed and tested. Real data takes priority always.
            // map(vehicles => isDevMode() && vehicles.length === 0 ? MOCK_VEHICLES : vehicles),
            catchError(() => of([])),
            retry({ count: 3, delay: 5_000 })
          )
        )
      )
    )
  );
}
