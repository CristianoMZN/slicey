export type AuthToken = {
  accessToken: string;
  refreshToken: string;
};

export interface User {
  id: string;
  username: string;
  email: string;
  passwordHash: string;
}

export interface Place {
  id: string;
  name: string;
  description: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
}

export interface GeoFilterOptions {
  latitude: number;
  longitude: number;
  radius: number;
  additionalFilters?: Record<string, any>;
}