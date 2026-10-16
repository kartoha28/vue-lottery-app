<script setup lang="ts">
import AppHeader from '@/components/AppHeader.vue'
</script>

<template>
  <div class="default-layout">
    <AppHeader />
    <main class="main-container">
      <slot />
    </main>
  </div>
</template>

<style scoped lang="scss">
.default-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-container {
  max-width: 960px;
  width: 100%;
  margin: 0 auto;
  padding: 0 1.25rem 3rem;
  flex: 1;
}
</style>
