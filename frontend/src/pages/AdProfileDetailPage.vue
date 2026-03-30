<template>
  <q-page class="page-shell q-px-md q-pt-md q-pb-xl">
    <q-card v-if="profile" flat bordered class="section-card overflow-hidden">
      <q-img :src="profile.coverImage" height="220px">
        <div class="absolute-bottom row items-end justify-between q-col-gutter-md q-pa-md profile-cover-overlay">
          <div class="col-auto row items-center q-gutter-sm">
            <q-avatar size="74px" class="profile-avatar-shadow">
              <img :src="profile.profileImage" :alt="profile.name" />
            </q-avatar>
            <div>
              <div class="text-h6 text-weight-bold">{{ profile.name }}</div>
              <div class="text-caption">{{ profile.city }} • {{ profile.neighborhood }}</div>
            </div>
          </div>

          <div class="col-auto">
            <q-chip color="primary" text-color="white" icon="verified">{{ profile.badge }}</q-chip>
          </div>
        </div>
      </q-img>

      <q-card-section>
        <div class="row q-col-gutter-md">
          <div class="col-12 col-md-8">
            <div class="text-overline page-kicker">Perfil completo</div>
            <h1 class="text-h5 q-my-xs text-weight-bold">{{ profile.hourlyRate }}</h1>
            <p class="text-body2 text-grey-6 q-mb-md">{{ profile.bio }}</p>

            <div class="row q-gutter-sm q-mb-md">
              <q-chip outline color="primary" icon="schedule">{{ profile.availability }}</q-chip>
              <q-chip outline color="secondary" icon="cake">{{ profile.age }} anos</q-chip>
              <q-chip outline color="accent" icon="language">
                {{ profile.languages.join(' • ') }}
              </q-chip>
              <q-chip
                :color="profile.sexuality === 'Trans' ? 'deep-purple' : 'blue-grey'"
                text-color="white"
                icon="transgender"
              >
                {{ profile.sexuality }}
              </q-chip>
              <q-chip outline :color="profile.gender === 'Feminino' ? 'pink' : 'blue'" icon="person">
                {{ profile.gender }}
              </q-chip>
            </div>

            <div class="text-subtitle1 text-weight-bold q-mb-sm">Servicos</div>
            <div class="row q-gutter-sm q-mb-md">
              <q-chip
                v-for="service in profile.services"
                :key="service"
                dense
                color="deep-orange-6"
                text-color="white"
              >
                {{ service }}
              </q-chip>
            </div>

            <div class="text-subtitle1 text-weight-bold q-mb-sm">Dados publicos</div>
            <q-list bordered separator class="rounded-borders q-mb-md">
              <q-item>
                <q-item-section avatar><q-icon name="straighten" /></q-item-section>
                <q-item-section><q-item-label>Altura</q-item-label></q-item-section>
                <q-item-section side>{{ profile.publicData.height }}</q-item-section>
              </q-item>
              <q-item>
                <q-item-section avatar><q-icon name="monitor_weight" /></q-item-section>
                <q-item-section><q-item-label>Peso</q-item-label></q-item-section>
                <q-item-section side>{{ profile.publicData.weight }}</q-item-section>
              </q-item>
              <q-item>
                <q-item-section avatar><q-icon name="self_improvement" /></q-item-section>
                <q-item-section><q-item-label>Tipo fisico</q-item-label></q-item-section>
                <q-item-section side>{{ profile.publicData.bodyType }}</q-item-section>
              </q-item>
              <q-item>
                <q-item-section avatar><q-icon name="face" /></q-item-section>
                <q-item-section><q-item-label>Cor do cabelo</q-item-label></q-item-section>
                <q-item-section side>{{ profile.publicData.hairColor }}</q-item-section>
              </q-item>
              <q-item>
                <q-item-section avatar><q-icon name="visibility" /></q-item-section>
                <q-item-section><q-item-label>Cor dos olhos</q-item-label></q-item-section>
                <q-item-section side>{{ profile.publicData.eyeColor }}</q-item-section>
              </q-item>
              <q-item>
                <q-item-section avatar><q-icon name="diversity_3" /></q-item-section>
                <q-item-section><q-item-label>Etnia</q-item-label></q-item-section>
                <q-item-section side>{{ profile.publicData.ethnicity }}</q-item-section>
              </q-item>
              <q-item>
                <q-item-section avatar><q-icon name="style" /></q-item-section>
                <q-item-section><q-item-label>Estilo</q-item-label></q-item-section>
                <q-item-section side>{{ profile.publicData.style }}</q-item-section>
              </q-item>
            </q-list>

            <div class="text-subtitle1 text-weight-bold q-mb-sm">Personalidade</div>
            <div class="row q-gutter-sm q-mb-lg">
              <q-chip
                v-for="trait in profile.publicData.personalityTraits"
                :key="trait"
                dense
                outline
                color="purple"
              >
                {{ trait }}
              </q-chip>
            </div>

            <div class="row q-gutter-sm">
              <q-btn
                color="primary"
                rounded
                unelevated
                icon="forum"
                label="Conversar agora"
                @click="openChat"
              />
              <q-btn flat rounded icon="arrow_back" label="Voltar para anuncios" :to="{ name: 'anuncios' }" />
            </div>
          </div>

          <div class="col-12 col-md-4">
            <div class="text-subtitle1 text-weight-bold q-mb-sm">Galeria</div>
            <div class="gallery-preview-grid q-mb-sm">
              <q-img
                v-for="(image, index) in previewGalleryImages"
                :key="`${image}-${index}`"
                :src="image"
                :alt="`Foto ${index + 1} de ${profile.name}`"
                :ratio="index % 5 === 0 ? 1 : 4 / 3"
                class="rounded-borders gallery-preview-item"
                @click="openGalleryPreview(index)"
              />
            </div>
            <q-btn
              flat
              rounded
              icon="photo_library"
              label="Ver galeria"
              :to="{ name: 'anuncio-galeria', params: { id: profile.id } }"
            />
          </div>
        </div>
      </q-card-section>
    </q-card>

    <q-card v-else-if="isLoadingProfile" flat bordered class="section-card q-pa-lg">
      <q-skeleton type="rect" height="220px" class="q-mb-md" />
      <q-skeleton type="text" class="q-mb-sm" width="60%" />
      <q-skeleton type="text" width="80%" />
    </q-card>

    <q-card v-else-if="loadProfileError" flat bordered class="section-card q-pa-lg text-center">
      <q-icon size="48px" name="wifi_off" color="negative" />
      <div class="text-h6 q-mt-sm">Falha ao carregar perfil</div>
      <div class="text-body2 text-grey-6 q-mt-xs q-mb-md">{{ loadProfileError }}</div>
      <q-btn color="primary" rounded unelevated label="Tentar novamente" @click="loadProfileData" />
    </q-card>

    <q-card v-else flat bordered class="section-card q-pa-lg text-center">
      <q-icon size="48px" name="person_off" color="warning" />
      <div class="text-h6 q-mt-sm">Perfil nao encontrado</div>
      <div class="text-body2 text-grey-6 q-mt-xs q-mb-md">
        Esse anuncio pode ter sido removido ou o link esta incorreto.
      </div>
      <q-btn color="primary" rounded unelevated label="Voltar para anuncios" :to="{ name: 'anuncios' }" />
    </q-card>

    <template v-if="profile">
      <div class="text-overline page-kicker q-mt-lg q-mb-sm">Publicacoes</div>
      <h2 class="text-h6 text-weight-bold q-mt-none q-mb-md">Historico de posts de {{ profile.name }}</h2>

      <div class="profile-posts-grid">
        <q-card
          v-for="post in profilePosts"
          :key="post.id"
          flat
          bordered
          class="section-card q-mb-md profile-post-card"
        >
          <q-card-section class="row items-center q-col-gutter-sm">
            <div class="col-auto">
              <q-avatar color="deep-purple-6" text-color="white">
                {{ post.author.charAt(0) }}
              </q-avatar>
            </div>
            <div class="col">
              <div class="text-subtitle2 text-weight-bold">{{ post.author }}</div>
              <div class="text-caption text-grey-6">{{ post.location }} • {{ post.timeAgo }}</div>
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
              class="rounded-borders post-image-preview"
              @click="openPostImagePreview(post.media.src)"
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
              @click="openComments(post.id)"
            />
            <q-btn flat rounded icon="share" label="Compartilhar" @click="share(post.author)" />
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

      <q-card v-if="profilePosts.length === 0" flat bordered class="section-card q-pa-lg text-center">
        <q-icon size="36px" name="feed" color="grey-5" />
        <div class="text-body1 text-grey-6 q-mt-sm">Nenhuma publicacao ainda.</div>
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
        :images="viewerImages"
        :initial-index="viewerImageIndex"
        :title="viewerTitle"
        @update:initialIndex="viewerImageIndex = $event"
      />
    </template>
  </q-page>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useQuasar } from 'quasar';
import { useRoute, useRouter } from 'vue-router';
import AudioPlayerCard from 'src/components/AudioPlayerCard.vue';
import ImageViewerDialog from 'src/components/ImageViewerDialog.vue';
import PostCommentComposer from 'src/components/PostCommentComposer.vue';
import PostCommentsDialog from 'src/components/PostCommentsDialog.vue';
import SimpleVideoPlayer from 'src/components/SimpleVideoPlayer.vue';
import { useAuth } from 'src/composables/useAuth';
import {
  fetchAdProfileDetailsById,
  fetchPostsByAuthorId,
  fetchProfileGallery,
} from 'src/services/content.service';
import type { SubmitCommentPayload } from 'src/types/comments';
import type { AdProfileDetails, FeedPost } from 'src/types/content';

const route = useRoute();
const router = useRouter();
const $q = useQuasar();
const auth = useAuth();
const isAuthenticated = computed(() => auth.isAuthenticated.value);

const profileId = computed(() => Number.parseInt(route.params.id as string, 10));
const profile = ref<AdProfileDetails | null>(null);
const profilePosts = ref<FeedPost[]>([]);
const isLoadingProfile = ref(true);
const loadProfileError = ref('');
const commentsDialogOpen = ref(false);
const selectedPostId = ref<number | null>(null);
const imageViewerOpen = ref(false);
const fullGalleryImages = ref<string[]>([]);
const viewerImages = ref<string[]>([]);
const viewerImageIndex = ref(0);
const viewerTitle = ref('Visualizador de imagem');
const selectedPost = computed(() => profilePosts.value.find((post) => post.id === selectedPostId.value));

const previewGalleryImages = computed(() => fullGalleryImages.value.slice(0, 6));

async function loadProfileData() {
  if (Number.isNaN(profileId.value)) {
    profile.value = null;
    profilePosts.value = [];
    fullGalleryImages.value = [];
    isLoadingProfile.value = false;
    return;
  }

  isLoadingProfile.value = true;
  loadProfileError.value = '';

  try {
    // Dica para iniciantes: todo fluxo de API desta tela fica centralizado aqui.
    const loadedProfile = await fetchAdProfileDetailsById(profileId.value);
    profile.value = loadedProfile;

    if (!loadedProfile) {
      profilePosts.value = [];
      fullGalleryImages.value = [];
      return;
    }

    const [posts, gallery] = await Promise.all([
      fetchPostsByAuthorId(loadedProfile.id),
      fetchProfileGallery(loadedProfile.id),
    ]);

    profilePosts.value = posts;
    fullGalleryImages.value = gallery;
  } catch {
    loadProfileError.value = 'Nao foi possivel carregar os dados do perfil agora.';
  } finally {
    isLoadingProfile.value = false;
  }
}

watch(profileId, () => {
  void loadProfileData();
}, { immediate: true });

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
  guardAction('comentar nesse perfil');
}

function toggleLike(post: FeedPost) {
  if (!guardAction('curtir postagens desse perfil')) {
    return;
  }

  post.liked = !post.liked;
  post.likes += post.liked ? 1 : -1;
}

function openComments(postId: number) {
  if (!guardAction('abrir comentarios')) {
    return;
  }

  selectedPostId.value = postId;
  commentsDialogOpen.value = true;
}

function addComment(post: FeedPost, payload: SubmitCommentPayload) {
  if (!guardAction('comentar nesse perfil')) {
    return;
  }

  const comment: FeedPost['comments'][number] = {
    id: Date.now(),
    author: auth.state.email?.split('@')[0] ?? 'Voce',
    timeAgo: 'agora',
    body: payload.message,
  };

  if (payload.superComment) {
    comment.superComment = payload.superComment;
  }

  post.comments.unshift(comment);
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

function share(author: string) {
  $q.notify({
    type: 'info',
    message: `Link da postagem de ${author} copiado.`,
    timeout: 1600,
  });
}

function openGalleryPreview(index: number) {
  if (fullGalleryImages.value.length === 0) {
    return;
  }

  viewerImages.value = fullGalleryImages.value;
  viewerImageIndex.value = index;
  viewerTitle.value = profile.value ? `Galeria de ${profile.value.name}` : 'Galeria';
  imageViewerOpen.value = true;
}

function openPostImagePreview(src: string) {
  viewerImages.value = [src];
  viewerImageIndex.value = 0;
  viewerTitle.value = 'Imagem da postagem';
  imageViewerOpen.value = true;
}

function openChat() {
  if (!profile.value) {
    return;
  }

  void router.push({
    name: 'mensagens',
    query: {
      thread: profile.value.id.toString(),
    },
  });
}
</script>

<style scoped lang="scss">
.profile-cover-overlay {
  background: linear-gradient(180deg, rgba(8, 5, 12, 0) 0%, rgba(8, 5, 12, 0.85) 100%);
}

.profile-avatar-shadow {
  border: 2px solid rgba(255, 255, 255, 0.9);
  box-shadow: 0 8px 18px rgba(0, 0, 0, 0.32);
}

.profile-post-card {
  width: 100%;
}

.post-image-preview {
  cursor: zoom-in;
}

.gallery-preview-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px;
}

.gallery-preview-item {
  cursor: zoom-in;
}

@media (min-width: 1024px) {
  .profile-posts-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 16px;
    align-items: start;
  }

  .profile-post-card {
    margin-bottom: 0 !important;
  }
}
</style>
