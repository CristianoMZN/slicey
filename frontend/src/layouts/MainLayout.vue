<template>
  <q-layout view="lHh Lpr lFf" class="jobbie-layout">
    <q-header class="jobbie-header q-px-md q-py-sm">
      <q-toolbar class="q-px-none header-toolbar">
        <router-link :to="{ name: 'frames' }" class="brand-wrap brand-link">
          <div class="brand-dot" />
          <div>
            <div class="brand-title">Jobbie</div>
            <div v-if="!isMobile" class="brand-subtitle">Frames first social booking</div>
          </div>
        </router-link>

        <q-space />

        <template v-if="isMobile">
          <q-btn flat round dense icon="menu" @click="mobileMenuOpen = true" />
        </template>

        <template v-else>
          <q-btn
            v-if="!isAuthenticated"
            color="primary"
            unelevated
            rounded
            icon="login"
            label="Login"
            @click="openAuthDialog('entrar na plataforma')"
          />

          <q-btn-dropdown
            v-else
            flat
            rounded
            dropdown-icon="expand_more"
            class="account-dropdown"
          >
            <template #label>
              <div class="row items-center no-wrap q-gutter-sm">
                <q-avatar size="38px" class="account-avatar">
                  {{ userInitial }}
                </q-avatar>
                <div class="text-left">
                  <div class="account-name">{{ userDisplayName }}</div>
                  <div class="account-caption">{{ auth.state.email }}</div>
                </div>
              </div>
            </template>

            <q-list class="desktop-menu-list">
              <q-item class="desktop-account-card">
                <q-item-section avatar>
                  <q-avatar size="52px" class="account-avatar account-avatar-large">
                    {{ userInitial }}
                  </q-avatar>
                </q-item-section>
                <q-item-section>
                  <q-item-label class="text-weight-bold">{{ userDisplayName }}</q-item-label>
                  <q-item-label caption>{{ auth.state.email }}</q-item-label>
                </q-item-section>
              </q-item>

              <q-separator spaced />

              <q-item
                v-for="item in desktopMenuItems"
                :key="item.label"
                clickable
                v-close-popup
                @click="handleMenuItem(item)"
              >
                <q-item-section avatar>
                  <q-icon :name="item.icon" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>{{ item.label }}</q-item-label>
                  <q-item-label caption>{{ item.caption }}</q-item-label>
                </q-item-section>
              </q-item>

              <q-separator spaced />

              <q-item>
                <q-item-section avatar>
                  <q-icon :name="isDarkMode ? 'light_mode' : 'dark_mode'" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>{{ isDarkMode ? 'Modo claro' : 'Modo escuro' }}</q-item-label>
                  <q-item-label caption>Alternar o visual da interface</q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-toggle v-model="isDarkMode" color="primary" />
                </q-item-section>
              </q-item>

              <q-separator spaced />

              <q-item clickable v-close-popup @click="logout()">
                <q-item-section avatar>
                  <q-icon name="logout" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>Sair</q-item-label>
                  <q-item-label caption>Encerrar a sessao atual</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-btn-dropdown>
        </template>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>

    <q-footer class="jobbie-footer q-px-sm q-py-xs">
      <q-tabs align="justify" class="bottom-tabs" active-color="primary" indicator-color="transparent">
        <q-route-tab to="/feed" icon="dynamic_feed" label="Posts" class="nav-tab" />
        <q-route-tab to="/anuncios" icon="campaign" label="Anuncios" class="nav-tab" />
        <q-route-tab to="/frames" icon="theaters" label="Frames" class="nav-tab frames-tab" />
        <q-route-tab to="/mensagens" icon="forum" label="Mensagens" class="nav-tab" />
        <q-route-tab to="/loja" icon="storefront" label="Loja" class="nav-tab" />
      </q-tabs>
    </q-footer>

    <q-dialog
      v-model="mobileMenuOpen"
      maximized
      transition-show="slide-left"
      transition-hide="slide-right"
    >
      <q-card class="mobile-menu-card">
        <q-card-section class="row items-center justify-between mobile-menu-topbar">
          <div>
            <div class="text-overline page-kicker">Menu</div>
            <div class="text-h6 text-weight-bold">Acesso rapido</div>
          </div>
          <q-btn flat round dense icon="close" @click="mobileMenuOpen = false" />
        </q-card-section>

        <q-card-section>
          <q-card flat bordered class="mobile-account-panel q-pa-md">
            <div class="row items-center q-col-gutter-md">
              <div class="col-auto">
                <q-avatar size="64px" class="account-avatar account-avatar-large">
                  {{ userInitial }}
                </q-avatar>
              </div>
              <div class="col">
                <div class="text-subtitle1 text-weight-bold">{{ isAuthenticated ? userDisplayName : 'Visitante' }}</div>
                <div class="text-body2 text-grey-6">
                  {{ isAuthenticated ? auth.state.email : 'Entre para curtir, comentar e conversar.' }}
                </div>
                <div class="q-mt-sm row q-gutter-sm">
                  <q-chip dense outline color="primary">{{ isAuthenticated ? 'Conta ativa' : 'Modo visitante' }}</q-chip>
                  <q-chip dense outline color="secondary">Frames em destaque</q-chip>
                </div>
              </div>
            </div>

            <div v-if="!isAuthenticated" class="q-mt-md">
              <q-btn
                color="primary"
                rounded
                unelevated
                icon="login"
                label="Entrar agora"
                @click="openAuthFromMobile"
              />
            </div>
          </q-card>
        </q-card-section>

        <q-separator />

        <q-scroll-area class="mobile-menu-scroll">
          <q-list padding>
            <q-item-label header class="text-grey-6">Navegacao</q-item-label>
            <q-item
              v-for="item in mobileMenuItems"
              :key="item.label"
              clickable
              @click="handleMobileMenuItem(item)"
            >
              <q-item-section avatar>
                <q-icon :name="item.icon" />
              </q-item-section>
              <q-item-section>
                <q-item-label>{{ item.label }}</q-item-label>
                <q-item-label caption>{{ item.caption }}</q-item-label>
              </q-item-section>
            </q-item>

            <q-item-label header class="text-grey-6">Conta</q-item-label>
            <q-item clickable @click="goToRoute({ name: 'perfil' }, true)">
              <q-item-section avatar>
                <q-icon name="manage_accounts" />
              </q-item-section>
              <q-item-section>
                <q-item-label>Minha conta</q-item-label>
                <q-item-label caption>Perfil, preferencias e recebimento</q-item-label>
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section avatar>
                <q-icon :name="isDarkMode ? 'light_mode' : 'dark_mode'" />
              </q-item-section>
              <q-item-section>
                <q-item-label>{{ isDarkMode ? 'Modo claro' : 'Modo escuro' }}</q-item-label>
                <q-item-label caption>Trocar o visual da interface</q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-toggle v-model="isDarkMode" color="primary" />
              </q-item-section>
            </q-item>
            <q-item clickable @click="showSoon('Favoritos e colecoes')">
              <q-item-section avatar>
                <q-icon name="favorite" />
              </q-item-section>
              <q-item-section>
                <q-item-label>Favoritos</q-item-label>
                <q-item-label caption>Salvar perfis e videos para rever depois</q-item-label>
              </q-item-section>
            </q-item>
            <q-item clickable @click="showSoon('Central de ajuda')">
              <q-item-section avatar>
                <q-icon name="support_agent" />
              </q-item-section>
              <q-item-section>
                <q-item-label>Central de ajuda</q-item-label>
                <q-item-label caption>FAQ, suporte e politicas da plataforma</q-item-label>
              </q-item-section>
            </q-item>
            <q-item v-if="isAuthenticated" clickable @click="logout(true)">
              <q-item-section avatar>
                <q-icon name="logout" />
              </q-item-section>
              <q-item-section>
                <q-item-label>Sair</q-item-label>
                <q-item-label caption>Encerrar sessao neste dispositivo</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-scroll-area>
      </q-card>
    </q-dialog>

    <q-dialog
      v-model="auth.state.authDialogOpen"
      persistent
      transition-show="jump-up"
      transition-hide="jump-down"
    >
      <q-card class="auth-card">
        <q-card-section class="q-pb-none">
          <div class="text-h6 text-weight-bold">Crie sua conta</div>
          <div class="text-subtitle2 text-grey-6">
            Registre-se para {{ auth.state.pendingAction }} e desbloquear curtidas, comentarios e mensagens.
          </div>
        </q-card-section>

        <q-card-section class="q-pt-sm">
          <div class="auth-illustration">
            <UndrawLogin primary-color="#dd2476" />
          </div>
        </q-card-section>

        <q-card-actions align="right" class="q-px-md q-pb-md">
          <q-btn flat label="Agora nao" @click="auth.closeAuthDialog" />
          <q-btn
            color="primary"
            unelevated
            rounded
            :loading="auth.state.isSubmittingAuth"
            @click="handleRegister"
          >
            <template #loading>
              <q-spinner-dots />
            </template>
            Registrar em 1 clique
          </q-btn>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-layout>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useQuasar } from 'quasar';
import { useRouter, type RouteLocationRaw } from 'vue-router';
import { useAuth } from 'src/composables/useAuth';
import UndrawLogin from 'vue-undraw/UndrawLogin.vue';

type MenuItem = {
  label: string;
  caption: string;
  icon: string;
  to?: RouteLocationRaw;
  action?: () => void;
};

const $q = useQuasar();
const router = useRouter();
const auth = useAuth();
const mobileMenuOpen = ref(false);

const isAuthenticated = computed(() => auth.isAuthenticated.value);
const isMobile = computed(() => $q.screen.lt.md);
const userDisplayName = computed(() => {
  const identity = auth.state.email?.split('@')[0] ?? 'visitante';
  return identity
    .split(/[._-]/g)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
});
const userInitial = computed(() => userDisplayName.value.charAt(0).toUpperCase() || 'J');

const isDarkMode = computed({
  get: () => $q.dark.isActive,
  set: (val: boolean) => $q.dark.set(val),
});

// CSS reactive bindings for dark/light theme
const menuDropdownBg = computed(() =>
  isDarkMode.value ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.84)',
);
const menuDropdownBorder = computed(() =>
  isDarkMode.value ? 'rgba(255,255,255,0.1)' : 'rgba(26,19,37,0.12)',
);
const mobileMenuCardBg = computed(() =>
  isDarkMode.value
    ? 'radial-gradient(circle at top left, rgba(212,20,90,0.12), transparent 34%), linear-gradient(180deg, #130a1f 0%, #0e0817 100%)'
    : 'radial-gradient(circle at top left, rgba(212,20,90,0.08), transparent 34%), linear-gradient(180deg, #fffaf8 0%, #fff 100%)',
);
const mobileMenuPanelBg = computed(() =>
  isDarkMode.value ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.85)',
);
const mobileMenuTopbarBorder = computed(() =>
  isDarkMode.value ? 'rgba(255,255,255,0.08)' : 'rgba(26,19,37,0.1)',
);

function openAuthDialog(action: string) {
  void router.push({ name: 'registro', query: { source: action } });
}

function openAuthFromMobile() {
  mobileMenuOpen.value = false;
  openAuthDialog('entrar na plataforma');
}

function handleRegister() {
  auth.closeAuthDialog();
  void router.push({ name: 'registro', query: { source: 'acesso-rapido' } });
}

function goToRoute(to: RouteLocationRaw, closeMobileMenu = false) {
  if (closeMobileMenu) {
    mobileMenuOpen.value = false;
  }
  void router.push(to);
}

function showSoon(feature: string) {
  mobileMenuOpen.value = false;
  $q.notify({
    type: 'info',
    message: `${feature} chega na proxima iteracao.`,
    timeout: 2000,
    position: 'top',
  });
}

function logout(closeMobileMenu = false) {
  if (closeMobileMenu) {
    mobileMenuOpen.value = false;
  }
  auth.logout();
  $q.notify({
    type: 'info',
    message: 'Sessao encerrada.',
    timeout: 1800,
  });
  void router.push({ name: 'frames' });
}

function handleMenuItem(item: MenuItem) {
  if (item.action) {
    item.action();
    return;
  }

  if (item.to) {
    void router.push(item.to);
  }
}

function handleMobileMenuItem(item: MenuItem) {
  mobileMenuOpen.value = false;
  handleMenuItem(item);
}

const desktopMenuItems = computed<MenuItem[]>(() => [
  {
    label: 'Frames',
    caption: 'Abrir o feed vertical principal da plataforma',
    icon: 'theaters',
    to: { name: 'frames' },
  },
  {
    label: 'Posts',
    caption: 'Ver publicacoes e atualizacoes da comunidade',
    icon: 'dynamic_feed',
    to: { name: 'feed' },
  },
  {
    label: 'Anuncios',
    caption: 'Descobrir perfis e aplicar filtros',
    icon: 'campaign',
    to: { name: 'anuncios' },
  },
  {
    label: 'Mensagens',
    caption: 'Conversas ativas e midias trocadas',
    icon: 'forum',
    to: { name: 'mensagens' },
  },
  {
    label: 'Loja',
    caption: 'Produtos, upgrades e extras da plataforma',
    icon: 'storefront',
    to: { name: 'loja' },
  },
  {
    label: 'Minha conta',
    caption: 'Editar perfil, preferencias e pagamentos',
    icon: 'manage_accounts',
    to: { name: 'perfil' },
  },
  {
    label: 'Favoritos',
    caption: 'Colecoes e perfis salvos para rever depois',
    icon: 'favorite',
    action: () => showSoon('Favoritos e colecoes'),
  },
  {
    label: 'Central de ajuda',
    caption: 'Suporte, FAQ e boas praticas de seguranca',
    icon: 'support_agent',
    action: () => showSoon('Central de ajuda'),
  },
]);

const mobileMenuItems = computed<MenuItem[]>(() => [
  {
    label: 'Frames',
    caption: 'Abrir o produto principal da plataforma',
    icon: 'theaters',
    to: { name: 'frames' },
  },
  {
    label: 'Posts',
    caption: 'Publicacoes da comunidade e criadoras',
    icon: 'dynamic_feed',
    to: { name: 'feed' },
  },
  {
    label: 'Anuncios',
    caption: 'Perfis publicos com filtros personalizados',
    icon: 'campaign',
    to: { name: 'anuncios' },
  },
  {
    label: 'Mensagens',
    caption: 'Acessar conversas, audio e camera',
    icon: 'forum',
    to: { name: 'mensagens' },
  },
  {
    label: 'Loja',
    caption: 'Explorar kits, creditos e beneficos premium',
    icon: 'storefront',
    to: { name: 'loja' },
  },
]);
</script>

<style scoped lang="scss">
// header & layout backgrounds are handled by app.scss (dark-first + .body--light overrides)

.header-toolbar {
  min-height: 60px;
}

.brand-link {
  text-decoration: none;
  color: inherit;
}

.brand-dot {
  width: 14px;
  height: 14px;
  border-radius: 999px;
  background: linear-gradient(135deg, #d4145a 0%, #fbb03b 100%);
  box-shadow: 0 0 0 6px rgba(212, 20, 90, 0.14);
}

.brand-title {
  font-size: 1.1rem;
  font-weight: 800;
  line-height: 1.1;
}

.brand-subtitle {
  font-size: 0.78rem;
}

.account-dropdown {
  padding: 2px 6px;
  border-radius: 18px;
  border: 1px solid v-bind(menuDropdownBorder);
  background: v-bind(menuDropdownBg);
}

.account-avatar {
  background: linear-gradient(135deg, #d4145a 0%, #8e2de2 100%);
  color: white;
  font-weight: 800;
}

.account-avatar-large {
  box-shadow: 0 10px 24px rgba(142, 45, 226, 0.2);
}

.account-name {
  font-size: 0.92rem;
  font-weight: 700;
  line-height: 1.2;
}

.account-caption {
  font-size: 0.76rem;
  opacity: 0.58;
  line-height: 1.2;
}

.desktop-menu-list {
  min-width: 300px;
}

.desktop-account-card {
  background: linear-gradient(135deg, rgba(212, 20, 90, 0.1), rgba(142, 45, 226, 0.1));
  border-radius: 18px;
  margin: 8px;
}

.nav-tab {
  min-height: 58px;
}

.frames-tab {
  border-radius: 16px;
  margin: 5px 2px;
  background: linear-gradient(135deg, rgba(212, 20, 90, 0.38) 0%, rgba(142, 45, 226, 0.38) 100%);
  transition: background 0.2s ease, box-shadow 0.2s ease;
}

.frames-tab.q-tab--active {
  background: linear-gradient(135deg, #d4145a 0%, #8e2de2 100%);
  box-shadow: 0 4px 18px rgba(142, 45, 226, 0.38);
}

.frames-tab :deep(.q-tab__label),
.frames-tab :deep(.q-icon) {
  color: rgba(255, 255, 255, 0.6);
}

.frames-tab.q-tab--active :deep(.q-tab__label),
.frames-tab.q-tab--active :deep(.q-icon) {
  color: white;
}

.mobile-menu-card {
  background-color: rgba(18, 10, 31, 0.97);
  background: v-bind(mobileMenuCardBg);
}

.mobile-menu-topbar {
  border-bottom: 1px solid v-bind(mobileMenuTopbarBorder);
}

.mobile-account-panel {
  border-radius: 22px;
  background-color: rgba(255, 255, 255, 0.14);
  background: v-bind(mobileMenuPanelBg);
}

.mobile-menu-scroll {
  height: calc(100vh - 220px);
}

@media (max-width: 599px) {
  .brand-dot {
    width: 12px;
    height: 12px;
  }

  .brand-title {
    font-size: 1rem;
  }
}
</style>