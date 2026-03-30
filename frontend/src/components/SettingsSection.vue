<template>
  <div class="settings-section q-mb-lg">
    <div class="settings-section__header row items-center q-gutter-xs q-mb-sm q-px-xs">
      <q-icon :name="icon" size="18px" color="primary" />
      <span class="text-caption text-uppercase text-weight-bold settings-section__title">
        {{ title }}
      </span>
    </div>
    <q-card flat bordered class="settings-section__card">
      <slot />
    </q-card>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string;
  icon: string;
}>();
</script>

<style scoped lang="scss">
.settings-section__title {
  color: var(--q-primary);
  letter-spacing: 0.1em;
  font-size: 0.7rem;
}

.settings-section__card {
  border-radius: 12px;
  overflow: hidden;
}
</style>
