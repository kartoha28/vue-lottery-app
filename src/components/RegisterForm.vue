<script setup lang="ts">
import { reactive, ref } from 'vue'
import AppButton from './AppButton.vue'
import AppInput from './AppInput.vue'
import type { Participant } from '../types/participant'

const props = defineProps<{
  existingEmails: string[]
}>()

const emit = defineEmits<{
  (e: 'add-participant', data: Omit<Participant, 'id'>): void
}>()

const formData = reactive({
  name: '',
  dateOfBirth: '',
  email: '',
  phoneNumber: '',
})

const errors = reactive({
  name: '',
  dateOfBirth: '',
  email: '',
  phoneNumber: '',
})

const touched = reactive({
  name: false,
  dateOfBirth: false,
  email: false,
  phoneNumber: false,
})

const isSubmitted = ref(false)

const PHONE_REGEX = /^\+380\d{9}$/
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const getTodayString = (): string => {
  const d = new Date()
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const validateName = (): boolean => {
  if (!formData.name.trim()) {
    errors.name = 'This value is required'
    return false
  }
  errors.name = ''
  return true
}

const validateDateOfBirth = (): boolean => {
  if (!formData.dateOfBirth) {
    errors.dateOfBirth = 'This value is required'
    return false
  }
  const today = getTodayString()
  if (formData.dateOfBirth > today) {
    errors.dateOfBirth = 'Дата народження не повинна бути у майбутньому'
    return false
  }
  errors.dateOfBirth = ''
  return true
}

const validateEmail = (): boolean => {
  const trimmed = formData.email.trim()
  if (!trimmed) {
    errors.email = 'This value is required'
    return false
  }
  if (!EMAIL_REGEX.test(trimmed)) {
    errors.email = 'Невірний формат електронної пошти'
    return false
  }
  const isDuplicate = props.existingEmails.some(
    (e) => e.toLowerCase() === trimmed.toLowerCase(),
  )
  if (isDuplicate) {
    errors.email = 'Учасник з такою електронною поштою вже існує'
    return false
  }
  errors.email = ''
  return true
}

const validatePhoneNumber = (): boolean => {
  const trimmed = formData.phoneNumber.trim()
  if (!trimmed) {
    errors.phoneNumber = 'This value is required'
    return false
  }
  if (!PHONE_REGEX.test(trimmed)) {
    errors.phoneNumber = 'Формат телефону повинен бути +380XXXXXXXXX (9 цифр)'
    return false
  }
  errors.phoneNumber = ''
  return true
}

const resetForm = (): void => {
  formData.name = ''
  formData.dateOfBirth = ''
  formData.email = ''
  formData.phoneNumber = ''

  errors.name = ''
  errors.dateOfBirth = ''
  errors.email = ''
  errors.phoneNumber = ''

  touched.name = false
  touched.dateOfBirth = false
  touched.email = false
  touched.phoneNumber = false
  isSubmitted.value = false
}

const handleSubmit = (): void => {
  isSubmitted.value = true
  touched.name = true
  touched.dateOfBirth = true
  touched.email = true
  touched.phoneNumber = true

  const isNameValid = validateName()
  const isDateValid = validateDateOfBirth()
  const isEmailValid = validateEmail()
  const isPhoneValid = validatePhoneNumber()

  if (isNameValid && isDateValid && isEmailValid && isPhoneValid) {
    emit('add-participant', {
      name: formData.name.trim(),
      dateOfBirth: formData.dateOfBirth,
      email: formData.email.trim(),
      phoneNumber: formData.phoneNumber.trim(),
    })
    resetForm()
  }
}
</script>

<template>
  <section class="register-card" @keydown.enter="handleSubmit">
    <div class="register-header">
      <h2 class="register-title">REGISTER FORM</h2>
      <p class="register-subtitle">Please fill in all the fields.</p>
    </div>

    <form class="register-form" @submit.prevent="handleSubmit">
      <AppInput
        v-model="formData.name"
        label="Name"
        placeholder="Enter user name"
        :error="touched.name ? errors.name : ''"
        :is-valid="touched.name && !errors.name"
        @blur="touched.name = true; validateName()"
      />

      <AppInput
        v-model="formData.dateOfBirth"
        type="date"
        label="Date of Birth"
        placeholder="mm/dd/yyyy"
        :error="touched.dateOfBirth ? errors.dateOfBirth : ''"
        :is-valid="touched.dateOfBirth && !errors.dateOfBirth"
        @blur="touched.dateOfBirth = true; validateDateOfBirth()"
      />

      <AppInput
        v-model="formData.email"
        type="email"
        label="Email"
        placeholder="Enter email"
        :error="touched.email ? errors.email : ''"
        :is-valid="touched.email && !errors.email"
        @blur="touched.email = true; validateEmail()"
      />

      <AppInput
        v-model="formData.phoneNumber"
        type="tel"
        label="Phone number"
        placeholder="Enter Phone number"
        :error="touched.phoneNumber ? errors.phoneNumber : ''"
        :is-valid="touched.phoneNumber && !errors.phoneNumber"
        @blur="touched.phoneNumber = true; validatePhoneNumber()"
      />

      <div class="form-actions">
        <AppButton type="submit" variant="primary" class="save-btn">
          Save
        </AppButton>
      </div>
    </form>
  </section>
</template>

<style scoped lang="scss">
.register-card {
  margin-bottom: 2.5rem;
}

.register-header {
  margin-bottom: 1.25rem;
}

.register-title {
  font-size: 1.15rem;
  font-weight: 700;
  letter-spacing: 0.5px;
  color: #2b2d42;
  margin-bottom: 0.2rem;
}

.register-subtitle {
  font-size: 0.875rem;
  color: #8d99ae;
  margin: 0;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 1rem;
}

.save-btn {
  background-color: #0d6efd;
  border-color: #0d6efd;
  font-weight: 500;
  padding: 0.5rem 1.75rem;
}
</style>
