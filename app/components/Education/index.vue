<template>
  <section id="education">
    <h2>EDUCATION</h2>
    <Card class="relative overflow-hidden">
      <img :src="brand" alt="Saint Petersburg Electrotechnical University Brand" class="brand" />
      <CardHeader class="z-10">
        <CardTitle class="font-semibold text-xl">
          Bachelor's Degree in Software Engineering
        </CardTitle>
        <CardDescription class="text-sm text-neutral-700">
          Saint Petersburg Electrotechnical University (SPbETU)
        </CardDescription>
        <CardAction class="text-xs text-neutral-700">
          2020 - 2024
        </CardAction>
      </CardHeader>
      <CardContent class="text-sm text-neutral-400">
        Studied algorithms, data structures, and software architecture with a focus on web technologies and distributed systems. Graduated with honours.
      </CardContent>
    </Card>
  </section>
</template>

<script setup lang="ts">
import { Card, CardHeader, CardTitle, CardDescription, CardAction, CardContent } from '@/components/ui/card';
import brand from '@/assets/svg/etu.svg'

</script>

<style>
@reference "@/assets/css/tailwind.css";

.brand {
  @apply z-5 absolute top-[-50%] right-[-45%] w-[220%] h-[220%] rotate-[-15deg] opacity-[0.03] duration-300;
}
#education {
  &:hover {
    .brand {
      @apply opacity-[0.05];
    }
  }
}
</style>