<template>
  <aside class="sidebar">
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
  </aside>
</template>
<script setup lang="ts">

const navItems = [
  { id: 'about', href: '#about', label: 'About' },
  { id: 'skills', href: '#skills', label: 'Skills' },
  { id: 'experience', href: '#experience', label: 'Experience' },
  { id: 'education', href: '#education', label: 'Education' },
]
const activeAnchor = ref(navItems[0]!.id)

let sectionTops: Array<{ id: string, top: number }> = []
let animationFrameId = 0

const getMaxScrollY = () => (
  document.documentElement.scrollHeight - window.innerHeight
)

const measureSections = () => {
  const maxScrollY = getMaxScrollY()

  sectionTops = navItems
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

  activeAnchor.value = currentSection?.id ?? navItems[0]!.id
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

.sidebar {
  @apply fixed top-[15%] z-10 hidden h-fit w-max lg:block;
  left: calc(50% + (min(100vw, 48rem) / 2) + 4rem);

  li {
    @apply text-sm text-neutral-700 relative;
    a {
      @apply pl-2;
    }
    &::before {
      @apply content-[''] absolute top-[10px] left-[-30%] w-[10px] h-px bg-neutral-700;
      @apply transition-all duration-300;
    }

    &.active {
      @apply text-neutral-400;
      &::before {
        @apply w-[20px] bg-neutral-400;
      }
    }
  }
}
</style>