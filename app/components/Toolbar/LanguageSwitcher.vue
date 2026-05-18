<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <Button v-spotlight variant="outline" size="sm" class="text-neutral-400 gap-1.5">
        <Icon name="iconoir:translate" size="14" />
        {{ locale.toUpperCase() }}
        <Icon name="iconoir:nav-arrow-down" size="14" />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent :align="align" class="min-w-32">
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
</template>

<script setup lang="ts">
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'

withDefaults(
  defineProps<{
    align?: 'start' | 'center' | 'end'
  }>(),
  { align: 'end' },
)

const { locale, setLocale } = useI18n()

const locales = [
  { code: 'en', label: 'English' },
  { code: 'ru', label: 'Русский' },
]
</script>
