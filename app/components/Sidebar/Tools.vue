<template>
  <div class="tools" v-spotlight>
    <Compatibility />
    <Settings />
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
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger as-child>
          <Button v-spotlight variant="outline" size="icon-sm" class="text-neutral-400">
            <Icon name="iconoir:info-circle" size="18" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          {{ $t('tools.about') }}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
    <div class="h-[32px] w-px m-auto bg-white/20" />
    <Position />
    <DropdownMenu>
      <DropdownMenuTrigger as-child>
        <Button v-spotlight variant="outline" size="sm" class="text-neutral-400 gap-1.5">
          <Icon name="iconoir:translate" size="14" />
          {{ locale.toUpperCase() }}
          <Icon name="iconoir:nav-arrow-down" size="14" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" class="min-w-32">
        <DropdownMenuItem
          v-for="l in locales"
          :key="l.code"
          v-spotlight
          :class="{ 'text-primary': locale === l.code }"
          @click="setLocale(l.code as 'en' | 'ru')"
        >
          {{ l.label }}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  </div>
</template>
<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip/index'
import Settings from './Settings/index.vue';
import Compatibility from './Compatibility/index.vue';
import Position from './Settings/Position.vue';

const { locale, setLocale } = useI18n()

const locales = [
  { code: 'en', label: 'English' },
  { code: 'ru', label: 'Русский' },
]

</script>
<style scoped>
@reference "@/assets/css/tailwind.css";

.tools {
  @apply fixed bottom-5 left-1/2 -translate-x-1/2 z-10 flex gap-3 w-max;
  @apply mt-5 p-3 bg-black/10 backdrop-blur-md rounded-2xl border border-white/20;
}
</style>
