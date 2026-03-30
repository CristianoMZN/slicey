import { api } from 'src/boot/axios';
import { useMockApi } from 'src/services/runtime';

const PUSH_ANONYMOUS_SESSION_KEY = 'jobbie.push.anonymous-session-id';

let cachedVapidPublicKey: string | null = null;

type PushSubscriptionPayload = {
  endpoint: string;
  expirationTime: number | null;
  keys: {
    p256dh: string;
    auth: string;
  };
  device: string;
  anonymousSessionId?: string;
};

function isPushSupported() {
  if (typeof window === 'undefined') {
    return false;
  }

  return 'serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window;
}

function toUint8Array(base64String: string) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; i += 1) {
    outputArray[i] = rawData.charCodeAt(i);
  }

  return outputArray;
}

export function getOrCreateAnonymousPushSessionId() {
  if (typeof window === 'undefined') {
    return null;
  }

  const existing = window.localStorage.getItem(PUSH_ANONYMOUS_SESSION_KEY);
  if (existing) {
    return existing;
  }

  const generated = window.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  window.localStorage.setItem(PUSH_ANONYMOUS_SESSION_KEY, generated);
  return generated;
}

function getAnonymousPushSessionId() {
  if (typeof window === 'undefined') {
    return null;
  }

  return window.localStorage.getItem(PUSH_ANONYMOUS_SESSION_KEY);
}

async function fetchVapidPublicKey() {
  if (cachedVapidPublicKey) {
    return cachedVapidPublicKey;
  }

  const envVapidPublicKey = import.meta.env.VITE_PUSH_PUBLIC_VAPID_KEY?.trim();
  if (envVapidPublicKey) {
    cachedVapidPublicKey = envVapidPublicKey;
    return cachedVapidPublicKey;
  }

  const { data } = await api.get<{ publicKey: string }>('/auth/push/public-key');
  cachedVapidPublicKey = data.publicKey;
  return cachedVapidPublicKey;
}

async function getActiveSubscription(requestPermission: boolean) {
  if (!isPushSupported()) {
    return null;
  }

  if (Notification.permission === 'default' && requestPermission) {
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      return null;
    }
  }

  if (Notification.permission !== 'granted') {
    return null;
  }

  const registration = await navigator.serviceWorker.ready;
  const existingSubscription = await registration.pushManager.getSubscription();

  if (existingSubscription) {
    return existingSubscription;
  }

  const publicKey = await fetchVapidPublicKey();

  return registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: toUint8Array(publicKey)
  });
}

function buildPayload(subscription: PushSubscription, anonymousSessionId?: string): PushSubscriptionPayload {
  const serialized = subscription.toJSON();
  const payload: PushSubscriptionPayload = {
    endpoint: subscription.endpoint,
    expirationTime: serialized.expirationTime ?? null,
    keys: {
      p256dh: serialized.keys?.p256dh ?? '',
      auth: serialized.keys?.auth ?? ''
    },
    device: 'web-pwa'
  };

  if (anonymousSessionId) {
    payload.anonymousSessionId = anonymousSessionId;
  }

  return payload;
}

export async function registerPushForCurrentContext(options?: { requestPermission?: boolean }) {
  if (useMockApi || !isPushSupported()) {
    return;
  }

  const anonymousSessionId = getOrCreateAnonymousPushSessionId() ?? undefined;

  try {
    const subscription = await getActiveSubscription(Boolean(options?.requestPermission));
    if (!subscription) {
      return;
    }

    await api.post('/auth/push/subscriptions', buildPayload(subscription, anonymousSessionId));
  } catch {
    // Push opt-in can fail due to browser policy or missing backend config.
  }
}

export async function initializePushContext() {
  getOrCreateAnonymousPushSessionId();
  await registerPushForCurrentContext({ requestPermission: false });
}

export async function bindAnonymousPushToAuthenticatedContext() {
  if (useMockApi) {
    return;
  }

  const anonymousSessionId = getAnonymousPushSessionId();
  if (!anonymousSessionId) {
    return;
  }

  try {
    await api.post('/auth/push/bind-anonymous', { anonymousSessionId });
  } catch {
    // Binding can fail when user has no anonymous subscription yet.
  }
}

export async function handleAuthPushContextChange() {
  await bindAnonymousPushToAuthenticatedContext();
  await registerPushForCurrentContext({ requestPermission: true });
}

export async function handleGuestPushContextChange() {
  await registerPushForCurrentContext({ requestPermission: false });
}
