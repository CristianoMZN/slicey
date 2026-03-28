import { Elysia, t } from 'elysia';
import { createPlace, deletePlace, getPlaceById, getPlaces, updatePlace } from './places.controller';
import { CreatePlaceBodySchema, PlaceIdParamSchema, PlaceSchema, UpdatePlaceBodySchema } from './places.schema';

export const placesRoutes = new Elysia({ prefix: '/places' })
	.get('/', getPlaces, {
		response: {
			200: t.Array(PlaceSchema)
		},
		detail: {
			tags: ['Places'],
			summary: 'List places'
		}
	})
	.get('/:id', getPlaceById, {
		params: PlaceIdParamSchema,
		response: {
			200: PlaceSchema,
			404: t.Object({ message: t.String() })
		},
		detail: {
			tags: ['Places'],
			summary: 'Get place by id'
		}
	})
	.post('/', createPlace, {
		body: CreatePlaceBodySchema,
		response: {
			200: PlaceSchema
		},
		detail: {
			tags: ['Places'],
			summary: 'Create place'
		}
	})
	.put('/:id', updatePlace, {
		params: PlaceIdParamSchema,
		body: UpdatePlaceBodySchema,
		response: {
			200: PlaceSchema,
			404: t.Object({ message: t.String() })
		},
		detail: {
			tags: ['Places'],
			summary: 'Update place'
		}
	})
	.delete('/:id', deletePlace, {
		params: PlaceIdParamSchema,
		response: {
			204: t.Null(),
			404: t.Object({ message: t.String() })
		},
		detail: {
			tags: ['Places'],
			summary: 'Delete place'
		}
	});