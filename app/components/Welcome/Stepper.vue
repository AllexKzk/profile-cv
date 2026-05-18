<template>
  <Stepper v-model="step" class="welcome-stepper">
    <StepperItem v-for="s in steps" :key="s.id" :step="s.id" class="welcome-step">
      <StepperTrigger as-child>
        <button type="button" class="welcome-trigger">
          <StepperIndicator>{{ s.id }}</StepperIndicator>
          <StepperTitle>{{ $t(s.titleKey) }}</StepperTitle>
        </button>
      </StepperTrigger>
      <StepperSeparator v-if="s.id !== steps.length" class="welcome-separator" />
    </StepperItem>
  </Stepper>

  <section class="welcome-body">
    <div v-if="step === 1" class="flex flex-col items-center gap-2">
      <Position />
      <label class="label-wrapper whitespace-pre-line">
        <Transition name="slide" mode="out-in">
          <span :key="tuning.position ?? 'hr'" class="label-text">
            {{ $t(`settings.${tuning.position ?? 'hr'}-label`) }}
          </span>
        </Transition>
      </label>
    </div>
    <Stack
      v-else-if="step === 2"
      v-model:stack="stack"
      v-model:vacancy-name="vacancyName"
    />
  </section>

  <footer class="welcome-actions">
    <Button variant="glass" size="sm" @click="emit('skip')" v-spotlight>
      {{ $t('welcome.skip') }}
    </Button>
    <div class="grow" />
    <Button v-if="step > 1" variant="glass" size="sm" @click="step--" v-spotlight>
      {{ $t('welcome.back') }}
    </Button>
    <Button variant="glass" size="sm" @click="onNext" v-spotlight>
      {{ step === steps.length ? $t('welcome.apply') : $t('welcome.next') }}
    </Button>
  </footer>
</template>

<script setup lang="ts">
import {
  Stepper,
  StepperIndicator,
  StepperItem,
  StepperSeparator,
  StepperTitle,
  StepperTrigger,
} from '@/components/ui/stepper';
import { Button } from '@/components/ui/button';
import Position from '~/components/Toolbar/Tuning/Position.vue';
import Stack from '~/components/Toolbar/Tuning/Stack.vue';

const step = defineModel<number>('step', { default: 1 });
const stack = defineModel<string[]>('stack', { default: () => [] });
const vacancyName = defineModel<string | undefined>('vacancyName');
const { tuning } = useTuning();

const emit = defineEmits<{
  skip: [];
  apply: [];
}>();

const steps = [
  { id: 1, titleKey: 'welcome.step_position' },
  { id: 2, titleKey: 'welcome.step_stack' },
] as const;

const onNext = () => {
  if (step.value < steps.length) {
    step.value++;
  }
  else {
    emit('apply');
  }
};
</script>

<style scoped>
@reference "@/assets/css/tailwind.css";

.welcome-stepper {
  @apply w-full justify-between;
}

.welcome-step {
  @apply flex-1;
}

.welcome-trigger {
  @apply w-full flex flex-col items-center gap-1 text-neutral-400;
}

.welcome-separator {
  @apply h-px flex-1 mx-2;
}

.welcome-body {
  @apply min-h-[150px] flex flex-col gap-3 text-neutral-400;
}

.welcome-body :deep(fieldset) legend {
  @apply mb-2 text-neutral-400 text-sm;
}

.welcome-actions {
  @apply flex items-center gap-2;
}

.welcome-actions .grow {
  @apply flex-1;
}

.label-wrapper {
  @apply relative block overflow-hidden text-center;
}

.label-text {
  @apply block text-sm;
}

.slide-enter-active,
.slide-leave-active {
  transition: transform 0.25s ease, opacity 0.25s ease;
}

.slide-enter-from {
  transform: translateY(-100%);
  opacity: 0;
}

.slide-leave-to {
  transform: translateY(100%);
  opacity: 0;
}
</style>
