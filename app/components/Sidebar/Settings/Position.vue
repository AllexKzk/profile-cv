<template>
  <fieldset>
    <div class="flex flex-col items-center gap-2">
      <ToggleGroup v-model="position" variant="outline">
        <ToggleGroupItem value="hr"  class="toggle-item" v-spotlight>
          <Icon name="iconoir:doc-magnifying-glass-in" size="18" />
          {{ $t('settings.hr') }}
        </ToggleGroupItem>
        <ToggleGroupItem value="tech" class="toggle-item" v-spotlight>
          <Icon name="iconoir:code" size="18" />
          {{ $t('settings.tech') }}
        </ToggleGroupItem>
      </ToggleGroup>
      <label class="label-wrapper whitespace-pre-line">
        <Transition name="slide" mode="out-in">
          <span :key="position ?? 'hr'" class="label-text">
            {{ $t(`settings.${position ?? 'hr'}-label`) }}
          </span>
        </Transition>
      </label>
    </div>
  </fieldset>
</template>
<script setup lang="ts">
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import type { Position as PositionValue } from '@/composables/useTuning';

const position = defineModel<PositionValue>({ default: 'hr' });
</script>
<style scoped>
@reference "@/assets/css/tailwind.css";

.toggle-item {
  @apply flex h-[32px] p-2 gap-2 text-sm;
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
