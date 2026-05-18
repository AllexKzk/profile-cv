<template>
  <Sheet v-model:open="open">
    <SheetTrigger as-child>
      <Button v-spotlight variant="outline" class="text-neutral-400" size="icon-sm" :aria-label="$t('tools.menu')">
        <Icon name="iconoir:menu" size="18" />
      </Button>
    </SheetTrigger>
    <SheetContent side="bottom" class="dark border-white/10">
      <SheetHeader class="pb-2">
        <SheetTitle class="text-primary">{{ $t('nav.menu_title') }}</SheetTitle>
        <SheetDescription class="sr-only">{{ $t('nav.menu_title') }}</SheetDescription>
      </SheetHeader>
      <nav class="mobile-nav">
        <a
          v-for="item in sections"
          :key="item.id"
          :href="item.href"
          class="mobile-nav-link"
          @click="open = false"
        >
          <span>{{ item.label }}</span>
          <Icon name="iconoir:nav-arrow-right" size="16" class="opacity-60" />
        </a>
      </nav>
    </SheetContent>
  </Sheet>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'

const { sections } = useNavSections()
const open = ref(false)
</script>
<style scoped>
@reference "@/assets/css/tailwind.css";

.mobile-nav {
  @apply flex flex-col pb-[max(--spacing(4),env(safe-area-inset-bottom))];
}

.mobile-nav-link {
  @apply flex items-center justify-between px-4 py-3 text-neutral-300 text-base border-t border-white/5;
  @apply transition-colors hover:bg-white/5 active:bg-white/10;
}
</style>
