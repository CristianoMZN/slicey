<template>
  <div class="comment-composer row items-end q-col-gutter-sm">
    <div class="col">
      <q-input
        v-model="draft"
        autogrow
        dense
        filled
        :readonly="!canComment"
        :placeholder="canComment ? 'Escreva um comentario...' : 'Cadastre-se para comentar'"
        @focus="handleIntent"
        @click="handleIntent"
        @keyup.enter.exact.prevent="submitComment"
      />
    </div>
    <div class="col-auto">
      <q-btn
        color="primary"
        round
        unelevated
        icon="send"
        @click="submitComment"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const props = defineProps<{
  canComment: boolean;
}>();

const emit = defineEmits<{
  submit: [message: string];
  requestAuth: [];
}>();

const draft = ref('');

function handleIntent() {
  if (!props.canComment) {
    emit('requestAuth');
  }
}

function submitComment() {
  if (!props.canComment) {
    emit('requestAuth');
    return;
  }

  const normalizedDraft = draft.value.trim();
  if (!normalizedDraft) {
    return;
  }

  emit('submit', normalizedDraft);
  draft.value = '';
}
</script>

<style scoped lang="scss">
.comment-composer {
  .q-field {
    border-radius: 14px;
  }
}
</style>
