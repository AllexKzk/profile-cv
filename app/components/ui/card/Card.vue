<script setup lang="ts">
import type { HTMLAttributes } from "vue"
import type { CardVariants } from "."
import { cn } from "@/lib/utils"
import { cardVariants } from "."

const props = defineProps<{
  class?: HTMLAttributes["class"]
  variant?: CardVariants["variant"]
}>()
</script>

<template>
  <div
    data-slot="card"
    :class="cn(cardVariants({ variant }), props.class)"
  >
    <slot />
  </div>
</template>
