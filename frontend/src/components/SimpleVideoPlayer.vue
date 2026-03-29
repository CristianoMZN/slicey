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

    <div v-if="!isPlaying" class="video-overlay">
      <q-icon name="play_circle" size="58px" color="white" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

defineProps<{
  src: string;
  poster: string;
}>();

const videoElement = ref<HTMLVideoElement | null>(null);
const isPlaying = ref(false);
const isMuted = ref(true);

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

.video-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(180deg, rgba(10, 6, 16, 0.04), rgba(10, 6, 16, 0.28));
}
</style>
