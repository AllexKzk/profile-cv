<template>
  <Card variant="glass" class="uni">
    <img :src="brand" alt="Saint Petersburg Electrotechnical University Brand" class="brand" />
    <CardHeader class="z-10">
      <CardTitle class="font-semibold text-xl">
        {{ title }}
      </CardTitle>
      <CardDescription class="text-sm text-neutral-700">
        {{ description }}
      </CardDescription>
      <CardAction class="text-xs text-neutral-700">
        {{ duration }}
      </CardAction>
    </CardHeader>
    <CardContent class="text-sm text-neutral-400">
      {{ description }}
    </CardContent>
  </Card>
</template>
<script setup lang="ts">
import { Card, CardHeader, CardTitle, CardDescription, CardAction, CardContent } from '@/components/ui/card';

const { title, description, duration, brand } = defineProps<{
  title: string;
  description: string;
  duration: string;
  brand: string;
}>();

</script>
<style>
@reference "@/assets/css/tailwind.css";

.brand {
  @apply z-5 absolute top-[-50%] right-[-45%] w-[220%] h-[220%] rotate-[-15deg] opacity-[0.03] duration-300;
}
.uni {
  @apply relative overflow-hidden;
  &:hover {
    .brand {
      @apply opacity-[0.05];
    }
  }
}
</style>