<template>
  <q-page class="page-shell q-px-md q-pt-md q-pb-xl">
    <q-card flat bordered class="section-card profile-card q-pa-sm">
      <q-card-section class="q-pb-none">
        <div class="text-overline page-kicker">Meu perfil</div>
        <h1 class="text-h5 q-my-none text-weight-bold">Dados publicos e validacao cadastral</h1>
      </q-card-section>

      <q-card-section class="row q-col-gutter-lg items-start">
        <div class="col-12 col-lg-4">
          <div class="illustration-box q-mx-auto q-mb-md">
            <UndrawProfileData primary-color="#8e2de2" />
          </div>

          <q-card flat bordered class="q-pa-md profile-summary">
            <div class="text-subtitle1 text-weight-bold q-mb-sm">Resumo de perfil</div>
            <q-linear-progress stripe rounded size="10px" :value="0.74" color="primary" />
            <div class="text-caption text-grey-6 q-mt-sm">
              Complete os campos abaixo para aumentar a confianca e liberar recursos de pagamento.
            </div>
          </q-card>
        </div>

        <div class="col-12 col-lg-8">
          <q-form class="column q-gutter-md" @submit="saveProfile">
            <!-- Status de conta de criador -->
            <q-card v-if="auth.state.userType === 'creator'" flat bordered class="q-pa-md creator-approved-card">
              <div class="row items-center q-gutter-md">
                <q-icon name="verified" color="primary" size="2.5rem" />
                <div>
                  <div class="text-subtitle1 text-weight-bold">Voce agora e um criador!</div>
                  <div class="text-body2 text-grey-6 q-mt-xs">
                    Sua conta foi verificada e aprovada. Voce pode publicar conteudo exclusivo e receber pagamentos.
                  </div>
                </div>
              </div>
            </q-card>

            <q-card v-else-if="auth.state.creatorVerificationStatus === 'pending-review'" flat bordered class="q-pa-md creator-pending-card">
              <div class="row items-center q-gutter-md">
                <q-icon name="hourglass_top" color="warning" size="2.5rem" />
                <div>
                  <div class="text-subtitle1 text-weight-bold">Conta de criador em analise</div>
                  <div class="text-body2 text-grey-6 q-mt-xs">
                    Seus documentos foram recebidos e estao sendo verificados pela nossa equipe. Voce sera notificado quando a aprovacao ocorrer.
                  </div>
                </div>
              </div>
            </q-card>

            <q-card v-else flat bordered class="q-pa-md creator-invite-card">
              <div class="text-subtitle1 text-weight-bold q-mb-sm">Quero ser um criador</div>
              <div class="text-body2 text-grey-6 q-mb-md">
                Preencha seus dados pessoais abaixo e clique em <strong>Enviar para verificacao KYC</strong>
                para submeter sua conta para analise. Se aprovado, voce podera publicar conteudo exclusivo e receber pagamentos.
              </div>
              <q-btn
                color="secondary"
                unelevated
                rounded
                icon="star"
                label="Enviar para verificacao KYC"
                :loading="auth.state.isSubmittingAuth"
                :disable="!canApplyForCreator"
                @click="applyForCreator"
              />
              <div v-if="!canApplyForCreator" class="text-caption text-grey-6 q-mt-sm">
                Preencha nome completo, CPF, data de nascimento e endereco para continuar.
              </div>
            </q-card>
            <!-- /Status de conta de criador -->

            <q-card flat bordered class="q-pa-md">
              <div class="text-subtitle1 text-weight-bold q-mb-md">Dados publicos</div>
              <div class="row q-col-gutter-sm">
                <div class="col-12 col-sm-6">
                  <q-input v-model="form.displayName" filled dense label="Nome de exibicao" />
                </div>
                <div class="col-12 col-sm-6">
                  <q-input v-model="form.city" filled dense label="Cidade" />
                </div>
                <div class="col-12">
                  <q-input v-model="form.profileImage" filled dense label="Imagem de perfil (URL)" />
                </div>
                <div class="col-12">
                  <q-input v-model="form.coverImage" filled dense label="Imagem de capa (URL)" />
                </div>
                <div class="col-12">
                  <q-input v-model="form.bio" filled type="textarea" autogrow label="BIO" />
                </div>
              </div>
            </q-card>

            <q-card flat bordered class="q-pa-md">
              <div class="text-subtitle1 text-weight-bold q-mb-md">Dados pessoais para validacao cadastral</div>
              <div class="row q-col-gutter-sm">
                <div class="col-12 col-sm-6">
                  <q-input v-model="form.fullName" filled dense label="Nome completo" />
                </div>
                <div class="col-12 col-sm-6">
                  <q-input v-model="form.socialName" filled dense label="Nome social" />
                </div>
                <div class="col-12 col-sm-6">
                  <q-input v-model="form.cpf" filled dense label="CPF" mask="###.###.###-##" />
                </div>
                <div class="col-12 col-sm-6">
                  <q-input v-model="form.birthDate" filled dense label="Data de nascimento" mask="##/##/####" />
                </div>
                <div class="col-12">
                  <q-input v-model="form.address" filled dense label="Endereco completo" />
                </div>
              </div>
            </q-card>

            <q-card flat bordered class="q-pa-md">
              <div class="text-subtitle1 text-weight-bold q-mb-md">Informacoes de contato</div>
              <div class="row q-col-gutter-sm">
                <div class="col-12 col-sm-6">
                  <q-input v-model="form.email" filled dense type="email" label="Email" />
                </div>
                <div class="col-12 col-sm-6">
                  <q-input
                    v-model="form.whatsapp"
                    filled
                    dense
                    label="WhatsApp"
                    mask="(##) #####-####"
                    unmasked-value
                  />
                </div>
              </div>
            </q-card>

            <q-card flat bordered class="q-pa-md">
              <div class="text-subtitle1 text-weight-bold q-mb-md">Informacoes de recebimento (mesmo CPF do cadastro)</div>
              <div class="row q-col-gutter-sm">
                <div class="col-12 col-sm-4">
                  <q-input v-model="form.bankName" filled dense label="Banco" />
                </div>
                <div class="col-12 col-sm-4">
                  <q-input v-model="form.bankBranch" filled dense label="Agencia" />
                </div>
                <div class="col-12 col-sm-4">
                  <q-input v-model="form.bankAccount" filled dense label="Conta" />
                </div>
              </div>
            </q-card>

            <q-card flat bordered class="q-pa-md">
              <div class="text-subtitle1 text-weight-bold q-mb-md">Informacoes de pagamento</div>
              <div class="row q-col-gutter-sm">
                <div class="col-12 col-sm-6">
                  <q-input v-model="form.cardHolder" filled dense label="Nome no cartao" />
                </div>
                <div class="col-12 col-sm-6">
                  <q-input v-model="form.cardNumber" filled dense label="Numero do cartao" mask="#### #### #### ####" />
                </div>
                <div class="col-12 col-sm-4">
                  <q-input v-model="form.cardExpiry" filled dense label="Validade" mask="##/##" />
                </div>
                <div class="col-12 col-sm-4">
                  <q-input v-model="form.cardCvv" filled dense label="CVV" mask="###" />
                </div>
                <div class="col-12 col-sm-4 row items-center">
                  <q-toggle v-model="form.oneClick" color="primary" label="Ativar compras com 1 clique" />
                </div>
              </div>

              <q-banner rounded class="payment-banner q-mt-md">
                Seus dados de cartao sao criptografados. Para maior seguranca, voce pode usar um cartao virtual gerado para compras online.
              </q-banner>
            </q-card>

            <q-card flat bordered class="q-pa-md">
              <div class="text-subtitle1 text-weight-bold q-mb-md">Preferencias de busca</div>
              <div class="text-body2 text-grey-6 q-mb-md">
                Defina seu interesse padrao. Essas opcoes pre-preenchem os filtros da tela de anuncios e podem ser ajustadas a qualquer momento durante uma busca.
              </div>
              <div class="row q-col-gutter-sm">
                <div class="col-12 col-sm-6">
                  <q-select
                    v-model="preferences.interestedIn"
                    filled
                    dense
                    label="Interesse em"
                    :options="interestedInOptions"
                    emit-value
                    map-options
                  />
                </div>
                <div class="col-12 col-sm-6">
                  <q-select
                    v-model="preferences.interestedSexuality"
                    filled
                    dense
                    label="Identidade de genero preferida"
                    :options="sexualityOptions"
                    emit-value
                    map-options
                  />
                </div>
              </div>
            </q-card>

            <div class="row items-center q-gutter-sm">
              <q-btn type="submit" color="primary" unelevated rounded icon="save" label="Salvar alteracoes" />
              <q-btn flat rounded icon="visibility" label="Visualizar perfil publico" :to="{ name: 'anuncios' }" />
            </div>
          </q-form>
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { computed, reactive } from 'vue';
import { useQuasar } from 'quasar';
import UndrawProfileData from 'vue-undraw/UndrawProfileData.vue';
import { useAuth } from 'src/composables/useAuth';
import { useUserPreferences } from 'src/composables/useUserPreferences';

const $q = useQuasar();
const auth = useAuth();
const { preferences } = useUserPreferences();

const interestedInOptions = [
  { label: 'Mulheres', value: 'Mulheres' },
  { label: 'Homens', value: 'Homens' },
  { label: 'Ambos', value: 'Ambos' },
];

const sexualityOptions = [
  { label: 'Cis', value: 'Cis' },
  { label: 'Trans', value: 'Trans' },
  { label: 'Ambos', value: 'Ambos' },
];

const form = reactive({
  displayName: 'Cristiano',
  city: 'Curitiba',
  profileImage: '',
  coverImage: '',
  bio: 'Criador no Jobbie',
  fullName: '',
  socialName: '',
  cpf: '',
  birthDate: '',
  address: '',
  email: 'usuario@jobbie.app',
  whatsapp: '',
  bankName: '',
  bankBranch: '',
  bankAccount: '',
  cardHolder: '',
  cardNumber: '',
  cardExpiry: '',
  cardCvv: '',
  oneClick: true,
});

async function applyForCreator() {
  try {
    await auth.submitCreatorApplication({
      fullName: form.fullName.trim(),
      cpf: form.cpf.trim(),
      birthDate: form.birthDate.trim(),
      address: form.address.trim(),
    });
    $q.notify({
      type: 'positive',
      message: 'Solicitacao enviada! Sua conta esta em analise.',
      timeout: 3000,
      position: 'top',
    });
  } catch {
    $q.notify({
      type: 'negative',
      message: 'Nao foi possivel enviar a solicitacao. Tente novamente.',
      timeout: 2200,
      position: 'top',
    });
  }
}

const canApplyForCreator = computed(() =>
  Boolean(form.fullName.trim() && form.cpf.trim() && form.birthDate.trim() && form.address.trim()),
);

function saveProfile() {
  $q.notify({
    type: 'positive',
    message: 'Perfil atualizado com sucesso.',
    timeout: 2200,
    position: 'top',
  });
}
</script>

<style scoped lang="scss">
.profile-summary {
  background: rgba(255, 255, 255, 0.05);
}

.creator-approved-card {
  border-color: rgba(var(--q-primary-rgb, 142, 45, 226), 0.4);
  background: rgba(var(--q-primary-rgb, 142, 45, 226), 0.06);
}

.creator-pending-card {
  border-color: rgba(255, 165, 0, 0.35);
  background: rgba(255, 165, 0, 0.06);
}

.creator-invite-card {
  border-color: rgba(var(--q-secondary-rgb, 221, 36, 118), 0.3);
  background: rgba(var(--q-secondary-rgb, 221, 36, 118), 0.05);
}

.payment-banner {
  background: rgba(255, 193, 7, 0.1);
  border: 1px solid rgba(255, 193, 7, 0.35);
}
</style>
