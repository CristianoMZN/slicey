import { t } from 'elysia';

const PushSubscriptionKeysSchema = t.Object({
    p256dh: t.String({ minLength: 1 }),
    auth: t.String({ minLength: 1 })
});

export const PushSubscriptionBodySchema = t.Object({
    endpoint: t.String({ minLength: 1 }),
    expirationTime: t.Optional(t.Nullable(t.Number())),
    keys: PushSubscriptionKeysSchema,
    device: t.Optional(t.String({ minLength: 1 })),
    anonymousSessionId: t.Optional(t.String({ minLength: 8 }))
});

export const BindAnonymousPushBodySchema = t.Object({
    anonymousSessionId: t.String({ minLength: 8 })
});

export const DeletePushSubscriptionBodySchema = t.Object({
    endpoint: t.String({ minLength: 1 }),
    anonymousSessionId: t.Optional(t.String({ minLength: 8 }))
});

export const PushNotificationPayloadSchema = t.Object({
    title: t.String({ minLength: 1 }),
    body: t.String({ minLength: 1 }),
    url: t.Optional(t.String())
});

export const PushTestBodySchema = t.Object({
    anonymousSessionId: t.Optional(t.String({ minLength: 8 })),
    payload: t.Optional(PushNotificationPayloadSchema)
});

export const PushSubscriptionResponseSchema = t.Object({
    ok: t.Boolean(),
    context: t.Union([t.Literal('authenticated'), t.Literal('anonymous')]),
    endpoint: t.String(),
    userId: t.Nullable(t.Number()),
    anonymousSessionId: t.Nullable(t.String())
});

export const PushPublicKeyResponseSchema = t.Object({
    publicKey: t.String()
});

export const BindAnonymousPushResponseSchema = t.Object({
    ok: t.Boolean(),
    linkedCount: t.Number()
});

export const DeletePushSubscriptionResponseSchema = t.Object({
    ok: t.Boolean(),
    deletedCount: t.Number()
});

export const PushTestResponseSchema = t.Object({
    ok: t.Boolean(),
    total: t.Number(),
    sent: t.Number(),
    failed: t.Number(),
    deactivated: t.Number()
});
