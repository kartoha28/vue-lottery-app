<script setup lang="ts">
import AppNavigation from './AppNavigation.vue'
import Logo from './Logo.vue'
</script>

<template>
  <header class="app-header">
    <div class="header-inner">
      <Logo />
      <AppNavigation />
    </div>
  </header>
</template>

<style scoped lang="scss">
.app-header {
  background-color: #ffffff;
  border-bottom: 1px solid #dee2e6;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04);
  margin-bottom: 2rem;
}

.header-inner {
  max-width: 960px;
  margin: 0 auto;
  padding: 0.85rem 1.25rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1rem;
}
</style>
