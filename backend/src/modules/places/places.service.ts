import { prisma } from '../../config/prisma';

export type CreatePlaceInput = {
    name: string;
    description?: string;
    latitude: number;
    longitude: number;
};

export type UpdatePlaceInput = Partial<CreatePlaceInput>;

export const placesService = {
    getAll() {
        return prisma.place.findMany({ orderBy: { id: 'desc' } });
    },

    getById(id: number) {
        return prisma.place.findUnique({ where: { id } });
    },

    create(data: CreatePlaceInput) {
        return prisma.place.create({ data });
    },

    update(id: number, data: UpdatePlaceInput) {
        return prisma.place.update({ where: { id }, data });
    },

    remove(id: number) {
        return prisma.place.delete({ where: { id } });
    }
};