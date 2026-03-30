<template>
  <q-page class="settings-page q-pa-md q-pa-sm-lg">
    <div class="settings-container">
      <!-- Header -->
      <div class="q-mb-lg">
        <div class="text-overline page-kicker">{{ t('settings.title') }}</div>
        <h1 class="text-h5 text-weight-bold q-my-xs">{{ t('settings.title') }}</h1>
        <p class="text-body2 text-grey-6 q-ma-none">{{ t('settings.subtitle') }}</p>
      </div>

      <!-- Seção: Conta -->
      <settings-section :title="t('settings.sections.account')" icon="manage_accounts">
        <q-list separator>
          <q-item>
            <q-item-section avatar>
              <q-icon name="email" color="primary" />
            </q-item-section>
            <q-item-section>
              <q-item-label>{{ t('settings.account.email') }}</q-item-label>
              <q-item-label caption>{{ auth.state.email }}</q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-chip
                dense
                :color="isAuthenticated ? 'positive' : 'grey'"
                text-color="white"
                size="sm"
              >
                {{ isAuthenticated ? 'Ativo' : '—' }}
              </q-chip>
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section avatar>
              <q-icon name="badge" color="primary" />
            </q-item-section>
            <q-item-section>
              <q-item-label>{{ t('settings.account.accountType') }}</q-item-label>
              <q-item-label caption>
                {{ t(`settings.account.types.${auth.state.userType}`) }}
              </q-item-label>
            </q-item-section>
          </q-item>

          <q-item v-if="auth.state.userType === 'creator'">
            <q-item-section avatar>
              <q-icon name="verified" color="primary" />
            </q-item-section>
            <q-item-section>
              <q-item-label>{{ t('settings.account.creatorStatus') }}</q-item-label>
              <q-item-label caption>
                {{ t(`settings.account.creatorStatuses.${auth.state.creatorVerificationStatus}`) }}
              </q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-chip
                dense
                :color="creatorStatusColor"
                text-color="white"
                size="sm"
              >
                {{ t(`settings.account.creatorStatuses.${auth.state.creatorVerificationStatus}`) }}
              </q-chip>
            </q-item-section>
          </q-item>
        </q-list>
      </settings-section>

      <!-- Seção: Aparência -->
      <settings-section :title="t('settings.sections.appearance')" icon="palette">
        <q-list>
          <q-item>
            <q-item-section avatar>
              <q-icon :name="isDarkMode ? 'dark_mode' : 'light_mode'" color="primary" />
            </q-item-section>
            <q-item-section>
              <q-item-label>{{ t('settings.appearance.darkMode') }}</q-item-label>
              <q-item-label caption>{{ t('settings.appearance.darkModeCaption') }}</q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-toggle v-model="isDarkMode" color="primary" />
            </q-item-section>
          </q-item>
        </q-list>
      </settings-section>

      <!-- Seção: Idioma -->
      <settings-section :title="t('settings.sections.language')" icon="translate">
        <div class="q-pa-md">
          <div class="text-body2 text-grey-6 q-mb-sm">{{ t('settings.language.label') }}</div>
          <div class="row q-gutter-sm">
            <q-btn
              v-for="lang in supportedLocales"
              :key="lang"
              rounded
              no-caps
              size="md"
              :outline="locale !== lang"
              :color="locale === lang ? 'primary' : 'grey-5'"
              class="lang-option"
              @click="setLocale(lang)"
            >
              <span class="flag-emoji q-mr-xs">{{ localeConfig[lang].flag }}</span>
              {{ localeConfig[lang].label }}
            </q-btn>
          </div>
          <div class="text-caption text-grey-5 q-mt-sm">{{ t('settings.language.caption') }}</div>
        </div>
      </settings-section>

      <!-- Seção: Preferências de conteúdo -->
      <settings-section :title="t('settings.sections.content')" icon="tune">
        <q-list separator>
          <q-item>
            <q-item-section avatar>
              <q-icon name="people" color="primary" />
            </q-item-section>
            <q-item-section>
              <q-item-label>{{ t('settings.content.interestedIn') }}</q-item-label>
              <q-item-label caption>{{ t('settings.content.interestedInCaption') }}</q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-btn-toggle
                v-model="preferences.interestedIn"
                no-caps
                rounded
                dense
                unelevated
                toggle-color="primary"
                color="grey-2"
                text-color="grey-8"
                toggle-text-color="white"
                size="sm"
                :options="interestedInOptions"
              />
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section avatar>
              <q-icon name="category" color="primary" />
            </q-item-section>
            <q-item-section>
              <q-item-label>{{ t('settings.content.interestedSexuality') }}</q-item-label>
              <q-item-label caption>{{ t('settings.content.interestedSexualityCaption') }}</q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-btn-toggle
                v-model="preferences.interestedSexuality"
                no-caps
                rounded
                dense
                unelevated
                toggle-color="primary"
                color="grey-2"
                text-color="grey-8"
                toggle-text-color="white"
                size="sm"
                :options="sexualityOptions"
              />
            </q-item-section>
          </q-item>
        </q-list>
      </settings-section>

      <!-- Seção: Sessão -->
      <settings-section :title="t('settings.sections.session')" icon="security">
        <q-list>
          <q-item clickable @click="handleLogout">
            <q-item-section avatar>
              <q-icon name="logout" color="negative" />
            </q-item-section>
            <q-item-section>
              <q-item-label class="text-negative">{{ t('settings.session.logout') }}</q-item-label>
              <q-item-label caption>{{ t('settings.session.logoutCaption') }}</q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-icon name="chevron_right" color="negative" />
            </q-item-section>
          </q-item>
        </q-list>
      </settings-section>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useQuasar } from 'quasar';
import { useRouter } from 'vue-router';
import { useAuth } from 'src/composables/useAuth';
import { useLanguage } from 'src/composables/useLanguage';
import { useUserPreferences } from 'src/composables/useUserPreferences';
import SettingsSection from 'src/components/SettingsSection.vue';

const { t } = useI18n();
const $q = useQuasar();
const router = useRouter();
const auth = useAuth();
const { locale, setLocale, supportedLocales, localeConfig } = useLanguage();
const { preferences } = useUserPreferences();

const isAuthenticated = computed(() => auth.isAuthenticated.value);

const isDarkMode = computed({
  get: () => $q.dark.isActive,
  set: (val: boolean) => $q.dark.set(val),
});

const creatorStatusColor = computed(() => {
  const map: Record<string, string> = {
    'pending-review': 'warning',
    approved: 'positive',
    'not-applicable': 'grey',
  };
  return map[auth.state.creatorVerificationStatus] ?? 'grey';
});

const interestedInOptions = computed(() => [
  { label: t('settings.content.options.interestedIn.Mulheres'), value: 'Mulheres' },
  { label: t('settings.content.options.interestedIn.Homens'), value: 'Homens' },
  { label: t('settings.content.options.interestedIn.Ambos'), value: 'Ambos' },
]);

const sexualityOptions = computed(() => [
  { label: t('settings.content.options.interestedSexuality.Cis'), value: 'Cis' },
  { label: t('settings.content.options.interestedSexuality.Trans'), value: 'Trans' },
  { label: t('settings.content.options.interestedSexuality.Ambos'), value: 'Ambos' },
]);

function handleLogout() {
  auth.logout();
  $q.notify({ type: 'info', message: 'Sessão encerrada.', timeout: 1800 });
  void router.push({ name: 'frames' });
}
</script>

<style scoped lang="scss">
.settings-page {
  min-height: 100vh;
}

.settings-container {
  max-width: 680px;
  margin: 0 auto;
}

.page-kicker {
  color: var(--q-primary);
  letter-spacing: 0.12em;
  font-size: 0.7rem;
}

.lang-option {
  min-width: 110px;
}

.flag-emoji {
  font-size: 1.1em;
}
</style>
