export interface FeedConfig {
  id: string;
  name: string;
  operator: string;
  vehicleType: 'scooter' | 'bike' | 'mixed';
  url: string;
  center: [number, number]; // [lng, lat]
  zoom: number;
}

export const FEEDS: FeedConfig[] = [
  {
    id: 'citibike-nyc',
    name: 'New York City',
    operator: 'Citi Bike',
    vehicleType: 'bike',
    url: 'https://gbfs.citibikenyc.com/gbfs/en/free_bike_status.json',
    center: [-73.98, 40.75],
    zoom: 12,
  },
  {
    id: 'spin-sf',
    name: 'San Francisco',
    operator: 'Spin',
    vehicleType: 'scooter',
    url: 'https://gbfs.spin.pm/api/gbfs/v1/san_francisco/free_bike_status',
    center: [-122.45, 37.77],
    zoom: 13,
  },
  {
    id: 'spin-dc',
    name: 'Washington DC',
    operator: 'Spin',
    vehicleType: 'scooter',
    url: 'https://gbfs.spin.pm/api/gbfs/v1/washington_dc/free_bike_status',
    center: [-77.03, 38.9],
    zoom: 12,
  },
  {
    id: 'spin-seattle',
    name: 'Seattle',
    operator: 'Spin',
    vehicleType: 'scooter',
    url: 'https://gbfs.spin.pm/api/gbfs/v1/seattle/free_bike_status',
    center: [-122.33, 47.6],
    zoom: 12,
  },
  {
    id: 'spin-atlanta',
    name: 'Atlanta',
    operator: 'Spin',
    vehicleType: 'scooter',
    url: 'https://gbfs.spin.pm/api/gbfs/v1/atlanta/free_bike_status',
    center: [-84.38, 33.75],
    zoom: 12,
  },
  {
    id: 'spin-nashville',
    name: 'Nashville',
    operator: 'Spin',
    vehicleType: 'scooter',
    url: 'https://gbfs.spin.pm/api/gbfs/v1/nashville/free_bike_status',
    center: [-86.78, 36.16],
    zoom: 12,
  },
  {
    id: 'spin-san-diego',
    name: 'San Diego',
    operator: 'Spin',
    vehicleType: 'scooter',
    url: 'https://gbfs.spin.pm/api/gbfs/v1/san_diego/free_bike_status',
    center: [-117.16, 32.72],
    zoom: 12,
  },
  {
    id: 'lime-nyc',
    name: 'New York City',
    operator: 'Lime',
    vehicleType: 'scooter',
    url: 'https://data.lime.bike/api/partners/v1/gbfs/new_york/free_bike_status.json',
    center: [-73.98, 40.75],
    zoom: 12,
  },
  {
    id: 'razor-tempe',
    name: 'Tempe',
    operator: 'Razor',
    vehicleType: 'scooter',
    url: 'https://razorapi.net/api/v1/gbfs/Tempe/free_bike_status.json',
    center: [-111.94, 33.42],
    zoom: 13,
  },
];

export const DEFAULT_FEED = FEEDS[1]; // Spin San Francisco — has real free-floating vehicles
