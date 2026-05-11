<template>
  <nav>
    <ul>
      <li
        v-for="item in navItems"
        :key="item.href"
        :class="{ active: activeAnchor === item.id }"
      >
        <a :href="item.href">
          {{ item.label }}
        </a>
      </li>
    </ul>
  </nav>
</template>
<script setup lang="ts">
const { t } = useI18n()

const navItems = computed(() => [
  { id: 'about', href: '#about', label: t('nav.about') },
  { id: 'skills', href: '#skills', label: t('nav.skills') },
  { id: 'experience', href: '#experience', label: t('nav.experience') },
  { id: 'education', href: '#education', label: t('nav.education') },
])
const activeAnchor = ref(navItems.value[0]!.id)

let sectionTops: Array<{ id: string, top: number }> = []
let animationFrameId = 0

const getMaxScrollY = () => (
  document.documentElement.scrollHeight - window.innerHeight
)

const measureSections = () => {
  const maxScrollY = getMaxScrollY()

  sectionTops = navItems.value
    .map((item) => {
      const section = document.getElementById(item.id)
      if (!section) {
        return null
      }

      const sectionTop = section.getBoundingClientRect().top + window.scrollY

      return {
        id: item.id,
        top: Math.min(sectionTop, maxScrollY),
      }
    })
    .filter((section): section is { id: string, top: number } => Boolean(section))
}

const updateActiveAnchor = () => {
  const viewportTop = Math.round(window.scrollY)
  const currentSection = sectionTops.findLast(section => viewportTop >= Math.round(section.top))

  activeAnchor.value = currentSection?.id ?? navItems.value[0]!.id
}

const requestActiveAnchorUpdate = () => {
  if (animationFrameId) {
    return
  }

  animationFrameId = window.requestAnimationFrame(() => {
    animationFrameId = 0
    updateActiveAnchor()
  })
}

const handleResize = () => {
  measureSections()
  requestActiveAnchorUpdate()
}

onMounted(() => {
  measureSections()
  updateActiveAnchor()

  window.addEventListener('scroll', requestActiveAnchorUpdate, { passive: true })
  window.addEventListener('resize', handleResize)
})
onUnmounted(() => {
  window.removeEventListener('scroll', requestActiveAnchorUpdate)
  window.removeEventListener('resize', handleResize)

  if (animationFrameId) {
    window.cancelAnimationFrame(animationFrameId)
  }
})
</script>
<style scoped>
@reference "@/assets/css/tailwind.css";

nav {
  @apply fixed top-[40%] z-10 hidden h-fit w-max lg:block;
  left: calc(50% + (min(100vw, 48rem) / 2) + 4rem);

  li {
    @apply text-sm text-neutral-600 relative opacity-80;
    a {
      @apply pl-7;
    }
    &::before {
      @apply content-[''] absolute top-[10px] left-0 w-[12px] h-px bg-neutral-600;
      @apply transition-all duration-300;
    }
    &:hover {
      @apply text-neutral-600 opacity-100;
      &::before {
        @apply bg-neutral-600;
      }
      }

    &.active {
      @apply text-neutral-400 opacity-100;
      &::before {
        @apply w-[20px] bg-neutral-400;
      }
    }
  }
}
</style>