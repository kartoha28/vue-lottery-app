<script setup lang="ts">
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { LoginForm } from '@/features/auth'

const router = useRouter()
const route = useRoute()

const handleSuccess = async (): Promise<void> => {
  const redirectPath = (route.query.redirect as string) || '/users'
  await router.push(redirectPath)
}
</script>

<template>
  <div class="login-view-wrapper">
    <div class="login-card">
      <div class="login-header">
        <h1 class="login-title">Вхід у систему</h1>
        <p class="login-subtitle">
          Введіть свої облікові дані для доступу до списку користувачів
        </p>
      </div>

      <LoginForm @success="handleSuccess" />

      <div class="back-link-wrapper">
        <RouterLink to="/" class="back-link">
          &larr; На головну
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.login-view-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1.5rem 0;
}

.login-card {
  background-color: #ffffff;
  border: 1px solid #dee2e6;
  border-radius: 8px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  padding: 2.25rem;
  width: 100%;
  max-width: 440px;
}

.login-header {
  text-align: center;
  margin-bottom: 1.75rem;
}

.login-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #212529;
  margin-bottom: 0.5rem;
}

.login-subtitle {
  font-size: 0.9rem;
  color: #6c757d;
  line-height: 1.4;
  margin: 0;
}

.back-link-wrapper {
  margin-top: 1.5rem;
  text-align: center;
  border-top: 1px solid #f1f3f5;
  padding-top: 1rem;
}

.back-link {
  color: #6c757d;
  font-size: 0.875rem;
  text-decoration: none;

  &:hover {
    color: #0d6efd;
    text-decoration: underline;
  }
}
</style>
