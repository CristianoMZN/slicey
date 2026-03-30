<template>
  <!-- column + no-wrap faz o q-page ser um flex-column que preenche o container do layout -->
  <q-page class="page-messages column no-wrap">

    <!-- ── LAYOUT PRINCIPAL ── -->
    <div class="messenger-layout col row no-wrap">

      <!-- ── SIDEBAR DE CONVERSAS (desktop) ── -->
      <div v-if="!isMobile" class="thread-sidebar column no-wrap">
        <div class="q-px-md q-pt-md q-pb-sm">
          <div class="text-overline page-kicker">Mensagens</div>
          <div class="text-h6 text-weight-bold q-mb-sm">Conversas</div>
          <q-input v-model="search" outlined dense rounded label="Buscar conversa" />
        </div>
        <q-separator />
        <div class="col overflow-auto">
          <thread-list
            :threads="filteredThreads"
            :selected-thread-id="selectedThreadId"
            @select-thread="selectThread"
          />
        </div>
      </div>

      <!-- ── PAINEL DO CHAT ── -->
      <div class="col column no-wrap chat-main">

        <!-- Cabeçalho do chat -->
        <div class="chat-header row items-center justify-between">
          <div class="row items-center q-gutter-sm">
            <q-btn v-if="isMobile" flat round dense icon="menu" @click="mobileThreadsOpen = true" />
            <template v-if="activeThread">
              <q-avatar size="40px">
                <img :src="activeThread.contactAvatar" :alt="activeThread.contactName" />
              </q-avatar>
              <div>
                <div class="text-subtitle2 text-weight-bold">{{ activeThread.contactName }}</div>
                <div class="text-caption text-grey-6">
                  {{ activeThread.city }} •
                  <span :class="activeThread.online ? 'text-positive' : 'text-grey-5'">
                    {{ activeThread.online ? 'online' : 'offline' }}
                  </span>
                </div>
              </div>
            </template>
            <template v-else>
              <span class="text-subtitle1 text-weight-bold">Mensagens</span>
            </template>
          </div>

          <q-btn
            v-if="activeThread"
            flat rounded dense
            icon="video_call"
            label="Chamada"
            @click="notifyFeature('Chamada de video')"
          />
        </div>

        <q-separator />

        <!-- Histórico de mensagens -->
        <div class="chat-history col" ref="historyRef">
          <div v-if="activeThread" class="column q-gutter-sm q-pa-md">
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
                  <q-img
                    :src="message.content"
                    class="rounded-borders chat-img"
                    :ratio="4/3"
                  />
                </template>
                <template v-else-if="message.type === 'video'">
                  <chat-video-player :src="message.content" />
                </template>
                <template v-else>
                  <chat-voice-player :src="message.content" :is-mine="message.sender === 'me'" />
                </template>
                <div class="text-caption q-mt-xs text-right message-time">{{ message.createdAt }}</div>
              </div>
            </div>
          </div>

          <div v-else class="column items-center justify-center full-height text-grey-5 q-pa-xl">
            <q-icon name="chat_bubble_outline" size="56px" class="q-mb-md" />
            <div class="text-body1">Selecione uma conversa para começar.</div>
          </div>
        </div>

        <q-separator />

        <!-- Compositor de mensagem -->
        <div v-if="activeThread" class="chat-composer">
          <q-tabs
            v-model="composerMode"
            dense align="left" no-caps
            active-color="primary" indicator-color="primary"
            class="q-mb-sm"
          >
            <q-tab name="text"  label="Texto"     icon="chat" />
            <q-tab name="image" label="Imagem"    icon="image" />
            <q-tab name="video" label="Vídeo"     icon="movie" />
            <q-tab name="audio" label="Voz/Áudio" icon="mic" />
          </q-tabs>

          <!-- Texto -->
          <div v-if="composerMode === 'text'" class="row items-end q-gutter-sm">
            <q-input
              v-model="draftText"
              outlined dense autogrow
              class="col"
              label="Digite sua mensagem"
              @keyup.enter.exact.prevent="sendText"
            />
            <q-btn color="primary" round unelevated icon="send" @click="sendText" />
          </div>

          <!-- Imagem / Vídeo -->
          <div v-else-if="composerMode === 'image' || composerMode === 'video'" class="column q-gutter-sm">
            <div class="row items-center q-gutter-sm wrap">
              <q-btn
                color="secondary" rounded unelevated
                :icon="captureIcon" :label="captureCtaLabel"
                @click="composerMode === 'image' ? imageCaptureInput?.click() : videoCaptureInput?.click()"
              />
              <q-btn
                flat rounded icon="collections" label="Galeria"
                @click="composerMode === 'image' ? imageGalleryInput?.click() : videoGalleryInput?.click()"
              />
              <q-btn color="primary" rounded unelevated icon="send" label="Enviar" :disable="!draftFile" @click="sendFile" />
            </div>
            <q-input
              :model-value="draftFileName"
              readonly outlined dense :label="captureFieldLabel"
              hint="Fotos e vídeos podem vir da câmera ou do rolo."
            >
              <template #append>
                <q-btn v-if="draftFile" flat round dense icon="close" @click="clearDraftFile" />
              </template>
            </q-input>
          </div>

          <!-- Áudio -->
          <div v-else class="column q-gutter-sm">
            <voice-recorder @captured="handleRecordedVoice" @cleared="clearDraftFile" @error="notifyCaptureError" />
            <q-btn color="primary" rounded unelevated icon="send" label="Enviar áudio" :disable="!draftFile" @click="sendFile" />
          </div>
        </div>

      </div>
    </div>

    <!-- ── DRAWER MOBILE ── -->
    <q-dialog v-if="isMobile" v-model="mobileThreadsOpen" position="left">
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
          <q-input v-model="search" outlined dense rounded label="Buscar conversa" class="q-mb-sm" />
          <thread-list
            :threads="filteredThreads"
            :selected-thread-id="selectedThreadId"
            @select-thread="handleMobileThreadSelect"
          />
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- hidden file inputs -->
    <input ref="imageCaptureInput" class="capture-input" type="file" accept="image/*" capture="environment" @change="handleCapturedFile($event, 'image')" />
    <input ref="imageGalleryInput" class="capture-input" type="file" accept="image/*" @change="handleCapturedFile($event, 'image')" />
    <input ref="videoCaptureInput" class="capture-input" type="file" accept="video/*" capture="environment" @change="handleCapturedFile($event, 'video')" />
    <input ref="videoGalleryInput" class="capture-input" type="file" accept="video/*" @change="handleCapturedFile($event, 'video')" />

  </q-page>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useQuasar } from 'quasar';
import { useRoute, useRouter } from 'vue-router';
import VoiceRecorder from 'src/components/VoiceRecorder.vue';
import ChatVoicePlayer from 'src/components/ChatVoicePlayer.vue';
import ChatVideoPlayer from 'src/components/ChatVideoPlayer.vue';
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
// ── Página ocupa toda a altura disponível sem scroll externo ──
.page-messages {
  padding: 0 !important;
  overflow: hidden;
}

// ── Container principal: sidebar + chat lado a lado ──
.messenger-layout {
  overflow: hidden;
  border-top: 1px solid var(--jobbie-border, rgba(0, 0, 0, 0.1));
}

// ── Sidebar de conversas (desktop) ──
.thread-sidebar {
  width: 300px;
  min-width: 240px;
  flex-shrink: 0;
  border-right: 1px solid var(--jobbie-border, rgba(0, 0, 0, 0.1));
  background: var(--jobbie-card, #fff);
  overflow: hidden;
}

// ── Área principal do chat ──
.chat-main {
  overflow: hidden;
  min-width: 0;
  background: var(--jobbie-bg, #f9f9fb);
}

// ── Cabeçalho do chat ──
.chat-header {
  min-height: 64px;
  padding: 0 16px;
  flex-shrink: 0;
  background: var(--jobbie-card, #fff);
}

// ── Histórico de mensagens: flex-fill com scroll próprio ──
.chat-history {
  overflow-y: auto;
  padding: 0;
}

// ── Compositor de mensagem ──
.chat-composer {
  flex-shrink: 0;
  padding: 12px 16px 16px;
  background: var(--jobbie-card, #fff);
}

// ── Bolhas ──
.message-row {
  display: flex;

  &--me      { justify-content: flex-end; }
  &--contact { justify-content: flex-start; }
}

.message-bubble {
  max-width: min(75%, 480px);
  padding: 10px 14px;
  border-radius: 16px;
  background: rgba(0, 0, 0, 0.06);

  &--me {
    background: rgba(212, 20, 90, 0.22);
    border-bottom-right-radius: 4px;
  }
}

.message-time {
  opacity: 0.68;
}

.chat-img {
  width: 100%;
  min-width: 160px;
  max-width: 260px;
  height: auto;
  border-radius: 12px;
}

// ── Dialog mobile ──
.mobile-thread-dialog {
  width: min(92vw, 400px);
  height: 100vh;
  border-radius: 0;
  display: flex;
  flex-direction: column;
}

:deep(.q-dialog__inner) {
  width: 100%;
  height: 100%;
  padding: 0 !important;
}

.capture-input {
  display: none;
}
</style>
