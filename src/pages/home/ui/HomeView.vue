<script setup lang="ts">
import { RouterLink } from 'vue-router'

const technologies = [
  'Vue 3 (Composition API, <script setup>)',
  'TypeScript',
  'Vue Router 4 (Dynamic & Nested Routes, Navigation Guards)',
  'Pinia (State Management)',
  'Repository Pattern (ServiceProvider, UserService, AuthService)',
  'VeeValidate 4 + Yup (Form Validation)',
  'JWT Authentication (Access & Refresh Token Interceptor)',
  'SCSS + Bootstrap 5',
  'DummyJSON REST API',
]
</script>

<template>
  <section class="content-card home-view">
    <h1 class="page-title">Vue Lottery &amp; Users Management SPA</h1>
    <p class="lead-text">
      Односторінковий веб-застосунок (SPA), розроблений у межах курсу «Інженерія клієнтських
      веб-систем». Проєкт демонструє маршрутизацію за допомогою <strong>Vue Router</strong>,
      архітектурний патерн <strong>Repository</strong> для роботи з REST API DummyJSON,
      керування станом через <strong>Pinia</strong> та захист маршрутів на основі
      <strong>JWT-авторизації</strong>.
    </p>

    <div class="tech-section">
      <h2 class="section-heading">Технології, що використовуються</h2>
      <ul class="tech-list">
        <li v-for="tech in technologies" :key="tech" class="tech-item">
          {{ tech }}
        </li>
      </ul>
    </div>

    <div class="links-section">
      <RouterLink to="/users" class="btn btn-primary">
        Перейти до учасників (Users)
      </RouterLink>
      <RouterLink to="/about" class="btn btn-outline-secondary">
        Про автора
      </RouterLink>
      <a
        href="https://github.com/kartoha28/vue-lottery-app"
        target="_blank"
        rel="noopener noreferrer"
        class="btn btn-outline-dark"
      >
        GitHub Репозиторій проєкту &#8599;
      </a>
    </div>
  </section>
</template>

<style scoped lang="scss">
.page-title {
  font-size: 1.75rem;
  font-weight: 700;
  color: #212529;
  margin-bottom: 1rem;
}

.lead-text {
  font-size: 1rem;
  line-height: 1.6;
  color: #495057;
  margin-bottom: 1.75rem;
}

.tech-section {
  margin-bottom: 2rem;
}

.section-heading {
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 0.85rem;
  color: #343a40;
}

.tech-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 0.6rem;
  list-style: none;
  padding: 0;
  margin: 0;
}

.tech-item {
  background-color: #f8f9fa;
  border: 1px solid #e9ecef;
  border-left: 4px solid #0d6efd;
  padding: 0.55rem 0.85rem;
  border-radius: 4px;
  font-size: 0.925rem;
  font-weight: 500;
}

.links-section {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  padding-top: 1rem;
  border-top: 1px solid #e9ecef;
}
</style>
