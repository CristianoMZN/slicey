<template>
  <q-dialog
    :model-value="ageVerification.requiresVerification.value"
    persistent
    maximized
    transition-show="fade"
    transition-hide="fade"
  >
    <q-card class="age-gate-card">
      <div class="age-gate-shell row items-stretch">
        <div class="col-12 col-lg-5 age-gate-copy">
          <div class="text-overline age-kicker">Controle de idade</div>
          <h1 class="text-h4 text-weight-bold q-mt-sm q-mb-sm">Acesso liberado apenas para maiores de 18 anos</h1>
          <p class="text-body1 text-grey-4 q-mb-md">
            A validacao roda localmente no seu aparelho com a camera frontal. Nenhuma foto ou video sai do dispositivo.
          </p>

          <q-banner v-if="ageVerification.state.tampered" rounded class="bg-negative text-white q-mb-md">
            {{ ageVerification.state.errorMessage }}
          </q-banner>

          <q-list bordered separator class="age-gate-list q-mb-md">
            <q-item>
              <q-item-section avatar>
                <q-icon name="shield" color="primary" />
              </q-item-section>
              <q-item-section>
                <q-item-label class="text-weight-medium">Minimo de dados</q-item-label>
                <q-item-label caption>Guardamos apenas um selo local com hash e expiracao.</q-item-label>
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section avatar>
                <q-icon name="memory" color="secondary" />
              </q-item-section>
              <q-item-section>
                <q-item-label class="text-weight-medium">Inferencia local</q-item-label>
                <q-item-label caption>O modelo roda no navegador usando WebGL quando disponivel.</q-item-label>
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section avatar>
                <q-icon name="schedule" color="accent" />
              </q-item-section>
              <q-item-section>
                <q-item-label class="text-weight-medium">Validade temporaria</q-item-label>
                <q-item-label caption>Depois do prazo, a verificacao precisa ser refeita.</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>

          <div class="row q-gutter-sm items-center q-mb-md">
            <q-chip color="primary" text-color="white" icon="badge">Anonimo apos validacao</q-chip>
            <q-chip outline color="secondary" icon="shopping_bag">Registrado para compras</q-chip>
            <q-chip outline color="deep-orange" icon="verified_user">Criador com analise manual</q-chip>
          </div>

          <div class="text-caption text-grey-5">
            Backend: desativado nesta etapa. Toda a validacao fica apenas no frontend.
          </div>
        </div>

        <div class="col-12 col-lg-7 age-gate-stage">
          <div class="age-stage-card">
            <template v-if="!supportsCamera">
              <div class="column items-center justify-center text-center q-pa-xl full-height">
                <q-icon name="videocam_off" size="56px" color="negative" class="q-mb-md" />
                <div class="text-h6 text-weight-bold q-mb-sm">Camera indisponivel</div>
                <div class="text-body2 text-grey-6">
                  Este dispositivo ou navegador nao liberou acesso a camera. Sem isso o acesso continua bloqueado.
                </div>
              </div>
            </template>

            <template v-else>
              <div class="row items-center justify-between q-mb-sm">
                <div>
                  <div class="text-subtitle1 text-weight-bold">Validacao facial local</div>
                  <div class="text-caption text-grey-6">Backend atual: {{ backendLabel || 'carregando' }}</div>
                </div>
                <q-chip v-if="modelsReady" dense color="positive" text-color="white" icon="check_circle">
                  Modelos carregados
                </q-chip>
              </div>

              <q-banner v-if="step === 'intro'" rounded class="bg-dark text-grey-3 q-mb-md">
                Centralize apenas um rosto na camera e faça a leitura em ambiente iluminado.
              </q-banner>

              <q-banner v-if="step === 'blocked'" rounded class="bg-negative text-white q-mb-md">
                A estimativa atual ficou abaixo de 18 anos. Se houve erro de leitura, tente novamente com melhor luz e enquadramento.
              </q-banner>

              <q-banner v-if="isLocked" rounded class="bg-warning text-dark q-mb-md">
                Novo timeout ativo apos {{ ageVerification.state.failedAttempts }} tentativa(s). Tente novamente em {{ lockCountdownLabel }}.
              </q-banner>

              <div v-if="step !== 'camera'" class="mascot-wrap">
                <img
                  src="/images/age_validation.png"
                  alt="Mascote do portal de verificacao etaria"
                  class="mascot-image"
                />
                <div class="text-caption text-grey-5 text-center q-mt-sm">
                  Nosso mascote cuida da foto local para validar a maioridade.
                </div>
              </div>

              <div class="camera-stage" :class="{ 'camera-stage--active': step === 'camera' }">
                <video
                  v-show="step === 'camera'"
                  ref="videoRef"
                  playsinline
                  autoplay
                  muted
                  class="camera-video"
                />

                <div v-if="step !== 'camera'" class="camera-placeholder">
                  <q-icon name="photo_camera_front" size="64px" color="primary" class="q-mb-md" />
                  <div class="text-subtitle1 text-weight-bold q-mb-sm">Pronto para iniciar</div>
                  <div class="text-body2 text-grey-6 text-center">
                    A camera frontal sera usada somente para estimar idade e nada sera enviado para fora do aparelho.
                  </div>
                </div>
              </div>

              <div v-if="estimatedAge !== null" class="q-mt-md result-strip">
                <div class="text-caption text-grey-6">Ultima estimativa local</div>
                <div class="text-h6 text-weight-bold">{{ estimatedAge }} anos</div>
              </div>

              <div class="row q-gutter-sm q-mt-md">
                <q-btn
                  v-if="step !== 'camera'"
                  color="primary"
                  rounded
                  unelevated
                  icon="videocam"
                  :label="isLocked ? `Aguarde ${lockCountdownLabel}` : 'Abrir camera'"
                  :loading="isPreparing"
                  :disable="isLocked"
                  @click="startCamera"
                />
                <q-btn
                  v-if="step === 'camera'"
                  color="primary"
                  rounded
                  unelevated
                  icon="fact_check"
                  label="Validar idade"
                  :loading="isAnalyzing"
                  @click="analyzeAge"
                />
                <q-btn
                  v-if="step === 'camera'"
                  flat
                  rounded
                  icon="refresh"
                  label="Reiniciar camera"
                  :disable="isAnalyzing"
                  @click="restartCamera"
                />
                <q-btn
                  v-if="step === 'blocked'"
                  color="primary"
                  flat
                  rounded
                  icon="replay"
                  :label="isLocked ? `Liberado em ${lockCountdownLabel}` : 'Tentar novamente'"
                  :disable="isLocked"
                  @click="resetBlockedState"
                />
              </div>
            </template>
          </div>
        </div>
      </div>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import * as faceapi from '@vladmandic/face-api';
import { useQuasar } from 'quasar';
import { useAgeVerification } from 'src/composables/useAgeVerification';

const $q = useQuasar();
const ageVerification = useAgeVerification();
const videoRef = ref<HTMLVideoElement | null>(null);
const backendLabel = ref('');
const step = ref<'intro' | 'camera' | 'blocked'>('intro');
const modelsReady = ref(false);
const isPreparing = ref(false);
const isAnalyzing = ref(false);
const estimatedAge = ref<number | null>(null);
const now = ref(Date.now());
let mediaStream: MediaStream | null = null;
let countdownTimer: ReturnType<typeof setInterval> | null = null;

const isLocked = computed(() => {
  ageVerification.clearLockIfExpired();
  if (!ageVerification.lockUntil.value) {
    return false;
  }

  return new Date(ageVerification.lockUntil.value).getTime() > now.value;
});

const lockCountdownLabel = computed(() => {
  if (!ageVerification.lockUntil.value) {
    return '0s';
  }

  const remainingMs = Math.max(0, new Date(ageVerification.lockUntil.value).getTime() - now.value);
  const totalSeconds = Math.ceil(remainingMs / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) {
    return `${hours}h ${minutes}min`;
  }

  if (minutes > 0) {
    return `${minutes}min ${seconds}s`;
  }

  return `${seconds}s`;
});

const supportsCamera = computed(() => {
  if (typeof navigator === 'undefined' || !navigator.mediaDevices) {
    return false;
  }

  return typeof navigator.mediaDevices.getUserMedia === 'function';
});

function delay(ms: number) {
  return new Promise<void>((resolve) => {
    setTimeout(() => resolve(), ms);
  });
}

async function loadModels() {
  if (modelsReady.value) {
    return;
  }

  try {
    backendLabel.value = 'auto';

    await Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri('/models/face-api'),
      faceapi.nets.ageGenderNet.loadFromUri('/models/face-api'),
    ]);

    modelsReady.value = true;
  } catch (error) {
    console.error(error);
    $q.notify({
      type: 'negative',
      message: 'Nao foi possivel carregar os modelos de validacao facial.',
      timeout: 2600,
      position: 'top',
    });
  }
}

function stopCamera() {
  mediaStream?.getTracks().forEach((track) => track.stop());
  mediaStream = null;

  if (videoRef.value) {
    videoRef.value.pause();
    videoRef.value.srcObject = null;
  }
}

async function startCamera() {
  ageVerification.clearLockIfExpired();

  if (!supportsCamera.value || isLocked.value) {
    return;
  }

  isPreparing.value = true;

  try {
    await loadModels();
    if (!modelsReady.value) {
      return;
    }

    stopCamera();
    mediaStream = await navigator.mediaDevices.getUserMedia({
      audio: false,
      video: {
        facingMode: 'user',
        width: { ideal: 720 },
        height: { ideal: 1280 },
      },
    });

    if (!videoRef.value) {
      return;
    }

    videoRef.value.srcObject = mediaStream;
    await videoRef.value.play();
    step.value = 'camera';
  } catch (error) {
    console.error(error);
    $q.notify({
      type: 'negative',
      message: 'Nao foi possivel abrir a camera frontal.',
      timeout: 2600,
      position: 'top',
    });
  } finally {
    isPreparing.value = false;
  }
}

async function analyzeAge() {
  if (!videoRef.value || !modelsReady.value) {
    return;
  }

  isAnalyzing.value = true;

  try {
    const options = new faceapi.TinyFaceDetectorOptions({ inputSize: 224, scoreThreshold: 0.45 });
    const samples: number[] = [];

    for (let attempt = 0; attempt < 5 && samples.length < 3; attempt += 1) {
      await delay(320);
      const detections = await faceapi.detectAllFaces(videoRef.value, options).withAgeAndGender();

      if (detections.length > 1) {
        $q.notify({
          type: 'warning',
          message: 'Deixe apenas um rosto na camera para continuar.',
          timeout: 2200,
          position: 'top',
        });
        return;
      }

      const [detection] = detections;
      if (detection?.age) {
        samples.push(detection.age);
      }
    }

    if (samples.length === 0) {
      $q.notify({
        type: 'warning',
        message: 'Nao foi possivel detectar um rosto. Ajuste luz e enquadramento.',
        timeout: 2400,
        position: 'top',
      });
      return;
    }

    const averageAge = Math.round(samples.reduce((sum, value) => sum + value, 0) / samples.length);
    estimatedAge.value = averageAge;

    if (averageAge < 18) {
      ageVerification.registerFailure();
      step.value = 'blocked';
      stopCamera();
      return;
    }

    await ageVerification.approve(averageAge, samples.length);
    stopCamera();
  } catch (error) {
    console.error(error);
    $q.notify({
      type: 'negative',
      message: 'A leitura facial falhou. Tente novamente em ambiente mais iluminado.',
      timeout: 2600,
      position: 'top',
    });
  } finally {
    isAnalyzing.value = false;
  }
}

function restartCamera() {
  void startCamera();
}

function resetBlockedState() {
  ageVerification.clearLockIfExpired();
  if (isLocked.value) {
    return;
  }

  step.value = 'intro';
  estimatedAge.value = null;
}

onMounted(() => {
  void ageVerification.hydrate();

  countdownTimer = setInterval(() => {
    now.value = Date.now();
    ageVerification.clearLockIfExpired();
  }, 1000);
});

onBeforeUnmount(() => {
  stopCamera();

  if (countdownTimer) {
    clearInterval(countdownTimer);
  }
});
</script>

<style scoped lang="scss">
.age-gate-card {
  background:
    radial-gradient(circle at top left, rgba(236, 72, 153, 0.12), transparent 32%),
    radial-gradient(circle at bottom right, rgba(56, 189, 248, 0.12), transparent 26%),
    #06070b;
  color: white;
}

.age-gate-shell {
  min-height: 100vh;
}

.age-gate-copy {
  padding: 32px;
  border-right: 1px solid rgba(255, 255, 255, 0.08);
}

.age-kicker {
  color: rgba(255, 255, 255, 0.56);
  letter-spacing: 0.18em;
}

.age-gate-list {
  background: rgba(255, 255, 255, 0.03);
  border-color: rgba(255, 255, 255, 0.08);
}

.age-gate-stage {
  padding: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.age-stage-card {
  width: min(100%, 720px);
  min-height: 560px;
  padding: 24px;
  border-radius: 28px;
  background: rgba(255, 255, 255, 0.045);
  border: 1px solid rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(20px);
}

.camera-stage {
  min-height: 420px;
  border-radius: 24px;
  overflow: hidden;
  border: 1px dashed rgba(255, 255, 255, 0.16);
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.04), rgba(255, 255, 255, 0.02)),
    rgba(0, 0, 0, 0.3);
}

.camera-stage--active {
  border-style: solid;
}

.camera-video,
.camera-placeholder {
  width: 100%;
  min-height: 420px;
}

.camera-video {
  object-fit: cover;
  transform: scaleX(-1);
}

.camera-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 32px;
}

.result-strip {
  padding: 12px 14px;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.05);
}

.mascot-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 16px;
}

.mascot-image {
  width: min(100%, 340px);
  max-height: 260px;
  object-fit: contain;
  filter: drop-shadow(0 20px 30px rgba(0, 0, 0, 0.45));
}

@media (max-width: 1023px) {
  .age-gate-copy,
  .age-gate-stage {
    padding: 20px;
  }

  .age-gate-copy {
    border-right: 0;
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  }

  .age-stage-card {
    min-height: auto;
  }

  .camera-stage,
  .camera-video,
  .camera-placeholder {
    min-height: 320px;
  }
}
</style>
