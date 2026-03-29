<template>
  <q-page class="page-shell q-px-md q-pt-md q-pb-xl">
    <q-card flat bordered class="section-card messenger-shell">
      <q-card-section class="q-pb-none">
        <div class="row items-center justify-between q-gutter-sm">
          <div>
            <div class="text-overline page-kicker">Mensagens</div>
            <h1 class="text-h5 q-my-none text-weight-bold">Messenger completo</h1>
          </div>

          <q-btn
            v-if="isMobile"
            flat
            rounded
            icon="chat"
            label="Conversas"
            @click="mobileThreadsOpen = true"
          />
        </div>
      </q-card-section>

      <q-card-section class="q-pt-sm">
        <div class="row q-col-gutter-md">
          <div v-if="!isMobile" class="col-12 col-md-4">
            <div class="desktop-thread-panel">
              <q-input v-model="search" filled dense label="Buscar conversa" class="q-mb-sm" />
              <thread-list
                :threads="filteredThreads"
                :selected-thread-id="selectedThreadId"
                @select-thread="selectThread"
              />
            </div>
          </div>

          <div class="col-12" :class="isMobile ? '' : 'col-md-8'">
            <q-card flat bordered class="chat-pane">
              <q-card-section v-if="activeThread" class="chat-header row items-center justify-between">
                <div class="row items-center q-gutter-sm">
                  <q-avatar>
                    <img :src="activeThread.contactAvatar" :alt="activeThread.contactName" />
                  </q-avatar>
                  <div>
                    <div class="text-subtitle2 text-weight-bold">{{ activeThread.contactName }}</div>
                    <div class="text-caption text-grey-6">
                      {{ activeThread.city }} • {{ activeThread.online ? 'online' : 'offline' }}
                    </div>
                  </div>
                </div>

                <q-btn
                  flat
                  rounded
                  icon="video_call"
                  label="Iniciar chamada"
                  @click="notifyFeature('Chamada de video')"
                />
              </q-card-section>

              <q-separator />

              <q-card-section class="chat-history">
                <div v-if="activeThread" class="column q-gutter-sm">
                  <div
                    v-for="message in activeThread.messages"
                    :key="message.id"
                    class="message-row"
                    :class="message.sender === 'me' ? 'message-row--me' : 'message-row--contact'"
                  >
                    <div class="message-bubble" :class="message.sender === 'me' ? 'message-bubble--me' : ''">
                      <template v-if="message.type === 'text'">
                        <div class="text-body2">{{ message.content }}</div>
                      </template>

                      <template v-else-if="message.type === 'image'">
                        <q-img :src="message.content" height="170px" class="rounded-borders" />
                      </template>

                      <template v-else-if="message.type === 'video'">
                        <video controls class="chat-video" :src="message.content" />
                      </template>

                      <template v-else>
                        <audio controls class="chat-audio" :src="message.content" />
                      </template>

                      <div class="text-caption q-mt-xs text-right message-time">{{ message.createdAt }}</div>
                    </div>
                  </div>
                </div>

                <div v-else class="text-center text-grey-6 q-pa-lg">
                  Selecione uma conversa para comecar.
                </div>
              </q-card-section>

              <q-separator />

              <q-card-section v-if="activeThread">
                <q-tabs v-model="composerMode" dense align="left" no-caps active-color="primary" indicator-color="primary">
                  <q-tab name="text" label="Texto" icon="chat" />
                  <q-tab name="image" label="Imagem" icon="image" />
                  <q-tab name="video" label="Video" icon="movie" />
                  <q-tab name="audio" label="Voz/Audio" icon="mic" />
                </q-tabs>

                <q-separator class="q-my-sm" />

                <div v-if="composerMode === 'text'" class="row items-center q-gutter-sm">
                  <q-input
                    v-model="draftText"
                    filled
                    dense
                    autogrow
                    class="col"
                    label="Digite sua mensagem"
                    @keyup.enter.exact.prevent="sendText"
                  />
                  <q-btn color="primary" rounded unelevated icon="send" label="Enviar" @click="sendText" />
                </div>

                <div v-else-if="composerMode === 'image' || composerMode === 'video'" class="column q-gutter-sm">
                  <div class="row items-center q-gutter-sm wrap">
                    <q-btn
                      color="secondary"
                      rounded
                      unelevated
                      :icon="captureIcon"
                      :label="captureCtaLabel"
                      @click="composerMode === 'image' ? imageCaptureInput?.click() : videoCaptureInput?.click()"
                    />
                    <q-btn
                      flat
                      rounded
                      icon="collections"
                      :label="composerMode === 'image' ? 'Escolher da galeria' : 'Escolher da galeria'"
                      @click="composerMode === 'image' ? imageGalleryInput?.click() : videoGalleryInput?.click()"
                    />
                    <q-btn
                      color="primary"
                      rounded
                      unelevated
                      icon="send"
                      label="Enviar"
                      :disable="!draftFile"
                      @click="sendFile"
                    />
                  </div>

                  <q-input
                    :model-value="draftFileName"
                    readonly
                    filled
                    dense
                    :label="captureFieldLabel"
                    hint="Fotos e videos podem vir da camera ou do rolo da camera."
                  >
                    <template #append>
                      <q-btn v-if="draftFile" flat round dense icon="close" @click="clearDraftFile" />
                    </template>
                  </q-input>
                </div>

                <div v-else class="column q-gutter-sm">
                  <voice-recorder @captured="handleRecordedVoice" @cleared="clearDraftFile" @error="notifyCaptureError" />
                  <q-btn
                    color="primary"
                    rounded
                    unelevated
                    icon="send"
                    label="Enviar audio"
                    :disable="!draftFile"
                    @click="sendFile"
                  />
                </div>
              </q-card-section>
            </q-card>
          </div>
        </div>
      </q-card-section>
    </q-card>

    <q-dialog v-model="mobileThreadsOpen" position="left" :maximized="false" v-if="isMobile">
      <q-card class="mobile-thread-dialog">
        <q-card-section class="row items-center q-pb-sm">
          <div>
            <div class="text-overline page-kicker">Conversas</div>
            <div class="text-subtitle1 text-weight-bold">Chats ativos</div>
          </div>
          <q-space />
          <q-btn flat round dense icon="close" @click="mobileThreadsOpen = false" />
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-input v-model="search" filled dense label="Buscar conversa" class="q-mb-sm" />
          <thread-list
            :threads="filteredThreads"
            :selected-thread-id="selectedThreadId"
            @select-thread="handleMobileThreadSelect"
          />
        </q-card-section>
      </q-card>
    </q-dialog>

    <input
      ref="imageCaptureInput"
      class="capture-input"
      type="file"
      accept="image/*"
      capture="environment"
      @change="handleCapturedFile($event, 'image')"
    />
    <input
      ref="imageGalleryInput"
      class="capture-input"
      type="file"
      accept="image/*"
      @change="handleCapturedFile($event, 'image')"
    />
    <input
      ref="videoCaptureInput"
      class="capture-input"
      type="file"
      accept="video/*"
      capture="environment"
      @change="handleCapturedFile($event, 'video')"
    />
    <input
      ref="videoGalleryInput"
      class="capture-input"
      type="file"
      accept="video/*"
      @change="handleCapturedFile($event, 'video')"
    />
  </q-page>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useQuasar } from 'quasar';
import { useRoute, useRouter } from 'vue-router';
import VoiceRecorder from 'src/components/VoiceRecorder.vue';
import { chatThreadsSeed, type ChatMessage, type ChatThread } from 'src/data/mock-content';
import ThreadList from 'src/components/ThreadList.vue';

const $q = useQuasar();
const route = useRoute();
const router = useRouter();
const isMobile = computed(() => $q.screen.lt.md);

const search = ref('');
const threads = ref<ChatThread[]>(structuredClone(chatThreadsSeed));
const selectedThreadId = ref<number | null>(null);
const mobileThreadsOpen = ref(false);
const composerMode = ref<'text' | 'image' | 'video' | 'audio'>('text');
const draftText = ref('');
const draftFile = ref<File | null>(null);
const draftFileType = ref<'image' | 'video' | 'audio' | null>(null);
const imageCaptureInput = ref<HTMLInputElement | null>(null);
const imageGalleryInput = ref<HTMLInputElement | null>(null);
const videoCaptureInput = ref<HTMLInputElement | null>(null);
const videoGalleryInput = ref<HTMLInputElement | null>(null);

const filteredThreads = computed(() => {
  const term = search.value.trim().toLowerCase();
  if (!term) {
    return threads.value;
  }

  return threads.value.filter((thread) =>
    [thread.contactName, thread.city, thread.lastPreview].join(' ').toLowerCase().includes(term),
  );
});

const activeThread = computed(() =>
  threads.value.find((thread) => thread.id === selectedThreadId.value),
);

const draftFileName = computed(() => draftFile.value?.name ?? 'Nenhuma captura selecionada');

const captureFieldLabel = computed(() => {
  if (composerMode.value === 'image') {
    return 'Foto capturada';
  }

  if (composerMode.value === 'video') {
    return 'Video gravado';
  }

  return 'Audio gravado';
});

const captureCtaLabel = computed(() => {
  if (composerMode.value === 'image') {
    return 'Usar camera';
  }

  if (composerMode.value === 'video') {
    return 'Gravar video';
  }

  return 'Gravar audio';
});

const captureIcon = computed(() => {
  if (composerMode.value === 'image') {
    return 'photo_camera';
  }

  if (composerMode.value === 'video') {
    return 'videocam';
  }

  return 'mic';
});

function nowLabel() {
  return new Intl.DateTimeFormat('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date());
}

function selectThread(id: number) {
  selectedThreadId.value = id;
  const thread = threads.value.find((item) => item.id === id);
  if (thread) {
    thread.unreadCount = 0;
  }
}

function handleMobileThreadSelect(id: number) {
  selectThread(id);
  mobileThreadsOpen.value = false;
}

function pushMessage(thread: ChatThread, message: ChatMessage) {
  thread.messages.push(message);
  thread.lastPreview =
    message.type === 'text' ? message.content : `Arquivo de ${message.type} enviado`;
}

function sendText() {
  if (!activeThread.value || !draftText.value.trim()) {
    return;
  }

  pushMessage(activeThread.value, {
    id: Date.now(),
    sender: 'me',
    type: 'text',
    content: draftText.value.trim(),
    createdAt: nowLabel(),
  });

  draftText.value = '';
}

function sendFile() {
  if (!activeThread.value || !draftFile.value || !draftFileType.value) {
    return;
  }

  const file = draftFile.value;
  const fileUrl = URL.createObjectURL(file);

  pushMessage(activeThread.value, {
    id: Date.now(),
    sender: 'me',
    type: draftFileType.value,
    content: fileUrl,
    createdAt: nowLabel(),
  });

  clearDraftFile();
  composerMode.value = 'text';
}

function handleCapturedFile(event: Event, type: 'image' | 'video' | 'audio') {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0] ?? null;

  if (!file) {
    return;
  }

  draftFile.value = file;
  draftFileType.value = type;
  target.value = '';
}

function handleRecordedVoice(payload: { file: File }) {
  clearDraftFile();
  draftFile.value = payload.file;
  draftFileType.value = 'audio';
}

function clearDraftFile() {
  draftFile.value = null;
  draftFileType.value = null;
}

function notifyCaptureError(message: string) {
  $q.notify({
    type: 'warning',
    message,
    timeout: 2200,
    position: 'top',
  });
}

function notifyFeature(feature: string) {
  $q.notify({
    type: 'info',
    message: `${feature} sera liberada em breve.`,
    timeout: 1700,
  });
}

watch(
  () => route.query.thread,
  (threadQuery) => {
    const parsedId = Number.parseInt((threadQuery as string) || '', 10);
    if (!Number.isNaN(parsedId) && threads.value.some((item) => item.id === parsedId)) {
      selectThread(parsedId);
      return;
    }

    if (!selectedThreadId.value && threads.value.length > 0) {
      selectThread(threads.value[0]!.id);
    }
  },
  { immediate: true },
);

watch(selectedThreadId, (id) => {
  if (!id) {
    return;
  }

  void router.replace({
    query: {
      ...route.query,
      thread: id.toString(),
    },
  });
});
</script>

<style scoped lang="scss">
.messenger-shell {
  min-height: 78vh;
}

.desktop-thread-panel {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.thread-list {
  max-height: 62vh;
  overflow: auto;
}

.mobile-thread-dialog {
  width: min(92vw, 420px);
  min-height: 100vh;
  border-radius: 0;
}

.thread-active {
  background: rgba(212, 20, 90, 0.16);
}

.chat-pane {
  min-height: 62vh;
  display: flex;
  flex-direction: column;
}

.chat-header {
  min-height: 80px;
}

.chat-history {
  flex: 1;
  max-height: 46vh;
  overflow: auto;
}

.message-row {
  display: flex;
}

.message-row--me {
  justify-content: flex-end;
}

.message-row--contact {
  justify-content: flex-start;
}

.message-bubble {
  max-width: min(82%, 440px);
  padding: 10px 12px;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.08);
}

.message-bubble--me {
  background: rgba(212, 20, 90, 0.28);
}

.message-time {
  opacity: 0.72;
}

.chat-video,
.chat-audio {
  width: 100%;
  border-radius: 10px;
}

.capture-input {
  display: none;
}

@media (max-width: 768px) {
  .thread-list,
  .chat-history {
    max-height: 40vh;
  }
}
</style>
