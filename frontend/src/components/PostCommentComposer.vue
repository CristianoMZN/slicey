<template>
  <div class="comment-composer">
    <transition name="super-panel">
      <super-comment-composer
        v-if="isSuperCommentEnabled"
        v-model="superComment"
        :can-comment="canComment"
        class="q-mb-sm"
        @request-auth="handleIntent"
      />
    </transition>

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
          round
          unelevated
          :color="isSuperCommentEnabled ? 'warning' : 'grey-8'"
          text-color="white"
          icon="bolt"
          @click="toggleSuperComment"
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
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import SuperCommentComposer from 'src/components/SuperCommentComposer.vue';
import {
  SUPER_COMMENT_MIN_AMOUNT,
  resolveSuperCommentTemperature,
  type SubmitCommentPayload,
  type SuperCommentPayload,
} from 'src/types/comments';

const props = defineProps<{
  canComment: boolean;
}>();

const emit = defineEmits<{
  submit: [payload: SubmitCommentPayload];
  requestAuth: [];
}>();

const draft = ref('');
const superComment = ref<SuperCommentPayload | null>(null);
const isSuperCommentEnabled = ref(false);

function handleIntent() {
  if (!props.canComment) {
    emit('requestAuth');
  }
}

function toggleSuperComment() {
  if (!props.canComment) {
    emit('requestAuth');
    return;
  }

  isSuperCommentEnabled.value = !isSuperCommentEnabled.value;
  if (isSuperCommentEnabled.value) {
    if (!superComment.value) {
      superComment.value = {
        amount: SUPER_COMMENT_MIN_AMOUNT,
        temperature: resolveSuperCommentTemperature(SUPER_COMMENT_MIN_AMOUNT),
      };
    }
    return;
  }

  superComment.value = null;
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

  if (isSuperCommentEnabled.value && superComment.value) {
    payload.superComment = superComment.value;
  }

  emit('submit', payload);

  draft.value = '';
  superComment.value = null;
  isSuperCommentEnabled.value = false;
}
</script>

<style scoped lang="scss">
.comment-composer {
  .q-field {
    border-radius: 14px;
  }
}

.super-panel-enter-active,
.super-panel-leave-active {
  transition: all 160ms ease;
}

.super-panel-enter-from,
.super-panel-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}
</style>
