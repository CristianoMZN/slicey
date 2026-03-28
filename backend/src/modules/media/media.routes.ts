import { Elysia, t } from 'elysia';
import { createUploadUrl } from './media.controller';
import { UploadMediaBodySchema, UploadMediaResponseSchema } from './media.schema';

export const mediaRoutes = new Elysia({ prefix: '/media' }).post('/upload', createUploadUrl, {
    body: UploadMediaBodySchema,
    response: {
        200: UploadMediaResponseSchema,
        401: t.Object({ message: t.String() }),
        403: t.Object({ message: t.String() }),
        404: t.Object({ message: t.String() }),
        500: t.Object({ message: t.String() })
    },
    detail: {
        tags: ['Media'],
        summary: 'Generate private S3 upload URL (CREATOR only)'
    }
});
