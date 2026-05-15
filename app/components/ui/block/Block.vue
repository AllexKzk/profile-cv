<template>
  <Card variant="glass" class="py-5 w-full" v-spotlight>
    <CardHeader>
      <CardTitle>
        {{ header }}
      </CardTitle>
      <CardAction class="period">
        {{ subheader }}
      </CardAction>
    </CardHeader>
    <Separator />
    <CardContent>
      <Button class="p-0 text-neutral-700 underline" variant="link" size="sm" as="a" :href="companyUrl" target="_blank">
        {{ caption }}
      </Button>
      <div class="description">
        <template v-for="(block, i) in blocks" :key="i">
          <p v-if="block.type === 'paragraph'" class="paragraph">{{ block.text }}</p>
          <ul v-else-if="block.type === 'bullets'" class="bullets">
            <li v-for="(item, j) in block.items" :key="j">{{ item }}</li>
          </ul>
        </template>
      </div>
    </CardContent>
    <div v-if="isDev && projects?.length" class="projects">
      <h4 class="period">{{ $t('experience.products') }}</h4>
      <div v-for="(project, pi) in projects" :key="pi" class="project">
        <Button class="p-0 underline w-min" variant="link" size="sm" as="a" :href="project.url" target="_blank">
          {{ project.projectName }}
        </Button>
        <p class="project-desc">{{ project.shortDescription }}</p>
        <p class="project-stack">{{ project.stack }}</p>
      </div>
    </div>
    <Separator />
    <CardFooter v-if="tech" class="tech">
      {{ tech }}
    </CardFooter>
  </Card>
</template>
<script setup lang="ts">
import { computed } from 'vue';
import CardAction from '../card/CardAction.vue';
import CardFooter from '../card/CardFooter.vue';

export type ExperienceProject = {
  projectName: string
  url: string
  shortDescription: string
  stack: string
}

const { isDev } = useTuning()

const {
  header,
  caption,
  description,
  tech,
  subheader,
  companyUrl,
  projects,
} = defineProps<{
  header: string
  caption: string
  description: string
  tech?: string
  subheader: string
  companyUrl?: string
  projects?: ExperienceProject[]
}>()

type Block =
  | { type: 'paragraph'; text: string }
  | { type: 'bullets'; items: string[] };

const blocks = computed<Block[]>(() => {
  const lines = (description ?? '')
    .split(/\r?\n/)
    .map(l => l.trim())
    .filter(Boolean);

  const out: Block[] = [];
  let bullets: string[] = [];
  const flushBullets = () => {
    if (bullets.length) {
      out.push({ type: 'bullets', items: bullets });
      bullets = [];
    }
  };

  for (const line of lines) {
    if (/^[•·●]\s*/.test(line)) {
      bullets.push(line.replace(/^[•·●]\s*/, ''));
    } else {
      flushBullets();
      out.push({ type: 'paragraph', text: line });
    }
  }
  flushBullets();

  return out;
});
</script>
<style scoped>
@reference "@/assets/css/tailwind.css";

.period {
  @apply text-xs text-neutral-600 uppercase;
}

.description {
  @apply flex  flex-col gap-3 text-sm text-neutral-400 leading-relaxed;
}

.description .paragraph {
  @apply text-neutral-400;
}

.description .bullets {
  @apply flex flex-col gap-1.5 list-disc pl-5 marker:text-neutral-600;
}

.description .bullets li {
  @apply pl-1;
}

.tech {
  @apply mt-3 text-xs text-neutral-600 tracking-wide;
}

.projects {
  @apply mt-6 flex flex-col gap-3 border-t border-white/5 px-6 py-5;
  .project {
    @apply flex flex-col gap-1;
    .project-name {
      @apply text-sm font-medium text-neutral-300;
    }

    .project-desc {
      @apply text-sm text-neutral-400 leading-relaxed;
    }

    .project-stack {
      @apply text-xs text-neutral-600 tracking-wide;
    }
  }
}
</style>
