import { Vehicle } from '../models/vehicle.model';

// DEV ONLY — used when the GBFS feed returns 0 free-floating bikes.
// Citi Bike is a docked system; free_bike_status is empty during off-peak hours.
export const MOCK_VEHICLES: Vehicle[] = [
  // 5th Ave & 59th St area
  { id: 'mock-1', lat: 40.7648, lon: -73.9730, status: 'available' },
  { id: 'mock-2', lat: 40.7645, lon: -73.9740, status: 'reserved' },
  { id: 'mock-3', lat: 40.7652, lon: -73.9720, status: 'available' },
  { id: 'mock-4', lat: 40.7640, lon: -73.9750, status: 'disabled' },
  { id: 'mock-5', lat: 40.7655, lon: -73.9710, status: 'available' },
  { id: 'mock-6', lat: 40.7660, lon: -73.9730, status: 'available' },
  { id: 'mock-7', lat: 40.7635, lon: -73.9720, status: 'reserved' },
  { id: 'mock-8', lat: 40.7643, lon: -73.9760, status: 'available' },
  { id: 'mock-9', lat: 40.7658, lon: -73.9740, status: 'available' },
  { id: 'mock-10', lat: 40.7638, lon: -73.9710, status: 'disabled' },
];
