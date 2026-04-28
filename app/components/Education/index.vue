<template>
  <section id="education">
    <h2>EDUCATION</h2>
    <University
      title="Bachelor's Degree in Software Engineering"
      description="Saint Petersburg Electrotechnical University (SPbETU)"
      duration="2020 - 2024"
      :brand="brand"
    />
    <h2>BOOKS</h2>
    <div class="books-list">
      <Book url="https://www.google.com" status="in-progress" title="Clean Code" author="Robert C. Martin" description="A book about writing clean code." />
      <Book url="https://www.google.com" status="completed" title="Clean Code" author="Robert C. Martin" description="A book about writing clean code." />
    </div>
  </section>
</template>

<script setup lang="ts">
import brand from '@/assets/svg/etu.svg'
import Book from './Book.vue';
import University from './University.vue';
</script>

<style>
@reference "@/assets/css/tailwind.css";

.books-list {
  @apply grid grid-cols-2 gap-4;
}
</style>