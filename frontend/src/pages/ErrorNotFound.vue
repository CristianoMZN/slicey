<template>
  <div class="error-page fullscreen flex flex-center">
    <div class="error-content column flex-center items-center text-center q-pa-xl">
      <div class="astronaut-wrapper q-mb-md">
        <span class="astronaut">🧑‍🚀</span>
      </div>

      <div class="error-code">404</div>

      <h1 class="error-title q-mt-none q-mb-sm">{{ t('notFound.title') }}</h1>
      <p class="error-subtitle q-mb-xs">{{ t('notFound.subtitle') }}</p>
      <p class="error-hint q-mt-none">{{ t('notFound.hint') }}</p>

      <q-btn
        class="q-mt-lg"
        rounded
        color="white"
        text-color="deep-purple-9"
        unelevated
        size="lg"
        icon="home"
        to="/"
        :label="t('notFound.goHome')"
        no-caps
      />

      <div class="lang-switcher q-mt-xl row q-gutter-sm justify-center">
        <q-btn
          v-for="lang in supportedLocales"
          :key="lang"
          flat
          no-caps
          rounded
          :class="['lang-btn', { 'lang-btn--active': locale === lang }]"
          @click="setLocale(lang)"
        >
          <span class="flag-emoji">{{ localeConfig[lang].flag }}</span>
          <span class="q-ml-xs">{{ localeConfig[lang].label }}</span>
        </q-btn>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { useLanguage } from 'src/composables/useLanguage';

const { t } = useI18n();
const { locale, setLocale, supportedLocales, localeConfig } = useLanguage();
</script>

<style scoped lang="scss">
.error-page {
  background: radial-gradient(ellipse at 60% 30%, #2d0a6b 0%, #0d1b2a 45%, #080c14 100%);
  color: white;
  overflow: hidden;
  position: relative;

  // Camada de estrelas pequenas
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background-image: radial-gradient(
      circle,
      rgba(255, 255, 255, 0.75) 1px,
      transparent 1px
    );
    background-size: 110px 110px;
    opacity: 0.22;
    pointer-events: none;
  }

  // Camada de estrelas médias (offset)
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background-image: radial-gradient(
      circle,
      rgba(255, 255, 255, 0.55) 1px,
      transparent 1px
    );
    background-size: 65px 65px;
    background-position: 32px 32px;
    opacity: 0.15;
    pointer-events: none;
  }
}

.error-content {
  position: relative;
  z-index: 1;
  max-width: 580px;
}

.astronaut-wrapper {
  filter: drop-shadow(0 0 28px rgba(168, 85, 247, 0.7));
}

.astronaut {
  font-size: clamp(3.5rem, 11vw, 6.5rem);
  display: block;
  animation: float 4s ease-in-out infinite;
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0px) rotate(-5deg);
  }
  50% {
    transform: translateY(-18px) rotate(5deg);
  }
}

.error-code {
  font-size: clamp(5rem, 18vw, 11rem);
  font-weight: 900;
  line-height: 1;
  background: linear-gradient(135deg, #38bdf8 0%, #a855f7 50%, #f472b6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: -0.03em;
}

.error-title {
  font-size: clamp(1.4rem, 4.5vw, 2.2rem);
  font-weight: 700;
  color: #e2e8f0;
}

.error-subtitle {
  font-size: clamp(0.9rem, 2.5vw, 1.1rem);
  color: #94a3b8;
  max-width: 400px;
  line-height: 1.65;
}

.error-hint {
  font-size: 0.875rem;
  color: #475569;
  font-style: italic;
}

.lang-btn {
  color: #64748b;
  border: 1px solid rgba(255, 255, 255, 0.08);
  transition:
    background 0.2s,
    color 0.2s,
    border-color 0.2s;
  padding: 5px 14px;

  &:hover {
    background: rgba(168, 85, 247, 0.15);
    color: #c084fc;
    border-color: rgba(168, 85, 247, 0.3);
  }

  &--active {
    background: rgba(168, 85, 247, 0.2);
    color: #e9d5ff;
    border-color: rgba(168, 85, 247, 0.5);
  }
}

.flag-emoji {
  font-size: 1.1rem;
}
</style>

