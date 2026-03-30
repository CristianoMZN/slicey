<template>
  <div class="comment-composer">
    <div class="row items-end q-col-gutter-sm">
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

    <super-comment-composer
      v-model="superComment"
      :can-comment="canComment"
      @request-auth="handleIntent"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import SuperCommentComposer from 'src/components/SuperCommentComposer.vue';
import type { SubmitCommentPayload, SuperCommentPayload } from 'src/types/comments';

const props = defineProps<{
  canComment: boolean;
}>();

const emit = defineEmits<{
  submit: [payload: SubmitCommentPayload];
  requestAuth: [];
}>();

const draft = ref('');
const superComment = ref<SuperCommentPayload | null>(null);

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

  const payload: SubmitCommentPayload = {
    message: normalizedDraft,
  };

  if (superComment.value) {
    payload.superComment = superComment.value;
  }

  emit('submit', payload);

  draft.value = '';
  superComment.value = null;
}
</script>

<style scoped lang="scss">
.comment-composer {
  .q-field {
    border-radius: 14px;
  }
}
</style>
