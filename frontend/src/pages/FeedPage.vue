<template>
  <q-page class="page-shell q-px-md q-pt-md q-pb-xl">
    <q-card flat bordered class="section-card q-mb-md create-post-card">
      <q-card-section class="row items-center q-col-gutter-md">
        <div class="col-auto">
          <q-avatar color="primary" text-color="white">
            {{ auth.state.email.charAt(0).toUpperCase() }}
          </q-avatar>
        </div>
        <div class="col">
          <div class="text-subtitle2 text-weight-bold">Criar nova postagem</div>
          <div class="text-body2 text-grey-6">
            Publique um texto, uma foto da camera/galeria ou uma mensagem de voz gravada agora.
          </div>
        </div>
        <div class="col-12 col-md-auto row q-gutter-sm wrap justify-end">
          <q-btn flat rounded icon="article" label="Texto" @click="openPostComposer('text')" />
          <q-btn flat rounded icon="image" label="Imagem" @click="openPostComposer('image')" />
          <q-btn flat rounded icon="mic" label="Audio" @click="openPostComposer('audio')" />
        </div>
      </q-card-section>
    </q-card>

    <q-card v-if="isBootstrapping" flat bordered class="q-pa-md q-mb-md">
      <q-skeleton type="rect" height="150px" class="q-mb-sm" />
      <q-skeleton type="text" class="q-mb-xs" />
      <q-skeleton type="text" width="80%" class="q-mb-md" />
      <q-skeleton type="QBtn" width="140px" />
    </q-card>

    <q-infinite-scroll @load="onLoad" :offset="200" :disable="isBootstrapping || allLoaded">
      <div v-if="isDesktopFeed" class="feed-columns">
        <div v-for="(columnPosts, columnIndex) in desktopColumns" :key="columnIndex" class="feed-column">
          <div v-for="post in columnPosts" :key="post.id" class="feed-masonry-item">
            <q-card bordered flat class="feed-card">
              <q-card-section>
                <div class="row items-center q-col-gutter-sm">
                  <div class="col-auto">
                    <router-link
                      v-if="post.authorId"
                      :to="{ name: 'anuncio-detalhe', params: { id: post.authorId } }"
                      class="author-link"
                    >
                      <q-avatar color="deep-purple-6" text-color="white">
                        {{ post.author.charAt(0) }}
                      </q-avatar>
                    </router-link>
                    <q-avatar v-else color="deep-purple-6" text-color="white">
                      {{ post.author.charAt(0) }}
                    </q-avatar>
                  </div>
                  <div class="col">
                    <router-link
                      v-if="post.authorId"
                      :to="{ name: 'anuncio-detalhe', params: { id: post.authorId } }"
                      class="author-link"
                    >
                      <div class="text-subtitle2 text-weight-bold">{{ post.author }}</div>
                    </router-link>
                    <div v-else class="text-subtitle2 text-weight-bold">{{ post.author }}</div>
                    <div class="text-caption text-grey-6">{{ post.location }}</div>
                  </div>
                  <div class="col-auto text-caption text-grey-6">{{ post.timeAgo }}</div>
                </div>
              </q-card-section>

              <q-card-section class="q-pt-none">
                <div class="text-body1 q-mb-xs">{{ post.title }}</div>
                <div class="text-body2 text-grey-7">{{ post.description }}</div>
              </q-card-section>

              <q-card-section v-if="post.media.type !== 'text'" class="q-pt-none">
                <q-img
                  v-if="post.media.type === 'image'"
                  :src="post.media.src"
                  :alt="post.media.alt"
                  :ratio="4 / 5"
                  class="post-image"
                  @click="openImagePreview(post.media.src, post.media.alt)"
                />
                <audio-player-card
                  v-else-if="post.media.type === 'audio'"
                  :src="post.media.src"
                  :title="`Audio de ${post.author}`"
                  :subtitle="post.media.subtitle"
                  :cover-image="post.media.coverImage"
                />
                <simple-video-player
                  v-else
                  :src="post.media.src"
                  :poster="post.media.poster"
                />
              </q-card-section>

              <q-separator />

              <q-card-actions align="between">
                <q-btn
                  flat
                  rounded
                  :color="post.liked ? 'primary' : 'grey-7'"
                  icon="favorite"
                  :label="`${post.likes} curtidas`"
                  @click="toggleLike(post)"
                />
                <q-btn
                  flat
                  rounded
                  icon="comment"
                  :label="`${post.comments.length} comentarios`"
                  @click="openComments(post)"
                />
                <q-btn flat rounded icon="share" label="Compartilhar" @click="share(post)" />
              </q-card-actions>

              <q-separator />

              <q-card-section>
                <post-comment-composer
                  :can-comment="isAuthenticated"
                  @submit="submitInlineComment(post, $event)"
                  @request-auth="requestCommentAuth"
                />
              </q-card-section>
            </q-card>
          </div>
        </div>
      </div>

      <div v-else class="feed-masonry">
        <div v-for="post in posts" :key="post.id" class="feed-masonry-item">
          <q-card bordered flat class="feed-card">
            <q-card-section>
              <div class="row items-center q-col-gutter-sm">
                <div class="col-auto">
                  <router-link
                    v-if="post.authorId"
                    :to="{ name: 'anuncio-detalhe', params: { id: post.authorId } }"
                    class="author-link"
                  >
                    <q-avatar color="deep-purple-6" text-color="white">
                      {{ post.author.charAt(0) }}
                    </q-avatar>
                  </router-link>
                  <q-avatar v-else color="deep-purple-6" text-color="white">
                    {{ post.author.charAt(0) }}
                  </q-avatar>
                </div>
                <div class="col">
                  <router-link
                    v-if="post.authorId"
                    :to="{ name: 'anuncio-detalhe', params: { id: post.authorId } }"
                    class="author-link"
                  >
                    <div class="text-subtitle2 text-weight-bold">{{ post.author }}</div>
                  </router-link>
                  <div v-else class="text-subtitle2 text-weight-bold">{{ post.author }}</div>
                  <div class="text-caption text-grey-6">{{ post.location }}</div>
                </div>
                <div class="col-auto text-caption text-grey-6">{{ post.timeAgo }}</div>
              </div>
            </q-card-section>

            <q-card-section class="q-pt-none">
              <div class="text-body1 q-mb-xs">{{ post.title }}</div>
              <div class="text-body2 text-grey-7">{{ post.description }}</div>
            </q-card-section>

            <q-card-section v-if="post.media.type !== 'text'" class="q-pt-none">
              <q-img
                v-if="post.media.type === 'image'"
                :src="post.media.src"
                :alt="post.media.alt"
                :ratio="4 / 5"
                class="post-image"
                @click="openImagePreview(post.media.src, post.media.alt)"
              />
              <audio-player-card
                v-else-if="post.media.type === 'audio'"
                :src="post.media.src"
                :title="`Audio de ${post.author}`"
                :subtitle="post.media.subtitle"
                :cover-image="post.media.coverImage"
              />
              <simple-video-player
                v-else
                :src="post.media.src"
                :poster="post.media.poster"
              />
            </q-card-section>

            <q-separator />

            <q-card-actions align="between">
              <q-btn
                flat
                rounded
                :color="post.liked ? 'primary' : 'grey-7'"
                icon="favorite"
                :label="`${post.likes} curtidas`"
                @click="toggleLike(post)"
              />
              <q-btn
                flat
                rounded
                icon="comment"
                :label="`${post.comments.length} comentarios`"
                @click="openComments(post)"
              />
              <q-btn flat rounded icon="share" label="Compartilhar" @click="share(post)" />
            </q-card-actions>

            <q-separator />

            <q-card-section>
              <post-comment-composer
                :can-comment="isAuthenticated"
                @submit="submitInlineComment(post, $event)"
                @request-auth="requestCommentAuth"
              />
            </q-card-section>
          </q-card>
        </div>
      </div>

      <template #loading>
        <div class="row justify-center q-my-md">
          <q-spinner-dots color="primary" size="32px" />
        </div>
      </template>
    </q-infinite-scroll>

    <q-card v-if="allLoaded" flat bordered class="q-pa-lg text-center final-state">
      <div class="final-illustration q-mx-auto q-mb-sm">
        <UndrawPostOnline primary-color="#8e2de2" />
      </div>
      <div class="text-subtitle1 text-weight-bold">Voce chegou ao fim por agora</div>
      <div class="text-body2 text-grey-6">Atualize mais tarde para novas postagens do feed.</div>
    </q-card>

    <post-comments-dialog
      v-model="commentsDialogOpen"
      :post-title="selectedPost?.title ?? ''"
      :comments="selectedPost?.comments ?? []"
      :can-comment="isAuthenticated"
      @submit-comment="submitDialogComment"
      @request-auth="requestCommentAuth"
    />

    <image-viewer-dialog
      v-model="imageViewerOpen"
      :src="selectedImageSrc"
      :alt="selectedImageAlt"
    />

    <post-composer-dialog
      v-model="postComposerOpen"
      :initial-mode="postComposerMode"
      @submit="submitNewPost"
      @error="notifyComposerError"
    />
  </q-page>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useQuasar } from 'quasar';
import AudioPlayerCard from 'src/components/AudioPlayerCard.vue';
import ImageViewerDialog from 'src/components/ImageViewerDialog.vue';
import PostComposerDialog from 'src/components/PostComposerDialog.vue';
import PostCommentComposer from 'src/components/PostCommentComposer.vue';
import PostCommentsDialog from 'src/components/PostCommentsDialog.vue';
import SimpleVideoPlayer from 'src/components/SimpleVideoPlayer.vue';
import { useAuth } from 'src/composables/useAuth';
import { fetchFeedPostsPage } from 'src/services/content.service';
import type { SubmitCommentPayload } from 'src/types/comments';
import type { FeedPost } from 'src/types/content';
import type { PostComposerMode, PostComposerPayload } from 'src/types/post-composer';
import UndrawPostOnline from 'vue-undraw/UndrawPostOnline.vue';

const $q = useQuasar();
const auth = useAuth();
const isAuthenticated = computed(() => auth.isAuthenticated.value);
// Use platform instead of reactive viewport width to avoid remounting feed trees during fullscreen.
const isDesktopFeed = computed(() => $q.platform.is.desktop);

const isBootstrapping = ref(true);
const posts = ref<FeedPost[]>([]);
const currentPage = ref(0);
const allLoaded = ref(false);
const commentsDialogOpen = ref(false);
const selectedPostId = ref<number | null>(null);
const postComposerOpen = ref(false);
const postComposerMode = ref<PostComposerMode>('text');
const imageViewerOpen = ref(false);
const selectedImageSrc = ref('');
const selectedImageAlt = ref('Imagem do post');

const selectedPost = computed(() =>
  posts.value.find((post) => post.id === selectedPostId.value),
);

const desktopColumns = computed(() => {
  const columns: FeedPost[][] = [[], []];

  posts.value.forEach((post, index) => {
    columns[index % 2]?.push(post);
  });

  return columns;
});

function guardAction(action: string): boolean {
  if (isAuthenticated.value) {
    return true;
  }

  auth.requestAuth(action);
  $q.notify({
    type: 'warning',
    message: 'Crie sua conta para usar este recurso.',
    timeout: 2200,
    position: 'top',
  });
  return false;
}

function requestCommentAuth() {
  guardAction('comentar no feed');
}

function openPostComposer(mode: PostComposerMode) {
  if (!guardAction('criar postagens')) {
    return;
  }

  postComposerMode.value = mode;
  postComposerOpen.value = true;
}

function toggleLike(post: FeedPost) {
  if (!guardAction('curtir postagens')) {
    return;
  }

  post.liked = !post.liked;
  post.likes += post.liked ? 1 : -1;
}

function addComment(post: FeedPost, payload: SubmitCommentPayload) {
  if (!guardAction('comentar no feed')) {
    return;
  }

  const comment: FeedPost['comments'][number] = {
    id: Date.now(),
    author: auth.state.email.split('@')[0] ?? 'Voce',
    timeAgo: 'agora',
    body: payload.message,
  };

  if (payload.superComment) {
    comment.superComment = payload.superComment;
  }

  post.comments.unshift(comment);

  $q.notify({
    type: 'positive',
    message: payload.superComment
      ? `Super comentario de ${payload.superComment.amount.toLocaleString('pt-BR')} J-GOLD enviado para ${post.author}.`
      : `Comentario enviado para ${post.author}.`,
    timeout: 1800,
  });
}

function submitInlineComment(post: FeedPost, payload: SubmitCommentPayload) {
  addComment(post, payload);
}

function submitDialogComment(payload: SubmitCommentPayload) {
  if (!selectedPost.value) {
    return;
  }

  addComment(selectedPost.value, payload);
}

function openComments(post: FeedPost) {
  if (!guardAction('abrir comentarios')) {
    return;
  }

  selectedPostId.value = post.id;
  commentsDialogOpen.value = true;
}

function openImagePreview(src: string, alt?: string) {
  selectedImageSrc.value = src;
  selectedImageAlt.value = alt || 'Imagem do post';
  imageViewerOpen.value = true;
}

function share(post: FeedPost) {
  $q.notify({
    type: 'info',
    message: `Link da postagem de ${post.author} copiado.`,
    timeout: 1600,
  });
}

function notifyComposerError(message: string) {
  $q.notify({
    type: 'warning',
    message,
    timeout: 2200,
    position: 'top',
  });
}

function submitNewPost(payload: PostComposerPayload) {
  const mediaUrl = payload.mediaFile ? URL.createObjectURL(payload.mediaFile) : null;
  const media = (() => {
    if (payload.mode === 'text') {
      return { type: 'text' } as const;
    }

    if (payload.mode === 'image') {
      return {
        type: 'image',
        src: mediaUrl || '',
        alt: payload.title,
      } as const;
    }

    return {
      type: 'audio',
      src: mediaUrl || '',
      coverImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=900&q=80',
      subtitle: 'Mensagem de voz recem-gravada',
    } as const;
  })();

  posts.value.unshift({
    id: Date.now(),
    author: auth.state.email.split('@')[0] ?? 'Voce',
    location: 'Agora',
    timeAgo: 'agora',
    title: payload.title,
    description: payload.description,
    likes: 0,
    liked: false,
    media,
    comments: [],
  });

  $q.notify({
    type: 'positive',
    message: 'Post publicado com sucesso.',
    timeout: 2200,
    position: 'top',
  });
}

async function onLoad(_index: number, done: () => void) {
  if (allLoaded.value) {
    done();
    return;
  }

  const nextPage = currentPage.value + 1;
  const batch = await fetchFeedPostsPage(nextPage);

  if (batch.length === 0) {
    allLoaded.value = true;
    done();
    return;
  }

  currentPage.value = nextPage;
  posts.value.push(...batch);

  done();
}

onMounted(async () => {
  try {
    // Dica para iniciantes: carregamento inicial sempre no onMounted para manter o setup limpo.
    const firstPage = await fetchFeedPostsPage(0);
    posts.value = firstPage;
    allLoaded.value = firstPage.length === 0;
  } catch {
    $q.notify({
      type: 'negative',
      message: 'Nao foi possivel carregar o feed.',
      timeout: 2200,
      position: 'top',
    });
  } finally {
    isBootstrapping.value = false;
  }
});
</script>

<style scoped lang="scss">
.create-post-card {
  backdrop-filter: blur(8px);
}

.feed-card {
  width: 100%;
}

.feed-masonry-item {
  margin-bottom: 16px;
}

.post-image {
  border-radius: 18px;
  overflow: hidden;
  cursor: zoom-in;
}

.author-link {
  text-decoration: none;
  color: inherit;

  &:hover {
    .text-subtitle2 {
      text-decoration: underline;
    }
    .q-avatar {
      opacity: 0.85;
    }
  }
}

@media (min-width: 1024px) {
  .feed-columns {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 16px;
    align-items: start;
  }

  .feed-column {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .feed-masonry-item {
    margin-bottom: 0;
  }
}
</style>
