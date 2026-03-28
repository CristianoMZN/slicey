import { t } from 'elysia';

const MediaTypeSchema = t.Union([
    t.Literal('TEXT'),
    t.Literal('IMAGE'),
    t.Literal('VIDEO'),
    t.Literal('AUDIO')
]);

export const CreatePostBodySchema = t.Object({
    type: MediaTypeSchema,
    content: t.Optional(t.String()),
    mediaUrl: t.Optional(t.String()),
    duration: t.Optional(t.Number({ minimum: 1 })),
    location: t.Optional(t.String()),
    allowComments: t.Optional(t.Boolean())
});

export const PostIdParamSchema = t.Object({
    id: t.Numeric()
});

export const LikeBodySchema = t.Object({
    type: t.Optional(t.String({ default: 'LIKE' })),
    geoLocation: t.Optional(t.String()),
    userId: t.Optional(t.Number())
});

export const FeedPostSchema = t.Object({
    id: t.Number(),
    type: MediaTypeSchema,
    content: t.Nullable(t.String()),
    mediaUrl: t.Nullable(t.String()),
    duration: t.Nullable(t.Number()),
    location: t.Nullable(t.String()),
    allowComments: t.Boolean(),
    createdAt: t.String({ format: 'date-time' }),
    author: t.Object({
        id: t.Number(),
        nickname: t.String(),
        type: t.Union([t.Literal('CUSTOMER'), t.Literal('CREATOR')]),
        profile: t.Nullable(
            t.Object({
                publicName: t.String(),
                slug: t.String(),
                profileImage: t.Nullable(t.String())
            })
        )
    }),
    _count: t.Object({
        comments: t.Number(),
        interactions: t.Number()
    })
});

export const LikeResponseSchema = t.Object({
    id: t.Number(),
    postId: t.Number(),
    userId: t.Number(),
    type: t.String(),
    geoLocation: t.Nullable(t.String()),
    canceledAt: t.Nullable(t.String()),
    createdAt: t.String({ format: 'date-time' })
});
