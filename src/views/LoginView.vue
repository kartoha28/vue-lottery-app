<script setup lang="ts">
import { useField, useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/yup'
import * as yup from 'yup'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'
import AppButton from '@/components/AppButton.vue'
import AppInput from '@/components/AppInput.vue'

const authStore = useAuthStore()
const router = useRouter()
const route = useRoute()

const loginSchema = toTypedSchema(
  yup.object({
    username: yup.string().trim().required("Ім'я користувача є обов'язковим"),
    password: yup
      .string()
      .required("Пароль є обов'язковим")
      .min(6, 'Пароль має містити щонайменше 6 символів'),
  }),
)

const { handleSubmit, setValues } = useForm({
  validationSchema: loginSchema,
  initialValues: {
    username: '',
    password: '',
  },
})

const { value: username, errorMessage: usernameError } = useField<string>('username')
const { value: password, errorMessage: passwordError } = useField<string>('password')

const fillDemoCredentials = (): void => {
  setValues({
    username: 'emilys',
    password: 'emilyspass',
  })
}

const onSubmit = handleSubmit(async (values) => {
  try {
    await authStore.login({
      username: values.username,
      password: values.password,
    })
    const redirectPath =
      typeof route.query.redirect === 'string' && route.query.redirect
        ? route.query.redirect
        : '/users'
    await router.push(redirectPath)
  } catch {
    // Error is stored in authStore.error and shown in template
  }
})
</script>

<template>
  <section class="login-card">
    <h1 class="login-title">Вхід у систему</h1>
    <p class="login-subtitle">Авторизуйтесь для доступу до списку користувачів</p>

    <div class="demo-credentials-box">
      <div>
        Тестовий акаунт DummyJSON: <code>emilys</code> / <code>emilyspass</code>
      </div>
      <button type="button" class="btn btn-sm btn-link p-0" @click="fillDemoCredentials">
        Заповнити автоматично
      </button>
    </div>

    <div v-if="authStore.error" class="alert alert-danger py-2 px-3 mb-3" role="alert">
      {{ authStore.error }}
    </div>

    <form @submit.prevent="onSubmit">
      <AppInput
        v-model="username"
        label="Username"
        placeholder="Введіть username (напр. emilys)"
        :error="usernameError"
        :is-valid="Boolean(username && !usernameError)"
      />

      <AppInput
        v-model="password"
        type="password"
        label="Password"
        placeholder="Введіть пароль"
        :error="passwordError"
        :is-valid="Boolean(password && !passwordError)"
      />

      <div class="login-actions">
        <AppButton
          type="submit"
          variant="primary"
          :disabled="authStore.isLoading"
          class="w-100"
        >
          {{ authStore.isLoading ? 'Вхід...' : 'Login' }}
        </AppButton>
      </div>
    </form>

    <div class="back-home">
      <RouterLink to="/">&#8592; На головну сторінку</RouterLink>
    </div>
  </section>
</template>

<style scoped lang="scss">
.login-card {
  width: 100%;
  max-width: 440px;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  padding: 2rem;
}

.login-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #212529;
  margin-bottom: 0.25rem;
}

.login-subtitle {
  font-size: 0.9rem;
  color: #6c757d;
  margin-bottom: 1.25rem;
}

.demo-credentials-box {
  background-color: #f8f9fa;
  border: 1px dashed #ced4da;
  border-radius: 6px;
  padding: 0.65rem 0.85rem;
  font-size: 0.85rem;
  margin-bottom: 1.25rem;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.25rem;
}

.login-actions {
  margin-top: 1.25rem;
}

.back-home {
  margin-top: 1.25rem;
  text-align: center;
  font-size: 0.9rem;

  a {
    color: #6c757d;
    text-decoration: none;

    &:hover {
      color: #0d6efd;
      text-decoration: underline;
    }
  }
}
</style>
