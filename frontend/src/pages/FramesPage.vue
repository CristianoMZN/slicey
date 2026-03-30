<template>
  <q-page class="frames-page" style="padding: 0; overflow: hidden">
    <div v-if="isLoadingFrames" class="frames-loading column items-center justify-center">
      <q-spinner-dots color="white" size="48px" />
      <div class="text-subtitle1 q-mt-md">Carregando Frames...</div>
    </div>

    <div v-else-if="loadFramesError" class="frames-loading column items-center justify-center q-px-lg">
      <q-icon name="wifi_off" color="negative" size="56px" />
      <div class="text-subtitle1 text-center q-mt-md">{{ loadFramesError }}</div>
      <q-btn color="primary" rounded unelevated label="Tentar novamente" class="q-mt-md" @click="loadFrames" />
    </div>

    <div v-else ref="scrollRef" class="frames-scroll" :style="{ height: `${frameHeight}px` }">
      <div
        v-for="frame in frames"
        :key="frame.id"
        class="frame-item"
        :data-id="frame.id"
        :style="{ height: `${frameHeight}px` }"
        @click="togglePlay(frame.id)"
      >
        <video
          :ref="(el) => bindVideoRef(el as HTMLVideoElement | null, frame.id)"
          :src="frame.videoSrc"
          :poster="frame.poster"
          class="frame-video"
          loop
          playsinline
          preload="metadata"
        />

        <transition name="pop">
          <div v-if="flashId === frame.id" class="play-flash">
            <q-icon :name="flashIcon" size="80px" color="white" />
          </div>
        </transition>

        <div class="frame-overlay">
          <div class="frame-info">
            <component
              :is="frame.authorId ? 'router-link' : 'div'"
              v-bind="
                frame.authorId
                  ? { to: { name: 'anuncio-detalhe', params: { id: frame.authorId } } }
                  : {}
              "
              class="author-row"
              @click.stop
            >
              <q-avatar size="44px" class="frame-avatar">
                {{ frame.author.charAt(0) }}
              </q-avatar>
              <div>
                <div class="author-name">{{ frame.author }}</div>
                <div class="author-location">
                  <q-icon name="location_on" size="12px" />
                  {{ frame.location }}
                </div>
              </div>
            </component>
            <div class="frame-desc q-mt-xs">{{ frame.description }}</div>
          </div>

          <div class="frame-actions" @click.stop>
            <div class="action-item">
              <q-btn
                round
                flat
                :icon="frame.liked ? 'favorite' : 'favorite_border'"
                :style="{ color: frame.liked ? '#ff4d6d' : 'white' }"
                size="md"
                @click="toggleLike(frame)"
              />
              <span class="action-count">{{ formatCount(frame.likes) }}</span>
            </div>

            <div class="action-item">
              <q-btn
                round
                flat
                icon="chat_bubble_outline"
                style="color: white"
                size="md"
                @click="openComments(frame)"
              />
              <span class="action-count">{{ frame.comments.length }}</span>
            </div>

            <div class="action-item">
              <q-btn
                round
                flat
                icon="share"
                style="color: white"
                size="md"
                @click.stop
              />
            </div>

            <div v-if="frame.authorId" class="action-item">
              <router-link
                :to="{ name: 'anuncio-detalhe', params: { id: frame.authorId } }"
                @click.stop
              >
                <q-btn round flat icon="person" style="color: white" size="md" />
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>

    <post-comments-dialog
      v-model="commentsOpen"
      :post-title="selectedFrame?.title ?? ''"
      :comments="selectedFrame?.comments ?? []"
      :can-comment="isAuthenticated"
      @submit-comment="onSubmitComment"
      @request-auth="() => {}"
    />

    <q-dialog
      v-model="creatorOpen"
      maximized
      transition-show="slide-up"
      transition-hide="slide-down"
      @hide="teardownCreatorSession"
    >
      <q-card class="creator-card">
        <q-card-section class="creator-topbar row items-center justify-between">
          <div>
            <div class="text-overline">Frames Studio</div>
            <div class="text-subtitle1 text-weight-bold">Crie um novo video</div>
          </div>
          <div class="row items-center q-gutter-sm">
            <q-chip dense color="grey-9" text-color="white" icon="photo_camera_front">
              {{ cameraFacingLabel }}
            </q-chip>
            <q-btn
              flat
              round
              dense
              icon="cameraswitch"
              :disable="creatorMode === 'recording' || isOpeningCamera"
              @click="toggleCameraFacing"
            />
            <q-btn flat round dense icon="close" @click="creatorOpen = false" />
          </div>
        </q-card-section>

        <q-card-section class="creator-stage-wrap q-pa-none">
          <div v-if="cameraError" class="camera-error-wrap q-pa-lg">
            <q-icon name="videocam_off" size="44px" color="negative" />
            <div class="text-subtitle1 text-weight-bold q-mt-sm">Nao foi possivel abrir a camera</div>
            <div class="text-body2 text-grey-5 q-mt-xs">{{ cameraError }}</div>
            <q-btn
              class="q-mt-md"
              color="primary"
              unelevated
              rounded
              icon="refresh"
              label="Tentar novamente"
              @click="openCreator"
            />
          </div>

          <div v-else class="creator-stage">
            <video
              v-show="creatorMode !== 'preview'"
              ref="cameraPreviewRef"
              class="creator-video"
              autoplay
              muted
              playsinline
              :style="{ filter: currentFilter.cssFilter, transform: cameraMirrorTransform }"
            />
            <video
              v-show="creatorMode === 'preview'"
              ref="recordedPreviewRef"
              class="creator-video"
              :src="recordedVideoUrl"
              loop
              autoplay
              controls
              playsinline
              :style="{ filter: currentFilter.cssFilter, transform: cameraMirrorTransform }"
            />

            <div class="creator-overlay">
              <div class="creator-status-chip">
                <q-chip
                  v-if="creatorMode === 'recording'"
                  dense
                  color="negative"
                  text-color="white"
                  icon="fiber_manual_record"
                >
                  Gravando {{ recordingDurationLabel }}
                </q-chip>
                <q-chip
                  v-else-if="creatorMode === 'preview'"
                  dense
                  color="secondary"
                  text-color="white"
                  icon="play_circle"
                >
                  Preview com filtro
                </q-chip>
                <q-chip
                  v-else
                  dense
                  color="dark"
                  text-color="white"
                  icon="videocam"
                >
                  Pronto para gravar
                </q-chip>
              </div>
            </div>
          </div>
        </q-card-section>

        <q-card-section class="creator-filters q-py-sm">
          <div class="text-caption text-weight-medium q-mb-xs">Filtros</div>
          <div class="filters-scroll row no-wrap q-gutter-sm">
            <q-btn
              v-for="filter in frameFilters"
              :key="filter.id"
              dense
              rounded
              no-caps
              :outline="selectedFilterId !== filter.id"
              :color="selectedFilterId === filter.id ? 'primary' : 'grey-7'"
              :label="filter.label"
              @click="selectedFilterId = filter.id"
            />
          </div>
        </q-card-section>

        <q-separator dark />

        <q-card-actions align="between" class="creator-actions q-pa-md">
          <q-btn
            v-if="creatorMode === 'preview'"
            flat
            color="white"
            rounded
            icon="replay"
            label="Regravar"
            @click="retryRecording"
          />
          <q-btn
            v-else
            flat
            color="white"
            rounded
            icon="refresh"
            label="Reiniciar camera"
            @click="restartCamera"
          />

          <div class="row items-center q-gutter-sm">
            <q-btn
              v-if="creatorMode === 'recording'"
              color="negative"
              unelevated
              rounded
              icon="stop_circle"
              label="Parar"
              @click="stopRecording"
            />
            <q-btn
              v-else-if="creatorMode === 'preview'"
              color="primary"
              unelevated
              rounded
              icon="cloud_upload"
              label="Postar"
              :loading="isUploading"
              @click="postRecordedVideo"
            />
            <q-btn
              v-else
              color="primary"
              unelevated
              rounded
              icon="fiber_manual_record"
              label="Gravar"
              :loading="isOpeningCamera"
              @click="startRecording"
            />
          </div>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { useQuasar } from 'quasar';
import PostCommentsDialog from 'src/components/PostCommentsDialog.vue';
import { useAuth } from 'src/composables/useAuth';
import { fetchFrameVideos } from 'src/services/content.service';
import type { SubmitCommentPayload } from 'src/types/comments';
import type { FrameVideo } from 'src/types/content';

type CreatorMode = 'idle' | 'recording' | 'preview';
type FrameFilter = {
  id: string;
  label: string;
  cssFilter: string;
};

const auth = useAuth();
const $q = useQuasar();
const isAuthenticated = computed(() => auth.isAuthenticated.value);

// Frame height (calculated in onMounted to account for layout bars)
const frameHeight = ref(window.innerHeight);
const frameBottomInset = ref(20);
const frameBottomInsetPx = computed(() => `${frameBottomInset.value}px`);
const isLoadingFrames = ref(true);
const loadFramesError = ref('');

const frames = ref<FrameVideo[]>([]);

const frameFilters: FrameFilter[] = [
  { id: 'none', label: 'Original', cssFilter: 'none' },
  { id: 'warm', label: 'Sunset', cssFilter: 'saturate(1.2) contrast(1.05) hue-rotate(-8deg)' },
  { id: 'vivid', label: 'Vivid', cssFilter: 'saturate(1.45) contrast(1.15)' },
  { id: 'mono', label: 'Mono', cssFilter: 'grayscale(1) contrast(1.12)' },
  { id: 'cool', label: 'Cool', cssFilter: 'saturate(1.1) hue-rotate(16deg) brightness(1.04)' },
  { id: 'fade', label: 'Fade', cssFilter: 'contrast(0.92) brightness(1.08) saturate(0.9)' },
];
const defaultFilter = frameFilters[0]!;
const selectedFilterId = ref(defaultFilter.id);
const currentFilter = computed(
  () => frameFilters.find((item) => item.id === selectedFilterId.value) ?? defaultFilter,
);

const creatorOpen = ref(false);
const creatorMode = ref<CreatorMode>('idle');
const isOpeningCamera = ref(false);
const isUploading = ref(false);
const cameraError = ref('');
const currentCameraFacing = ref<'environment' | 'user'>('environment');
const cameraPreviewRef = ref<HTMLVideoElement | null>(null);
const recordedPreviewRef = ref<HTMLVideoElement | null>(null);
const recordedVideoUrl = ref('');
const recordingSeconds = ref(0);

let cameraStream: MediaStream | null = null;
let mediaRecorder: MediaRecorder | null = null;
let recordingTimer: ReturnType<typeof setInterval> | null = null;
const recordedChunks: BlobPart[] = [];
let recordedBlob: Blob | null = null;
let recordingOutputStream: MediaStream | null = null;
let recordingDrawRaf: number | null = null;

const cameraFacingLabel = computed(() =>
  currentCameraFacing.value === 'user' ? 'Camera frontal' : 'Camera traseira',
);
const cameraMirrorTransform = computed(() =>
  currentCameraFacing.value === 'user' ? 'scaleX(-1)' : 'none',
);

// ── Video refs ─────────────────────────────────────────────────────────────
const videoRefs = new Map<number, HTMLVideoElement>();

function bindVideoRef(el: HTMLVideoElement | null, id: number) {
  if (el) {
    // Keep audio enabled by default for Frames playback.
    el.muted = false;
    el.defaultMuted = false;
    videoRefs.set(id, el);
  }
  else videoRefs.delete(id);
}

const recordingDurationLabel = computed(() => {
  const mins = Math.floor(recordingSeconds.value / 60)
    .toString()
    .padStart(2, '0');
  const secs = (recordingSeconds.value % 60).toString().padStart(2, '0');
  return `${mins}:${secs}`;
});

// ── Play / Pause ────────────────────────────────────────────────────────────
const flashId = ref<number | null>(null);
const flashIcon = ref<'play_arrow' | 'pause'>('play_arrow');
let flashTimer: ReturnType<typeof setTimeout> | null = null;

function togglePlay(id: number) {
  const video = videoRefs.get(id);
  if (!video) return;
  if (video.paused) {
    void video.play().catch(() => undefined);
    flashIcon.value = 'play_arrow';
  } else {
    video.pause();
    flashIcon.value = 'pause';
  }
  flashId.value = id;
  if (flashTimer) clearTimeout(flashTimer);
  flashTimer = setTimeout(() => {
    flashId.value = null;
  }, 700);
}

// ── Like ────────────────────────────────────────────────────────────────────
function toggleLike(frame: FrameVideo) {
  frame.liked = !frame.liked;
  frame.likes += frame.liked ? 1 : -1;
}

// ── Comments ────────────────────────────────────────────────────────────────
const commentsOpen = ref(false);
const selectedFrame = ref<FrameVideo | null>(null);

function openComments(frame: FrameVideo) {
  selectedFrame.value = frame;
  commentsOpen.value = true;
}

function onSubmitComment(payload: SubmitCommentPayload) {
  if (!selectedFrame.value) return;
  const comment: FrameVideo['comments'][number] = {
    id: Date.now(),
    author: auth.state.email || 'Voce',
    timeAgo: 'agora',
    body: payload.message,
  };

  if (payload.superComment) {
    comment.superComment = payload.superComment;
  }

  selectedFrame.value.comments.unshift(comment);
}

// ── Helpers ─────────────────────────────────────────────────────────────────
function formatCount(n: number): string {
  return n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n);
}

function clearRecordedAsset() {
  if (recordedVideoUrl.value) {
    URL.revokeObjectURL(recordedVideoUrl.value);
  }
  recordedVideoUrl.value = '';
  recordedBlob = null;
}

function startRecordingTimer() {
  recordingSeconds.value = 0;
  if (recordingTimer) {
    clearInterval(recordingTimer);
  }
  recordingTimer = setInterval(() => {
    recordingSeconds.value += 1;
  }, 1000);
}

function stopRecordingTimer() {
  if (recordingTimer) {
    clearInterval(recordingTimer);
    recordingTimer = null;
  }
}

function stopRecordingPipeline() {
  if (recordingDrawRaf !== null) {
    window.cancelAnimationFrame(recordingDrawRaf);
    recordingDrawRaf = null;
  }

  if (recordingOutputStream) {
    for (const track of recordingOutputStream.getTracks()) {
      track.stop();
    }
    recordingOutputStream = null;
  }
}

async function syncCameraToElement() {
  if (!cameraStream || !cameraPreviewRef.value) {
    return;
  }

  cameraPreviewRef.value.srcObject = cameraStream;
  try {
    await cameraPreviewRef.value.play();
  } catch {
    // Mobile browsers may require a direct user gesture to start playback.
  }
}

function releaseCamera() {
  if (!cameraStream) {
    return;
  }

  for (const track of cameraStream.getTracks()) {
    track.stop();
  }
  cameraStream = null;

  if (cameraPreviewRef.value) {
    cameraPreviewRef.value.srcObject = null;
  }
}

async function openCamera() {
  if (!navigator.mediaDevices?.getUserMedia) {
    cameraError.value = 'Seu navegador nao suporta captura de camera para este fluxo.';
    return;
  }

  if (!('MediaRecorder' in window)) {
    cameraError.value = 'Seu navegador nao suporta gravacao de video no momento.';
    return;
  }

  isOpeningCamera.value = true;
  cameraError.value = '';

  try {
    const getMedia = async (facingMode: ConstrainDOMString): Promise<MediaStream> =>
      navigator.mediaDevices.getUserMedia({
        video: {
          facingMode,
          width: { ideal: 1080 },
          height: { ideal: 1920 },
        },
        audio: true,
      });

    try {
      cameraStream = await getMedia({ exact: currentCameraFacing.value });
    } catch {
      cameraStream = await getMedia({ ideal: currentCameraFacing.value });
    }

    await nextTick();
    await syncCameraToElement();
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Permissao de camera negada.';
    cameraError.value = `Falha ao acessar camera: ${message}`;
  } finally {
    isOpeningCamera.value = false;
  }
}

async function openCreator() {
  clearRecordedAsset();
  creatorMode.value = 'idle';
  recordingSeconds.value = 0;
  selectedFilterId.value = defaultFilter.id;
  creatorOpen.value = true;
  await openCamera();
}

function restartCamera() {
  releaseCamera();
  void openCamera();
}

function toggleCameraFacing() {
  if (creatorMode.value === 'recording') {
    $q.notify({
      type: 'warning',
      message: 'Pare a gravacao para trocar de camera.',
      timeout: 1800,
    });
    return;
  }

  currentCameraFacing.value = currentCameraFacing.value === 'environment' ? 'user' : 'environment';

  if (creatorMode.value === 'preview') {
    clearRecordedAsset();
    creatorMode.value = 'idle';
  }

  restartCamera();
}

function resolveRecorderMimeType(): string | undefined {
  const options = ['video/mp4', 'video/webm;codecs=vp9,opus', 'video/webm;codecs=vp8,opus', 'video/webm'];
  return options.find((mime) => MediaRecorder.isTypeSupported(mime));
}

function createPortraitRecordingStream(sourceStream: MediaStream): MediaStream {
  const outputWidth = 720;
  const outputHeight = 1280;
  const videoEl = cameraPreviewRef.value;
  if (!videoEl) {
    return sourceStream;
  }

  const canvas = document.createElement('canvas');
  canvas.width = outputWidth;
  canvas.height = outputHeight;
  const ctx = canvas.getContext('2d', { alpha: false });
  if (!ctx) {
    return sourceStream;
  }

  const drawFrame = () => {
    const srcWidth = videoEl.videoWidth || outputWidth;
    const srcHeight = videoEl.videoHeight || outputHeight;

    ctx.clearRect(0, 0, outputWidth, outputHeight);
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, outputWidth, outputHeight);

    // Some mobile browsers expose camera frames in landscape even when device is upright.
    // Rotating those frames before recording guarantees a portrait (9:16) output asset.
    if (srcWidth > srcHeight) {
      const rotatedWidth = srcHeight;
      const rotatedHeight = srcWidth;
      const scale = Math.max(outputWidth / rotatedWidth, outputHeight / rotatedHeight);
      const drawWidth = rotatedWidth * scale;
      const drawHeight = rotatedHeight * scale;

      ctx.save();
      ctx.translate(outputWidth / 2, outputHeight / 2);
      ctx.rotate(Math.PI / 2);
      ctx.drawImage(videoEl, -drawWidth / 2, -drawHeight / 2, drawWidth, drawHeight);
      ctx.restore();
    } else {
      const scale = Math.max(outputWidth / srcWidth, outputHeight / srcHeight);
      const drawWidth = srcWidth * scale;
      const drawHeight = srcHeight * scale;
      const offsetX = (outputWidth - drawWidth) / 2;
      const offsetY = (outputHeight - drawHeight) / 2;

      ctx.drawImage(videoEl, offsetX, offsetY, drawWidth, drawHeight);
    }

    recordingDrawRaf = window.requestAnimationFrame(drawFrame);
  };

  drawFrame();

  const outputStream = canvas.captureStream(30);
  for (const audioTrack of sourceStream.getAudioTracks()) {
    outputStream.addTrack(audioTrack.clone());
  }
  return outputStream;
}

async function startRecording() {
  if (!cameraStream) {
    await openCamera();
  }

  if (!cameraStream) {
    $q.notify({
      type: 'negative',
      message: 'Camera indisponivel para iniciar gravacao.',
      timeout: 2200,
    });
    return;
  }

  clearRecordedAsset();
  recordedChunks.length = 0;
  stopRecordingPipeline();

  recordingOutputStream = createPortraitRecordingStream(cameraStream);

  const mimeType = resolveRecorderMimeType();
  mediaRecorder = mimeType
    ? new MediaRecorder(recordingOutputStream, { mimeType })
    : new MediaRecorder(recordingOutputStream);

  mediaRecorder.ondataavailable = (event) => {
    if (event.data.size > 0) {
      recordedChunks.push(event.data);
    }
  };

  mediaRecorder.onstop = async () => {
    stopRecordingTimer();
    stopRecordingPipeline();
    const blobType = mediaRecorder?.mimeType || mimeType || 'video/webm';
    recordedBlob = new Blob(recordedChunks, { type: blobType });
    recordedVideoUrl.value = URL.createObjectURL(recordedBlob);
    creatorMode.value = 'preview';
    releaseCamera();

    await nextTick();
    try {
      await recordedPreviewRef.value?.play();
    } catch {
      // Preview controls remain visible even if autoplay is blocked.
    }
  };

  mediaRecorder.start(250);
  creatorMode.value = 'recording';
  startRecordingTimer();
}

function stopRecording() {
  if (!mediaRecorder || mediaRecorder.state === 'inactive') {
    return;
  }
  mediaRecorder.stop();
}

function retryRecording() {
  clearRecordedAsset();
  creatorMode.value = 'idle';
  void openCamera();
}

async function postRecordedVideo() {
  if (!recordedBlob) {
    return;
  }

  isUploading.value = true;
  try {
    // Placeholder upload; replace endpoint when backend route is ready.
    await new Promise((resolve) => {
      window.setTimeout(resolve, 1200);
    });

    const localUrl = URL.createObjectURL(recordedBlob);
    frames.value.unshift({
      id: Date.now(),
      title: 'Meu novo Frame',
      author: auth.state.email?.split('@')[0] || 'Voce',
      description: `Publicado com filtro ${currentFilter.value.label}`,
      location: 'Agora',
      poster: localUrl,
      videoSrc: localUrl,
      likes: 0,
      liked: false,
      comments: [],
    });
    void nextTick().then(() => setupObserver());

    creatorOpen.value = false;
    $q.notify({
      type: 'positive',
      message: 'Video pronto! Quando o endpoint estiver definido, vamos enviar automaticamente para o backend.',
      timeout: 2500,
    });
  } finally {
    isUploading.value = false;
  }
}

function teardownCreatorSession() {
  stopRecordingTimer();
  stopRecordingPipeline();
  if (mediaRecorder && mediaRecorder.state !== 'inactive') {
    mediaRecorder.stop();
  }
  mediaRecorder = null;
  releaseCamera();
  clearRecordedAsset();
  creatorMode.value = 'idle';
}

function handleExternalCreateRequest() {
  void openCreator();
}

// ── IntersectionObserver (autoplay on scroll) ────────────────────────────────
const scrollRef = ref<HTMLElement | null>(null);
let observer: IntersectionObserver | null = null;

function setupObserver() {
  if (!scrollRef.value) return;
  observer?.disconnect();
  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        const id = Number((entry.target as HTMLElement).dataset.id);
        const video = videoRefs.get(id);
        if (!video) continue;
        if (entry.isIntersecting) {
          void video.play().catch(() => undefined);
        } else {
          video.pause();
        }
      }
    },
    { root: scrollRef.value, threshold: 0.75 },
  );
  scrollRef.value.querySelectorAll<HTMLElement>('.frame-item').forEach((el) =>
    observer!.observe(el),
  );
}

async function loadFrames() {
  isLoadingFrames.value = true;
  loadFramesError.value = '';

  try {
    // Dica para iniciantes: a pagina nao conhece endpoint, so chama o service.
    frames.value = await fetchFrameVideos();
    await nextTick();
    setupObserver();
  } catch {
    loadFramesError.value = 'Nao foi possivel carregar os videos agora.';
  } finally {
    isLoadingFrames.value = false;
  }
}

function updateViewportMetrics() {
  const pageContainer = document.querySelector('.q-page-container');
  const pageStyles = pageContainer ? getComputedStyle(pageContainer) : null;
  const pt = pageStyles ? parseInt(pageStyles.paddingTop, 10) : 50;
  const pb = pageStyles ? parseInt(pageStyles.paddingBottom, 10) : 56;
  const viewportHeight = window.visualViewport?.height ?? window.innerHeight;

  frameHeight.value = Math.max(320, Math.round(viewportHeight - pt - pb));
  // Keep content controls/info comfortably above the footer area.
  frameBottomInset.value = Math.max(20, Math.round(pb * 0.35));
}

onMounted(() => {
  updateViewportMetrics();
  void loadFrames();
  window.addEventListener('jobbie:frames-create-video', handleExternalCreateRequest);
  window.addEventListener('resize', updateViewportMetrics);
  window.addEventListener('orientationchange', updateViewportMetrics);
  window.visualViewport?.addEventListener('resize', updateViewportMetrics);
  window.visualViewport?.addEventListener('scroll', updateViewportMetrics);
});

onBeforeUnmount(() => {
  observer?.disconnect();
  if (flashTimer) clearTimeout(flashTimer);
  videoRefs.forEach((v) => v.pause());
  window.removeEventListener('jobbie:frames-create-video', handleExternalCreateRequest);
  window.removeEventListener('resize', updateViewportMetrics);
  window.removeEventListener('orientationchange', updateViewportMetrics);
  window.visualViewport?.removeEventListener('resize', updateViewportMetrics);
  window.visualViewport?.removeEventListener('scroll', updateViewportMetrics);
  teardownCreatorSession();
});

watch(
  () => cameraPreviewRef.value,
  () => {
    void syncCameraToElement();
  },
);
</script>

<style scoped lang="scss">
.frames-page {
  background: #000;
}

.frames-loading {
  min-height: 100%;
  color: #fff;
}

.creator-card {
  background: radial-gradient(circle at top right, rgba(212, 20, 90, 0.2), transparent 32%),
    linear-gradient(180deg, #0f0916 0%, #09050d 100%);
  color: #fff;
}

.creator-topbar {
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.creator-stage-wrap {
  position: relative;
  height: min(58vh, 560px);
  background: #000;
}

.creator-stage {
  position: relative;
  width: 100%;
  height: 100%;
}

.creator-video {
  width: 100%;
  height: 100%;
  object-fit: cover;
  background: #000;
}

.creator-overlay {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0.35), transparent 24%, rgba(0, 0, 0, 0.58));
}

.creator-status-chip {
  position: absolute;
  left: 12px;
  top: 12px;
}

.creator-filters {
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.filters-scroll {
  overflow-x: auto;
  padding-bottom: 4px;
}

.creator-actions {
  min-height: 74px;
}

.camera-error-wrap {
  min-height: 260px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.frames-scroll {
  overflow-y: scroll;
  scroll-snap-type: y mandatory;
  overscroll-behavior: contain;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }
}

.frame-item {
  position: relative;
  overflow: hidden;
  scroll-snap-align: start;
  background: #000;
  cursor: pointer;
}

.frame-video {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center center;
  display: block;
  background: #000;
}

.frame-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: flex-end;
  background: linear-gradient(
    to bottom,
    transparent 0%,
    transparent 38%,
    rgba(0, 0, 0, 0.3) 60%,
    rgba(0, 0, 0, 0.72) 100%
  );
  pointer-events: none;
}

// ── Bottom-left info ─────────────────────────────────────────────────────────
.frame-info {
  flex: 1;
  min-width: 0;
  padding: 0 68px v-bind(frameBottomInsetPx) 14px;
  pointer-events: auto;
}

.author-row {
  display: flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
  margin-bottom: 6px;
  cursor: pointer;
}

.frame-avatar {
  background: linear-gradient(135deg, #8e2de2, #d4145a);
  color: #fff;
  font-weight: 700;
  font-size: 17px;
  flex-shrink: 0;
}

.author-name {
  color: #fff;
  font-size: 14px;
  font-weight: 700;
  line-height: 1.3;
  text-shadow: 0 1px 6px rgba(0, 0, 0, 0.6);
}

.author-location {
  color: rgba(255, 255, 255, 0.72);
  font-size: 12px;
  text-shadow: 0 1px 4px rgba(0, 0, 0, 0.5);
}

.frame-desc {
  color: rgba(255, 255, 255, 0.92);
  font-size: 13px;
  line-height: 1.45;
  text-shadow: 0 1px 4px rgba(0, 0, 0, 0.6);
  display: -webkit-box;
  -webkit-line-clamp: 3;
    line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

// ── Right action buttons ─────────────────────────────────────────────────────
.frame-actions {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 8px v-bind(frameBottomInsetPx) 0;
  pointer-events: auto;
}

.action-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 10px;

  a {
    text-decoration: none;
  }
}

.action-count {
  color: #fff;
  font-size: 11px;
  font-weight: 700;
  margin-top: -4px;
  text-shadow: 0 1px 5px rgba(0, 0, 0, 0.7);
  letter-spacing: 0.3px;
}

// ── Play/pause flash indicator ───────────────────────────────────────────────
.play-flash {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
  filter: drop-shadow(0 2px 10px rgba(0, 0, 0, 0.7));
}

.pop-enter-active {
  animation: pop-in 0.12s ease-out;
}

.pop-leave-active {
  animation: pop-out 0.55s ease-in;
}

@keyframes pop-in {
  from {
    opacity: 0;
    transform: scale(0.4);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes pop-out {
  from {
    opacity: 1;
    transform: scale(1);
  }
  to {
    opacity: 0;
    transform: scale(1.35);
  }
}
</style>
