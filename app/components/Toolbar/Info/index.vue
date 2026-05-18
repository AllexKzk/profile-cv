<template>
  <Sheet>
    <SheetTrigger as-child>
      <Button
        v-spotlight
        variant="outline"
        class="text-neutral-400 md:hidden"
        size="icon-sm"
        :aria-label="$t('tools.about')"
      >
        <Icon name="iconoir:info-circle" size="18" />
      </Button>
    </SheetTrigger>
    <SheetContent side="bottom" class="dark border-white/10">
      <SheetHeader class="pb-1">
        <SheetTitle class="text-primary">{{ $t('info.title') }}</SheetTitle>
        <SheetDescription class="sr-only">{{ $t('info.title') }}</SheetDescription>
      </SheetHeader>
      <div class="info-body">
        <InfoContent />
      </div>
    </SheetContent>
  </Sheet>

  <Dialog>
    <InfoTrigger class="hidden md:inline-flex" />
    <DialogContent class="dark border-white/10">
      <DialogHeader>
        <DialogTitle class="text-primary">{{ $t('info.title') }}</DialogTitle>
        <InfoContent />
      </DialogHeader>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import Dialog from '~/components/ui/dialog/Dialog.vue'
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import InfoTrigger from './InfoTrigger.vue'
import InfoContent from './InfoContent.vue'
</script>

<style scoped>
@reference "@/assets/css/tailwind.css";

.info-body {
  @apply px-4 pb-[max(--spacing(5),env(safe-area-inset-bottom))];
}
</style>
