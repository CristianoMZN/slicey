import { computed, reactive } from 'vue';

const AGE_VERIFICATION_STORAGE_KEY = 'jobbie.age.verification';
const AGE_VERIFICATION_ATTEMPTS_STORAGE_KEY = 'jobbie.age.verification.attempts';
const AGE_VERIFICATION_EXPIRATION_MS = 1000 * 60 * 60 * 24 * 30;
const AGE_VERIFICATION_PEPPER = 'jobbie-age-gate-v1-local-integrity';
const AGE_VERIFICATION_LOCK_SCHEDULE_MS = [30_000, 5 * 60_000, 2 * 60 * 60_000] as const;

export type AgeVerificationMethod = 'face-api-age-estimation';

export interface AgeVerificationPayload {
  approved: true;
  estimatedAge: number;
  issuedAt: string;
  expiresAt: string;
  method: AgeVerificationMethod;
  version: '1';
  sampleCount: number;
  threshold: number;
}

interface AgeVerificationRecord {
  payload: AgeVerificationPayload;
  integrity: string;
}

interface AgeVerificationAttemptsRecord {
  failedAttempts: number;
  lockUntil: string | null;
}

const state = reactive({
  hydrated: false,
  record: null as AgeVerificationPayload | null,
  tampered: false,
  errorMessage: '',
  failedAttempts: 0,
  lockUntil: null as string | null,
});

function buildIntegrityInput(payload: AgeVerificationPayload): string {
  return [
    payload.approved ? '1' : '0',
    payload.estimatedAge.toString(),
    payload.issuedAt,
    payload.expiresAt,
    payload.method,
    payload.version,
    payload.sampleCount.toString(),
    payload.threshold.toString(),
  ].join('|');
}

async function sha256Hex(value: string): Promise<string> {
  const encoded = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest('SHA-256', encoded);
  return Array.from(new Uint8Array(digest))
    .map((part) => part.toString(16).padStart(2, '0'))
    .join('');
}

async function computeIntegrity(payload: AgeVerificationPayload): Promise<string> {
  return sha256Hex(`${AGE_VERIFICATION_PEPPER}|${buildIntegrityInput(payload)}`);
}

function clearPersistedRecord() {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.removeItem(AGE_VERIFICATION_STORAGE_KEY);
}

function persistAttemptsRecord() {
  if (typeof window === 'undefined') {
    return;
  }

  const record: AgeVerificationAttemptsRecord = {
    failedAttempts: state.failedAttempts,
    lockUntil: state.lockUntil,
  };

  window.localStorage.setItem(AGE_VERIFICATION_ATTEMPTS_STORAGE_KEY, JSON.stringify(record));
}

function clearAttemptsRecord() {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.removeItem(AGE_VERIFICATION_ATTEMPTS_STORAGE_KEY);
}

function isPayloadExpired(payload: AgeVerificationPayload): boolean {
  return new Date(payload.expiresAt).getTime() <= Date.now();
}

function isPayloadShapeValid(payload: Partial<AgeVerificationPayload> | null | undefined): payload is AgeVerificationPayload {
  return Boolean(
    payload &&
      payload.approved === true &&
      typeof payload.estimatedAge === 'number' &&
      typeof payload.issuedAt === 'string' &&
      typeof payload.expiresAt === 'string' &&
      payload.method === 'face-api-age-estimation' &&
      payload.version === '1' &&
      typeof payload.sampleCount === 'number' &&
      typeof payload.threshold === 'number',
  );
}

async function hydrate() {
  if (state.hydrated) {
    return;
  }

  if (typeof window === 'undefined') {
    state.hydrated = true;
    return;
  }

  const rawRecord = window.localStorage.getItem(AGE_VERIFICATION_STORAGE_KEY);
  const rawAttemptsRecord = window.localStorage.getItem(AGE_VERIFICATION_ATTEMPTS_STORAGE_KEY);

  if (rawAttemptsRecord) {
    try {
      const parsedAttempts = JSON.parse(rawAttemptsRecord) as Partial<AgeVerificationAttemptsRecord>;
      state.failedAttempts = Math.max(0, Number(parsedAttempts.failedAttempts ?? 0));
      state.lockUntil = typeof parsedAttempts.lockUntil === 'string' ? parsedAttempts.lockUntil : null;

      if (state.lockUntil && new Date(state.lockUntil).getTime() <= Date.now()) {
        state.lockUntil = null;
        persistAttemptsRecord();
      }
    } catch {
      state.failedAttempts = 0;
      state.lockUntil = null;
      clearAttemptsRecord();
    }
  }

  if (!rawRecord) {
    state.hydrated = true;
    return;
  }

  try {
    const parsed = JSON.parse(rawRecord) as Partial<AgeVerificationRecord>;
    if (!parsed || !isPayloadShapeValid(parsed.payload) || typeof parsed.integrity !== 'string') {
      throw new Error('invalid-age-verification-record');
    }

    if (isPayloadExpired(parsed.payload)) {
      throw new Error('expired-age-verification-record');
    }

    const expectedIntegrity = await computeIntegrity(parsed.payload);
    if (expectedIntegrity !== parsed.integrity) {
      throw new Error('tampered-age-verification-record');
    }

    state.record = parsed.payload;
    state.tampered = false;
    state.errorMessage = '';
  } catch {
    clearPersistedRecord();
    state.record = null;
    state.tampered = true;
    state.errorMessage = 'Nao foi possivel validar o selo local de maioridade. Refaca a validacao.';
  } finally {
    state.hydrated = true;
  }
}

async function approve(estimatedAge: number, sampleCount = 3) {
  const payload: AgeVerificationPayload = {
    approved: true,
    estimatedAge: Math.round(estimatedAge),
    issuedAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + AGE_VERIFICATION_EXPIRATION_MS).toISOString(),
    method: 'face-api-age-estimation',
    version: '1',
    sampleCount,
    threshold: 18,
  };

  const integrity = await computeIntegrity(payload);
  const record: AgeVerificationRecord = {
    payload,
    integrity,
  };

  if (typeof window !== 'undefined') {
    window.localStorage.setItem(AGE_VERIFICATION_STORAGE_KEY, JSON.stringify(record));
  }

  state.record = payload;
  state.tampered = false;
  state.errorMessage = '';
  state.failedAttempts = 0;
  state.lockUntil = null;
  persistAttemptsRecord();
  state.hydrated = true;
}

function registerFailure() {
  const nextFailedAttempts = state.failedAttempts + 1;
  const scheduleIndex = Math.min(nextFailedAttempts, AGE_VERIFICATION_LOCK_SCHEDULE_MS.length) - 1;
  const fallbackDurationMs = AGE_VERIFICATION_LOCK_SCHEDULE_MS[AGE_VERIFICATION_LOCK_SCHEDULE_MS.length - 1] as number;
  const lockDurationMs = AGE_VERIFICATION_LOCK_SCHEDULE_MS[scheduleIndex] ?? fallbackDurationMs;

  state.failedAttempts = nextFailedAttempts;
  state.lockUntil = new Date(Date.now() + lockDurationMs).toISOString();
  persistAttemptsRecord();
}

function clearLockIfExpired() {
  if (!state.lockUntil) {
    return;
  }

  if (new Date(state.lockUntil).getTime() > Date.now()) {
    return;
  }

  state.lockUntil = null;
  persistAttemptsRecord();
}

function invalidate() {
  clearPersistedRecord();
  state.record = null;
  state.tampered = false;
  state.errorMessage = '';
}

export function useAgeVerification() {
  return {
    state,
    hydrate,
    approve,
    registerFailure,
    clearLockIfExpired,
    invalidate,
    isVerified: computed(() => Boolean(state.record) && !isPayloadExpired(state.record as AgeVerificationPayload)),
    requiresVerification: computed(() => state.hydrated && !state.record),
    expiresAt: computed(() => state.record?.expiresAt ?? null),
    isLocked: computed(() => Boolean(state.lockUntil) && new Date(state.lockUntil as string).getTime() > Date.now()),
    lockUntil: computed(() => state.lockUntil),
  };
}
