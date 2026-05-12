<template>
  <Dialog v-model:open="open">
    <DialogTrigger as-child>
      <Button variant="glass" class="text-neutral-400" size="icon-sm">
        <Icon name="iconoir:settings" size="18" />
      </Button>
    </DialogTrigger>
    <DialogContent class="dark px-0">
      <DialogHeader class="px-4">
        <DialogTitle class="text-primary font-bold">
          {{ $t('settings.title') }}
        </DialogTitle>
      </DialogHeader>
      <Separator />
      <div class="text-neutral-400 settings px-4">
        <Position v-model="draft.position" />
        <Stack
          v-model:stack="draft.stack"
          v-model:vacancy-name="draft.vacancyName"
          v-model:compatibility="draft.compatibility"
        />
      </div>
      <Separator />
      <DialogFooter class="px-4">
        <Button variant="destructive" class="mr-auto" size="sm" v-spotlight @click="resetAll">
          {{ $t('settings.reset') }}
        </Button>
        <DialogClose as-child>
          <Button variant="glass" size="sm" v-spotlight @click="cancel">
            {{ $t('settings.close') }}
          </Button>
        </DialogClose>
        <Button variant="glass" size="sm" v-spotlight @click="apply">
          {{ $t('settings.apply') }}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
<script setup lang="ts">
import { reactive, ref, watch } from 'vue';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import Position from './Position.vue';
import Stack from './Stack.vue';

const { tuning, reset: resetTuning } = useTuning();
const { reset: resetParser } = useVacancyParser();

const open = ref(false);

const draft = reactive({ ...tuning.value });

const syncDraft = () => {
  Object.assign(draft, tuning.value);
  draft.vacancyName = tuning.value.vacancyName;
  draft.compatibility = tuning.value.compatibility;
};

watch(open, (next) => {
  if (next) syncDraft();
});

const apply = () => {
  tuning.value = { ...draft };
  open.value = false;
};

const cancel = () => {
  syncDraft();
};

const resetAll = () => {
  resetParser();
  resetTuning();
  syncDraft();
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
