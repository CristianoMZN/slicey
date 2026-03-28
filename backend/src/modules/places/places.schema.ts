import { t } from 'elysia';

export const PlaceSchema = t.Object({
  id: t.Number(),
  name: t.String(),
  description: t.Optional(t.String()),
  latitude: t.Number(),
  longitude: t.Number(),
  createdAt: t.String({ format: 'date-time' }),
  updatedAt: t.String({ format: 'date-time' })
});

export const CreatePlaceBodySchema = t.Object({
  name: t.String({ minLength: 1 }),
  description: t.Optional(t.String()),
  latitude: t.Number(),
  longitude: t.Number()
});

export const UpdatePlaceBodySchema = t.Object({
  name: t.Optional(t.String({ minLength: 1 })),
  description: t.Optional(t.String()),
  latitude: t.Optional(t.Number()),
  longitude: t.Optional(t.Number())
});

export const PlaceIdParamSchema = t.Object({
  id: t.Numeric()
});