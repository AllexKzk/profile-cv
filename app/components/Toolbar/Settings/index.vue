<template>
  <Sheet v-model:open="open">
    <SheetTrigger as-child>
      <Button v-spotlight variant="outline" class="text-neutral-400" size="icon-sm" :aria-label="$t('tools.settings')">
        <Icon name="iconoir:settings" size="18" />
      </Button>
    </SheetTrigger>
    <SheetContent side="bottom" class="dark border-white/10">
      <SheetHeader class="pb-1">
        <SheetTitle class="text-primary">{{ $t('settings.title') }}</SheetTitle>
        <SheetDescription class="sr-only">{{ $t('settings.about_text') }}</SheetDescription>
      </SheetHeader>

      <div class="settings-body">
        <section class="settings-row">
          <h4 class="settings-label">{{ $t('settings.position') }}</h4>
          <Position />
        </section>

        <section class="settings-row">
          <h4 class="settings-label">{{ $t('settings.tuning_title') }}</h4>
          <p class="settings-hint">{{ $t('settings.tuning_hint') }}</p>
          <Button
            v-spotlight
            variant="outline"
            size="sm"
            class="text-neutral-300 justify-center"
            @click="openTuning"
          >
            <Icon name="iconoir:brain-research" size="14" />
            {{ $t('settings.open_tuning') }}
          </Button>
        </section>

        <section class="settings-row">
          <h4 class="settings-label">{{ $t('settings.language') }}</h4>
          <LanguageSwitcher align="start" />
        </section>

      </div>
    </SheetContent>
  </Sheet>

  <Tuning v-model:open="tuningOpen" hide-trigger />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import Position from '@/components/Toolbar/Tuning/Position.vue'
import Tuning from '@/components/Toolbar/Tuning/index.vue'
import LanguageSwitcher from '@/components/Toolbar/LanguageSwitcher.vue'

const open = ref(false)
const tuningOpen = ref(false)

const openTuning = () => {
  open.value = false
  tuningOpen.value = true
}
</script>

<style scoped>
@reference "@/assets/css/tailwind.css";

.settings-body {
  @apply flex flex-col gap-5 px-4 pb-[max(--spacing(5),env(safe-area-inset-bottom))];
}

.settings-row {
  @apply flex flex-col gap-2;
}

.settings-label {
  @apply text-xs uppercase tracking-wide text-neutral-500;
}

.settings-hint {
  @apply text-xs text-neutral-500;
}

.settings-text {
  @apply text-sm text-neutral-400 leading-relaxed;
}

.settings-about {
  @apply pt-2 border-t border-white/5;
}
</style>
