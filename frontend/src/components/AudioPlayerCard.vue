<template>
  <q-card flat bordered class="audio-player-card">
    <q-card-section class="row items-center q-col-gutter-md">
      <div class="col-auto">
        <q-img :src="coverImage" width="82px" height="82px" class="rounded-borders" />
      </div>
      <div class="col">
        <div class="text-subtitle2 text-weight-bold">{{ title }}</div>
        <div class="text-caption text-grey-6">{{ subtitle }}</div>
        <div class="row items-center q-col-gutter-sm q-mt-sm">
          <div class="col-auto">
            <q-btn
              color="primary"
              round
              unelevated
              :icon="isPlaying ? 'pause' : 'play_arrow'"
              @click="togglePlayback"
            />
          </div>
          <div class="col">
            <q-slider
              :model-value="progressPercent"
              color="primary"
              track-color="grey-5"
              thumb-size="16px"
              @update:model-value="seekAudio"
            />
          </div>
        </div>
        <div class="row justify-between text-caption text-grey-6">
          <span>{{ formatTime(currentTime) }}</span>
          <span>{{ formatTime(duration) }}</span>
        </div>
      </div>
    </q-card-section>

    <audio
      ref="audioElement"
      :src="src"
      preload="metadata"
      @timeupdate="syncProgress"
      @loadedmetadata="syncDuration"
      @ended="handleEnded"
    />
  </q-card>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';

defineProps<{
  src: string;
  title: string;
  subtitle: string;
  coverImage: string;
}>();

const audioElement = ref<HTMLAudioElement | null>(null);
const isPlaying = ref(false);
const currentTime = ref(0);
const duration = ref(0);

const progressPercent = computed(() => {
  if (!duration.value) {
    return 0;
  }

  return (currentTime.value / duration.value) * 100;
});

async function togglePlayback() {
  if (!audioElement.value) {
    return;
  }

  if (isPlaying.value) {
    audioElement.value.pause();
    isPlaying.value = false;
    return;
  }

  await audioElement.value.play();
  isPlaying.value = true;
}

function syncProgress() {
  currentTime.value = audioElement.value?.currentTime ?? 0;
}

function syncDuration() {
  duration.value = audioElement.value?.duration ?? 0;
}

function seekAudio(nextPercent: number | null) {
  if (!audioElement.value || nextPercent === null || !duration.value) {
    return;
  }

  audioElement.value.currentTime = (nextPercent / 100) * duration.value;
  currentTime.value = audioElement.value.currentTime;
}

function handleEnded() {
  isPlaying.value = false;
  currentTime.value = 0;
}

function formatTime(value: number) {
  if (!Number.isFinite(value) || value <= 0) {
    return '0:00';
  }

  const minutes = Math.floor(value / 60);
  const seconds = Math.floor(value % 60)
    .toString()
    .padStart(2, '0');

  return `${minutes}:${seconds}`;
}
</script>

<style scoped lang="scss">
.audio-player-card {
  background: rgba(255, 255, 255, 0.04);
}

:global(body.body--light) .audio-player-card {
  background: rgba(212, 20, 90, 0.04);
}
</style>
