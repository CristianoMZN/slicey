import { placesService } from './places.service';

export const getPlaces = () => placesService.getAll();

export const getPlaceById = async ({ params, set }: { params: { id: number }; set: { status?: number } }) => {
    const place = await placesService.getById(Number(params.id));

    if (!place) {
        set.status = 404;
        return { message: 'Place not found' };
    }

    return place;
};

export const createPlace = ({ body }: { body: { name: string; description?: string; latitude: number; longitude: number } }) =>
    placesService.create(body);

export const updatePlace = async ({
    params,
    body,
    set
}: {
    params: { id: number };
    body: { name?: string; description?: string; latitude?: number; longitude?: number };
    set: { status?: number };
}) => {
    const existing = await placesService.getById(Number(params.id));

    if (!existing) {
        set.status = 404;
        return { message: 'Place not found' };
    }

    return placesService.update(Number(params.id), body);
};

export const deletePlace = async ({ params, set }: { params: { id: number }; set: { status?: number } }) => {
    const existing = await placesService.getById(Number(params.id));

    if (!existing) {
        set.status = 404;
        return { message: 'Place not found' };
    }

    await placesService.remove(Number(params.id));
    set.status = 204;
    return null;
};