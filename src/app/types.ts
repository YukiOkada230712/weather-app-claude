export interface City {
  name: string;
  latitude: number;
  longitude: number;
}

export const CITIES: City[] = [
  { name: "東京", latitude: 35.6762, longitude: 139.6503 },
  { name: "大阪", latitude: 34.6937, longitude: 135.5023 },
  { name: "札幌", latitude: 43.0618, longitude: 141.3545 },
  { name: "福岡", latitude: 33.5902, longitude: 130.4017 },
  { name: "那覇", latitude: 26.2124, longitude: 127.6809 },
];
