import { z } from 'zod';
import { t } from 'elysia';

export const models = {
  User: t.Object({
    id: t.Number(),
    email: t.String({ format: 'email' }),
    password: t.String(),
    createdAt: t.String({ format: 'date-time' }),
    updatedAt: t.String({ format: 'date-time' })
  }),

  Place: t.Object({
    id: t.Number(),
    name: t.String(),
    description: t.Optional(t.String()),
    latitude: t.Number(),
    longitude: t.Number(),
    createdAt: t.String({ format: 'date-time' }),
    updatedAt: t.String({ format: 'date-time' })
  }),

  UserRegistrationSchema: z.object({
    email: z.string().email(),
    password: z.string().min(6),
  }),

  PlaceCreationSchema: z.object({
    name: z.string().min(1),
    latitude: z.number(),
    longitude: z.number(),
    description: z.string().optional(),
  }),
};