<template>
  <div class="tools" :class="{ 'tools--hidden': isHidden }" v-spotlight>
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
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from '../ui/tooltip'
import Settings from './Settings/index.vue';
import Compatibility from './Compatibility/index.vue';

const { locale, setLocale } = useI18n()

const locales = [
  { code: 'en', label: 'English' },
  { code: 'ru', label: 'Русский' },
]

// Auto-hide on scroll-down, reveal on scroll-up or when the cursor approaches
// the bottom edge of the viewport.
const SHOW_NEAR_TOP_PX = 80    // always visible while scrolled near the top
const SCROLL_DELTA_PX = 6      // ignore sub-pixel jitter between rAF samples
const HOVER_REVEAL_PX = 140    // cursor this close to the bottom keeps it shown

const hiddenByScroll = ref(false)
const hoveringBottom = ref(false)
const isHidden = computed(() => hiddenByScroll.value && !hoveringBottom.value)

let lastScrollY = 0
let scrollFrame = 0
let scrollHandler: (() => void) | null = null
let mouseHandler: ((e: MouseEvent) => void) | null = null

function syncScroll() {
  scrollFrame = 0
  const y = window.scrollY || 0
  const dy = y - lastScrollY
  lastScrollY = y

  if (y < SHOW_NEAR_TOP_PX) {
    hiddenByScroll.value = false
    return
  }
  const maxScrollY = document.documentElement.scrollHeight - window.innerHeight
  const nearDocumentBottom = y >= maxScrollY - 48
  if (nearDocumentBottom) {
    hiddenByScroll.value = false
    return
  }
  if (dy > SCROLL_DELTA_PX) hiddenByScroll.value = true
  else if (dy < -SCROLL_DELTA_PX) hiddenByScroll.value = false
}

onMounted(() => {
  lastScrollY = window.scrollY || 0

  scrollHandler = () => {
    if (scrollFrame) return
    scrollFrame = requestAnimationFrame(syncScroll)
  }
  window.addEventListener('scroll', scrollHandler, { passive: true })

  mouseHandler = (e: MouseEvent) => {
    hoveringBottom.value = e.clientY > window.innerHeight - HOVER_REVEAL_PX
  }
  window.addEventListener('mousemove', mouseHandler, { passive: true })
})

onBeforeUnmount(() => {
  if (scrollFrame) cancelAnimationFrame(scrollFrame)
  if (scrollHandler) window.removeEventListener('scroll', scrollHandler)
  if (mouseHandler) window.removeEventListener('mousemove', mouseHandler)
})
</script>
<style scoped>
@reference "@/assets/css/tailwind.css";

.tools {
  @apply sticky bottom-5 z-10 flex gap-3 w-max mx-auto;
  @apply mt-5 p-3 bg-black/10 backdrop-blur-md rounded-2xl border border-white/20;
  transition:
    transform 320ms cubic-bezier(0.32, 0.72, 0, 1),
    opacity 220ms ease;
  will-change: transform, opacity;
}

.tools--hidden {
  pointer-events: none;
  opacity: 0;
  /* Slide off the bottom plus a small gap so the rounded corners fully clear
     the viewport edge. */
  transform: translateY(calc(100% + 32px));
}

@media (prefers-reduced-motion: reduce) {
  .tools {
    transition: none;
  }
}
</style>
