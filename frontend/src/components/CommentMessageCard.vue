<template>
  <q-item class="q-px-none" :class="rootClass">
    <q-item-section avatar top>
      <q-avatar :color="avatarColor" text-color="white">
        {{ comment.author.charAt(0) }}
      </q-avatar>
    </q-item-section>

    <q-item-section>
      <div class="row items-center q-gutter-sm">
        <q-item-label class="text-weight-bold">{{ comment.author }}</q-item-label>
        <q-badge
          v-if="comment.superComment"
          class="super-badge"
          :class="`super-badge--${comment.superComment.temperature}`"
          rounded
        >
          <q-icon name="bolt" size="12px" class="q-mr-xs" />
          SUPER {{ comment.superComment.amount.toLocaleString('pt-BR') }} J-GOLD
        </q-badge>
      </div>

      <q-item-label caption class="text-grey-6">{{ comment.timeAgo }}</q-item-label>

      <div class="comment-body q-mt-xs" :class="bodyClass">
        <div v-if="isBlaze" class="ember-layer" aria-hidden="true">
          <span
            v-for="n in 10"
            :key="`ember-${comment.id}-${n}`"
            class="ember"
            :style="{
              left: `${(n - 1) * 9 + (n % 2 ? 2 : 0)}%`,
              animationDelay: `${(n - 1) * 0.24}s`,
              animationDuration: `${3 + (n % 4) * 0.35}s`,
            }"
          />
        </div>

        <div class="comment-content">
          <div v-if="comment.superComment" class="text-caption text-weight-medium q-mb-xs">
            Temperatura: {{ temperatureLabel }}
          </div>
          {{ comment.body }}
        </div>
      </div>
    </q-item-section>
  </q-item>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { commentTemperatureLabelMap, type FeedComment } from 'src/data/mock-content';

const props = defineProps<{
  comment: FeedComment;
}>();

const temperature = computed(() => props.comment.superComment?.temperature);
const isBlaze = computed(() => temperature.value === 'blaze');

const temperatureLabel = computed(() => {
  if (!temperature.value) {
    return 'Normal';
  }

  return commentTemperatureLabelMap[temperature.value];
});

const rootClass = computed(() => {
  if (!temperature.value) {
    return '';
  }

  return `comment-row--${temperature.value}`;
});

const bodyClass = computed(() => {
  if (!temperature.value) {
    return '';
  }

  const fireClass = temperature.value === 'hot' || temperature.value === 'blaze' ? 'comment-body--fire' : '';
  return `comment-body--${temperature.value} ${fireClass}`.trim();
});

const avatarColor = computed(() => {
  if (!temperature.value) {
    return 'secondary';
  }

  if (temperature.value === 'cold') {
    return 'blue-7';
  }

  if (temperature.value === 'warm') {
    return 'amber-8';
  }

  if (temperature.value === 'hot') {
    return 'deep-orange-8';
  }

  return 'red-8';
});
</script>

<style scoped lang="scss">
.comment-body {
  position: relative;
  overflow: hidden;
  white-space: pre-wrap;
  line-height: 1.55;
  border-radius: 12px;
  padding: 8px 10px;
}

.comment-content {
  position: relative;
  z-index: 2;
}

.comment-body--cold {
  background: linear-gradient(120deg, #d9f1ff, #b8e4ff);
  color: #073b5a;
}

.comment-body--warm {
  background: linear-gradient(120deg, #fff9d5, #ffe38f);
  color: #5a3a00;
}

.comment-body--hot {
  background: linear-gradient(120deg, #ffe0b8, #ff9f68);
  color: #5b2200;
}

.comment-body--blaze {
  background: linear-gradient(120deg, #ffd8a8, #ff735a, #ff4d4d, #ff9e52);
  background-size: 220% 220%;
  color: #4a0000;
  animation: blazeGradientShift 5.8s ease-in-out infinite;
}

.comment-body--fire {
  animation: emberPulse 1.4s ease-in-out infinite;
  box-shadow: 0 0 0 rgba(255, 102, 0, 0.2);
}

.ember-layer {
  position: absolute;
  inset: 0;
  z-index: 1;
  pointer-events: none;
}

.ember {
  position: absolute;
  bottom: -12px;
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: radial-gradient(circle at 30% 30%, #fff4d7 0%, #ffd27a 40%, #ff6a00 100%);
  opacity: 0;
  filter: blur(0.2px);
  animation-name: emberRise;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
}

.super-badge {
  font-size: 10px;
  letter-spacing: 0.5px;
}

.super-badge--cold {
  background: #1e88e5;
  color: #fff;
}

.super-badge--warm {
  background: #f9a825;
  color: #231300;
}

.super-badge--hot {
  background: #ef6c00;
  color: #fff;
}

.super-badge--blaze {
  background: #d50000;
  color: #fff;
}

@keyframes emberPulse {
  0% {
    box-shadow: 0 0 0 0 rgba(255, 94, 0, 0.35), 0 0 12px 0 rgba(255, 42, 0, 0.28);
  }
  50% {
    box-shadow: 0 0 0 4px rgba(255, 94, 0, 0.12), 0 0 20px 2px rgba(255, 42, 0, 0.36);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(255, 94, 0, 0.35), 0 0 12px 0 rgba(255, 42, 0, 0.28);
  }
}

@keyframes blazeGradientShift {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

@keyframes emberRise {
  0% {
    transform: translate3d(0, 0, 0) scale(0.6);
    opacity: 0;
  }
  12% {
    opacity: 0.8;
  }
  60% {
    opacity: 0.45;
  }
  100% {
    transform: translate3d(8px, -72px, 0) scale(1.05);
    opacity: 0;
  }
}
</style>
