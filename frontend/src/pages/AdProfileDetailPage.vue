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
            <div class="column q-gutter-sm">
              <q-img
                v-for="(image, index) in profile.gallery"
                :key="`${image}-${index}`"
                :src="image"
                :alt="`Foto ${index + 1} de ${profile.name}`"
                height="120px"
                class="rounded-borders"
              />
            </div>
          </div>
        </div>
      </q-card-section>
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

      <q-card
        v-for="post in profilePosts"
        :key="post.id"
        flat
        bordered
        class="section-card q-mb-md"
      >
        <q-card-section class="row items-center q-col-gutter-sm">
          <div class="col-auto">
            <q-avatar color="deep-purple-6" text-color="white">
              {{ post.author.charAt(0) }}
            </q-avatar>
          </div>
          <div class="col">
            <div class="text-subtitle2 text-weight-bold">{{ post.author }}</div>
            <div class="text-caption text-grey-6">{{ post.location }} &bull; {{ post.timeAgo }}</div>
          </div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <div class="text-body1 q-mb-xs">{{ post.title }}</div>
          <div class="text-body2 text-grey-7">{{ post.description }}</div>
        </q-card-section>

        <q-card-section v-if="post.media.type === 'image'" class="q-pt-none">
          <q-img :src="post.media.src" :alt="post.media.alt" height="220px" class="rounded-borders" />
        </q-card-section>

        <q-card-section v-else-if="post.media.type === 'audio'" class="q-pt-none">
          <audio controls :src="post.media.src" class="full-width" />
        </q-card-section>

        <q-card-section v-else-if="post.media.type === 'video'" class="q-pt-none">
          <video controls :src="post.media.src" :poster="post.media.poster" class="full-width rounded-borders" style="max-height:280px" />
        </q-card-section>

        <q-separator />
        <q-card-actions align="left">
          <q-btn flat rounded icon="favorite" :label="`${post.likes} curtidas`" color="grey-7" />
          <q-btn flat rounded icon="comment" :label="`${post.comments.length} comentarios`" color="grey-7" />
        </q-card-actions>
      </q-card>

      <q-card v-if="profilePosts.length === 0" flat bordered class="section-card q-pa-lg text-center">
        <q-icon size="36px" name="feed" color="grey-5" />
        <div class="text-body1 text-grey-6 q-mt-sm">Nenhuma publicacao ainda.</div>
      </q-card>
    </template>
  </q-page>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { adProfilesDetails, baseFeedPosts } from 'src/data/mock-content';

const route = useRoute();
const router = useRouter();

const profileId = computed(() => Number.parseInt(route.params.id as string, 10));
const profile = computed(() => adProfilesDetails.find((item) => item.id === profileId.value));
const profilePosts = computed(() =>
  baseFeedPosts.filter((post) => post.authorId === profileId.value),
);

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
</style>
