<template>
  <ToggleGroup v-model="tuning.position">
    <ToggleGroupItem value="hr">
      <Icon name="iconoir:doc-magnifying-glass-in" size="18" />
      {{ $t('settings.hr') }}
    </ToggleGroupItem>
    <ToggleGroupItem value="tech">
      <Icon name="iconoir:code" size="18" />
      {{ $t('settings.tech') }}
    </ToggleGroupItem>
  </ToggleGroup>
</template>
<script setup lang="ts">
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group/index';

const { tuning } = useTuning();
</script>
