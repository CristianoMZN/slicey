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
import { reactive } from 'vue';
import { useQuasar } from 'quasar';
import UndrawProfileData from 'vue-undraw/UndrawProfileData.vue';
import { useUserPreferences } from 'src/composables/useUserPreferences';

const $q = useQuasar();
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

.payment-banner {
  background: rgba(255, 193, 7, 0.1);
  border: 1px solid rgba(255, 193, 7, 0.35);
}
</style>
