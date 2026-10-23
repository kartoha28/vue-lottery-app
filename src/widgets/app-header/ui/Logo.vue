<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>

<template>
  <RouterLink to="/" class="app-logo">
    <span class="logo-icon">&#127922;</span>
    <span class="logo-text">VueLottery</span>
  </RouterLink>
</template>

<style scoped lang="scss">
.app-logo {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.25rem;
  font-weight: 700;
  color: #0d6efd;
  text-decoration: none;
  transition: opacity 0.15s ease;

  &:hover {
    opacity: 0.85;
  }
}

.logo-icon {
  font-size: 1.4rem;
}

.logo-text {
  color: var(--text-primary, #212529);
  transition: color 0.2s ease;
}
</style>
