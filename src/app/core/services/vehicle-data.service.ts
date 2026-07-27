import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, timer } from 'rxjs';
import { map, retry, switchMap } from 'rxjs/operators';
import { Vehicle } from '../models/vehicle.model';
import { adaptGbfsFeed, GbfsFeedResponse } from '../adapters/gbfs.adapter';

const FEED_URL = 'https://gbfs.citibikenyc.com/gbfs/en/free_bike_status.json';
const POLL_INTERVAL_MS = 30_000;

@Injectable({ providedIn: 'root' })
export class VehicleDataService {
  private readonly http = inject(HttpClient);

  readonly vehicles$: Observable<Vehicle[]> = timer(0, POLL_INTERVAL_MS).pipe(
    switchMap(() =>
      this.http.get<GbfsFeedResponse>(FEED_URL).pipe(
        map(adaptGbfsFeed),
        retry({ count: 3, delay: 5_000 })
      )
    )
  );
}