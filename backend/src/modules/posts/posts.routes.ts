import { Elysia, t } from 'elysia';
import { createPost, getFeed, likePost } from './posts.controller';
import {
    CreatePostBodySchema,
    FeedPostSchema,
    LikeBodySchema,
    LikeResponseSchema,
    PostIdParamSchema
} from './posts.schema';

export const postsRoutes = new Elysia({ prefix: '/posts' })
    .get('/', getFeed, {
        response: {
            200: t.Array(FeedPostSchema)
        },
        detail: {
            tags: ['Posts'],
            summary: 'Get feed with signed media URLs and redacted sensitive fields'
        }
    })
    .post('/', createPost, {
        body: CreatePostBodySchema,
        response: {
            200: t.Object({
                id: t.Number(),
                authorId: t.Number(),
                type: t.Union([t.Literal('TEXT'), t.Literal('IMAGE'), t.Literal('VIDEO'), t.Literal('AUDIO')]),
                content: t.Nullable(t.String()),
                mediaUrl: t.Nullable(t.String()),
                duration: t.Nullable(t.Number()),
                location: t.Nullable(t.String()),
                allowComments: t.Boolean(),
                createdAt: t.String({ format: 'date-time' })
            }),
            401: t.Object({ message: t.String() })
        },
        detail: {
            tags: ['Posts'],
            summary: 'Create post using authenticated user id from token'
        }
    })
    .post('/:id/like', likePost, {
        params: PostIdParamSchema,
        body: LikeBodySchema,
        response: {
            200: LikeResponseSchema,
            401: t.Object({ message: t.String() }),
            404: t.Object({ message: t.String() })
        },
        detail: {
            tags: ['Posts'],
            summary: 'Like post using authenticated user id (ignores body.userId)'
        }
    });
