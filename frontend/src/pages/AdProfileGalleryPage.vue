<template>
  <q-page class="page-shell q-px-md q-pt-md q-pb-xl">
    <q-card v-if="profile" flat bordered class="section-card q-pa-md q-mb-md">
      <div class="row items-center justify-between q-col-gutter-sm">
        <div class="col">
          <div class="text-overline page-kicker">Galeria completa</div>
          <h1 class="text-h5 q-my-xs text-weight-bold">Fotos de {{ profile.name }}</h1>
          <div class="text-body2 text-grey-6">
            {{ fullGalleryImages.length }} fotos disponiveis
          </div>
        </div>
        <div class="col-auto row q-gutter-sm">
          <q-btn
            flat
            rounded
            icon="arrow_back"
            label="Voltar ao perfil"
            :to="{ name: 'anuncio-detalhe', params: { id: profile.id } }"
          />
        </div>
      </div>
    </q-card>

    <q-card v-if="profile" flat bordered class="section-card q-pa-sm">
      <div class="row q-gutter-sm q-px-sm q-pt-sm q-pb-md">
        <q-chip
          clickable
          :outline="selectedFilter !== 'all'"
          color="primary"
          text-color="white"
          @click="selectFilter('all')"
        >
          Todas
        </q-chip>
        <q-chip
          clickable
          :outline="selectedFilter !== 'featured'"
          color="secondary"
          text-color="white"
          @click="selectFilter('featured')"
        >
          Destaques
        </q-chip>
        <q-chip
          clickable
          :outline="selectedFilter !== 'square'"
          color="accent"
          text-color="white"
          @click="selectFilter('square')"
        >
          Quadradas
        </q-chip>
      </div>

      <q-infinite-scroll @load="onLoad" :offset="200" :disable="allLoaded">
        <div class="gallery-grid">
          <q-img
            v-for="(image, index) in visibleGalleryImages"
            :key="`${image}-${index}`"
            :src="image"
            :alt="`Foto ${index + 1} de ${profile.name}`"
            :ratio="index % 8 === 0 ? 1 : 4 / 3"
            class="gallery-photo"
            @click="openImageViewer(index)"
          />
        </div>

        <template #loading>
          <div class="row justify-center q-my-md">
            <q-spinner-dots color="primary" size="30px" />
          </div>
        </template>
      </q-infinite-scroll>

      <div v-if="allLoaded" class="text-center text-caption text-grey-6 q-py-md">
        Voce visualizou todas as fotos desta selecao.
      </div>
    </q-card>

    <q-card v-else flat bordered class="section-card q-pa-lg text-center">
      <q-icon size="48px" name="person_off" color="warning" />
      <div class="text-h6 q-mt-sm">Perfil nao encontrado</div>
      <q-btn color="primary" rounded unelevated label="Voltar para anuncios" :to="{ name: 'anuncios' }" class="q-mt-md" />
    </q-card>

    <image-viewer-dialog
      v-model="imageViewerOpen"
      :images="filteredGalleryImages"
      :initial-index="activeImageIndex"
      :title="profile ? `Galeria de ${profile.name}` : 'Galeria'"
      @update:initialIndex="activeImageIndex = $event"
    />
  </q-page>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRoute } from 'vue-router';
import ImageViewerDialog from 'src/components/ImageViewerDialog.vue';
import { adProfilesDetails, portraitGalleryPool } from 'src/data/mock-content';

const route = useRoute();

const profileId = computed(() => Number.parseInt(route.params.id as string, 10));
const profile = computed(() => adProfilesDetails.find((item) => item.id === profileId.value));

const imageViewerOpen = ref(false);
const activeImageIndex = ref(0);
const selectedFilter = ref<'all' | 'featured' | 'square'>('all');
const visibleCount = ref(12);
const PAGE_SIZE = 12;

const fullGalleryImages = computed(() => {
  if (!profile.value) {
    return [];
  }

  const merged = Array.from(
    new Set([
      profile.value.coverImage,
      profile.value.profileImage,
      ...profile.value.images,
      ...profile.value.gallery,
      ...portraitGalleryPool,
    ]),
  );
  const fallbackImage = merged[0] ?? '';

  return Array.from(
    { length: 36 },
    (_, index) => merged[(index + profile.value!.id) % merged.length] ?? fallbackImage,
  );
});

const filteredGalleryImages = computed(() => {
  if (selectedFilter.value === 'all') {
    return fullGalleryImages.value;
  }

  if (selectedFilter.value === 'featured') {
    return fullGalleryImages.value.filter((_, index) => index % 5 === 0);
  }

  return fullGalleryImages.value.filter((_, index) => index % 8 === 0);
});

const visibleGalleryImages = computed(() => filteredGalleryImages.value.slice(0, visibleCount.value));
const allLoaded = computed(() => visibleCount.value >= filteredGalleryImages.value.length);

function selectFilter(filter: 'all' | 'featured' | 'square') {
  selectedFilter.value = filter;
  visibleCount.value = PAGE_SIZE;
}

async function onLoad(_index: number, done: () => void) {
  if (allLoaded.value) {
    done();
    return;
  }

  await new Promise<void>((resolve) => {
    setTimeout(() => resolve(), 420);
  });

  visibleCount.value = Math.min(visibleCount.value + PAGE_SIZE, filteredGalleryImages.value.length);
  done();
}

function openImageViewer(index: number) {
  activeImageIndex.value = index;
  imageViewerOpen.value = true;
}
</script>

<style scoped lang="scss">
.gallery-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
}

.gallery-photo {
  border-radius: 14px;
  overflow: hidden;
  cursor: zoom-in;
}

@media (min-width: 768px) {
  .gallery-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 12px;
  }
}

@media (min-width: 1280px) {
  .gallery-grid {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
}
</style>
