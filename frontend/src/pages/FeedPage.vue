<template>
  <q-page class="page-shell q-px-md q-pt-md q-pb-xl">
    <div class="page-head q-mb-md">
      <div>
        <div class="text-overline page-kicker">Timeline publica</div>
        <h1 class="text-h5 q-my-none text-weight-bold">Feed infinito</h1>
      </div>
      <q-chip
        square
        outline
        :color="isAuthenticated ? 'positive' : 'warning'"
        :text-color="isAuthenticated ? 'positive' : 'warning'"
      >
        {{ isAuthenticated ? 'Logado' : 'Modo visitante' }}
      </q-chip>
    </div>

    <q-banner v-if="!isAuthenticated" rounded class="guest-banner q-mb-md">
      <template #avatar>
        <q-icon name="lock" color="warning" />
      </template>
      O feed e livre. Para comentar, curtir e navegar em outras abas, registre-se em 1 clique.
      <template #action>
        <q-btn flat color="primary" label="Criar conta" @click="requestAuth('interagir com o feed')" />
      </template>
    </q-banner>

    <q-card flat bordered class="hero-card q-mb-md">
      <q-card-section class="row items-center no-wrap q-col-gutter-md">
        <div class="col-auto hero-illustration">
          <UndrawSocialMedia primary-color="#d4145a" />
        </div>
        <div class="col">
          <div class="text-subtitle1 text-weight-bold">Novidades fresquinhas o dia todo</div>
          <div class="text-body2 text-grey-6">
            Curta publicacoes, descubra perfis e acompanhe tendencias da comunidade em tempo real.
          </div>
        </div>
      </q-card-section>
    </q-card>

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
      <q-card v-for="post in posts" :key="post.id" bordered flat class="feed-card q-mb-md">
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
            class="post-image"
            height="280px"
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
import PostComposerDialog from 'src/components/PostComposerDialog.vue';
import PostCommentComposer from 'src/components/PostCommentComposer.vue';
import PostCommentsDialog from 'src/components/PostCommentsDialog.vue';
import SimpleVideoPlayer from 'src/components/SimpleVideoPlayer.vue';
import { useAuth } from 'src/composables/useAuth';
import { baseFeedPosts, type FeedPost } from 'src/data/mock-content';
import type { SubmitCommentPayload } from 'src/types/comments';
import type { PostComposerMode, PostComposerPayload } from 'src/types/post-composer';
import UndrawPostOnline from 'vue-undraw/UndrawPostOnline.vue';
import UndrawSocialMedia from 'vue-undraw/UndrawSocialMedia.vue';

const $q = useQuasar();
const auth = useAuth();
const isAuthenticated = computed(() => auth.isAuthenticated.value);

const isBootstrapping = ref(true);
const posts = ref<FeedPost[]>([]);
const currentPage = ref(0);
const maxPages = 3;
const allLoaded = computed(() => currentPage.value >= maxPages);
const commentsDialogOpen = ref(false);
const selectedPostId = ref<number | null>(null);
const postComposerOpen = ref(false);
const postComposerMode = ref<PostComposerMode>('text');

const selectedPost = computed(() =>
  posts.value.find((post) => post.id === selectedPostId.value),
);

function requestAuth(action: string) {
  auth.requestAuth(action);
}

function createBatch(page: number): FeedPost[] {
  return baseFeedPosts.map((template, index) => ({
    ...template,
    id: page * 100 + template.id,
    timeAgo: page === 0 ? template.timeAgo : `${page + index + 2}h`,
    likes: template.likes + page * 17,
    liked: false,
    media: { ...template.media },
    comments: template.comments.map((comment, commentIndex) => ({
      ...comment,
      id: page * 1000 + index * 100 + commentIndex + 1,
    })),
  }));
}

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

async function onLoad(index: number, done: () => void) {
  if (allLoaded.value) {
    done();
    return;
  }

  await new Promise<void>((resolve) => {
    setTimeout(() => resolve(), 700 + index * 70);
  });

  currentPage.value += 1;
  posts.value.push(...createBatch(currentPage.value));
  done();
}

onMounted(async () => {
  await new Promise<void>((resolve) => {
    setTimeout(() => resolve(), 900);
  });

  posts.value = createBatch(0);
  isBootstrapping.value = false;
});
</script>

<style scoped lang="scss">
.create-post-card {
  backdrop-filter: blur(8px);
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
</style>
