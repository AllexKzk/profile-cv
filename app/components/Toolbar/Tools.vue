<template>
  <div class="tools">
    <div class="tools-mobile">
      <MobileNav />
      <Settings />
      <Button
        as="a"
        :href="`/Alexandr_Kozikov_${locale}.pdf`"
        :download="`Alexandr_Kozikov_${locale}.pdf`"
        variant="outline"
        class="text-neutral-400"
        size="icon-sm"
        :aria-label="$t('tools.download-pdf')"
      >
        <Icon name="iconoir:download" size="18" />
      </Button>
      <Info />
      <Compatibility compact />
    </div>

    <div class="tools-desktop" v-spotlight>
      <Compatibility />
      <Tuning />
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger as-child>
            <Button
              as="a"
              :href="`/Alexandr_Kozikov_${locale}.pdf`"
              :download="`Alexandr_Kozikov_${locale}.pdf`"
              variant="outline"
              class="text-neutral-400"
              size="icon-sm"
              v-spotlight
            >
              <Icon name="iconoir:download" size="18" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            {{ $t('tools.download-pdf') }}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <Info />
      <div class="h-[32px] w-px m-auto bg-white/20" />
      <Position />
      <LanguageSwitcher />
    </div>
  </div>
</template>
<script setup lang="ts">
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip/index'
import Tuning from '../Toolbar/Tuning/index.vue';
import Compatibility from '../Toolbar/Compatibility/index.vue';
import Position from '../Toolbar/Tuning/Position.vue';
import MobileNav from '../Nav/MobileNav.vue';
import Settings from '../Toolbar/Settings/index.vue';
import LanguageSwitcher from '../Toolbar/LanguageSwitcher.vue';
import { Info } from '../Toolbar/Info';

const { locale } = useI18n()
</script>
<style scoped>
@reference "@/assets/css/tailwind.css";

.tools {
  @apply fixed left-1/2 -translate-x-1/2 z-10 w-max max-w-[calc(100vw-1rem)];
  bottom: max(1.25rem, env(safe-area-inset-bottom));
}

.tools-mobile,
.tools-desktop {
  @apply mt-5 p-3 bg-black/10 backdrop-blur-md rounded-2xl border border-white/20;
}

.tools-mobile {
  @apply flex gap-3 md:hidden;
}

.tools-desktop {
  @apply hidden md:flex gap-3 w-max;
}
</style>
