<template>
  <q-card flat bordered class="ad-profile-card">
    <q-carousel
      v-model="slide"
      animated
      swipeable
      infinite
      height="100%"
      class="ad-carousel ad-carousel--bg"
    >
      <q-carousel-slide
        v-for="(image, index) in profile.images"
        :key="image"
        :name="index"
        class="q-pa-none carousel-slide"
      >
        <q-img :src="image" class="fit carousel-image" height="100%" />
      </q-carousel-slide>
    </q-carousel>

    <div class="card-overlay" />

    <div class="desktop-carousel-controls">
      <q-btn round flat color="white" icon="chevron_left" @click="goPrevious" />
      <q-btn round flat color="white" icon="chevron_right" @click="goNext" />
    </div>

    <q-card-section class="card-content">
      <div class="row items-start justify-between q-col-gutter-sm no-wrap">
        <div class="col">
          <div class="text-subtitle1 text-weight-bold text-white">{{ profile.name }}</div>
          <div class="text-caption text-grey-3">{{ cityAndState }}</div>
        </div>
        <q-btn
          color="primary"
          rounded
          unelevated
          dense
          label="Ver detalhes"
          icon="arrow_outward"
          @click="openDetails"
        />
      </div>

      <div class="row items-center q-gutter-xs q-mt-sm">
        <q-chip dense color="grey-9" text-color="white" icon="cake">{{ ageLabel }}</q-chip>
        <q-chip dense :color="profile.hasLocal ? 'positive' : 'orange-9'" text-color="white" icon="place">
          {{ localLabel }}
        </q-chip>
      </div>

      <div class="row q-gutter-xs q-mt-sm wrap">
        <q-chip
          v-for="badge in profileBadges"
          :key="badge.key"
          dense
          :color="badge.color"
          text-color="white"
          :icon="badge.icon"
          class="badge-chip"
        >
          {{ badge.label }}
        </q-chip>
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import type { AdProfile, AdProfileBadge } from 'src/data/mock-content';

const props = defineProps<{
  profile: AdProfile;
}>();

const router = useRouter();
const slide = ref(0);
let autoSwipeTimer: ReturnType<typeof setInterval> | null = null;
const badgePriority: Record<AdProfileBadge, number> = {
  'top-rated-10': 1,
  'verified-account': 2,
  'leaving-soon': 3,
  'new-profile': 4,
};

const badgeMap: Record<AdProfileBadge, { label: string; icon: string; color: string }> = {
  'verified-account': {
    label: 'Conta verificada',
    icon: 'verified',
    color: 'teal-8',
  },
  'leaving-soon': {
    label: 'Pouco tempo na cidade',
    icon: 'schedule',
    color: 'orange-9',
  },
  'new-profile': {
    label: 'Perfil novo',
    icon: 'new_releases',
    color: 'blue-8',
  },
  'top-rated-10': {
    label: 'Melhor rate (ultimas 10)',
    icon: 'military_tech',
    color: 'deep-purple-7',
  },
};

const cityAndState = computed(() =>
  props.profile.state ? `${props.profile.city} / ${props.profile.state}` : props.profile.city,
);

const ageLabel = computed(() => (props.profile.age ? `${props.profile.age} anos` : 'Idade nao informada'));
const localLabel = computed(() => (props.profile.hasLocal ? 'Com local' : 'Sem local'));
const profileBadges = computed(() =>
  [...(props.profile.badges ?? [])]
    .sort((a, b) => badgePriority[a] - badgePriority[b])
    .map((badge) => {
      const base = badgeMap[badge];
      if (badge !== 'leaving-soon') {
        return { key: badge, ...base };
      }

      const days = props.profile.leavingInDays;
      const countdown = typeof days === 'number' && days > 0 ? ` (em ${days}d)` : '';
      return {
        key: badge,
        ...base,
        label: `${base.label}${countdown}`,
      };
    }),
);

function goPrevious() {
  slide.value = slide.value === 0 ? props.profile.images.length - 1 : slide.value - 1;
  restartAutoSwipe();
}

function goNext() {
  slide.value = (slide.value + 1) % props.profile.images.length;
  restartAutoSwipe();
}

function autoSwipeNext() {
  slide.value = (slide.value + 1) % props.profile.images.length;
}

function startAutoSwipe() {
  if (autoSwipeTimer) return;
  autoSwipeTimer = setInterval(() => {
    autoSwipeNext();
  }, 20000);
}

function stopAutoSwipe() {
  if (!autoSwipeTimer) return;
  clearInterval(autoSwipeTimer);
  autoSwipeTimer = null;
}

function restartAutoSwipe() {
  stopAutoSwipe();
  startAutoSwipe();
}

function openDetails() {
  void router.push({ name: 'anuncio-detalhe', params: { id: props.profile.id.toString() } });
}

onMounted(() => {
  startAutoSwipe();
});

onBeforeUnmount(() => {
  stopAutoSwipe();
});
</script>

<style scoped lang="scss">
.ad-profile-card {
  overflow: hidden;
  position: relative;
  min-height: 360px;
  border-radius: 18px;
}

.ad-carousel {
  background: rgba(255, 255, 255, 0.04);
}

.ad-carousel--bg {
  position: absolute;
  inset: 0;
  z-index: 0;
}

.carousel-slide,
.carousel-image {
  height: 100%;
}

.card-overlay {
  position: absolute;
  inset: 0;
  z-index: 1;
  background:
    linear-gradient(to top, rgba(6, 7, 12, 0.92) 0%, rgba(6, 7, 12, 0.56) 34%, rgba(6, 7, 12, 0.12) 66%),
    linear-gradient(to right, rgba(0, 0, 0, 0.28), transparent 45%);
}

.desktop-carousel-controls {
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 3;
  display: flex;
  align-items: center;
  gap: 4px;
  background: rgba(10, 12, 18, 0.35);
  border-radius: 999px;
  backdrop-filter: blur(3px);
}

.card-content {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 2;
}

.badge-chip {
  backdrop-filter: blur(2px);
}

:deep(.q-carousel__slides-container) {
  transition-timing-function: cubic-bezier(0.12, 0.88, 0.28, 1) !important;
  transition-duration: 920ms !important;
}

@media (max-width: 768px) {
  .desktop-carousel-controls {
    display: none;
  }
}
</style>
