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
    <label class="file-picker" :class="{ 'is-disabled': status === 'loading' }">
      <span class="trigger">
        <Icon v-if="status === 'loading'" name="iconoir:refresh-double" class="animate-spin" size="14" />
        <Icon v-else name="iconoir:upload" size="14" />
        {{ $t('settings.choose-file') }}
      </span>
      <span class="filename" :class="{ 'is-empty': !displayName }">
        {{ displayName || $t('settings.no-file') }}
      </span>
      <input
        type="file"
        accept=".pdf,.txt,.md,.markdown,application/pdf,text/plain,text/markdown"
        :disabled="status === 'loading'"
        class="sr-only"
        @change="fileLoaded"
      >
    </label>
    <p v-if="status === 'error'" class="status">
      {{ $t('settings.parse_failed') }}
    </p>
  </fieldset>
</template>
<script setup lang="ts">
import { computed } from 'vue';
import { TagsInput, TagsInputInput, TagsInputItem, TagsInputItemText, TagsInputItemDelete } from '@/components/ui/tags-input';
import type { Compatibility } from '@/composables/useTuning';

const stack = defineModel<string[]>('stack', { default: () => [] });
const vacancyName = defineModel<string | undefined>('vacancyName');
const compatibility = defineModel<Compatibility | undefined>('compatibility');

const { locale, t } = useI18n();
const { status, parse } = useVacancyParser();

const displayName = computed(() => {
  if (status.value === 'loading') return t('settings.parsing');
  return vacancyName.value ?? '';
});

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
<style scoped>
@reference "@/assets/css/tailwind.css";

.file-picker {
  @apply flex items-center gap-2 rounded-md border border-input bg-transparent pl-1.5 pr-3 h-9 shadow-xs cursor-pointer transition-colors min-w-0 overflow-hidden;
}
.file-picker:hover {
  @apply border-neutral-500;
}
.file-picker:focus-within {
  @apply border-ring ring-ring/50 ring-[3px];
}
.file-picker.is-disabled {
  @apply opacity-50 pointer-events-none;
}

.trigger {
  @apply inline-flex items-center gap-1.5 px-2.5 py-1 rounded-sm text-xs font-medium text-neutral-400 bg-neutral-800/60;
}

.filename {
  @apply text-sm text-neutral-200 truncate min-w-0 flex-1;
}
.filename.is-empty {
  @apply text-neutral-500;
}

.sr-only {
  @apply absolute w-px h-px overflow-hidden whitespace-nowrap;
  clip: rect(0 0 0 0);
}

.status {
  @apply text-xs text-red-400 mt-1;
}
</style>
