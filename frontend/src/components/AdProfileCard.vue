<template>
  <q-card flat bordered class="ad-profile-card">
    <q-carousel
      v-model="slide"
      animated
      swipeable
      infinite
      navigation
      height="280px"
      class="ad-carousel"
    >
      <q-carousel-slide
        v-for="(image, index) in profile.images"
        :key="image"
        :name="index"
        class="q-pa-none"
      >
        <q-img :src="image" class="fit" height="280px" />
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

    <q-card-section>
      <div class="row items-start justify-between q-col-gutter-sm">
        <div class="col">
          <div class="text-subtitle1 text-weight-bold">{{ profile.name }}</div>
          <div class="text-caption text-grey-6">{{ profile.city }}</div>
        </div>
        <div class="col-auto">
          <q-chip dense color="primary" text-color="white">{{ profile.badge }}</q-chip>
        </div>
      </div>

      <div class="text-body2 text-grey-6 q-mt-sm">{{ profile.bio }}</div>

      <div class="row items-center justify-between q-mt-md">
        <div class="text-subtitle2 text-weight-bold">{{ profile.hourlyRate }}</div>
        <q-btn
          color="primary"
          rounded
          unelevated
          label="Ver detalhes"
          icon="arrow_outward"
          @click="openDetails"
        />
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import type { AdProfile } from 'src/data/mock-content';

const props = defineProps<{
  profile: AdProfile;
}>();

const router = useRouter();
const slide = ref(0);

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
}

.ad-carousel {
  background: rgba(255, 255, 255, 0.04);
}
</style>
