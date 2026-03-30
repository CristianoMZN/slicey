<template>
  <div class="chat-voice" :class="isMine ? 'chat-voice--mine' : 'chat-voice--contact'">
    <!-- Avatar / ícone -->
    <div class="chat-voice__avatar">
      <q-avatar size="38px" :color="isMine ? 'pink-3' : 'grey-4'">
        <q-icon name="mic" size="20px" :color="isMine ? 'pink-9' : 'grey-7'" />
      </q-avatar>
    </div>

    <!-- Controles -->
    <div class="chat-voice__body">
      <div class="row items-center no-wrap q-gutter-xs">
        <!-- Play / Pause -->
        <q-btn
          round unelevated dense
          size="sm"
          :color="isMine ? 'pink-8' : 'grey-8'"
          :icon="isPlaying ? 'pause' : 'play_arrow'"
          @click="togglePlayback"
        />

        <!-- Barra de progresso (estilo waveform) -->
        <div class="chat-voice__track col">
          <q-slider
            :model-value="progressPercent"
            :min="0"
            :max="100"
            :step="0.1"
            dense
            :color="isMine ? 'pink-7' : 'primary'"
            track-color="grey-4"
            thumb-size="12px"
            @update:model-value="seek"
          />
          <!-- Linhas decorativas de waveform -->
          <div class="chat-voice__bars" aria-hidden="true">
            <span
              v-for="(h, i) in waveBars"
              :key="i"
              class="chat-voice__bar"
              :style="{ height: h + 'px', opacity: barFilled(i) ? 1 : 0.35 }"
            />
          </div>
        </div>

        <!-- Tempo -->
        <span class="text-caption chat-voice__time">{{ displayTime }}</span>
      </div>
    </div>

    <audio
      ref="audioEl"
      :src="src"
      preload="metadata"
      @timeupdate="onTimeUpdate"
      @loadedmetadata="onLoaded"
      @ended="onEnded"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';

const props = defineProps<{
  src: string;
  isMine?: boolean;
}>();

const audioEl = ref<HTMLAudioElement | null>(null);
const isPlaying = ref(false);
const currentTime = ref(0);
const duration = ref(0);

// Gera alturas pseudo-aleatórias baseadas no src (determinístico)
const waveBars = computed(() => {
  const seed = props.src.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return Array.from({ length: 28 }, (_, i) => {
    const v = Math.abs(Math.sin(seed * (i + 1) * 0.37)) * 14 + 4;
    return Math.round(v);
  });
});

const progressPercent = computed(() =>
  duration.value ? (currentTime.value / duration.value) * 100 : 0,
);

const displayTime = computed(() => {
  const t = isPlaying.value || currentTime.value > 0 ? currentTime.value : duration.value;
  return fmt(t);
});

function barFilled(i: number) {
  return i < (progressPercent.value / 100) * waveBars.value.length;
}

async function togglePlayback() {
  if (!audioEl.value) return;
  if (isPlaying.value) {
    audioEl.value.pause();
    isPlaying.value = false;
  } else {
    await audioEl.value.play();
    isPlaying.value = true;
  }
}

function seek(val: number | null) {
  if (!audioEl.value || val === null || !duration.value) return;
  audioEl.value.currentTime = (val / 100) * duration.value;
  currentTime.value = audioEl.value.currentTime;
}

function onTimeUpdate() {
  currentTime.value = audioEl.value?.currentTime ?? 0;
}

function onLoaded() {
  duration.value = audioEl.value?.duration ?? 0;
}

function onEnded() {
  isPlaying.value = false;
  currentTime.value = 0;
}

function fmt(s: number) {
  if (!Number.isFinite(s) || s <= 0) return '0:00';
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60).toString().padStart(2, '0');
  return `${m}:${sec}`;
}
</script>

<style scoped lang="scss">
.chat-voice {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 10px;
  border-radius: 18px;
  min-width: 220px;
  max-width: 320px;

  &--mine {
    background: rgba(212, 20, 90, 0.18);
  }

  &--contact {
    background: rgba(0, 0, 0, 0.06);
  }
}

.chat-voice__avatar {
  flex-shrink: 0;
}

.chat-voice__body {
  flex: 1;
  min-width: 0;
}

.chat-voice__track {
  position: relative;
  padding-bottom: 12px; // espaço para as barrinhas decorativas
}

// As barrinhas ficam abaixo do slider, só visuais
.chat-voice__bars {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: flex-end;
  gap: 2px;
  height: 14px;
  pointer-events: none;
}

.chat-voice__bar {
  flex: 1;
  border-radius: 2px;
  background: currentColor;
  transition: opacity 80ms;
}

.chat-voice__time {
  flex-shrink: 0;
  min-width: 32px;
  text-align: right;
  opacity: 0.75;
  font-variant-numeric: tabular-nums;
}
</style>
