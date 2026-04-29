<script setup lang="ts">
import type { SeparatorProps } from "reka-ui"
import type { HTMLAttributes } from "vue"
import type { SeparatorVariants } from "."
import { reactiveOmit } from "@vueuse/core"
import { Separator } from "reka-ui"
import { cn } from "@/lib/utils"
import { separatorVariants } from "."

const props = withDefaults(defineProps<
  SeparatorProps & {
    class?: HTMLAttributes["class"]
    variant?: SeparatorVariants["variant"]
  }
>(), {
  orientation: "horizontal",
  decorative: true,
})

const delegatedProps = reactiveOmit(props, "class", "variant")
</script>

<template>
  <Separator
    data-slot="separator"
    v-bind="delegatedProps"
    :class="cn(separatorVariants({ variant }), props.class)"
  />
</template>
