<script setup lang="ts">
import { useField, useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/yup'
import * as yup from 'yup'
import { useSessionStore } from '@/entities/session'
import { AppButton, AppInput, useAppToast } from '@/shared/ui'

const emit = defineEmits<{
  (e: 'success'): void
}>()

const authStore = useSessionStore()
const toast = useAppToast()

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

const onSubmit = handleSubmit(async (values) => {
  try {
    await authStore.login({ username: values.username, password: values.password })
    toast.success('Успішний вхід', `Ласкаво просимо, ${authStore.user?.firstName || values.username}!`)
    emit('success')
  } catch (e) {
    toast.error('Помилка авторизації', (e as Error).message || 'Перевірте логін та пароль')
  }
})

const fillDemo = (user: string, pass: string): void => {
  setValues({ username: user, password: pass })
}
</script>

<template>
  <form class="login-form" novalidate @submit.prevent="onSubmit">
    <div v-if="authStore.error" class="alert alert-danger" role="alert">
      {{ authStore.error }}
    </div>

    <AppInput
      id="login-username"
      v-model="username"
      label="Ім'я користувача"
      placeholder="emilys"
      :error="usernameError"
      required
    />

    <AppInput
      id="login-password"
      v-model="password"
      type="password"
      label="Пароль"
      placeholder="emilyspass"
      :error="passwordError"
      required
    />

    <div class="demo-hints">
      <span class="hint-label">Демо акаунти:</span>
      <button
        type="button"
        class="demo-chip"
        @click="fillDemo('emilys', 'emilyspass')"
      >
        emilys (admin)
      </button>
      <button
        type="button"
        class="demo-chip"
        @click="fillDemo('michaelw', 'michaelwpass')"
      >
        michaelw
      </button>
    </div>

    <div class="form-actions">
      <AppButton
        type="submit"
        variant="primary"
        class="w-100"
        :disabled="authStore.isLoading"
      >
        <span v-if="authStore.isLoading" class="spinner-border spinner-border-sm me-1" />
        {{ authStore.isLoading ? 'Вхід...' : 'Увійти' }}
      </AppButton>
    </div>
  </form>
</template>

<style scoped lang="scss">
.demo-hints {
  margin-bottom: 1.25rem;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.5rem;
  font-size: 0.85rem;
}

.hint-label {
  color: #6c757d;
}

.demo-chip {
  background: #e9ecef;
  border: 1px solid #ced4da;
  border-radius: 12px;
  padding: 0.2rem 0.6rem;
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    background: #dee2e6;
    border-color: #adb5bd;
  }
}

.form-actions {
  margin-top: 1.5rem;
}

:global(html.app-dark-theme) {
  .hint-label {
    color: #adb5bd;
  }

  .demo-chip {
    background-color: #2a2a2a;
    border-color: #3e3e3e;
    color: #e0e0e0;

    &:hover {
      background-color: #383838;
      border-color: #4e4e4e;
    }
  }
}
</style>
