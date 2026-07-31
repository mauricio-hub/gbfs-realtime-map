import { Component, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { VehicleStore } from '../../../core/state/vehicle.store';
import { MapService } from '../../map/services/map.service';
import { FEEDS, FeedConfig } from '../../../core/config/feeds.config';

@Component({
  selector: 'app-feed-search',
  standalone: true,
  imports: [FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="feed-search">
      <div class="active-feed">
        <span class="label">Active feed</span>
        <span class="value">
          {{ typeIcon(store.activeFeed().vehicleType) }}
          {{ store.activeFeed().operator }} · {{ store.activeFeed().name }}
        </span>
        <span class="count">{{ store.vehicles().length }} vehicles</span>
      </div>

      <div class="search-wrap">
        <input
          class="search-input"
          type="text"
          placeholder="Search city or operator…"
          [(ngModel)]="query"
          (input)="onInput()"
          (blur)="onBlur()"
        />

        @if (suggestions().length > 0) {
          <ul class="dropdown">
            @for (feed of suggestions(); track feed.id) {
              <li class="option" (mousedown)="select(feed)">
                <span class="city">{{ typeIcon(feed.vehicleType) }} {{ feed.name }}</span>
                <span class="operator">{{ feed.operator }}</span>
              </li>
            }
          </ul>
        }
      </div>
    </div>
  `,
  styles: [`
    .feed-search {
      padding: 10px 16px;
      border-bottom: 1px solid #313244;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .active-feed {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 11px;
    }
    .label { color: #585b70; text-transform: uppercase; letter-spacing: 0.5px; }
    .value { color: #89b4fa; font-weight: 500; flex: 1; }
    .count { color: #a6adc8; font-size: 11px; }
    .search-wrap { position: relative; }
    .search-input {
      width: 100%;
      background: #313244;
      border: 1px solid #45475a;
      border-radius: 6px;
      color: #cdd6f4;
      font-size: 12px;
      padding: 6px 10px;
      outline: none;
      box-sizing: border-box;
    }
    .search-input:focus { border-color: #89b4fa; }
    .dropdown {
      position: absolute;
      top: calc(100% + 4px);
      left: 0;
      right: 0;
      background: #313244;
      border: 1px solid #45475a;
      border-radius: 6px;
      list-style: none;
      margin: 0;
      padding: 4px 0;
      z-index: 100;
      max-height: 200px;
      overflow-y: auto;
    }
    .option {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 8px 12px;
      cursor: pointer;
      font-size: 12px;
    }
    .option:hover { background: #45475a; }
    .city { color: #cdd6f4; font-weight: 500; }
    .operator { color: #a6adc8; font-size: 11px; }
  `],
})
export class FeedSearchComponent {
  readonly store      = inject(VehicleStore);
  private readonly mapService = inject(MapService);

  query       = '';
  suggestions = signal<FeedConfig[]>([]);

  onInput(): void {
    const q = this.query.toLowerCase().trim();
    this.suggestions.set(
      q.length < 1
        ? []
        : FEEDS.filter(
            f =>
              f.name.toLowerCase().includes(q) ||
              f.operator.toLowerCase().includes(q)
          )
    );
  }

  select(feed: FeedConfig): void {
    this.store.setFeed(feed);
    this.mapService.flyTo(feed.center, feed.zoom);
    this.query = '';
    this.suggestions.set([]);
  }

  typeIcon(type: string): string {
    return type === 'bike' ? '🚲' : type === 'scooter' ? '🛴' : '🚲🛴';
  }

  onBlur(): void {
    // small delay so mousedown on option fires first
    setTimeout(() => this.suggestions.set([]), 150);
  }
}
