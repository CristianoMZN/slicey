import { z } from 'zod';
import { prisma } from '../config/prisma';

export class GeoFilterService {
    async filterByDistance(latitude: number, longitude: number, radius: number, additionalFilters?: Record<string, any>) {
        const places = await prisma.place.findMany({
            where: {
                AND: [
                    {
                        location: {
                            // Assuming 'location' is a field of type Point in your Prisma schema
                            near: {
                                latitude,
                                longitude,
                                maxDistance: radius,
                            },
                        },
                    },
                    ...this.buildAdditionalFilters(additionalFilters),
                ],
            },
        });
        return places;
    }

    private buildAdditionalFilters(filters?: Record<string, any>) {
        if (!filters) return [];
        return Object.entries(filters).map(([key, value]) => ({
            [key]: value,
        }));
    }
}