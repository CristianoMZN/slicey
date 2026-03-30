import { Elysia } from 'elysia';

type GeoContext = {
    latitude: number;
    longitude: number;
    accuracy?: number;
    timestamp?: number;
    radiusKm: number;
};

const parseFiniteNumber = (value: string | null | undefined) => {
    if (!value) {
        return undefined;
    }

    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : undefined;
};

const inRange = (value: number, min: number, max: number) => value >= min && value <= max;

const normalizeRadiusKm = (value: number | undefined) => {
    if (!value) {
        return 30;
    }

    if (!Number.isFinite(value)) {
        return 30;
    }

    return Math.min(500, Math.max(1, value));
};

const extractGeoFromRequest = (request: Request): GeoContext | null => {
    const url = new URL(request.url);
    const headerLatitude = parseFiniteNumber(request.headers.get('x-geo-latitude'));
    const headerLongitude = parseFiniteNumber(request.headers.get('x-geo-longitude'));

    const queryLatitude = parseFiniteNumber(url.searchParams.get('geoLat'));
    const queryLongitude = parseFiniteNumber(url.searchParams.get('geoLng'));

    const latitude = headerLatitude ?? queryLatitude;
    const longitude = headerLongitude ?? queryLongitude;

    if (latitude === undefined || longitude === undefined) {
        return null;
    }

    if (!inRange(latitude, -90, 90) || !inRange(longitude, -180, 180)) {
        return null;
    }

    const accuracy = parseFiniteNumber(request.headers.get('x-geo-accuracy'));
    const timestamp = parseFiniteNumber(request.headers.get('x-geo-timestamp'));

    const queryRadius = parseFiniteNumber(url.searchParams.get('radiusKm'));
    const headerRadius = parseFiniteNumber(request.headers.get('x-geo-radius-km'));

    return {
        latitude,
        longitude,
        accuracy,
        timestamp,
        radiusKm: normalizeRadiusKm(queryRadius ?? headerRadius)
    };
};

export const geoContextPlugin = (app: Elysia) =>
    app.derive(({ request }) => ({
        geoContext: extractGeoFromRequest(request)
    }));
