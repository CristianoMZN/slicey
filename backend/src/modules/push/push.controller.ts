import { prisma } from '../../config/prisma';
import { isPushConfigured, pushPublicKey, sendPushNotification, type PushPayload } from './push.service';

type AuthUser = {
    id: number;
};

type PushSubscriptionBody = {
    endpoint: string;
    expirationTime?: number | null;
    keys: {
        p256dh: string;
        auth: string;
    };
    device?: string;
    anonymousSessionId?: string;
};

type BindAnonymousBody = {
    anonymousSessionId: string;
};

type DeletePushSubscriptionBody = {
    endpoint: string;
    anonymousSessionId?: string;
};

type PushTestBody = {
    anonymousSessionId?: string;
    payload?: PushPayload;
};

const cleanAnonymousSessionId = (value?: string) => {
    const sessionId = value?.trim();
    return sessionId ? sessionId : null;
};

const normalizeExpirationTime = (value?: number | null) => {
    if (value === undefined || value === null) {
        return null;
    }

    if (!Number.isFinite(value)) {
        return null;
    }

    return BigInt(Math.trunc(value));
};

export const getPushPublicKey = ({ set }: { set: { status?: number } }) => {
    if (!isPushConfigured || !pushPublicKey) {
        set.status = 503;
        return { message: 'Push VAPID is not configured' };
    }

    return { publicKey: pushPublicKey };
};

export const registerPushSubscription = async ({
    body,
    authUser,
    set
}: {
    body: PushSubscriptionBody;
    authUser: AuthUser | null;
    set: { status?: number };
}) => {
    const anonymousSessionId = cleanAnonymousSessionId(body.anonymousSessionId);

    if (!authUser && !anonymousSessionId) {
        set.status = 400;
        return { message: 'anonymousSessionId is required when user is not authenticated' };
    }

    if (authUser && anonymousSessionId) {
        await prisma.pushSubscription.updateMany({
            where: {
                anonymousSessionId,
                userId: null
            },
            data: {
                userId: authUser.id,
                anonymousSessionId: null,
                isActive: true,
                lastUsedAt: new Date()
            }
        });
    }

    const subscription = await prisma.pushSubscription.upsert({
        where: {
            endpoint: body.endpoint
        },
        update: {
            p256dh: body.keys.p256dh,
            auth: body.keys.auth,
            expirationTime: normalizeExpirationTime(body.expirationTime),
            device: body.device,
            isActive: true,
            userId: authUser?.id ?? null,
            anonymousSessionId: authUser ? null : anonymousSessionId,
            lastUsedAt: new Date()
        },
        create: {
            endpoint: body.endpoint,
            p256dh: body.keys.p256dh,
            auth: body.keys.auth,
            expirationTime: normalizeExpirationTime(body.expirationTime),
            device: body.device,
            userId: authUser?.id ?? null,
            anonymousSessionId: authUser ? null : anonymousSessionId,
            isActive: true,
            lastUsedAt: new Date()
        }
    });

    return {
        ok: true,
        context: authUser ? 'authenticated' : 'anonymous',
        endpoint: subscription.endpoint,
        userId: subscription.userId,
        anonymousSessionId: subscription.anonymousSessionId
    };
};

export const bindAnonymousPushSubscriptions = async ({
    body,
    authUser,
    set
}: {
    body: BindAnonymousBody;
    authUser: AuthUser | null;
    set: { status?: number };
}) => {
    if (!authUser) {
        set.status = 401;
        return { message: 'Invalid or missing token' };
    }

    const anonymousSessionId = cleanAnonymousSessionId(body.anonymousSessionId);

    if (!anonymousSessionId) {
        set.status = 400;
        return { message: 'anonymousSessionId is required' };
    }

    const result = await prisma.pushSubscription.updateMany({
        where: {
            anonymousSessionId,
            userId: null
        },
        data: {
            userId: authUser.id,
            anonymousSessionId: null,
            isActive: true,
            lastUsedAt: new Date()
        }
    });

    return {
        ok: true,
        linkedCount: result.count
    };
};

export const deletePushSubscription = async ({
    body,
    authUser,
    set
}: {
    body: DeletePushSubscriptionBody;
    authUser: AuthUser | null;
    set: { status?: number };
}) => {
    const anonymousSessionId = cleanAnonymousSessionId(body.anonymousSessionId);

    if (!authUser && !anonymousSessionId) {
        set.status = 400;
        return { message: 'anonymousSessionId is required when user is not authenticated' };
    }

    const result = await prisma.pushSubscription.deleteMany({
        where: authUser
            ? {
                  endpoint: body.endpoint,
                  userId: authUser.id
              }
            : {
                  endpoint: body.endpoint,
                  userId: null,
                  anonymousSessionId
              }
    });

    if (result.count === 0) {
        set.status = 404;
        return { message: 'Subscription not found for current context' };
    }

    return {
        ok: true,
        deletedCount: result.count
    };
};

export const sendPushTest = async ({
    body,
    authUser,
    set
}: {
    body: PushTestBody;
    authUser: AuthUser | null;
    set: { status?: number };
}) => {
    if (!isPushConfigured) {
        set.status = 503;
        return { message: 'Push VAPID is not configured' };
    }

    const anonymousSessionId = cleanAnonymousSessionId(body.anonymousSessionId);

    if (!authUser && !anonymousSessionId) {
        set.status = 400;
        return { message: 'Provide anonymousSessionId or authenticate with Bearer token' };
    }

    const subscriptions = await prisma.pushSubscription.findMany({
        where: authUser
            ? {
                  userId: authUser.id,
                  isActive: true
              }
            : {
                  userId: null,
                  anonymousSessionId,
                  isActive: true
              }
    });

    if (subscriptions.length === 0) {
        set.status = 404;
        return { message: 'No active subscriptions found for current context' };
    }

    const payload: PushPayload = body.payload ?? {
        title: 'Jobbie',
        body: authUser
            ? 'Push de teste para contexto autenticado.'
            : 'Push de teste para contexto anonimo.',
        url: '/#/messages'
    };

    let sent = 0;
    let failed = 0;
    let deactivated = 0;

    for (const subscription of subscriptions) {
        const result = await sendPushNotification(
            {
                endpoint: subscription.endpoint,
                p256dh: subscription.p256dh,
                auth: subscription.auth
            },
            payload
        );

        if (result.ok) {
            sent += 1;
            continue;
        }

        failed += 1;

        if (result.statusCode === 404 || result.statusCode === 410) {
            await prisma.pushSubscription.update({
                where: {
                    id: subscription.id
                },
                data: {
                    isActive: false
                }
            });

            deactivated += 1;
        }
    }

    return {
        ok: true,
        total: subscriptions.length,
        sent,
        failed,
        deactivated
    };
};
