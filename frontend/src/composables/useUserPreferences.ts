import { reactive, watch } from 'vue';

export type InterestedIn = 'Mulheres' | 'Homens' | 'Ambos';
export type InterestedSexuality = 'Cis' | 'Trans' | 'Ambos';

export interface UserPreferences {
  interestedIn: InterestedIn;
  interestedSexuality: InterestedSexuality;
}

const PREFS_KEY = 'jobbie_user_prefs';

function loadPreferences(): UserPreferences {
  try {
    const raw = localStorage.getItem(PREFS_KEY);
    if (raw) {
      return JSON.parse(raw) as UserPreferences;
    }
  } catch {
    // ignore
  }
  return { interestedIn: 'Ambos', interestedSexuality: 'Ambos' };
}

const preferences = reactive<UserPreferences>(loadPreferences());

watch(
  preferences,
  (val) => {
    localStorage.setItem(PREFS_KEY, JSON.stringify(val));
  },
  { deep: true },
);

export function useUserPreferences() {
  return { preferences };
}
