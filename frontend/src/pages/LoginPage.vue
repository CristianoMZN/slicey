<template>
  <q-page class="page-shell q-px-md q-pt-md q-pb-xl">
    <q-card flat bordered class="section-card login-card">
      <q-card-section class="q-pb-none">
        <div class="text-overline page-kicker">Acesso</div>
        <h1 class="text-h5 q-my-none text-weight-bold">Entrar no Jobbie</h1>
        <p class="text-body2 text-grey-6 q-mt-sm q-mb-none">
          Use seu email ou telefone e senha para acessar sua conta.
        </p>
      </q-card-section>

      <q-card-section>
        <q-form class="row q-col-gutter-md" @submit="submitLogin">
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

          <div class="col-12" v-if="loginType === 'email'">
            <q-input
              v-model="identity"
              filled
              dense
              type="email"
              label="Email"
              :rules="emailRules"
            />
          </div>

          <div class="col-12" v-else>
            <q-input
              v-model="identity"
              filled
              dense
              label="Telefone"
              mask="(##) #####-####"
              unmasked-value
              :rules="phoneRules"
            />
          </div>

          <div class="col-12">
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

          <div class="col-12 row items-center q-gutter-sm">
            <q-btn
              type="submit"
              color="primary"
              rounded
              unelevated
              icon="login"
              label="Entrar"
              :loading="auth.state.isSubmittingAuth"
            />
            <q-btn flat rounded icon="person_add" label="Criar nova conta" :to="{ name: 'registro' }" />
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import { useAuth } from 'src/composables/useAuth';

const $q = useQuasar();
const router = useRouter();
const route = useRoute();
const auth = useAuth();

const loginType = ref<'email' | 'phone'>('email');
const identity = ref('');
const password = ref('');
const showPassword = ref(false);

watch(loginType, () => {
  identity.value = '';
});

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

async function submitLogin() {
  const ok = await auth.login(identity.value.trim(), password.value);
  if (!ok) {
    $q.notify({
      type: 'negative',
      message: 'Credenciais invalidas. Verifique e tente novamente.',
      timeout: 2200,
      position: 'top',
    });
    return;
  }

  const redirect = typeof route.query.redirect === 'string' ? route.query.redirect : '/feed';
  void router.push(redirect);
}
</script>

<style scoped lang="scss">
.login-card {
  max-width: 480px;
  margin: 0 auto;
}
</style>
