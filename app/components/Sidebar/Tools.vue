<script setup lang="ts">
import {ToggleGroup, ToggleGroupItem} from '@/components/ui/toggle-group';

</script>

<template>
  <aside>
    <div class="tools">
      <Button variant="glass" class="text-neutral-400" size="icon-sm">
        <Icon name="mdi:download" />
      </Button>
      <ToggleGroup variant="glass" type="single" size="sm" class="text-neutral-400">
        <ToggleGroupItem value="ru">
          RU
        </ToggleGroupItem>
        <ToggleGroupItem value="en">
          EN
        </ToggleGroupItem>
      </ToggleGroup>
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