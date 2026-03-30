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
        <q-form v-if="step === 'form'" class="row q-col-gutter-md" @submit="submitRegister">
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
            <q-btn flat rounded icon="login" label="Já tenho conta" :to="{ name: 'login' }" />
          </div>
        </q-form>

        <div v-else class="verification-step">
          <q-banner rounded class="bg-primary text-white q-mb-md">
            Enviamos um codigo de verificacao para {{ verificationIdentityLabel }}.
          </q-banner>

          <q-input
            v-model="verificationCode"
            filled
            dense
            maxlength="6"
            mask="######"
            label="Codigo de verificacao"
            :hint="verificationHint"
          />

          <div class="row q-gutter-sm q-mt-md">
            <q-btn
              color="primary"
              rounded
              unelevated
              icon="verified"
              label="Confirmar codigo"
              :loading="auth.state.isSubmittingAuth"
              @click="confirmVerification"
            />
            <q-btn
              flat
              rounded
              icon="refresh"
              :label="resendLabel"
              :disable="resendCountdown > 0"
              @click="resendCode"
            />
            <q-btn
              flat
              rounded
              icon="edit"
              label="Editar contato"
              @click="backToForm"
            />
          </div>
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import { useAuth } from 'src/composables/useAuth';
import { requestVerificationCode, verifyRegistrationCode } from 'src/services/registration.service';
import { useMockApi } from 'src/services/runtime';

const $q = useQuasar();
const router = useRouter();
const route = useRoute();
const auth = useAuth();

const loginType = ref<'email' | 'phone'>('email');
const email = ref('');
const phone = ref('');
const password = ref('');
const passwordConfirm = ref('');
const acceptTerms = ref(false);
const showPassword = ref(false);
const showPasswordConfirm = ref(false);
const step = ref<'form' | 'verify'>('form');
const verificationIdentity = ref('');
const verificationCode = ref('');
const verificationRequestId = ref('');
const resendCountdown = ref(0);
let resendTimer: ReturnType<typeof setInterval> | null = null;

const RESEND_SECONDS = 30;

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
const verificationIdentityLabel = computed(() =>
  loginType.value === 'email'
    ? `email ${verificationIdentity.value}`
    : `celular ${formatPhoneForLabel(verificationIdentity.value)}`,
);
const resendLabel = computed(() =>
  resendCountdown.value > 0 ? `Reenviar em ${resendCountdown.value}s` : 'Reenviar codigo',
);
const verificationHint = computed(() =>
  useMockApi
    ? 'Modo simulacao: qualquer codigo com 6 numeros sera aceito.'
    : 'Digite o codigo recebido no seu contato.',
);

function formatPhoneForLabel(rawPhone: string): string {
  const digits = rawPhone.replace(/\D/g, '');

  if (digits.length < 10) {
    return rawPhone;
  }

  const ddd = digits.slice(0, 2);
  const first = digits.slice(2, 7);
  const last = digits.slice(7, 11);
  return `(${ddd}) ${first}-${last}`;
}

function startResendCountdown() {
  if (resendTimer) {
    clearInterval(resendTimer);
  }

  resendCountdown.value = RESEND_SECONDS;

  resendTimer = setInterval(() => {
    if (resendCountdown.value <= 1) {
      resendCountdown.value = 0;
      if (resendTimer) {
        clearInterval(resendTimer);
        resendTimer = null;
      }
      return;
    }

    resendCountdown.value -= 1;
  }, 1000);
}

function validateForm(): boolean {
  if (loginType.value === 'email' && !/\S+@\S+\.\S+/.test(email.value)) {
    $q.notify({ type: 'warning', message: 'Informe um email valido.', timeout: 2200 });
    return false;
  }

  if (loginType.value === 'phone' && phone.value.replace(/\D/g, '').length < 10) {
    $q.notify({ type: 'warning', message: 'Informe um telefone valido.', timeout: 2200 });
    return false;
  }

  if (password.value.length < 6) {
    $q.notify({ type: 'warning', message: 'Use pelo menos 6 caracteres na senha.', timeout: 2200 });
    return false;
  }

  if (password.value !== passwordConfirm.value) {
    $q.notify({ type: 'warning', message: 'As senhas nao conferem.', timeout: 2200 });
    return false;
  }

  if (!acceptTerms.value) {
    $q.notify({ type: 'warning', message: 'Voce precisa aceitar os termos para continuar.', timeout: 2200 });
    return false;
  }

  return true;
}

async function sendVerificationCode(): Promise<boolean> {
  verificationCode.value = '';

  try {
    const payload = {
      loginType: loginType.value,
      identity: loginIdentity.value.trim(),
    };

    const result = await requestVerificationCode(payload);

    verificationRequestId.value = result.requestId;
    startResendCountdown();

    const channel = loginType.value === 'email' ? 'email' : 'celular';
    const demoSuffix = result.debugCode ? ` (demo: ${result.debugCode})` : '';

    $q.notify({
      type: 'info',
      message: `Codigo enviado por ${channel}.${demoSuffix}`,
      timeout: 3500,
      position: 'top',
    });

    return true;
  } catch {
    $q.notify({
      type: 'negative',
      message: 'Nao foi possivel enviar o codigo agora. Tente novamente.',
      timeout: 2200,
      position: 'top',
    });
    return false;
  }
}

async function submitRegister() {
  if (!validateForm()) {
    return;
  }

  verificationIdentity.value = loginIdentity.value.trim();
  const sent = await sendVerificationCode();
  if (sent) {
    step.value = 'verify';
  }
}

async function resendCode() {
  if (resendCountdown.value > 0) {
    return;
  }

  await sendVerificationCode();
}

function backToForm() {
  step.value = 'form';
  verificationCode.value = '';
  verificationRequestId.value = '';
}

async function confirmVerification() {
  if (verificationCode.value.length !== 6) {
    $q.notify({ type: 'warning', message: 'Digite os 6 numeros do codigo.', timeout: 2200 });
    return;
  }

  if (!verificationRequestId.value) {
    $q.notify({ type: 'warning', message: 'Solicite um novo codigo para continuar.', timeout: 2200 });
    return;
  }

  // Dica para iniciantes: a validacao do codigo deve acontecer no backend.
  const isValid = await verifyRegistrationCode({
    requestId: verificationRequestId.value,
    code: verificationCode.value,
  });
  if (!isValid) {
    $q.notify({ type: 'negative', message: 'Codigo invalido. Tente novamente.', timeout: 2200 });
    return;
  }

  await auth.registerQuick(verificationIdentity.value, 'registered');

  $q.notify({
    type: 'positive',
    message: 'Conta criada e contato verificado com sucesso.',
    timeout: 2200,
    position: 'top',
  });

  const redirect = typeof route.query.redirect === 'string' ? route.query.redirect : '/feed';
  void router.push(redirect);
}

onBeforeUnmount(() => {
  if (resendTimer) {
    clearInterval(resendTimer);
  }
});
</script>

<style scoped lang="scss">
.register-card {
  max-width: 580px;
  margin: 0 auto;
}

.verification-step {
  max-width: 540px;
}
</style>
