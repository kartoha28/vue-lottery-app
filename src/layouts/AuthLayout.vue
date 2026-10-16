<script setup lang="ts">
import Logo from '@/components/Logo.vue'
</script>

<template>
  <div class="auth-layout">
    <div class="auth-top-bar">
      <Logo />
    </div>
    <main class="auth-main">
      <slot />
    </main>
  </div>
</template>

<style scoped lang="scss">
.auth-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #f1f5f9;
}

.auth-top-bar {
  padding: 1.25rem 2rem;
  display: flex;
  justify-content: center;
}

.auth-main {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}
</style>
