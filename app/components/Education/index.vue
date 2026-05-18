<template>
  <Section id="education" :title="$t('education.title')">
    <University
      :title="$t('education.university.degree')"
      :description="$t('education.university.name')"
      :duration="$t('education.university.duration')"
      :brand="brand"
      :logo-alt="$t('education.university.logo_alt')"
    />
    <template v-if="isDev">
      <h2>{{ $t('education.books_title') }}</h2>
      <div class="books-list">
        <Book
          v-for="(book, i) in books"
          :key="i"
          :status="book.status"
          :title="book.title"
          :author="book.author"
        />
      </div>
    </template>
  </Section>
</template>

<script setup lang="ts">
import brand from '@/assets/svg/etu.svg'
import { Section } from '@/components/ui/section'
import Book from './Book.vue'
import University from './University.vue'

const { tm, rt } = useI18n()
const { isDev } = useTuning()

const books = computed(() =>
  (tm('education.books') as any[]).map(book => ({
    title: rt(book.title),
    author: rt(book.author),
    status: rt(book.status) as 'in-progress' | 'completed' | 'planned',
  }))
)
</script>

<style scoped>
@reference "@/assets/css/tailwind.css";

.books-list {
  @apply grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4;
}
</style>
