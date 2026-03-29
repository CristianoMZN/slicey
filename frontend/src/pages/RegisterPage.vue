<template>
  <q-page class="page-shell q-px-md q-pt-md q-pb-xl">
    <q-card flat bordered class="section-card register-card">
      <q-card-section class="q-pb-none">
        <div class="text-overline page-kicker">Registro</div>
        <h1 class="text-h5 q-my-none text-weight-bold">Crie sua conta no Jobbie</h1>
        <p class="text-body2 text-grey-6 q-mt-sm q-mb-none">
          Cadastre-se com email ou telefone para acessar anuncios, mensagens e recursos de compra.
        </p>
      </q-card-section>

      <q-card-section>
        <q-form class="row q-col-gutter-md" @submit="submitRegister">
          <div class="col-12">
            <q-btn-toggle
              v-model="loginType"
              spread
              rounded
              unelevated
              toggle-color="primary"
              :options="[
                { label: 'Email', value: 'email' },
                { label: 'Telefone', value: 'phone' },
              ]"
            />
          </div>

          <div class="col-12 col-md-6">
            <q-input v-model="fullName" filled dense label="Nome completo" :rules="requiredRules" />
          </div>
          <div class="col-12 col-md-6">
            <q-input v-model="displayName" filled dense label="Nome social (opcional)" />
          </div>

          <div class="col-12" v-if="loginType === 'email'">
            <q-input
              v-model="email"
              filled
              dense
              type="email"
              label="Email de acesso"
              :rules="emailRules"
            />
          </div>

          <div class="col-12" v-else>
            <q-input
              v-model="phone"
              filled
              dense
              label="Telefone de acesso"
              mask="(##) #####-####"
              unmasked-value
              :rules="phoneRules"
            />
          </div>

          <div class="col-12 col-md-6">
            <q-input
              v-model="password"
              filled
              dense
              :type="showPassword ? 'text' : 'password'"
              label="Senha"
              :rules="passwordRules"
            >
              <template #append>
                <q-icon
                  :name="showPassword ? 'visibility_off' : 'visibility'"
                  class="cursor-pointer"
                  @click="showPassword = !showPassword"
                />
              </template>
            </q-input>
          </div>

          <div class="col-12 col-md-6">
            <q-input
              v-model="passwordConfirm"
              filled
              dense
              :type="showPasswordConfirm ? 'text' : 'password'"
              label="Confirmar senha"
              :rules="confirmRules"
            >
              <template #append>
                <q-icon
                  :name="showPasswordConfirm ? 'visibility_off' : 'visibility'"
                  class="cursor-pointer"
                  @click="showPasswordConfirm = !showPasswordConfirm"
                />
              </template>
            </q-input>
          </div>

          <div class="col-12">
            <q-checkbox
              v-model="acceptTerms"
              label="Concordo com os termos de uso e politica de privacidade."
            />
          </div>

          <div class="col-12 row items-center q-gutter-sm">
            <q-btn
              type="submit"
              color="primary"
              rounded
              unelevated
              icon="person_add"
              label="Criar conta"
              :loading="auth.state.isSubmittingAuth"
              :disable="!acceptTerms"
            />
            <q-btn flat rounded icon="arrow_back" label="Voltar ao feed" :to="{ name: 'feed' }" />
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import { useAuth } from 'src/composables/useAuth';

const $q = useQuasar();
const router = useRouter();
const route = useRoute();
const auth = useAuth();

const loginType = ref<'email' | 'phone'>('email');
const fullName = ref('');
const displayName = ref('');
const email = ref('');
const phone = ref('');
const password = ref('');
const passwordConfirm = ref('');
const acceptTerms = ref(false);
const showPassword = ref(false);
const showPasswordConfirm = ref(false);

const requiredRules = [(value: string) => Boolean(value?.trim()) || 'Campo obrigatorio'];
const emailRules = [
  (value: string) => Boolean(value?.trim()) || 'Email obrigatorio',
  (value: string) => /\S+@\S+\.\S+/.test(value) || 'Informe um email valido',
];
const phoneRules = [
  (value: string) => Boolean(value?.trim()) || 'Telefone obrigatorio',
  (value: string) => value.replace(/\D/g, '').length >= 10 || 'Telefone invalido',
];
const passwordRules = [
  (value: string) => Boolean(value?.trim()) || 'Senha obrigatoria',
  (value: string) => value.length >= 6 || 'Use pelo menos 6 caracteres',
];
const confirmRules = [
  (value: string) => Boolean(value?.trim()) || 'Confirme a senha',
  (value: string) => value === password.value || 'As senhas nao conferem',
];

const loginIdentity = computed(() => (loginType.value === 'email' ? email.value : phone.value));

async function submitRegister() {
  if (!acceptTerms.value) {
    $q.notify({
      type: 'warning',
      message: 'Voce precisa aceitar os termos para continuar.',
      timeout: 2200,
    });
    return;
  }

  await auth.registerQuick(loginIdentity.value);

  $q.notify({
    type: 'positive',
    message: 'Conta criada com sucesso.',
    timeout: 2200,
    position: 'top',
  });

  const redirect = typeof route.query.redirect === 'string' ? route.query.redirect : '/feed';
  void router.push(redirect);
}
</script>

<style scoped lang="scss">
.register-card {
  max-width: 820px;
  margin: 0 auto;
}
</style>
