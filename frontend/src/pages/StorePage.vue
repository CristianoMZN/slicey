<template>
  <q-page class="store-page q-px-md q-pt-md q-pb-xl">
    <q-card flat bordered class="section-card hero-card q-mb-md overflow-hidden">
      <q-card-section class="row items-center q-col-gutter-lg">
        <div class="col-12 col-md-7">
          <div class="text-overline page-kicker">Loja</div>
          <h1 class="text-h4 q-my-sm text-weight-bold">Beneficios para impulsionar seu ritmo na plataforma</h1>
          <p class="text-body1 text-grey-7 q-mb-md">
            Assinaturas, pacotes de destaque, creditos promocionais e ferramentas para deixar perfis e frames com mais alcance.
          </p>

          <div class="row q-gutter-sm q-mb-md">
            <q-chip outline color="primary">Boost de Frames</q-chip>
            <q-chip outline color="secondary">Kits promocionais</q-chip>
            <q-chip outline color="warning">Assinatura creator</q-chip>
          </div>

          <div class="row q-gutter-sm">
            <q-btn color="primary" rounded unelevated label="Explorar pacotes" @click="notifySoon('catalogo completo')" />
            <q-btn flat rounded icon="theaters" label="Ver Frames" :to="{ name: 'frames' }" />
          </div>
        </div>

        <div class="col-12 col-md-5">
          <q-card flat class="spotlight-card q-pa-lg">
            <div class="text-subtitle1 text-weight-bold q-mb-sm">Destaque da semana</div>
            <div class="text-body2 text-grey-7 q-mb-md">
              Pacote Frames Pulse: mais visibilidade no feed vertical, badge de destaque e prioridade em descobertas.
            </div>
            <div class="text-h5 text-weight-bold text-primary q-mb-sm">R$ 79 / semana</div>
            <q-linear-progress rounded stripe size="10px" :value="0.74" color="primary" />
            <div class="text-caption text-grey-6 q-mt-sm">74% das criadoras ativas usam algum tipo de impulsionamento.</div>
          </q-card>
        </div>
      </q-card-section>
    </q-card>

    <div class="row q-col-gutter-md q-mb-md">
      <div v-for="offer in offers" :key="offer.title" class="col-12 col-md-4">
        <q-card flat bordered class="section-card offer-card full-height">
          <q-card-section>
            <div class="row items-center justify-between q-mb-sm">
              <q-icon :name="offer.icon" size="28px" color="primary" />
              <q-chip dense outline color="secondary">{{ offer.tag }}</q-chip>
            </div>
            <div class="text-subtitle1 text-weight-bold q-mb-xs">{{ offer.title }}</div>
            <div class="text-body2 text-grey-7 q-mb-md">{{ offer.description }}</div>
            <div class="text-h6 text-weight-bold q-mb-md">{{ offer.price }}</div>
            <q-btn color="primary" rounded unelevated class="full-width" label="Tenho interesse" @click="notifySoon(offer.title)" />
          </q-card-section>
        </q-card>
      </div>
    </div>

    <q-card flat bordered class="section-card q-pa-md">
      <div class="text-subtitle1 text-weight-bold q-mb-md">O que vem em seguida</div>
      <q-list separator>
        <q-item v-for="step in roadmap" :key="step.title">
          <q-item-section avatar>
            <q-avatar color="primary" text-color="white">{{ step.id }}</q-avatar>
          </q-item-section>
          <q-item-section>
            <q-item-label>{{ step.title }}</q-item-label>
            <q-item-label caption>{{ step.caption }}</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { useQuasar } from 'quasar';

const $q = useQuasar();

const offers = [
  {
    title: 'Frames Pulse',
    description: 'Mais exibicoes no feed vertical, destaque visual e empurrao inicial nas primeiras horas.',
    price: 'R$ 79 / semana',
    icon: 'theaters',
    tag: 'Mais vendido',
  },
  {
    title: 'Boost de anuncios',
    description: 'Suba para o topo dos resultados e aumente as visitas no perfil por cidade e interesse.',
    price: 'R$ 49 / campanha',
    icon: 'campaign',
    tag: 'Descoberta',
  },
  {
    title: 'Creator Pro',
    description: 'Conjunto com analytics, selo premium, vitrine na loja e prioridade para novos recursos.',
    price: 'R$ 129 / mes',
    icon: 'workspace_premium',
    tag: 'Assinatura',
  },
];

const roadmap = [
  { id: 1, title: 'Checkout nativo', caption: 'Compra de pacotes direto no app com ativacao instantanea.' },
  { id: 2, title: 'Bundles sazonais', caption: 'Campanhas prontas para datas especiais e horarios de pico.' },
  { id: 3, title: 'Analytics da loja', caption: 'Visualize retorno de cada compra em alcance, cliques e conversoes.' },
];

function notifySoon(item: string) {
  $q.notify({
    type: 'info',
    message: `${item} entra no checkout completo em breve.`,
    timeout: 2200,
    position: 'top',
  });
}
</script>

<style scoped lang="scss">
.store-page {
  background:
    radial-gradient(circle at top right, rgba(212, 20, 90, 0.1), transparent 24%),
    radial-gradient(circle at top left, rgba(251, 176, 59, 0.1), transparent 26%);
}

// hero-card already inherits from .section-card (app.scss) which uses var(--jobbie-card)
// No override needed — theme switches automatically.

.spotlight-card {
  border-radius: 24px;
  background: linear-gradient(160deg, rgba(212, 20, 90, 0.1) 0%, rgba(142, 45, 226, 0.1) 100%),
    var(--jobbie-card);
  border: 1px solid var(--jobbie-border);
}

.offer-card {
  transition: transform 160ms ease, box-shadow 160ms ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 14px 28px rgba(26, 19, 37, 0.08);
  }
}
</style>