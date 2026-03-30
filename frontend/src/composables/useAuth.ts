import { computed, reactive } from 'vue';
import { api } from 'src/boot/axios';
import { useMockApi, wait } from 'src/services/runtime';
import {
  handleAuthPushContextChange,
  handleGuestPushContextChange,
  registerPushForCurrentContext,
} from 'src/services/push.service';

const AUTH_TOKEN_KEY = 'jobbie.auth.token';
const AUTH_EMAIL_KEY = 'jobbie.auth.email';
const AUTH_USER_TYPE_KEY = 'jobbie.auth.user-type';
const AUTH_CREATOR_STATUS_KEY = 'jobbie.auth.creator-status';

export type UserType = 'anonymous' | 'registered' | 'creator';
export type CreatorVerificationStatus = 'not-applicable' | 'pending-review' | 'approved';

const initialToken = typeof window !== 'undefined' ? window.localStorage.getItem(AUTH_TOKEN_KEY) : null;
const initialEmail =
  typeof window !== 'undefined' ? (window.localStorage.getItem(AUTH_EMAIL_KEY) ?? 'visitante@jobbie.app') : 'visitante@jobbie.app';
const initialUserType =
  typeof window !== 'undefined'
    ? ((window.localStorage.getItem(AUTH_USER_TYPE_KEY) as UserType | null) ?? (initialToken ? 'registered' : 'anonymous'))
    : 'anonymous';
const initialCreatorStatus =
  typeof window !== 'undefined'
    ? ((window.localStorage.getItem(AUTH_CREATOR_STATUS_KEY) as CreatorVerificationStatus | null) ??
      (initialUserType === 'creator' ? 'pending-review' : 'not-applicable'))
    : 'not-applicable';

const state = reactive({
  token: initialToken,
  email: initialEmail,
  userType: initialUserType,
  creatorVerificationStatus: initialCreatorStatus,
  authDialogOpen: false,
  pendingAction: 'continuar',
  isSubmittingAuth: false,
});

function persistSession() {
  if (typeof window === 'undefined') {
    return;
  }

  if (state.token) {
    window.localStorage.setItem(AUTH_TOKEN_KEY, state.token);
    window.localStorage.setItem(AUTH_EMAIL_KEY, state.email);
    window.localStorage.setItem(AUTH_USER_TYPE_KEY, state.userType);
    window.localStorage.setItem(AUTH_CREATOR_STATUS_KEY, state.creatorVerificationStatus);
    return;
  }

  window.localStorage.removeItem(AUTH_TOKEN_KEY);
  window.localStorage.removeItem(AUTH_EMAIL_KEY);
  window.localStorage.removeItem(AUTH_USER_TYPE_KEY);
  window.localStorage.removeItem(AUTH_CREATOR_STATUS_KEY);
}

async function registerQuick(identity?: string, userType: Exclude<UserType, 'anonymous'> = 'registered') {
  state.isSubmittingAuth = true;

  try {
    await registerPushForCurrentContext({ requestPermission: true });

    if (useMockApi) {
      await wait(850);

      state.token = 'demo-auth-token';
      state.email = identity?.trim() || 'nova.conta@jobbie.app';
      state.userType = userType;
      state.creatorVerificationStatus = userType === 'creator' ? 'pending-review' : 'not-applicable';
    } else {
      // TODO(back-end): ajustar endpoint e payload de sessao final de cadastro/login.
      const { data } = await api.post<{
        accessToken: string;
        email: string;
        userType: Exclude<UserType, 'anonymous'>;
        creatorVerificationStatus?: CreatorVerificationStatus;
      }>('/auth/register/complete', {
        identity,
        userType,
      });

      state.token = data.accessToken;
      state.email = data.email;
      state.userType = data.userType;
      state.creatorVerificationStatus = data.creatorVerificationStatus ?? 'not-applicable';
    }

    state.authDialogOpen = false;
    persistSession();
    await handleAuthPushContextChange();
  } finally {
    state.isSubmittingAuth = false;
  }
}

async function login(identity: string, _password: string): Promise<boolean> {
  state.isSubmittingAuth = true;
  try {
    await registerPushForCurrentContext({ requestPermission: true });

    if (useMockApi) {
      await wait(650);
      state.token = 'demo-auth-token';
      state.email = identity;
      state.userType = 'registered';
      state.creatorVerificationStatus = 'not-applicable';
      persistSession();
      await handleAuthPushContextChange();
      return true;
    }

    // TODO(back-end): ajustar endpoint de login com contrato real.
    const { data } = await api.post<{
      accessToken: string;
      email: string;
      userType: Exclude<UserType, 'anonymous'>;
      creatorVerificationStatus?: CreatorVerificationStatus;
    }>('/auth/login', { identity, password: _password });

    state.token = data.accessToken;
    state.email = data.email;
    state.userType = data.userType;
    state.creatorVerificationStatus = data.creatorVerificationStatus ?? 'not-applicable';
    persistSession();
    await handleAuthPushContextChange();
    return true;
  } catch {
    return false;
  } finally {
    state.isSubmittingAuth = false;
  }
}

async function submitCreatorApplication(kycData: {
  fullName: string;
  cpf: string;
  birthDate: string;
  address: string;
}): Promise<void> {
  state.isSubmittingAuth = true;
  try {
    if (useMockApi) {
      await wait(800);
      state.creatorVerificationStatus = 'pending-review';
      persistSession();
      return;
    }

    // TODO(back-end): endpoint de submissao de KYC de criador.
    await api.post('/auth/creator-application', kycData);
    state.creatorVerificationStatus = 'pending-review';
    persistSession();
  } finally {
    state.isSubmittingAuth = false;
  }
}

function logout() {
  state.token = null;
  state.email = 'visitante@jobbie.app';
  state.userType = 'anonymous';
  state.creatorVerificationStatus = 'not-applicable';
  persistSession();
  void handleGuestPushContextChange();
}

function requestAuth(action: string) {
  state.pendingAction = action;
  state.authDialogOpen = true;
}

function closeAuthDialog() {
  state.authDialogOpen = false;
}

export function useAuth() {
  return {
    state,
    isAuthenticated: computed(() => Boolean(state.token)),
    isCreator: computed(() => state.userType === 'creator'),
    login,
    registerQuick,
    submitCreatorApplication,
    logout,
    requestAuth,
    closeAuthDialog,
  };
}
