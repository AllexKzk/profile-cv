<template>
  <Teleport to="body">
    <!-- Curtain: hides resume until localStorage is read. Rendered from SSR. -->
    <div
      v-if="curtainVisible"
      class="welcome-curtain"
      :class="{ 'is-leaving': curtainLeaving }"
      @transitionend.self="onCurtainEnd"
    />
    <div
      v-if="mounted"
      class="welcome-overlay dark"
      :class="{ 'is-entering': entering, 'is-leaving': leaving }"
      @transitionend="onTransitionEnd"
    >
      <div class="welcome-card">
        <header class="welcome-head">
          <h2>{{ $t('welcome.title') }}</h2>
          <p>{{ $t('welcome.subtitle') }}</p>
        </header>

        <WelcomeStepper
          v-model:step="currentStep"
          v-model:position="draft.position"
          v-model:stack="draft.stack"
          v-model:vacancy-name="draft.vacancyName"
          @skip="skip"
          @apply="applyAndClose"
        />
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { reactive, ref, watch } from 'vue';

const { tuning } = useTuning();
const { open, ready, finish } = useOnboarding();

const currentStep = ref(1);
const draft = reactive({ ...tuning.value });

const mounted = ref(false);
const entering = ref(false);
const leaving = ref(false);

// Curtain covers the resume until we know whether to show onboarding.
const curtainVisible = ref(true);
const curtainLeaving = ref(false);

watch(ready, (isReady) => {
  if (!isReady) return;
  if (open.value) {
    // Onboarding overlay will cover the curtain — hide instantly.
    curtainVisible.value = false;
  }
  else {
    // No onboarding needed — fade curtain out.
    curtainLeaving.value = true;
  }
});

const onCurtainEnd = () => {
  curtainVisible.value = false;
  curtainLeaving.value = false;
};

watch(
  open,
  (next) => {
    if (next) {
      Object.assign(draft, tuning.value);
      currentStep.value = 1;
      leaving.value = false;
      entering.value = false;
      mounted.value = true;
      curtainVisible.value = false;
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          entering.value = true;
        });
      });
    }
    else if (mounted.value) {
      requestAnimationFrame(() => {
        leaving.value = true;
      });
    }
  },
  { immediate: true },
);

const applyAndClose = () => {
  tuning.value = { ...draft };
  finish();
};

const skip = () => {
  finish();
};

const onTransitionEnd = (event: TransitionEvent) => {
  if (event.target !== event.currentTarget) return;
  if (leaving.value && event.propertyName === 'transform') {
    mounted.value = false;
    leaving.value = false;
  }
};
</script>

<style scoped>
@reference "@/assets/css/tailwind.css";

.welcome-curtain {
  @apply fixed inset-0 z-50 bg-neutral-950;
  pointer-events: none;
  transition: opacity 250ms ease;
}

.welcome-curtain.is-leaving {
  opacity: 0;
}

.welcome-overlay {
  @apply fixed inset-0 z-60 flex items-center justify-center;
  @apply bg-neutral-950 text-primary;
  will-change: transform, opacity;
}

.welcome-overlay.is-leaving {
  transform: translateY(-100%);
  opacity: 0;
  transition:
    transform 600ms cubic-bezier(0.65, 0, 0.35, 1),
    opacity 400ms ease-out 200ms;
}

.welcome-card {
  @apply w-full max-w-lg mx-4 flex flex-col gap-6 p-6 rounded-xl;
  opacity: 0;
  transform: translateY(-28px);
  transition:
    opacity 500ms ease,
    transform 700ms cubic-bezier(0.22, 1, 0.36, 1);
}

.welcome-overlay.is-entering .welcome-card {
  opacity: 1;
  transform: translateY(0);
}

.welcome-head h2 {
  @apply text-lg font-semibold text-primary;
}
.welcome-head p {
  @apply text-xs text-neutral-500 mt-1;
}
</style>
