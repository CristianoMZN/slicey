<template>
  <q-card flat bordered class="ad-profile-card">
    <q-carousel
      v-model="slide"
      animated
      swipeable
      infinite
      navigation
      height="360px"
      class="ad-carousel"
    >
      <q-carousel-slide
        v-for="(image, index) in profile.images"
        :key="image"
        :name="index"
        class="q-pa-none"
      >
        <q-img :src="image" class="fit" height="360px" />
      </q-carousel-slide>

      <template #control>
        <q-carousel-control position="left" :offset="[12, 0]">
          <q-btn round flat color="white" icon="chevron_left" @click="goPrevious" />
        </q-carousel-control>
        <q-carousel-control position="right" :offset="[12, 0]">
          <q-btn round flat color="white" icon="chevron_right" @click="goNext" />
        </q-carousel-control>
      </template>
    </q-carousel>

    <div class="card-overlay" />

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
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import type { AdProfile, AdProfileBadge } from 'src/data/mock-content';

const props = defineProps<{
  profile: AdProfile;
}>();

const router = useRouter();
const slide = ref(0);

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
const profileBadges = computed(() => (props.profile.badges ?? []).map((badge) => ({ key: badge, ...badgeMap[badge] })));

function goPrevious() {
  slide.value = slide.value === 0 ? props.profile.images.length - 1 : slide.value - 1;
}

function goNext() {
  slide.value = (slide.value + 1) % props.profile.images.length;
}

function openDetails() {
  void router.push({ name: 'anuncio-detalhe', params: { id: props.profile.id.toString() } });
}
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

.card-overlay {
  position: absolute;
  inset: 0;
  z-index: 1;
  background:
    linear-gradient(to top, rgba(6, 7, 12, 0.92) 0%, rgba(6, 7, 12, 0.56) 34%, rgba(6, 7, 12, 0.12) 66%),
    linear-gradient(to right, rgba(0, 0, 0, 0.28), transparent 45%);
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
</style>
