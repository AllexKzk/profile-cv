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
    <Input
      type="file"
      accept=".pdf,.txt,.md,.markdown,application/pdf,text/plain,text/markdown"
      :disabled="status === 'loading'"
      @change="fileLoaded"
    />
    <p v-if="status === 'loading'" class="status text-xs mt-1 flex items-center gap-1.5">
      <Icon name="iconoir:refresh-double" class="animate-spin" size="12" />
      {{ $t('settings.parsing') }}
    </p>
    <p v-else-if="status === 'error'" class="status text-xs text-red-400 mt-1">
      {{ $t('settings.parse_failed') }}
    </p>
    <p v-else-if="vacancyName" class="status text-xs text-neutral-500 mt-1 truncate">
      {{ vacancyName }}
    </p>
  </fieldset>
</template>
<script setup lang="ts">
import { TagsInput, TagsInputInput, TagsInputItem, TagsInputItemText, TagsInputItemDelete } from '@/components/ui/tags-input';
import { Input } from '@/components/ui/input';
import type { Compatibility } from '@/composables/useTuning';

const stack = defineModel<string[]>('stack', { default: () => [] });
const vacancyName = defineModel<string | undefined>('vacancyName');
const compatibility = defineModel<Compatibility | undefined>('compatibility');

const { locale } = useI18n();
const { status, parse } = useVacancyParser();

const dedupe = (arr: string[]): string[] => {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const s of arr) {
    const key = s.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(s);
  }
  return out;
};

const fileLoaded = async (event: Event) => {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];
  if (!file) return;

  vacancyName.value = file.name;

  const res = await parse(file, String(locale.value));
  input.value = '';

  if (!res) return;

  stack.value = dedupe([...res.matched, ...res.adjacent]);
  compatibility.value = {
    score: res.score,
    summary: res.summary,
    matched: res.matched,
    adjacent: res.adjacent,
    missing: res.missing,
  };
};
</script>
<style>
@reference "@/assets/css/tailwind.css";
</style>
