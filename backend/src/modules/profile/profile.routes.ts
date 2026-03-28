import { Elysia, t } from 'elysia';
import { getMyProfile, getProfileById, upsertMyProfile } from './profile.controller';
import { ProfileIdParamSchema, ProfileInputSchema, ProfileResponseSchema } from './profile.schema';

export const profileRoutes = new Elysia({ prefix: '/profile' })
    .get('/me', getMyProfile, {
        response: {
            200: ProfileResponseSchema,
            401: t.Object({ message: t.String() }),
            404: t.Object({ message: t.String() })
        },
        detail: {
            tags: ['Profile'],
            summary: 'Get authenticated user profile'
        }
    })
    .get('/:id', getProfileById, {
        params: ProfileIdParamSchema,
        response: {
            200: ProfileResponseSchema,
            401: t.Object({ message: t.String() }),
            403: t.Object({ message: t.String() }),
            404: t.Object({ message: t.String() })
        },
        detail: {
            tags: ['Profile'],
            summary: 'Get profile by user id with sensitive data protection'
        }
    })
    .post('/', upsertMyProfile, {
        body: ProfileInputSchema,
        response: {
            200: ProfileResponseSchema,
            401: t.Object({ message: t.String() })
        },
        detail: {
            tags: ['Profile'],
            summary: 'Create or update authenticated user profile'
        }
    });
