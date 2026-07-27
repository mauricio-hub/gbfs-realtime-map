import { Vehicle, VehicleStatus } from '../models/vehicle.model';

interface GbfsVehicleItem {
  bike_id: string;
  lat: number;
  lon: number;
  is_reserved?: boolean;
  is_disabled?: boolean;
  vehicle_type_id?: string;
  [key: string]: unknown;
}

export interface GbfsFeedResponse {
  last_updated: number;
  ttl: number;
  data: {
    bikes: GbfsVehicleItem[];
  };
}

function resolveStatus(item: GbfsVehicleItem): VehicleStatus {
  if (item.is_disabled) return 'disabled';
  if (item.is_reserved) return 'reserved';
  return 'available';
}

export function adaptGbfsFeed(response: GbfsFeedResponse): Vehicle[] {
  return response.data.bikes
    .filter((item) => item.lat != null && item.lon != null)
    .map((item) => ({
      id: item.bike_id,
      lat: item.lat,
      lon: item.lon,
      status: resolveStatus(item),
      vehicleTypeId: item.vehicle_type_id,
    }));
}