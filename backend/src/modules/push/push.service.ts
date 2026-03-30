import webpush from 'web-push';

const PUSH_VAPID_PUBLIC_KEY = process.env.PUSH_VAPID_PUBLIC_KEY?.trim() ?? '';
const PUSH_VAPID_PRIVATE_KEY = process.env.PUSH_VAPID_PRIVATE_KEY?.trim() ?? '';
const PUSH_VAPID_SUBJECT = process.env.PUSH_VAPID_SUBJECT?.trim() ?? 'mailto:dev@jobbie.local';

export const isPushConfigured = Boolean(PUSH_VAPID_PUBLIC_KEY && PUSH_VAPID_PRIVATE_KEY);

if (isPushConfigured) {
    webpush.setVapidDetails(PUSH_VAPID_SUBJECT, PUSH_VAPID_PUBLIC_KEY, PUSH_VAPID_PRIVATE_KEY);
}

export const pushPublicKey = PUSH_VAPID_PUBLIC_KEY;

export type PushPayload = {
    title: string;
    body: string;
    url?: string;
};

export type PushSubscriptionRecord = {
    endpoint: string;
    p256dh: string;
    auth: string;
};

type PushSendResult = {
    ok: boolean;
    statusCode?: number;
};

export const sendPushNotification = async (
    subscription: PushSubscriptionRecord,
    payload: PushPayload
): Promise<PushSendResult> => {
    if (!isPushConfigured) {
        return { ok: false };
    }

    try {
        await webpush.sendNotification(
            {
                endpoint: subscription.endpoint,
                keys: {
                    p256dh: subscription.p256dh,
                    auth: subscription.auth
                }
            },
            JSON.stringify(payload),
            { TTL: 60 }
        );

        return { ok: true };
    } catch (error) {
        const maybeStatusCode =
            typeof error === 'object' && error !== null && 'statusCode' in error
                ? Number((error as { statusCode?: number }).statusCode)
                : undefined;

        return {
            ok: false,
            statusCode: Number.isFinite(maybeStatusCode) ? maybeStatusCode : undefined
        };
    }
};
