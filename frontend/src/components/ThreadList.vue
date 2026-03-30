<template>
  <q-list bordered separator class="rounded-borders thread-list">
    <q-item
      v-for="thread in threads"
      :key="thread.id"
      clickable
      :active="thread.id === selectedThreadId"
      active-class="thread-active"
      @click="emit('select-thread', thread.id)"
    >
      <q-item-section avatar>
        <q-avatar>
          <img :src="thread.contactAvatar" :alt="thread.contactName" />
        </q-avatar>
      </q-item-section>
      <q-item-section>
        <q-item-label>{{ thread.contactName }}</q-item-label>
        <q-item-label caption class="ellipsis">{{ thread.lastPreview }}</q-item-label>
      </q-item-section>
      <q-item-section side top>
        <q-badge v-if="thread.unreadCount" color="primary">{{ thread.unreadCount }}</q-badge>
        <q-icon
          class="q-mt-xs"
          :name="thread.online ? 'circle' : 'schedule'"
          :color="thread.online ? 'positive' : 'grey-5'"
          size="12px"
        />
      </q-item-section>
    </q-item>
  </q-list>
</template>

<script setup lang="ts">
import type { ChatThread } from 'src/types/content';

defineProps<{
  threads: ChatThread[];
  selectedThreadId: number | null;
}>();

const emit = defineEmits<{
  'select-thread': [id: number];
}>();
</script>

<style scoped lang="scss">
.thread-list {
  max-height: 62vh;
  overflow: auto;
}

.thread-active {
  background: rgba(212, 20, 90, 0.16);
}
</style>
