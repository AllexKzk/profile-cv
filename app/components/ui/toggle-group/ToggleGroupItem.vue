<template>
  <div class="toggle-group-item" :data-value="props.value" :data-active="active" @click="click">
    <slot />
  </div>
</template>
<script setup lang="ts">
interface ToggleGroupItemProps {
  value: string;
}

const props = defineProps<ToggleGroupItemProps>();
const toggleGroup = inject<Ref<string>>('toggleGroup');
const active = computed(() => toggleGroup?.value === props.value);

const click = () => {
  if (toggleGroup) {
    toggleGroup.value = props.value;
  }
}
</script>
<style scoped>
@reference "@/assets/css/tailwind.css";

.toggle-group-item {
  @apply cursor-pointer h-full flex items-center p-2 text-center gap-1 text-sm text-neutral-400;
  @apply data-[active=true]:bg-primary/10 data-[active=true]:text-primary;
  @apply transition-colors duration-500;
}
</style>
