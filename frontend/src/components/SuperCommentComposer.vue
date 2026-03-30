<template>
  <div class="super-comment-wrap q-mt-sm">
    <div class="row items-center justify-between q-col-gutter-sm">
      <div class="col">
        <q-toggle
          :model-value="enabled"
          color="warning"
          label="Enviar como super comentario"
          :disable="!canComment"
          @update:model-value="onToggle"
          @click="handleIntent"
        />
      </div>
      <div v-if="enabled" class="col-auto">
        <q-chip color="warning" text-color="black" icon="bolt" dense>
          {{ amountLabel }} J-GOLD
        </q-chip>
      </div>
    </div>

    <div v-if="enabled" class="q-mt-sm q-gutter-sm">
      <q-input
        :model-value="amountModel"
        type="number"
        dense
        filled
        min="5"
        max="9999"
        label="Valor do destaque (J-GOLD)"
        suffix="J-GOLD"
        @update:model-value="onAmountChange"
      />

      <q-btn-toggle
        :model-value="temperatureModel"
        unelevated
        rounded
        no-caps
        spread
        toggle-color="primary"
        color="grey-3"
        text-color="grey-8"
        :options="temperatureOptions"
        @update:model-value="onTemperatureChange"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { CommentTemperature, SuperCommentPayload } from 'src/types/comments';

const props = defineProps<{
  canComment: boolean;
  modelValue: SuperCommentPayload | null;
}>();

const emit = defineEmits<{
  'update:modelValue': [value: SuperCommentPayload | null];
  'request-auth': [];
}>();

const temperatureOptions: { label: string; value: CommentTemperature }[] = [
  { label: 'Frio', value: 'cold' },
  { label: 'Morno', value: 'warm' },
  { label: 'Quente', value: 'hot' },
  { label: 'Em chamas', value: 'blaze' },
];

const enabled = computed(() => Boolean(props.modelValue));
const amountModel = computed(() => props.modelValue?.amount ?? 20);
const temperatureModel = computed<CommentTemperature>(() => props.modelValue?.temperature ?? 'warm');
const amountLabel = computed(() => amountModel.value.toLocaleString('pt-BR'));

function handleIntent() {
  if (!props.canComment) {
    emit('request-auth');
  }
}

function onToggle(value: boolean) {
  if (!props.canComment) {
    emit('request-auth');
    emit('update:modelValue', null);
    return;
  }

  if (!value) {
    emit('update:modelValue', null);
    return;
  }

  emit('update:modelValue', {
    amount: amountModel.value,
    temperature: temperatureModel.value,
  });
}

function onAmountChange(rawValue: number | string | null) {
  if (!props.modelValue) {
    return;
  }

  const numeric = Number(rawValue ?? 0);
  const clamped = Number.isFinite(numeric) ? Math.max(5, Math.min(9999, Math.round(numeric))) : 5;

  emit('update:modelValue', {
    ...props.modelValue,
    amount: clamped,
  });
}

function onTemperatureChange(value: CommentTemperature) {
  if (!props.modelValue) {
    return;
  }

  emit('update:modelValue', {
    ...props.modelValue,
    temperature: value,
  });
}
</script>

<style scoped lang="scss">
.super-comment-wrap {
  border-radius: 14px;
  border: 1px solid rgba(255, 193, 7, 0.35);
  background: rgba(255, 193, 7, 0.08);
  padding: 10px 12px;
}
</style>
