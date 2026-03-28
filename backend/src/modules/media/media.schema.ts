import { t } from 'elysia';

export const UploadMediaBodySchema = t.Object({
    mediaType: t.Union([t.Literal('TEXT'), t.Literal('IMAGE'), t.Literal('VIDEO'), t.Literal('AUDIO')]),
    extension: t.Optional(t.String({ minLength: 1, maxLength: 10 })),
    contentType: t.Optional(t.String({ minLength: 3, maxLength: 128 }))
});

export const UploadMediaResponseSchema = t.Object({
    objectKey: t.String(),
    uploadUrl: t.String(),
    expiresIn: t.Number()
});
