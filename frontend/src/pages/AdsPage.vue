<template>
  <q-page class="page-shell q-pa-md">
    <q-card flat bordered class="section-card q-mb-md">
      <q-card-section class="row items-center q-col-gutter-lg">
        <div class="col-12 col-md-4 illustration-box">
          <UndrawPeopleSearch primary-color="#d4145a" />
        </div>
        <div class="col-12 col-md-8">
          <div class="text-overline page-kicker">Anuncios</div>
          <h1 class="text-h5 q-my-none text-weight-bold">Perfis publicos das acompanhantes</h1>
          <p class="text-body2 text-grey-6 q-mt-sm q-mb-md">
            Cards com carrossel de imagens, cidade, destaque e valor inicial para descoberta rapida.
          </p>
          <div class="row q-gutter-sm">
            <q-chip outline color="primary">Verificadas</q-chip>
            <q-chip outline color="secondary">Agenda hoje</q-chip>
            <q-chip outline color="warning">Cidades em destaque</q-chip>
          </div>
        </div>
      </q-card-section>
    </q-card>

    <q-card flat bordered class="section-card q-mb-md filter-card">
      <q-card-section>
        <div class="row items-center justify-between q-col-gutter-md q-mb-sm">
          <div class="col-12 col-md-auto">
            <div class="text-subtitle1 text-weight-bold">Filtrar anuncios</div>
            <div class="text-body2 text-grey-6">
              Refine por nome, cidade e destaque do perfil.
            </div>
          </div>

          <div class="col-12 col-md-auto row justify-end">
            <q-btn flat rounded icon="filter_alt_off" label="Limpar filtros" @click="clearFilters" />
          </div>
        </div>

        <div class="row q-col-gutter-md">
          <div class="col-12 col-md-5">
            <q-input
              v-model="search"
              filled
              dense
              clearable
              label="Buscar por nome, bio ou cidade"
              prefix=""
            >
              <template #prepend>
                <q-icon name="search" />
              </template>
            </q-input>
          </div>

          <div class="col-12 col-sm-6 col-md-3">
            <q-select
              v-model="selectedCity"
              filled
              dense
              clearable
              label="Cidade"
              :options="cityOptions"
            />
          </div>

          <div class="col-12 col-sm-6 col-md-4">
            <q-select
              v-model="selectedBadge"
              filled
              dense
              clearable
              label="Destaque do perfil"
              :options="badgeOptions"
            />
          </div>

          <div class="col-12 col-sm-6 col-md-3">
            <q-select
              v-model="selectedGender"
              filled
              dense
              clearable
              label="Genero"
              :options="genderOptions"
              emit-value
              map-options
            />
          </div>

          <div class="col-12 col-sm-6 col-md-3">
            <q-select
              v-model="selectedSexuality"
              filled
              dense
              clearable
              label="Identidade"
              :options="sexualityOptions"
              emit-value
              map-options
            />
          </div>
        </div>

        <div class="row items-center justify-between q-mt-md q-gutter-sm">
          <div class="text-caption text-grey-6">
            {{ filteredProfiles.length }} perfil{{ filteredProfiles.length === 1 ? '' : 's' }} encontrado{{ filteredProfiles.length === 1 ? '' : 's' }}
          </div>

          <div class="row q-gutter-sm">
            <q-chip v-if="search" removable color="primary" text-color="white" @remove="search = ''">
              Busca: {{ search }}
            </q-chip>
            <q-chip v-if="selectedCity" removable outline color="secondary" @remove="selectedCity = null">
              {{ selectedCity }}
            </q-chip>
            <q-chip v-if="selectedBadge" removable outline color="warning" @remove="selectedBadge = null">
              {{ selectedBadge }}
            </q-chip>
            <q-chip
              v-if="selectedGender"
              removable
              outline
              :color="selectedGender === 'Feminino' ? 'pink' : 'blue'"
              @remove="selectedGender = null"
            >
              {{ selectedGender }}
            </q-chip>
            <q-chip
              v-if="selectedSexuality"
              removable
              outline
              :color="selectedSexuality === 'Trans' ? 'deep-purple' : 'blue-grey'"
              @remove="selectedSexuality = null"
            >
              {{ selectedSexuality }}
            </q-chip>
          </div>
        </div>
      </q-card-section>
    </q-card>

    <div class="row q-col-gutter-md">
      <div v-for="profile in filteredProfiles" :key="profile.id" class="col-12 col-md-6">
        <ad-profile-card :profile="profile" />
      </div>
    </div>

    <q-card v-if="filteredProfiles.length === 0" flat bordered class="section-card q-pa-lg text-center q-mt-md">
      <q-icon size="40px" name="filter_alt_off" color="warning" />
      <div class="text-subtitle1 text-weight-bold q-mt-sm">Nenhum perfil encontrado</div>
      <div class="text-body2 text-grey-6 q-mt-xs q-mb-md">
        Ajuste os filtros para encontrar outras acompanhantes.
      </div>
      <q-btn color="primary" rounded unelevated label="Limpar filtros" @click="clearFilters" />
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import AdProfileCard from 'src/components/AdProfileCard.vue';
import { adProfiles } from 'src/data/mock-content';
import type { AdGender, AdSexuality } from 'src/data/mock-content';
import UndrawPeopleSearch from 'vue-undraw/UndrawPeopleSearch.vue';
import { useUserPreferences } from 'src/composables/useUserPreferences';

const { preferences } = useUserPreferences();

const search = ref('');
const selectedCity = ref<string | null>(null);
const selectedBadge = ref<string | null>(null);

function prefsGender(): AdGender | null {
  if (preferences.interestedIn === 'Mulheres') return 'Feminino';
  if (preferences.interestedIn === 'Homens') return 'Masculino';
  return null;
}

function prefsSexuality(): AdSexuality | null {
  if (preferences.interestedSexuality === 'Ambos') return null;
  return preferences.interestedSexuality as AdSexuality;
}

const selectedGender = ref<AdGender | null>(prefsGender());
const selectedSexuality = ref<AdSexuality | null>(prefsSexuality());

const cityOptions = [...new Set(adProfiles.map((profile) => profile.city))].sort();
const badgeOptions = [...new Set(adProfiles.map((profile) => profile.badge))].sort();

const genderOptions: { label: string; value: AdGender }[] = [
  { label: 'Feminino', value: 'Feminino' },
  { label: 'Masculino', value: 'Masculino' },
  { label: 'Nao-binario', value: 'Nao-binario' },
];

const sexualityOptions: { label: string; value: AdSexuality }[] = [
  { label: 'Cis', value: 'Cis' },
  { label: 'Trans', value: 'Trans' },
];

const filteredProfiles = computed(() => {
  const normalizedSearch = search.value.trim().toLowerCase();

  return adProfiles.filter((profile) => {
    const matchesSearch =
      !normalizedSearch ||
      [profile.name, profile.city, profile.bio, profile.badge]
        .join(' ')
        .toLowerCase()
        .includes(normalizedSearch);

    const matchesCity = !selectedCity.value || profile.city === selectedCity.value;
    const matchesBadge = !selectedBadge.value || profile.badge === selectedBadge.value;
    const matchesGender = !selectedGender.value || profile.gender === selectedGender.value;
    const matchesSexuality = !selectedSexuality.value || profile.sexuality === selectedSexuality.value;

    return matchesSearch && matchesCity && matchesBadge && matchesGender && matchesSexuality;
  });
});

function clearFilters() {
  search.value = '';
  selectedCity.value = null;
  selectedBadge.value = null;
  selectedGender.value = null;
  selectedSexuality.value = null;
}
</script>

<style scoped lang="scss">
.filter-card {
  backdrop-filter: blur(8px);
}
</style>
