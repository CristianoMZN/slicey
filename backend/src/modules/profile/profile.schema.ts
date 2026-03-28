import { t } from 'elysia';

const JsonValueSchema = t.Optional(t.Any());

export const ProfileInputSchema = t.Object({
    publicName: t.String({ minLength: 3 }),
    slug: t.String({ pattern: '^[a-z0-9-]+$' }),
    bio: t.Optional(t.String({ maxLength: 1200 })),
    profileImage: t.Optional(t.String()),
    coverImage: t.Optional(t.String()),
    services: t.Optional(t.String({ maxLength: 1200 })),
    isPublic: t.Boolean(),
    fullName: t.String({ minLength: 3 }),
    cpf: t.String({ pattern: '^\\d{11}$' }),
    birthDate: t.String({ format: 'date-time' }),
    pixKey: t.Optional(t.String()),
    bankAccount: JsonValueSchema,
    address: JsonValueSchema
});

export const ProfileIdParamSchema = t.Object({
    id: t.Numeric()
});

export const ProfileResponseSchema = t.Object({
    id: t.Number(),
    userId: t.Number(),
    publicName: t.String(),
    slug: t.String(),
    bio: t.Nullable(t.String()),
    profileImage: t.Nullable(t.String()),
    coverImage: t.Nullable(t.String()),
    services: t.Nullable(t.String()),
    isPublic: t.Boolean(),
    fullName: t.String(),
    cpf: t.Optional(t.String()),
    birthDate: t.String({ format: 'date-time' }),
    pixKey: t.Optional(t.Nullable(t.String())),
    bankAccount: t.Optional(t.Any()),
    address: t.Optional(t.Any()),
    updatedAt: t.String({ format: 'date-time' })
});
