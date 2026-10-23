<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>

<template>
  <section class="content-card not-found-view text-center">
    <h1 class="error-code">404</h1>
    <h2 class="error-title">Сторінку не знайдено</h2>
    <p class="error-desc">
      На жаль, запитана сторінка не існує або була переміщена.
    </p>
    <RouterLink to="/" class="btn btn-primary">
      Повернутися на головну
    </RouterLink>
  </section>
</template>

<style scoped lang="scss">
.not-found-view {
  padding: 3.5rem 1.5rem;
}

.error-code {
  font-size: 4.5rem;
  font-weight: 800;
  color: #0d6efd;
  line-height: 1;
  margin-bottom: 0.5rem;
}

.error-title {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 0.75rem;
  color: #212529;
}

.error-desc {
  color: #6c757d;
  margin-bottom: 1.5rem;
}
</style>
