export type ClientGeolocation = {
  latitude: number;
  longitude: number;
  accuracy?: number;
  timestamp: number;
};

const GEO_STORAGE_KEY = 'jobbie.client.geolocation';
const GEO_CACHE_TTL_MS = 5 * 60 * 1000;

let inflightGeoRequest: Promise<ClientGeolocation | null> | null = null;

function canUseGeolocation() {
  return typeof window !== 'undefined' && 'geolocation' in navigator;
}

function isValidCoordinate(latitude: number, longitude: number) {
  return Number.isFinite(latitude) && Number.isFinite(longitude) && latitude >= -90 && latitude <= 90 && longitude >= -180 && longitude <= 180;
}

function saveGeolocation(geo: ClientGeolocation) {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(GEO_STORAGE_KEY, JSON.stringify(geo));
}

function parseStoredGeolocation(raw: string | null): ClientGeolocation | null {
  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw) as Partial<ClientGeolocation>;

    if (!parsed || typeof parsed !== 'object') {
      return null;
    }

    if (!isValidCoordinate(Number(parsed.latitude), Number(parsed.longitude))) {
      return null;
    }

    const timestamp = Number(parsed.timestamp);
    if (!Number.isFinite(timestamp)) {
      return null;
    }

    const accuracy = Number(parsed.accuracy);

    const geo: ClientGeolocation = {
      latitude: Number(parsed.latitude),
      longitude: Number(parsed.longitude),
      timestamp,
    };

    if (Number.isFinite(accuracy)) {
      geo.accuracy = accuracy;
    }

    return geo;
  } catch {
    return null;
  }
}

export function getCachedGeolocation(maxAgeMs = GEO_CACHE_TTL_MS): ClientGeolocation | null {
  if (typeof window === 'undefined') {
    return null;
  }

  const cached = parseStoredGeolocation(window.localStorage.getItem(GEO_STORAGE_KEY));
  if (!cached) {
    return null;
  }

  if (Date.now() - cached.timestamp > maxAgeMs) {
    return null;
  }

  return cached;
}

async function requestCurrentGeolocation(): Promise<ClientGeolocation | null> {
  if (!canUseGeolocation()) {
    return null;
  }

  return new Promise((resolve) => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        if (!isValidCoordinate(latitude, longitude)) {
          resolve(null);
          return;
        }

        const geo: ClientGeolocation = {
          latitude,
          longitude,
          timestamp: Date.now(),
        };

        if (Number.isFinite(position.coords.accuracy)) {
          geo.accuracy = position.coords.accuracy;
        }

        saveGeolocation(geo);
        resolve(geo);
      },
      () => resolve(null),
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 2 * 60 * 1000,
      },
    );
  });
}

export async function ensureGeolocationForApi(options?: { forceRefresh?: boolean }): Promise<ClientGeolocation | null> {
  if (!canUseGeolocation()) {
    return null;
  }

  if (!options?.forceRefresh) {
    const cached = getCachedGeolocation();
    if (cached) {
      return cached;
    }
  }

  if (!inflightGeoRequest) {
    inflightGeoRequest = requestCurrentGeolocation().finally(() => {
      inflightGeoRequest = null;
    });
  }

  return inflightGeoRequest;
}
