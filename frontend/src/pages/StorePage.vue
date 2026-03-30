<template>
  <q-page class="store-page q-px-md q-pt-md q-pb-xl">

    <!-- ── HERO: J-GOLD ── -->
    <q-card flat bordered class="section-card hero-card q-mb-lg overflow-hidden">
      <q-card-section class="row items-center q-col-gutter-lg">
        <div class="col-12 col-md-7">
          <div class="text-overline page-kicker">Loja · J-Gold</div>
          <h1 class="text-h4 q-my-sm text-weight-bold">
            Impulsione seu conteúdo com <span class="text-gold">J-Golds</span>
          </h1>
          <p class="text-body1 text-grey-7 q-mb-md">
            J-Golds são a moeda da plataforma. Use para boostar frames, anunciar seu perfil, enviar presentes e muito mais.
          </p>
          <div class="row items-center q-gutter-xs q-mb-md">
            <q-icon name="monetization_on" color="gold-coin" size="20px" />
            <span class="text-body2 text-weight-medium">1 Real&nbsp;=&nbsp;<span class="text-gold text-weight-bold">100 J-Golds</span></span>
          </div>
          <q-btn color="primary" rounded unelevated label="Comprar J-Golds" icon="monetization_on" @click="scrollTo('buy-coins')" />
        </div>

        <div class="col-12 col-md-5">
          <div class="balance-card q-pa-lg">
            <div class="text-caption text-grey-6 text-uppercase q-mb-xs">Seu saldo atual</div>
            <div class="row items-center q-gutter-sm q-mb-md">
              <q-icon name="monetization_on" color="warning" size="32px" />
              <span class="text-h4 text-weight-bold text-gold">{{ balance.toLocaleString('pt-BR') }}</span>
              <span class="text-body2 text-grey-7 self-end q-pb-xs">J-Golds</span>
            </div>
            <q-separator color="grey-3" class="q-mb-md" />
            <div class="row q-gutter-sm">
              <q-btn dense rounded unelevated color="primary" label="Comprar" icon="add" class="col-grow" @click="scrollTo('buy-coins')" />
              <q-btn dense rounded outline color="positive" label="Sacar" icon="account_balance_wallet" class="col-grow" @click="scrollTo('withdraw')" />
            </div>
          </div>
        </div>
      </q-card-section>
    </q-card>

    <!-- ── COMPRAR MOEDAS ── -->
    <div id="buy-coins" class="q-mb-lg">
      <div class="section-title row items-center q-gutter-sm q-mb-md">
        <q-icon name="monetization_on" color="warning" size="24px" />
        <span class="text-h6 text-weight-bold">Comprar J-Golds</span>
      </div>
      <div class="row q-col-gutter-md">
        <div v-for="pack in coinPacks" :key="pack.brl" class="col-6 col-md-3">
          <q-card flat bordered :class="['section-card coin-card full-height', pack.highlight && 'coin-card--highlight']">
            <q-card-section class="column items-center text-center q-gutter-xs">
              <q-badge v-if="pack.badge" :color="pack.badgeColor || 'primary'" class="q-mb-xs">{{ pack.badge }}</q-badge>
              <q-icon name="monetization_on" :color="pack.highlight ? 'warning' : 'grey-5'" size="36px" />
              <div class="text-h5 text-weight-bold text-gold">{{ pack.gold.toLocaleString('pt-BR') }}</div>
              <div class="text-caption text-grey-6">J-Golds</div>
              <div class="text-h6 text-weight-bold q-mt-xs">R$&nbsp;{{ pack.brl }}</div>
              <q-btn
                rounded unelevated
                :color="pack.highlight ? 'primary' : 'grey-3'"
                :text-color="pack.highlight ? 'white' : 'dark'"
                label="Comprar"
                class="full-width q-mt-sm"
                @click="buyCoin(pack)"
              />
            </q-card-section>
          </q-card>
        </div>
      </div>
    </div>

    <!-- ── SERVIÇOS PARA CRIADORES ── -->
    <div class="q-mb-lg">
      <div class="section-title row items-center q-gutter-sm q-mb-md">
        <q-icon name="rocket_launch" color="primary" size="24px" />
        <span class="text-h6 text-weight-bold">Serviços para Criadores</span>
      </div>

      <!-- Frames Boot -->
      <div class="text-subtitle2 text-weight-bold text-grey-7 q-mb-sm row items-center q-gutter-xs">
        <q-icon name="theaters" size="18px" />
        <span>Boost de Frames</span>
      </div>
      <div class="row q-col-gutter-md q-mb-md">
        <div v-for="svc in frameBoosts" :key="svc.id" class="col-12 col-md-4">
          <q-card flat bordered class="section-card service-card full-height">
            <q-card-section>
              <div class="row items-start justify-between q-mb-sm">
                <q-icon name="bolt" size="28px" :color="svc.color" />
                <q-chip dense :color="svc.color" text-color="white" class="text-caption">{{ svc.scope }}</q-chip>
              </div>
              <div class="text-subtitle1 text-weight-bold q-mb-xs">{{ svc.title }}</div>
              <div class="text-body2 text-grey-7 q-mb-md">{{ svc.description }}</div>
              <div class="row items-center q-gutter-xs q-mb-md">
                <q-icon name="monetization_on" color="warning" size="18px" />
                <span class="text-h6 text-weight-bold text-gold">{{ svc.price.toLocaleString('pt-BR') }}</span>
                <span class="text-caption text-grey-6">J-Golds</span>
                <q-separator vertical class="q-mx-xs" />
                <span class="text-caption text-grey-6">≈ R$&nbsp;{{ (svc.price / 100).toFixed(0) }}</span>
              </div>
              <q-btn
                rounded unelevated
                :color="svc.color"
                label="Ativar boost"
                class="full-width"
                :disabled="balance < svc.price"
                @click="purchaseService(svc)"
              />
              <div v-if="balance < svc.price" class="text-caption text-negative q-mt-xs text-center">
                Saldo insuficiente
              </div>
            </q-card-section>
          </q-card>
        </div>
      </div>

      <!-- Anúncios -->
      <div class="text-subtitle2 text-weight-bold text-grey-7 q-mb-sm row items-center q-gutter-xs">
        <q-icon name="campaign" size="18px" />
        <span>Anúncios · Perfil entre os Frames</span>
      </div>
      <div class="row q-col-gutter-md q-mb-md">
        <div v-for="ad in adServices" :key="ad.id" class="col-12 col-md-6">
          <q-card flat bordered class="section-card service-card full-height">
            <q-card-section>
              <div class="row items-start justify-between q-mb-sm">
                <q-icon name="campaign" size="28px" color="secondary" />
                <q-badge v-if="ad.badge" :color="ad.badgeColor || 'positive'">{{ ad.badge }}</q-badge>
              </div>
              <div class="text-subtitle1 text-weight-bold q-mb-xs">{{ ad.title }}</div>
              <div class="text-body2 text-grey-7 q-mb-md">{{ ad.description }}</div>
              <div class="row items-center q-gutter-xs q-mb-md">
                <q-icon name="monetization_on" color="warning" size="18px" />
                <span class="text-h6 text-weight-bold text-gold">{{ ad.price.toLocaleString('pt-BR') }}</span>
                <span class="text-caption text-grey-6">J-Golds</span>
                <q-separator vertical class="q-mx-xs" />
                <span class="text-caption text-grey-6">≈ R$&nbsp;{{ (ad.price / 100).toFixed(0) }}</span>
                <q-chip v-if="ad.originalPrice" dense outline color="negative" class="text-caption q-ml-xs">
                  era {{ ad.originalPrice.toLocaleString('pt-BR') }}
                </q-chip>
              </div>
              <q-btn
                rounded unelevated
                color="secondary"
                label="Anunciar agora"
                class="full-width"
                :disabled="balance < ad.price"
                @click="purchaseService(ad)"
              />
              <div v-if="balance < ad.price" class="text-caption text-negative q-mt-xs text-center">
                Saldo insuficiente
              </div>
            </q-card-section>
          </q-card>
        </div>
      </div>
    </div>

    <!-- ── PRESENTES PARA USUÁRIOS ── -->
    <div class="q-mb-lg">
      <div class="section-title row items-center q-gutter-sm q-mb-md">
        <q-icon name="card_giftcard" color="pink" size="24px" />
        <span class="text-h6 text-weight-bold">Presentes</span>
        <q-chip dense outline color="pink" class="text-caption">Para usuários</q-chip>
      </div>
      <p class="text-body2 text-grey-7 q-mb-md">
        Envie presentes para as criadoras diretamente nas mensagens e nos comentários de cada postagem.
      </p>

      <div class="row q-col-gutter-md">
        <!-- Caixa de Presente -->
        <div class="col-12 col-md-6">
          <q-card flat bordered class="section-card gift-card full-height">
            <q-card-section>
              <div class="row items-center q-gutter-sm q-mb-sm">
                <q-icon name="redeem" size="32px" color="pink" />
                <div>
                  <div class="text-subtitle1 text-weight-bold">Caixa de Presente</div>
                  <div class="text-caption text-grey-6">A criadora clica para abrir e revelar sua mensagem e o valor</div>
                </div>
              </div>
              <q-separator class="q-my-md" />
              <div class="text-body2 text-grey-7 q-mb-md">Escolha o valor em J-Golds e escreva uma mensagem secreta. A caixa chega lacrada — a surpresa é parte do presente!</div>
              <div class="row q-col-gutter-sm q-mb-md">
                <div
                  v-for="g in giftAmounts"
                  :key="g"
                  class="col-auto"
                >
                  <q-btn
                    dense rounded
                    :outline="selectedGift !== g"
                    :unelevated="selectedGift === g"
                    :color="selectedGift === g ? 'pink' : 'grey-4'"
                    :text-color="selectedGift === g ? 'white' : 'dark'"
                    :label="`${g.toLocaleString('pt-BR')} ✦`"
                    @click="selectedGift = g"
                  />
                </div>
              </div>
              <q-input
                v-model="giftMessage"
                outlined dense rounded
                label="Sua mensagem secreta..."
                maxlength="120"
                class="q-mb-md"
              />
              <q-btn
                rounded unelevated
                color="pink"
                icon="redeem"
                label="Enviar caixa"
                class="full-width"
                :disabled="!selectedGift || balance < selectedGift"
                @click="sendGift"
              />
              <div v-if="selectedGift && balance < selectedGift" class="text-caption text-negative q-mt-xs text-center">
                Saldo insuficiente
              </div>
            </q-card-section>
          </q-card>
        </div>

        <!-- Comentário em Destaque -->
        <div class="col-12 col-md-6">
          <q-card flat bordered class="section-card highlight-card full-height">
            <q-card-section>
              <div class="row items-center q-gutter-sm q-mb-sm">
                <q-icon name="star" size="32px" color="warning" />
                <div>
                  <div class="text-subtitle1 text-weight-bold">Comentário em Destaque</div>
                  <div class="text-caption text-grey-6">Seu comentário aparece antes de todos, fixado no topo</div>
                </div>
              </div>
              <q-separator class="q-my-md" />
              <div class="text-body2 text-grey-7 q-mb-md">
                O comentário com o <strong>maior valor</strong> aparece primeiro e fixado no topo do post. Quanto mais J-Golds, maior a visibilidade!
              </div>
              <div class="row q-col-gutter-sm q-mb-md">
                <div v-for="h in highlightAmounts" :key="h" class="col-auto">
                  <q-btn
                    dense rounded
                    :outline="selectedHighlight !== h"
                    :unelevated="selectedHighlight === h"
                    :color="selectedHighlight === h ? 'warning' : 'grey-4'"
                    :text-color="selectedHighlight === h ? 'white' : 'dark'"
                    :label="`${h.toLocaleString('pt-BR')} ✦`"
                    @click="selectedHighlight = h"
                  />
                </div>
              </div>
              <div class="highlight-preview q-pa-md q-mb-md" v-if="selectedHighlight">
                <div class="row items-center q-gutter-xs q-mb-xs">
                  <q-icon name="star" color="warning" size="14px" />
                  <span class="text-caption text-weight-bold text-warning">Comentário em destaque</span>
                  <q-icon name="monetization_on" color="warning" size="12px" />
                  <span class="text-caption text-gold">{{ selectedHighlight?.toLocaleString('pt-BR') }} J-Golds</span>
                </div>
                <div class="text-body2">Seu comentário apareceria aqui, fixado antes de todos os outros.</div>
              </div>
              <q-btn
                rounded unelevated
                color="warning"
                text-color="dark"
                icon="star"
                label="Destacar comentário"
                class="full-width"
                :disabled="!selectedHighlight || balance < selectedHighlight"
                @click="purchaseHighlight"
              />
              <div v-if="selectedHighlight && balance < selectedHighlight" class="text-caption text-negative q-mt-xs text-center">
                Saldo insuficiente
              </div>
            </q-card-section>
          </q-card>
        </div>
      </div>
    </div>

    <!-- ── SAQUE ── -->
    <div id="withdraw" class="q-mb-lg">
      <div class="section-title row items-center q-gutter-sm q-mb-md">
        <q-icon name="account_balance_wallet" color="positive" size="24px" />
        <span class="text-h6 text-weight-bold">Saque</span>
        <q-chip dense outline color="positive" class="text-caption">Para criadores</q-chip>
      </div>

      <q-card flat bordered class="section-card withdraw-card">
        <q-card-section class="row q-col-gutter-lg items-start">
          <div class="col-12 col-md-6">
            <div class="text-subtitle1 text-weight-bold q-mb-xs">Transforme J-Golds em dinheiro</div>
            <div class="text-body2 text-grey-7 q-mb-md">
              Converta seus J-Golds acumulados em saldo na sua conta bancária. Uma taxa de <strong>20%</strong> é cobrada sobre o valor sacado.
            </div>

            <div class="withdraw-info-row q-mb-md">
              <div class="withdraw-info-item">
                <q-icon name="monetization_on" color="warning" size="20px" />
                <div>
                  <div class="text-caption text-grey-6">Conversão base</div>
                  <div class="text-body2 text-weight-bold">100 J-Golds = R$ 1,00</div>
                </div>
              </div>
              <div class="withdraw-info-item">
                <q-icon name="percent" color="negative" size="20px" />
                <div>
                  <div class="text-caption text-grey-6">Taxa da plataforma</div>
                  <div class="text-body2 text-weight-bold text-negative">20%</div>
                </div>
              </div>
              <div class="withdraw-info-item">
                <q-icon name="savings" color="positive" size="20px" />
                <div>
                  <div class="text-caption text-grey-6">Você recebe</div>
                  <div class="text-body2 text-weight-bold text-positive">R$ 0,80 por 100 J-Golds</div>
                </div>
              </div>
            </div>

            <q-input
              v-model.number="withdrawAmount"
              outlined dense rounded
              type="number"
              label="Quantidade de J-Golds para sacar"
              suffix="J-Golds"
              :hint="withdrawAmount > 0 ? `Você receberá R$ ${withdrawNet.toFixed(2)}` : ''"
              class="q-mb-md"
            >
              <template #prepend>
                <q-icon name="monetization_on" color="warning" />
              </template>
            </q-input>

            <q-btn
              rounded unelevated
              color="positive"
              icon="account_balance_wallet"
              label="Solicitar saque"
              :disabled="withdrawAmount <= 0 || withdrawAmount > balance"
              @click="requestWithdraw"
            />
            <div v-if="withdrawAmount > balance" class="text-caption text-negative q-mt-xs">
              Você não possui J-Golds suficientes.
            </div>
          </div>

          <div class="col-12 col-md-6">
            <q-card flat class="withdraw-example-card q-pa-lg">
              <div class="text-subtitle2 text-weight-bold q-mb-md">Exemplo de cálculo</div>
              <q-list dense>
                <q-item v-for="ex in withdrawExamples" :key="ex.gold">
                  <q-item-section avatar>
                    <q-icon name="monetization_on" color="warning" size="18px" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>{{ ex.gold.toLocaleString('pt-BR') }} J-Golds</q-item-label>
                    <q-item-label caption>Bruto: R$ {{ ex.gross.toFixed(2) }} · Taxa: R$ {{ ex.fee.toFixed(2) }}</q-item-label>
                  </q-item-section>
                  <q-item-section side>
                    <span class="text-positive text-weight-bold">R$ {{ ex.net.toFixed(2) }}</span>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-card>
          </div>
        </q-card-section>
      </q-card>
    </div>

  </q-page>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useQuasar } from 'quasar';

const $q = useQuasar();

// Saldo simulado do usuário
const balance = ref(5000);

// ── MOEDAS ──
const coinPacks = [
  { brl: 10,  gold: 1_000, badge: null,        badgeColor: '',         highlight: false },
  { brl: 30,  gold: 3_000, badge: 'Popular',   badgeColor: 'primary',  highlight: false },
  { brl: 50,  gold: 5_000, badge: 'Mais valor', badgeColor: 'secondary', highlight: true },
  { brl: 100, gold: 10_000, badge: '+500 bônus', badgeColor: 'positive', highlight: false },
];

function buyCoin(pack: typeof coinPacks[number]) {
  $q.notify({ type: 'positive', message: `Compra de ${pack.gold.toLocaleString('pt-BR')} J-Golds iniciada (R$ ${pack.brl})`, position: 'top' });
}

// ── SERVIÇOS CRIADORES ──
interface Service {
  id: string;
  title: string;
  description: string;
  price: number;
  originalPrice?: number;
  scope?: string;
  color?: string;
  badge?: string;
  badgeColor?: string;
}

const frameBoosts: Service[] = [
  {
    id: 'local-30',
    title: 'Local Boot · 30 min',
    description: 'Faça o seu frame viralizar na sua cidade e região pelo período de 30 minutos.',
    price: 3_000,
    scope: 'Local',
    color: 'teal',
  },
  {
    id: 'local-60',
    title: 'Local Boot · 60 min',
    description: 'Faça o seu frame viralizar na sua cidade e região pelo período de 60 minutos.',
    price: 4_000,
    scope: 'Local',
    color: 'teal',
  },
  {
    id: 'nacional-60',
    title: 'Nacional Boot · 60 min',
    description: 'Faça seu frame explodir e ficar nacionalmente viralizado por 60 minutos.',
    price: 10_000,
    scope: 'Nacional',
    color: 'primary',
  },
];

const adServices: Service[] = [
  {
    id: 'ad-60min',
    title: 'Destaque · 60 minutos',
    description: 'Seu perfil aparece em destaque entre os frames no feed por 60 minutos.',
    price: 1_000,
    scope: '60 min',
    color: 'secondary',
  },
  {
    id: 'ad-24h',
    title: 'Destaque · 24 horas',
    description: 'Seu perfil aparece em destaque entre os frames no feed por 24 horas inteiras.',
    price: 12_000,
    originalPrice: 24_000,
    badge: '50% OFF',
    badgeColor: 'positive',
    scope: '24 h',
    color: 'secondary',
  },
];

function purchaseService(svc: Service) {
  if (balance.value < svc.price) return;
  balance.value -= svc.price;
  $q.notify({ type: 'positive', message: `✔ "${svc.title}" ativado com sucesso!`, position: 'top' });
}

// ── PRESENTES ──
const giftAmounts = [100, 500, 1_000, 5_000, 10_000];
const selectedGift = ref<number | null>(null);
const giftMessage = ref('');

function sendGift() {
  if (!selectedGift.value || balance.value < selectedGift.value) return;
  balance.value -= selectedGift.value;
  $q.notify({ type: 'positive', message: `🎁 Caixa de presente enviada! (${selectedGift.value.toLocaleString('pt-BR')} J-Golds)`, position: 'top' });
  selectedGift.value = null;
  giftMessage.value = '';
}

// ── COMENTÁRIO DESTACADO ──
const highlightAmounts = [500, 1_000, 2_500, 5_000];
const selectedHighlight = ref<number | null>(null);

function purchaseHighlight() {
  if (!selectedHighlight.value || balance.value < selectedHighlight.value) return;
  balance.value -= selectedHighlight.value;
  $q.notify({ type: 'positive', message: `⭐ Comentário destacado com ${selectedHighlight.value.toLocaleString('pt-BR')} J-Golds!`, position: 'top' });
  selectedHighlight.value = null;
}

// ── SAQUE ──
const withdrawAmount = ref(0);
const withdrawNet = computed(() => (withdrawAmount.value / 100) * 0.8);

const withdrawExamples = [
  { gold: 1_000,  gross: 10,  fee: 2,   net: 8   },
  { gold: 5_000,  gross: 50,  fee: 10,  net: 40  },
  { gold: 10_000, gross: 100, fee: 20,  net: 80  },
  { gold: 50_000, gross: 500, fee: 100, net: 400 },
];

function requestWithdraw() {
  if (withdrawAmount.value <= 0 || withdrawAmount.value > balance.value) return;
  const net = withdrawNet.value.toFixed(2);
  balance.value -= withdrawAmount.value;
  withdrawAmount.value = 0;
  $q.notify({ type: 'positive', message: `Saque de R$ ${net} solicitado com sucesso!`, position: 'top', timeout: 3000 });
}

function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
}
</script>

<style scoped lang="scss">
.store-page {
  background:
    radial-gradient(circle at top right, rgba(212, 20, 90, 0.08), transparent 30%),
    radial-gradient(circle at bottom left, rgba(251, 176, 59, 0.08), transparent 30%);
}

.text-gold {
  color: #f5a623;
}

.section-title {
  border-left: 4px solid var(--q-primary);
  padding-left: 12px;
}

// ── Balance card ──
.balance-card {
  border-radius: 20px;
  background: linear-gradient(135deg, rgba(245, 166, 35, 0.12) 0%, rgba(142, 45, 226, 0.1) 100%),
    var(--jobbie-card, #fff);
  border: 1px solid rgba(245, 166, 35, 0.3);
}

// ── Coin cards ──
.coin-card {
  transition: transform 160ms ease, box-shadow 160ms ease;
  text-align: center;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 10px 24px rgba(0, 0, 0, 0.08);
  }

  &--highlight {
    border: 2px solid #f5a623 !important;
    background: linear-gradient(160deg, rgba(245, 166, 35, 0.08) 0%, transparent 100%),
      var(--jobbie-card, #fff);
  }
}

// ── Service cards ──
.service-card {
  transition: transform 160ms ease, box-shadow 160ms ease;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.07);
  }
}

// ── Gift card ──
.gift-card {
  border: 1px solid rgba(233, 30, 99, 0.25) !important;
}

// ── Highlight preview ──
.highlight-card {
  border: 1px solid rgba(251, 176, 59, 0.25) !important;
}

.highlight-preview {
  background: linear-gradient(135deg, rgba(251, 176, 59, 0.1) 0%, transparent 100%);
  border-radius: 12px;
  border: 1px dashed rgba(251, 176, 59, 0.4);
}

// ── Withdraw ──
.withdraw-card {
  border: 1px solid rgba(33, 186, 114, 0.2) !important;
}

.withdraw-example-card {
  border-radius: 20px;
  background: linear-gradient(135deg, rgba(33, 186, 114, 0.08) 0%, transparent 100%),
    var(--jobbie-card, #fff);
  border: 1px solid rgba(33, 186, 114, 0.25);
}

.withdraw-info-row {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.withdraw-info-item {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  flex: 1;
  min-width: 120px;
}
</style>