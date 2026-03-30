<template>
  <q-dialog
    :model-value="modelValue"
    maximized
    transition-show="fade"
    transition-hide="fade"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <q-card class="image-viewer-card">
      <q-card-section class="image-viewer-topbar row items-center justify-between">
        <div class="text-caption text-grey-4">
          {{ titleLabel }}
          <span v-if="resolvedImages.length > 1"> • {{ currentIndex + 1 }}/{{ resolvedImages.length }}</span>
        </div>
        <q-btn
          flat
          round
          dense
          icon="close"
          color="white"
          @click="emit('update:modelValue', false)"
        />
      </q-card-section>

      <q-card-section class="image-viewer-stage q-pa-none">
        <q-btn
          v-if="canNavigate"
          class="nav-btn nav-btn-left"
          round
          color="white"
          text-color="black"
          icon="chevron_left"
          @click="goPrev"
        />

        <q-img
          v-if="activeImage"
          :src="activeImage"
          :alt="alt"
          fit="contain"
          class="image-viewer-media"
          spinner-color="white"
        />

        <q-btn
          v-if="canNavigate"
          class="nav-btn nav-btn-right"
          round
          color="white"
          text-color="black"
          icon="chevron_right"
          @click="goNext"
        />
      </q-card-section>

      <q-card-section v-if="resolvedImages.length > 1" class="thumbs-wrap q-px-md q-pb-md">
        <div class="thumbs-track">
          <q-img
            v-for="(image, index) in resolvedImages"
            :key="`${image}-${index}`"
            :src="image"
            :ratio="1"
            class="thumb-item"
            :class="{ 'thumb-item--active': index === currentIndex }"
            @click="setIndex(index)"
          />
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue';

const props = withDefaults(
  defineProps<{
    modelValue: boolean;
    src?: string;
    images?: string[];
    initialIndex?: number;
    alt?: string;
    title?: string;
  }>(),
  {
    src: '',
    images: () => [],
    initialIndex: 0,
    alt: 'Imagem',
    title: 'Visualizador de imagem',
  },
);

const emit = defineEmits<{
  'update:modelValue': [value: boolean];
  'update:initialIndex': [value: number];
}>();

const internalIndex = ref(props.initialIndex);

const resolvedImages = computed(() => {
  if (props.images.length > 0) {
    return props.images;
  }

  return props.src ? [props.src] : [];
});

const currentIndex = computed({
  get: () => {
    const maxIndex = Math.max(0, resolvedImages.value.length - 1);
    return Math.min(Math.max(internalIndex.value, 0), maxIndex);
  },
  set: (next) => {
    const maxIndex = Math.max(0, resolvedImages.value.length - 1);
    const safeIndex = Math.min(Math.max(next, 0), maxIndex);
    internalIndex.value = safeIndex;
    emit('update:initialIndex', safeIndex);
  },
});

const activeImage = computed(() => resolvedImages.value[currentIndex.value] ?? '');
const canNavigate = computed(() => resolvedImages.value.length > 1);
const titleLabel = computed(() => props.title);

function goNext() {
  if (!canNavigate.value) {
    return;
  }

  currentIndex.value = (currentIndex.value + 1) % resolvedImages.value.length;
}

function goPrev() {
  if (!canNavigate.value) {
    return;
  }

  currentIndex.value = (currentIndex.value - 1 + resolvedImages.value.length) % resolvedImages.value.length;
}

function setIndex(index: number) {
  currentIndex.value = index;
}

function handleKeydown(event: KeyboardEvent) {
  if (!props.modelValue) {
    return;
  }

  if (event.key === 'ArrowRight') {
    goNext();
  }

  if (event.key === 'ArrowLeft') {
    goPrev();
  }
}

watch(
  () => props.modelValue,
  (opened) => {
    if (opened) {
      window.addEventListener('keydown', handleKeydown);
      return;
    }

    window.removeEventListener('keydown', handleKeydown);
  },
);

watch(
  () => props.initialIndex,
  (next) => {
    internalIndex.value = next;
  },
);

watch(
  () => resolvedImages.value.length,
  (length) => {
    if (length === 0) {
      internalIndex.value = 0;
      return;
    }

    if (internalIndex.value > length - 1) {
      internalIndex.value = length - 1;
    }
  },
);

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeydown);
});
</script>

<style scoped lang="scss">
.image-viewer-card {
  background: radial-gradient(circle at 20% 10%, rgba(255, 255, 255, 0.08), transparent 34%),
    #06070b;
}

.image-viewer-topbar {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: 2;
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0.55), transparent);
}

.image-viewer-stage {
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.image-viewer-media {
  width: 100%;
  height: 100%;
}

.nav-btn {
  position: absolute;
  z-index: 3;
  top: 50%;
  transform: translateY(-50%);
  opacity: 0.85;

  &:hover {
    opacity: 1;
  }
}

.nav-btn-left {
  left: 14px;
}

.nav-btn-right {
  right: 14px;
}

.thumbs-wrap {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 3;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.65), transparent);
}

.thumbs-track {
  display: flex;
  gap: 8px;
  overflow-x: auto;
  padding-bottom: 4px;
}

.thumb-item {
  width: 64px;
  min-width: 64px;
  border-radius: 10px;
  overflow: hidden;
  cursor: pointer;
  border: 2px solid transparent;
  opacity: 0.7;
  transition: opacity 0.2s ease, border-color 0.2s ease;
}

.thumb-item--active {
  opacity: 1;
  border-color: rgba(255, 255, 255, 0.95);
}

@media (max-width: 768px) {
  .nav-btn {
    width: 34px;
    height: 34px;
  }

  .thumb-item {
    width: 56px;
    min-width: 56px;
  }
}
</style>
