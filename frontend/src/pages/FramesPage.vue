<template>
  <q-page class="frames-page" style="padding: 0; overflow: hidden">
    <div ref="scrollRef" class="frames-scroll" :style="{ height: `${frameHeight}px` }">
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
  </q-page>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import PostCommentsDialog from 'src/components/PostCommentsDialog.vue';
import { frameVideos, type FrameVideo } from 'src/data/mock-content';
import { useAuth } from 'src/composables/useAuth';

const auth = useAuth();
const isAuthenticated = computed(() => auth.isAuthenticated.value);

// Frame height (calculated in onMounted to account for layout bars)
const frameHeight = ref(window.innerHeight);

// Local reactive copy so likes/liked mutate reactively
const frames = ref<FrameVideo[]>(frameVideos.map((f) => ({ ...f, comments: [...f.comments] })));

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

function onSubmitComment(text: string) {
  if (!selectedFrame.value) return;
  selectedFrame.value.comments.unshift({
    id: Date.now(),
    author: auth.state.email || 'Voce',
    timeAgo: 'agora',
    body: text,
  });
}

// ── Helpers ─────────────────────────────────────────────────────────────────
function formatCount(n: number): string {
  return n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n);
}

// ── IntersectionObserver (autoplay on scroll) ────────────────────────────────
const scrollRef = ref<HTMLElement | null>(null);
let observer: IntersectionObserver | null = null;

function setupObserver() {
  if (!scrollRef.value) return;
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

onMounted(() => {
  const pageContainer = document.querySelector('.q-page-container');
  const pt = pageContainer ? parseInt(getComputedStyle(pageContainer).paddingTop, 10) : 50;
  const pb = pageContainer ? parseInt(getComputedStyle(pageContainer).paddingBottom, 10) : 56;
  frameHeight.value = window.innerHeight - pt - pb;
  setupObserver();
});

onBeforeUnmount(() => {
  observer?.disconnect();
  if (flashTimer) clearTimeout(flashTimer);
  videoRefs.forEach((v) => v.pause());
});
</script>

<style scoped lang="scss">
.frames-page {
  background: #000;
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
  display: block;
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
  padding: 0 68px 20px 14px;
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
  padding: 0 8px 20px 0;
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
