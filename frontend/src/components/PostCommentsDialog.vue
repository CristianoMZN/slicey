<template>
  <q-dialog
    :model-value="modelValue"
    maximized
    transition-show="slide-up"
    transition-hide="slide-down"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <q-card class="comments-dialog-card">
      <q-card-section class="row items-center q-pb-sm">
        <div>
          <div class="text-overline page-kicker">Comentarios</div>
          <div class="text-h6 text-weight-bold">{{ postTitle }}</div>
          <div class="text-caption text-grey-6">{{ comments.length }} conversas nesta postagem</div>
        </div>
        <q-space />
        <q-btn flat round dense icon="close" @click="emit('update:modelValue', false)" />
      </q-card-section>

      <q-separator />

      <q-scroll-area class="comments-scroll-area">
        <div class="q-pa-md">
          <q-list separator>
            <comment-message-card
              v-for="comment in comments"
              :key="comment.id"
              :comment="comment"
            />
          </q-list>
        </div>
      </q-scroll-area>

      <q-separator />

      <q-card-section>
        <post-comment-composer
          :can-comment="canComment"
          @submit="emit('submit-comment', $event)"
          @request-auth="emit('request-auth')"
        />
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import CommentMessageCard from 'src/components/CommentMessageCard.vue';
import PostCommentComposer from 'src/components/PostCommentComposer.vue';
import type { FeedComment } from 'src/types/content';
import type { SubmitCommentPayload } from 'src/types/comments';

defineProps<{
  modelValue: boolean;
  postTitle: string;
  comments: FeedComment[];
  canComment: boolean;
}>();

const emit = defineEmits<{
  'update:modelValue': [value: boolean];
  'submit-comment': [payload: SubmitCommentPayload];
  'request-auth': [];
}>();
</script>

<style scoped lang="scss">
.comments-dialog-card {
  background: rgba(20, 10, 32, 0.96);
}

.comments-scroll-area {
  height: calc(100vh - 190px);
}

:global(body.body--light) .comments-dialog-card {
  background: rgba(255, 255, 255, 0.98);
}
</style>
