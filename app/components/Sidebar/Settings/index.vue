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

const { tuning } = useTuning();
const open = ref(false);

const draft = reactive({ ...tuning.value });

watch(open, (next) => {
  if (next) {
    Object.assign(draft, tuning.value);
  }
});

const apply = () => {
  tuning.value = { ...draft };
  open.value = false;
};

const cancel = () => {
  Object.assign(draft, tuning.value);
};
</script>
<style>
@reference "@/assets/css/tailwind.css";

.settings {
  @apply mt-3 flex flex-col gap-4;
  fieldset {
    legend {
      @apply mb-2 text-neutral-400;
    }
  }
}
</style>
