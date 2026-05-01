<template>
  <Card variant="glass" v-spotlight>
    <CardHeader>
      <CardTitle>
        {{ header }}
      </CardTitle>
      <CardAction class="period">
        {{ subheader }}
      </CardAction>
      <CardDescription>
        <Button class="p-0 text-neutral-700" variant="link" size="sm" as="a" :href="companyUrl" target="_blank">
          {{ caption }}
        </Button>
      </CardDescription>
    </CardHeader>
    <CardContent>
      <div class="description">
        {{ description }}
      </div>
    </CardContent>
  </Card>
</template>
<script setup lang="ts">
import CardAction from '../card/CardAction.vue';
const {
  header,
  caption,
  description,
  subheader,
  companyUrl,
} = defineProps<{
  header: string;
  caption: string;
  description: string;
  subheader: string;
  companyUrl?: string;
}>();
</script>
<style>
@reference "@/assets/css/tailwind.css";

.period {
  @apply text-xs text-neutral-700;
}

.block {
  @apply flex flex-col gap-1.5 w-full;
  .header {
    @apply flex justify-between w-full items-baseline;
    h3 {
      @apply font-semibold text-xl;
    }
    p {
      @apply text-neutral-700 text-xs;
    }
  }
  .caption {
    @apply text-neutral-700 text-sm;
  }
  .description {
    @apply text-neutral-400 text-sm;
  }
}
</style>