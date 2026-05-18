<template>
  <Accordion type="single" collapsible class="w-full" default-value="manifesto">
    <AccordionItem value="manifesto">
      <AccordionTrigger>
        {{ $t('info.manifesto') }}
      </AccordionTrigger>
      <AccordionContent>
        {{ $t('info.manifesto_description') }}
      </AccordionContent>
    </AccordionItem>
    <AccordionItem value="stack">
      <AccordionTrigger>
        {{ $t('info.stack') }}
      </AccordionTrigger>
      <AccordionContent>
        {{ $t('info.stack_description') }}
      </AccordionContent>
    </AccordionItem>
    <AccordionItem value="style">
      <AccordionTrigger>
        {{ $t('info.style') }}
      </AccordionTrigger>
      <AccordionContent>
        {{ $t('info.style_description') }}
      </AccordionContent>
    </AccordionItem>
  </Accordion>
</template>
<script setup lang="ts">
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '~/components/ui/accordion';
</script>