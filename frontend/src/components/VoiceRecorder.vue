<template>
  <div class="voice-recorder column q-gutter-sm">
    <div class="row items-center q-gutter-sm">
      <q-btn
        v-if="!isRecording"
        color="secondary"
        rounded
        unelevated
        icon="mic"
        label="Gravar voz"
        @click="startRecording"
      />
      <q-btn
        v-else
        color="negative"
        rounded
        unelevated
        icon="stop"
        label="Parar gravacao"
        @click="stopRecording"
      />
      <q-btn
        v-if="recordedUrl"
        flat
        rounded
        icon="delete"
        label="Descartar"
        @click="clearRecording()"
      />
      <q-chip v-if="isRecording" color="negative" text-color="white" icon="fiber_manual_record">
        Gravando...
      </q-chip>
    </div>

    <q-input
      :model-value="recordedFileName || 'Nenhum audio gravado ainda'"
      readonly
      filled
      dense
      label="Audio capturado"
      hint="A voz e gravada diretamente do microfone do aparelho."
    />

    <audio v-if="recordedUrl" controls class="voice-preview" :src="recordedUrl" />
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, ref } from 'vue';

const emit = defineEmits<{
  captured: [payload: { file: File }];
  cleared: [];
  error: [message: string];
}>();

const isRecording = ref(false);
const recordedUrl = ref<string | null>(null);
const recordedFileName = ref('');

let mediaRecorder: MediaRecorder | null = null;
let mediaStream: MediaStream | null = null;
let chunks: Blob[] = [];

function mimeToExtension(mimeType: string) {
  if (mimeType.includes('ogg')) {
    return 'ogg';
  }

  if (mimeType.includes('mp4')) {
    return 'm4a';
  }

  return 'webm';
}

async function startRecording() {
  if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === 'undefined') {
    emit('error', 'Gravacao de audio nao suportada neste navegador.');
    return;
  }

  try {
    clearRecording(false);
    mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorder = new MediaRecorder(mediaStream);
    chunks = [];

    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        chunks.push(event.data);
      }
    };

    mediaRecorder.onstop = () => {
      const mimeType = mediaRecorder?.mimeType || 'audio/webm';
      const audioBlob = new Blob(chunks, { type: mimeType });
      const extension = mimeToExtension(mimeType);
      const file = new File([audioBlob], `voz-${Date.now()}.${extension}`, { type: mimeType });
      const url = URL.createObjectURL(audioBlob);

      recordedUrl.value = url;
      recordedFileName.value = file.name;
      emit('captured', { file });
      cleanupStream();
      isRecording.value = false;
    };

    mediaRecorder.start();
    isRecording.value = true;
  } catch {
    cleanupStream();
    emit('error', 'Nao foi possivel acessar o microfone.');
  }
}

function stopRecording() {
  if (!mediaRecorder || mediaRecorder.state === 'inactive') {
    return;
  }

  mediaRecorder.stop();
}

function cleanupStream() {
  mediaStream?.getTracks().forEach((track) => track.stop());
  mediaStream = null;
  mediaRecorder = null;
}

function clearRecording(emitEvent = true) {
  if (isRecording.value) {
    stopRecording();
  }

  if (recordedUrl.value) {
    URL.revokeObjectURL(recordedUrl.value);
  }

  recordedUrl.value = null;
  recordedFileName.value = '';
  chunks = [];
  cleanupStream();
  isRecording.value = false;

  if (emitEvent) {
    emit('cleared');
  }
}

onBeforeUnmount(() => {
  clearRecording(false);
});
</script>

<style scoped lang="scss">
.voice-preview {
  width: 100%;
  border-radius: 10px;
}
</style>
