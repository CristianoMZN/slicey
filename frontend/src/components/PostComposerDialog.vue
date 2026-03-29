<template>
  <q-dialog
    :model-value="modelValue"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <q-card class="post-composer-card">
      <q-card-section class="row items-center q-pb-sm">
        <div>
          <div class="text-overline page-kicker">Novo post</div>
          <div class="text-h6 text-weight-bold">Compartilhe com a comunidade</div>
        </div>
        <q-space />
        <q-btn flat round dense icon="close" @click="closeDialog" />
      </q-card-section>

      <q-separator />

      <q-card-section class="q-gutter-md">
        <q-tabs v-model="mode" dense align="left" no-caps active-color="primary" indicator-color="primary">
          <q-tab name="text" icon="article" label="Texto" />
          <q-tab name="image" icon="image" label="Imagem" />
          <q-tab name="audio" icon="mic" label="Audio" />
        </q-tabs>

        <q-input v-model="title" filled dense label="Titulo do post" />
        <q-input v-model="description" filled autogrow type="textarea" label="Legenda ou texto do post" />

        <div v-if="mode === 'image'" class="column q-gutter-sm">
          <div class="row items-center q-gutter-sm wrap">
            <q-btn color="secondary" rounded unelevated icon="photo_camera" label="Usar camera" @click="imageCameraInput?.click()" />
            <q-btn flat rounded icon="collections" label="Escolher da galeria" @click="imageGalleryInput?.click()" />
          </div>
          <q-input :model-value="mediaFileName" readonly filled dense label="Imagem selecionada" />
          <q-img v-if="mediaPreviewUrl" :src="mediaPreviewUrl" height="220px" class="rounded-borders" />
        </div>

        <voice-recorder
          v-else-if="mode === 'audio'"
          @captured="handleVoiceCaptured"
          @cleared="clearMedia"
          @error="notifyError"
        />

        <q-banner rounded class="post-rules-banner">
          Fotos podem ser capturadas pela camera ou escolhidas do rolo da camera. Audio so pode ser gravado pelo microfone do aparelho.
        </q-banner>
      </q-card-section>

      <q-card-actions align="right" class="q-pa-md">
        <q-btn flat rounded label="Cancelar" @click="closeDialog" />
        <q-btn color="primary" rounded unelevated icon="send" label="Publicar" @click="submitPost" />
      </q-card-actions>

      <input
        ref="imageCameraInput"
        class="capture-input"
        type="file"
        accept="image/*"
        capture="environment"
        @change="handleImageSelection"
      />
      <input
        ref="imageGalleryInput"
        class="capture-input"
        type="file"
        accept="image/*"
        @change="handleImageSelection"
      />
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import VoiceRecorder from 'src/components/VoiceRecorder.vue';
import type { PostComposerMode, PostComposerPayload } from 'src/types/post-composer';

const props = defineProps<{
  modelValue: boolean;
  initialMode?: PostComposerMode;
}>();

const emit = defineEmits<{
  'update:modelValue': [value: boolean];
  submit: [payload: PostComposerPayload];
  error: [message: string];
}>();

const mode = ref<PostComposerMode>(props.initialMode ?? 'text');
const title = ref('');
const description = ref('');
const mediaFile = ref<File | null>(null);
const mediaPreviewUrl = ref<string | null>(null);
const imageCameraInput = ref<HTMLInputElement | null>(null);
const imageGalleryInput = ref<HTMLInputElement | null>(null);

const mediaFileName = ref('Nenhuma midia selecionada');

watch(
  () => props.initialMode,
  (nextMode) => {
    if (nextMode) {
      mode.value = nextMode;
    }
  },
  { immediate: true },
);

watch(mode, (nextMode) => {
  if (nextMode === 'text') {
    clearMedia();
  }

  if (nextMode === 'image' && mediaFile.value?.type.startsWith('audio/')) {
    clearMedia();
  }

  if (nextMode === 'audio' && mediaFile.value?.type.startsWith('image/')) {
    clearMedia();
  }
});

function handleImageSelection(event: Event) {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0] ?? null;

  if (!file) {
    return;
  }

  clearMedia();
  mediaFile.value = file;
  mediaPreviewUrl.value = URL.createObjectURL(file);
  mediaFileName.value = file.name;
  target.value = '';
}

function handleVoiceCaptured(payload: { file: File }) {
  clearMedia();
  mediaFile.value = payload.file;
  mediaPreviewUrl.value = URL.createObjectURL(payload.file);
  mediaFileName.value = payload.file.name;
}

function clearMedia() {
  if (mediaPreviewUrl.value && !mediaPreviewUrl.value.startsWith('https://')) {
    URL.revokeObjectURL(mediaPreviewUrl.value);
  }

  mediaFile.value = null;
  mediaPreviewUrl.value = null;
  mediaFileName.value = 'Nenhuma midia selecionada';
}

function notifyError(message: string) {
  emit('error', message);
}

function submitPost() {
  const normalizedTitle = title.value.trim();
  const normalizedDescription = description.value.trim();

  if (!normalizedTitle) {
    emit('error', 'Informe um titulo para a postagem.');
    return;
  }

  if (!normalizedDescription) {
    emit('error', 'Escreva um texto ou legenda para a postagem.');
    return;
  }

  if (mode.value !== 'text' && !mediaFile.value) {
    emit('error', mode.value === 'image' ? 'Selecione uma imagem.' : 'Grave um audio antes de publicar.');
    return;
  }

  emit('submit', {
    mode: mode.value,
    title: normalizedTitle,
    description: normalizedDescription,
    mediaFile: mediaFile.value,
    mediaPreviewUrl: mediaPreviewUrl.value,
  });

  resetForm();
  emit('update:modelValue', false);
}

function resetForm() {
  title.value = '';
  description.value = '';
  mode.value = props.initialMode ?? 'text';
  clearMedia();
}

function closeDialog() {
  resetForm();
  emit('update:modelValue', false);
}
</script>

<style scoped lang="scss">
.post-composer-card {
  width: min(92vw, 760px);
  max-width: 760px;
}

.post-rules-banner {
  background: rgba(255, 193, 7, 0.1);
  border: 1px solid rgba(255, 193, 7, 0.35);
}

.capture-input {
  display: none;
}
</style>
