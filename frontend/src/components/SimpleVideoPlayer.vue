<template>
  <div class="video-shell" @click="togglePlayback">
    <video
      ref="videoElement"
      class="video-element"
      :src="src"
      :poster="poster"
      playsinline
      loop
      :muted="isMuted"
      preload="metadata"
      @play="isPlaying = true"
      @pause="isPlaying = false"
    />

    <q-btn
      class="video-audio-toggle"
      round
      unelevated
      color="dark"
      text-color="white"
      :icon="isMuted ? 'volume_off' : 'volume_up'"
      @click.stop="toggleMute"
    />

    <q-btn
      class="video-fullscreen-toggle"
      round
      unelevated
      color="dark"
      text-color="white"
      :icon="isFullscreen ? 'fullscreen_exit' : 'fullscreen'"
      @click.stop="toggleFullscreen"
    />

    <div v-if="!isPlaying" class="video-overlay">
      <q-icon name="play_circle" size="58px" color="white" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue';

defineProps<{
  src: string;
  poster: string;
}>();

const videoElement = ref<HTMLVideoElement | null>(null);
const isPlaying = ref(false);
const isMuted = ref(true);
const isFullscreen = ref(false);

type FullscreenCapableVideo = HTMLVideoElement & {
  webkitEnterFullscreen?: () => void;
};

async function togglePlayback() {
  if (!videoElement.value) {
    return;
  }

  if (isPlaying.value) {
    videoElement.value.pause();
    return;
  }

  await videoElement.value.play();
}

function toggleMute() {
  isMuted.value = !isMuted.value;

  if (videoElement.value) {
    videoElement.value.muted = isMuted.value;
  }
}

async function toggleFullscreen() {
  const video = videoElement.value as FullscreenCapableVideo | null;
  if (!video) {
    return;
  }

  if (document.fullscreenElement) {
    await document.exitFullscreen();
    return;
  }

  if (video.requestFullscreen) {
    await video.requestFullscreen();
    return;
  }

  if (typeof video.webkitEnterFullscreen === 'function') {
    video.webkitEnterFullscreen();
  }
}

function syncFullscreenState() {
  isFullscreen.value = Boolean(document.fullscreenElement);
}

onMounted(() => {
  document.addEventListener('fullscreenchange', syncFullscreenState);
});

onBeforeUnmount(() => {
  document.removeEventListener('fullscreenchange', syncFullscreenState);
});
</script>

<style scoped lang="scss">
.video-shell {
  position: relative;
  overflow: hidden;
  border-radius: 18px;
  background: rgba(0, 0, 0, 0.16);
  cursor: pointer;
}

.video-element {
  display: block;
  width: 100%;
  aspect-ratio: 16 / 9;
  object-fit: cover;
}

.video-audio-toggle {
  position: absolute;
  top: 12px;
  right: 12px;
  z-index: 2;
  background: rgba(20, 10, 32, 0.72) !important;
}

.video-fullscreen-toggle {
  position: absolute;
  top: 12px;
  right: 58px;
  z-index: 2;
  background: rgba(20, 10, 32, 0.72) !important;
}

.video-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(180deg, rgba(10, 6, 16, 0.04), rgba(10, 6, 16, 0.28));
}
</style>
