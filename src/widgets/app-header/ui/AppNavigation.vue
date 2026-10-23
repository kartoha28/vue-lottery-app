<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useSessionStore } from '@/entities/session'
import { LogoutButton } from '@/features/auth'

const sessionStore = useSessionStore()
const { isAuthenticated, user } = storeToRefs(sessionStore)
</script>

<template>
  <nav class="app-nav">
    <RouterLink to="/" class="nav-link-item" exact-active-class="is-active">
      Home
    </RouterLink>
    <RouterLink to="/about" class="nav-link-item" active-class="is-active">
      About author
    </RouterLink>
    <RouterLink to="/users" class="nav-link-item" active-class="is-active">
      Users
    </RouterLink>

    <template v-if="isAuthenticated">
      <span v-if="user" class="user-badge">
        {{ user.firstName }} {{ user.lastName }}
      </span>
      <LogoutButton />
    </template>
    <template v-else>
      <RouterLink to="/login" class="nav-link-item nav-login-btn" active-class="is-active">
        Login
      </RouterLink>
    </template>
  </nav>
</template>

<style scoped lang="scss">
.app-nav {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.nav-link-item {
  padding: 0.4rem 0.85rem;
  font-size: 0.95rem;
  font-weight: 500;
  color: #495057;
  text-decoration: none;
  border-radius: 6px;
  transition: all 0.15s ease;

  &:hover {
    color: #0d6efd;
    background-color: #f1f5f9;
  }

  &.is-active {
    color: #0d6efd;
    background-color: #e7f1ff;
    font-weight: 600;
  }
}

.nav-login-btn {
  border: 1px solid #0d6efd;
  color: #0d6efd;

  &.is-active {
    background-color: #0d6efd;
    color: #ffffff;
  }
}

.user-badge {
  font-size: 0.85rem;
  font-weight: 600;
  color: #6c757d;
  padding: 0.25rem 0.5rem;
  background-color: #f8f9fa;
  border-radius: 4px;
  border: 1px solid #dee2e6;
}
</style>
