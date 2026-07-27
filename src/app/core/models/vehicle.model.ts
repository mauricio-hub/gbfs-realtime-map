export type VehicleStatus = 'available' | 'reserved' | 'disabled';

export interface Vehicle {
  id: string;
  lat: number;
  lon: number;
  status: VehicleStatus;
  vehicleTypeId?: string;
}