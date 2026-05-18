<template>
  <Dialog v-model:open="open">
    <DialogTrigger v-if="!hideTrigger" as-child>
      <Button v-spotlight variant="outline" class="text-neutral-400" size="icon-sm">
        <Icon name="iconoir:brain-research" size="18" />
      </Button>
    </DialogTrigger>
    <DialogContent class="dark px-0">
      <DialogHeader class="px-4">
        <DialogTitle class="text-primary font-bold">
          {{ $t('tuning.title') }}
        </DialogTitle>
      </DialogHeader>
      <Separator />
      <div class="text-neutral-400 settings px-4">
        <Stack
          v-model:stack="tuning.stack"
          v-model:vacancy-name="tuning.vacancyName"
          v-model:compatibility="tuning.compatibility"
        />
      </div>
      <DialogFooter class="px-4 justify-start sm:justify-start">
        <Button :disabled="tuning.stack.length === 0" variant="destructive" class="w-full" size="sm" v-spotlight @click="resetAll">
          {{ $t('tuning.reset') }}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import Stack from './Stack.vue';

const { tuning, reset: resetTuning } = useTuning();
const { reset: resetParser } = useVacancyParser();

defineProps<{
  hideTrigger?: boolean;
}>();

const open = defineModel<boolean>('open', { default: false });

const resetAll = () => {
  resetParser();
  resetTuning();
};
</script>
<style>
@reference "@/assets/css/tailwind.css";

.settings {
  @apply mt-3 flex flex-col gap-4 min-w-0 overflow-hidden;
  fieldset {
    @apply min-w-0;
    legend {
      @apply mb-2 text-neutral-400;
    }
  }
}
</style>
