<template>
  <div class="super-comment-wrap">
    <div class="row items-center justify-between q-col-gutter-sm q-mb-xs">
      <div class="col text-caption text-weight-medium">Super Comment</div>
      <div class="col-auto">
        <q-chip dense icon="bolt" :class="`tier-chip tier-chip--${temperature}`">
          {{ temperatureLabel }} · {{ amountLabel }} J-GOLD
        </q-chip>
      </div>
    </div>

    <div class="q-gutter-sm">
      <q-slider
        :model-value="sliderAmount"
        :min="SUPER_COMMENT_MIN_AMOUNT"
        :max="SUPER_COMMENT_SLIDER_MAX"
        :step="100"
        color="warning"
        track-color="orange-3"
        thumb-color="deep-orange"
        label
        :label-value="`${sliderAmount.toLocaleString('pt-BR')} J-GOLD`"
        @update:model-value="onSliderChange"
      />

      <div class="row items-center q-gutter-sm">
        <q-btn
          flat
          dense
          no-caps
          icon="edit"
          :label="showCustomInput ? 'Fechar digitacao manual' : 'Digitar outro valor'"
          @click="showCustomInput = !showCustomInput"
        />
        <div class="text-caption text-grey-6">Range padrao: 100-20.000</div>
      </div>

      <q-input
        v-if="showCustomInput"
        :model-value="manualAmount"
        type="number"
        dense
        filled
        :min="SUPER_COMMENT_MIN_AMOUNT"
        label="Valor manual (J-GOLD)"
        suffix="J-GOLD"
        @update:model-value="onManualAmountChange"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { commentTemperatureLabelMap } from 'src/types/content';
import {
  SUPER_COMMENT_MIN_AMOUNT,
  SUPER_COMMENT_SLIDER_MAX,
  resolveSuperCommentTemperature,
  type SuperCommentPayload,
} from 'src/types/comments';

const props = defineProps<{
  canComment: boolean;
  modelValue: SuperCommentPayload | null;
}>();

const emit = defineEmits<{
  'update:modelValue': [value: SuperCommentPayload | null];
  'request-auth': [];
}>();

const showCustomInput = ref(false);
const sliderAmount = computed(() => {
  const base = props.modelValue?.amount ?? SUPER_COMMENT_MIN_AMOUNT;
  return Math.max(SUPER_COMMENT_MIN_AMOUNT, Math.min(SUPER_COMMENT_SLIDER_MAX, Math.round(base / 100) * 100));
});

const manualAmount = computed(() => props.modelValue?.amount ?? SUPER_COMMENT_MIN_AMOUNT);
const temperature = computed(() =>
  resolveSuperCommentTemperature(props.modelValue?.amount ?? SUPER_COMMENT_MIN_AMOUNT),
);
const temperatureLabel = computed(() => commentTemperatureLabelMap[temperature.value]);
const amountLabel = computed(() => (props.modelValue?.amount ?? SUPER_COMMENT_MIN_AMOUNT).toLocaleString('pt-BR'));

function handleIntent() {
  if (!props.canComment) {
    emit('request-auth');
  }
}

function emitAmount(amount: number) {
  const normalized = Math.max(SUPER_COMMENT_MIN_AMOUNT, Math.round(amount));

  emit('update:modelValue', {
    amount: normalized,
    temperature: resolveSuperCommentTemperature(normalized),
  });
}

function onSliderChange(rawValue: number | null) {
  if (!props.canComment) {
    handleIntent();
    return;
  }

  if (rawValue === null) {
    return;
  }

  emitAmount(rawValue);
}

function onManualAmountChange(rawValue: number | string | null) {
  if (!props.canComment) {
    handleIntent();
    return;
  }

  const numeric = Number(rawValue ?? 0);
  if (!Number.isFinite(numeric)) {
    return;
  }

  emitAmount(numeric);
}
</script>

<style scoped lang="scss">
.super-comment-wrap {
  border-radius: 14px;
  border: 1px solid rgba(255, 193, 7, 0.35);
  background: rgba(255, 193, 7, 0.08);
  padding: 10px 12px;
}

.tier-chip {
  color: #fff;
}

.tier-chip--cold {
  background: #1e88e5;
}

.tier-chip--warm {
  background: #fb8c00;
}

.tier-chip--hot {
  background: #ef6c00;
}

.tier-chip--blaze {
  background: #d50000;
}
</style>
