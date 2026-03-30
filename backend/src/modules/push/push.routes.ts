import { Elysia, t } from 'elysia';
import {
    bindAnonymousPushSubscriptions,
    deletePushSubscription,
    getPushPublicKey,
    registerPushSubscription,
    sendPushTest
} from './push.controller';
import {
    BindAnonymousPushBodySchema,
    BindAnonymousPushResponseSchema,
    DeletePushSubscriptionBodySchema,
    DeletePushSubscriptionResponseSchema,
    PushPublicKeyResponseSchema,
    PushSubscriptionBodySchema,
    PushSubscriptionResponseSchema,
    PushTestBodySchema,
    PushTestResponseSchema
} from './push.schema';

export const pushRoutes = new Elysia({ prefix: '/auth/push' })
    .get('/public-key', getPushPublicKey, {
        response: {
            200: PushPublicKeyResponseSchema,
            503: t.Object({ message: t.String() })
        },
        detail: {
            tags: ['Push'],
            summary: 'Get public VAPID key for Web Push subscription'
        }
    })
    .post('/subscriptions', registerPushSubscription, {
        body: PushSubscriptionBodySchema,
        response: {
            200: PushSubscriptionResponseSchema,
            400: t.Object({ message: t.String() })
        },
        detail: {
            tags: ['Push'],
            summary: 'Register or update push subscription for anonymous/authenticated context'
        }
    })
    .post('/bind-anonymous', bindAnonymousPushSubscriptions, {
        body: BindAnonymousPushBodySchema,
        response: {
            200: BindAnonymousPushResponseSchema,
            400: t.Object({ message: t.String() }),
            401: t.Object({ message: t.String() })
        },
        detail: {
            tags: ['Push'],
            summary: 'Bind anonymous push subscriptions to authenticated user'
        }
    })
    .delete('/subscriptions', deletePushSubscription, {
        body: DeletePushSubscriptionBodySchema,
        response: {
            200: DeletePushSubscriptionResponseSchema,
            400: t.Object({ message: t.String() }),
            404: t.Object({ message: t.String() })
        },
        detail: {
            tags: ['Push'],
            summary: 'Delete push subscription in current context'
        }
    })
    .post('/test', sendPushTest, {
        body: PushTestBodySchema,
        response: {
            200: PushTestResponseSchema,
            400: t.Object({ message: t.String() }),
            404: t.Object({ message: t.String() }),
            503: t.Object({ message: t.String() })
        },
        detail: {
            tags: ['Push'],
            summary: 'Send test push for anonymous or authenticated context'
        }
    });
