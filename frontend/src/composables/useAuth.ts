import { computed, reactive } from 'vue';

const AUTH_TOKEN_KEY = 'jobbie.auth.token';
const AUTH_EMAIL_KEY = 'jobbie.auth.email';

const initialToken = typeof window !== 'undefined' ? window.localStorage.getItem(AUTH_TOKEN_KEY) : null;
const initialEmail =
  typeof window !== 'undefined' ? (window.localStorage.getItem(AUTH_EMAIL_KEY) ?? 'visitante@jobbie.app') : 'visitante@jobbie.app';

const state = reactive({
  token: initialToken,
  email: initialEmail,
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
    return;
  }

  window.localStorage.removeItem(AUTH_TOKEN_KEY);
  window.localStorage.removeItem(AUTH_EMAIL_KEY);
}

async function registerQuick(identity?: string) {
  state.isSubmittingAuth = true;

  try {
    await new Promise<void>((resolve) => {
      setTimeout(() => resolve(), 850);
    });

    state.token = 'demo-auth-token';
    state.email = identity?.trim() || 'nova.conta@jobbie.app';
    state.authDialogOpen = false;
    persistSession();
  } finally {
    state.isSubmittingAuth = false;
  }
}

function logout() {
  state.token = null;
  state.email = 'visitante@jobbie.app';
  persistSession();
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
    registerQuick,
    logout,
    requestAuth,
    closeAuthDialog,
  };
}
