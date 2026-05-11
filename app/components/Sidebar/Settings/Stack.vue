<template>
  <fieldset>
    <legend>
      {{ $t('settings.stack') }}
    </legend>
    <TagsInput v-model="stack">
      <TagsInputItem v-for="tag in stack" :key="tag" :value="tag">
        <TagsInputItemText />
        <TagsInputItemDelete />
      </TagsInputItem>
      <TagsInputInput placeholder="React..." />
    </TagsInput>
  </fieldset>
  <fieldset>
    <legend>
      {{ $t('settings.select-file') }}
    </legend>
    <Input type="file" accept="application/pdf" @change="fileLoaded" />
    <p v-if="vacancyName" class="text-xs text-neutral-500 mt-1 truncate">
      {{ vacancyName }}
    </p>
  </fieldset>
</template>
<script setup lang="ts">
import { TagsInput, TagsInputInput, TagsInputItem, TagsInputItemText, TagsInputItemDelete } from '@/components/ui/tags-input';
import { Input } from '@/components/ui/input';

const stack = defineModel<string[]>('stack', { default: () => [] });
const vacancyName = defineModel<string | undefined>('vacancyName');

const fileLoaded = (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0];
  vacancyName.value = file?.name;
};
</script>
<style>
@reference "@/assets/css/tailwind.css";
</style>
