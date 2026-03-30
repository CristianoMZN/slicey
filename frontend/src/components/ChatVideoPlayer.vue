<template>
  <div class="chat-video" @click="togglePlayback">
    <video
      ref="videoEl"
      class="chat-video__el"
      :src="src"
      playsinline
      preload="metadata"
      @play="isPlaying = true"
      @pause="isPlaying = false"
      @timeupdate="onTimeUpdate"
      @loadedmetadata="onLoaded"
      @ended="onEnded"
    />

    <!-- Overlay de play/pause no centro -->
    <transition name="fade">
      <div v-if="!isPlaying" class="chat-video__play-overlay">
        <q-icon name="play_circle_filled" size="52px" color="white" />
      </div>
    </transition>

    <!-- Barra inferior: seek + tempo + mute -->
    <div class="chat-video__bar" @click.stop>
      <q-slider
        :model-value="progressPercent"
        :min="0" :max="100" :step="0.1"
        dense color="white" track-color="grey-6"
        thumb-size="10px"
        class="chat-video__seek"
        @update:model-value="seek"
      />
      <div class="row items-center justify-between q-px-xs">
        <span class="text-caption text-white chat-video__time">
          {{ fmt(currentTime) }} / {{ fmt(duration) }}
        </span>
        <q-btn
          flat round dense size="xs"
          text-color="white"
          :icon="isMuted ? 'volume_off' : 'volume_up'"
          @click="toggleMute"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';

defineProps<{ src: string }>();

const videoEl = ref<HTMLVideoElement | null>(null);
const isPlaying = ref(false);
const isMuted = ref(false);
const currentTime = ref(0);
const duration = ref(0);

const progressPercent = computed(() =>
  duration.value ? (currentTime.value / duration.value) * 100 : 0,
);

async function togglePlayback() {
  if (!videoEl.value) return;
  if (isPlaying.value) {
    videoEl.value.pause();
  } else {
    await videoEl.value.play();
  }
}

function toggleMute() {
  isMuted.value = !isMuted.value;
  if (videoEl.value) videoEl.value.muted = isMuted.value;
}

function seek(val: number | null) {
  if (!videoEl.value || val === null || !duration.value) return;
  videoEl.value.currentTime = (val / 100) * duration.value;
  currentTime.value = videoEl.value.currentTime;
}

function onTimeUpdate() { currentTime.value = videoEl.value?.currentTime ?? 0; }
function onLoaded()     { duration.value = videoEl.value?.duration ?? 0; }
function onEnded()      { isPlaying.value = false; currentTime.value = 0; }

function fmt(s: number) {
  if (!Number.isFinite(s) || s <= 0) return '0:00';
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60).toString().padStart(2, '0');
  return `${m}:${sec}`;
}
</script>

<style scoped lang="scss">
.chat-video {
  position: relative;
  border-radius: 14px;
  overflow: hidden;
  cursor: pointer;
  background: #000;
  width: 100%;
  max-width: 300px;
}

.chat-video__el {
  display: block;
  width: 100%;
  aspect-ratio: 16 / 9;
  object-fit: cover;
}

.chat-video__play-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.28);
}

.chat-video__bar {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 4px 6px 2px;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.6));
}

.chat-video__seek {
  margin: 0 2px;
}

.chat-video__time {
  font-variant-numeric: tabular-nums;
  font-size: 10px;
  opacity: 0.9;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 150ms;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
