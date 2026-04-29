<script setup lang="ts">
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

const { locale, setLocale } = useI18n()

const locales = [
  { code: 'en', label: 'English' },
  { code: 'ru', label: 'Русский' },
]
</script>

<template>
  <aside>
    <div class="tools">
      <Button variant="glass" class="text-neutral-400" size="icon-sm">
        <Icon name="mdi:download" />
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger as-child>
          <Button variant="glass" size="sm" class="text-neutral-400 gap-1.5">
            <Icon name="mdi:translate" size="14" />
            {{ locale.toUpperCase() }}
            <Icon name="mdi:chevron-down" size="14" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" class="min-w-32">
          <DropdownMenuItem
            v-for="l in locales"
            :key="l.code"
            :class="{ 'text-primary': locale === l.code }"
            @click="setLocale(l.code as 'en' | 'ru')"
          >
            {{ l.label }}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  </aside>
</template>

<style scoped>
@reference "@/assets/css/tailwind.css";

aside {
  @apply fixed top-5 right-5 z-10 h-fit w-max lg:block;
  .tools {
    @apply flex gap-2;
  }
}
</style>
