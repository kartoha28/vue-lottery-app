<script setup lang="ts">
import { watch } from 'vue'
import { useField, useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/yup'
import * as yup from 'yup'
import { AppButton, AppInput } from '@/shared/ui'
import type { CreateUserDto, User } from '@/entities/user'

const props = withDefaults(
  defineProps<{
    initialData?: Partial<User> | null
    submitLabel?: string
    isSubmitting?: boolean
  }>(),
  {
    initialData: null,
    submitLabel: 'Зберегти',
    isSubmitting: false,
  },
)

const emit = defineEmits<{
  (e: 'submit', data: CreateUserDto): void
  (e: 'cancel'): void
}>()

const userSchema = toTypedSchema(
  yup.object({
    firstName: yup.string().trim().required("Ім'я є обов'язковим"),
    lastName: yup.string().trim().required("Прізвище є обов'язковим"),
    email: yup
      .string()
      .trim()
      .required("Email є обов'язковим")
      .email('Невірний формат email'),
    username: yup.string().trim().required("Username є обов'язковим"),
    password: yup
      .string()
      .required("Пароль є обов'язковим")
      .min(6, 'Пароль має містити щонайменше 6 символів'),
    age: yup
      .number()
      .typeError('Вік має бути числом')
      .required("Вік є обов'язковим")
      .min(1, 'Вік має бути більше 0')
      .max(120, 'Вік не може перевищувати 120'),
    gender: yup
      .string()
      .oneOf(['male', 'female'], 'Оберіть стать')
      .required("Стать є обов'язковою"),
    phone: yup.string().trim().required("Телефон є обов'язковим"),
  }),
)

const { handleSubmit, resetForm } = useForm({
  validationSchema: userSchema,
  initialValues: {
    firstName: props.initialData?.firstName ?? '',
    lastName: props.initialData?.lastName ?? '',
    email: props.initialData?.email ?? '',
    username: props.initialData?.username ?? '',
    password: props.initialData?.password ?? 'pass123',
    age: props.initialData?.age ?? 25,
    gender: (props.initialData?.gender === 'female' ? 'female' : 'male') as 'male' | 'female',
    phone: props.initialData?.phone ?? '+380501234567',
  },
})

watch(
  () => props.initialData,
  (newData) => {
    if (newData) {
      resetForm({
        values: {
          firstName: newData.firstName ?? '',
          lastName: newData.lastName ?? '',
          email: newData.email ?? '',
          username: newData.username ?? '',
          password: newData.password || 'pass123',
          age: newData.age ?? 25,
          gender: (newData.gender === 'female' ? 'female' : 'male') as 'male' | 'female',
          phone: newData.phone ?? '',
        },
      })
    }
  },
)

const { value: firstName, errorMessage: firstNameError } = useField<string>('firstName')
const { value: lastName, errorMessage: lastNameError } = useField<string>('lastName')
const { value: email, errorMessage: emailError } = useField<string>('email')
const { value: username, errorMessage: usernameError } = useField<string>('username')
const { value: password, errorMessage: passwordError } = useField<string>('password')
const { value: age, errorMessage: ageError } = useField<number>('age')
const { value: gender, errorMessage: genderError } = useField<'male' | 'female'>('gender')
const { value: phone, errorMessage: phoneError } = useField<string>('phone')

const ageString = {
  get: () => String(age.value ?? ''),
  set: (v: string) => {
    age.value = v === '' ? ('' as unknown as number) : Number(v)
  },
}

const onSubmit = handleSubmit((values) => {
  emit('submit', {
    firstName: values.firstName,
    lastName: values.lastName,
    email: values.email,
    username: values.username,
    password: values.password,
    age: Number(values.age),
    gender: values.gender,
    phone: values.phone,
  })
})
</script>

<template>
  <form class="user-form" @submit.prevent="onSubmit">
    <div class="row">
      <div class="col-md-6">
        <AppInput
          v-model="firstName"
          label="First Name"
          placeholder="Введіть ім'я"
          :error="firstNameError"
          :is-valid="Boolean(firstName && !firstNameError)"
        />
      </div>
      <div class="col-md-6">
        <AppInput
          v-model="lastName"
          label="Last Name"
          placeholder="Введіть прізвище"
          :error="lastNameError"
          :is-valid="Boolean(lastName && !lastNameError)"
        />
      </div>
    </div>

    <div class="row">
      <div class="col-md-6">
        <AppInput
          v-model="email"
          type="email"
          label="Email"
          placeholder="user@example.com"
          :error="emailError"
          :is-valid="Boolean(email && !emailError)"
        />
      </div>
      <div class="col-md-6">
        <AppInput
          v-model="phone"
          type="tel"
          label="Phone"
          placeholder="+380501234567"
          :error="phoneError"
          :is-valid="Boolean(phone && !phoneError)"
        />
      </div>
    </div>

    <div class="row">
      <div class="col-md-6">
        <AppInput
          v-model="username"
          label="Username"
          placeholder="username"
          :error="usernameError"
          :is-valid="Boolean(username && !usernameError)"
        />
      </div>
      <div class="col-md-6">
        <AppInput
          v-model="password"
          type="password"
          label="Password"
          placeholder="Мінімум 6 символів"
          :error="passwordError"
          :is-valid="Boolean(password && !passwordError)"
        />
      </div>
    </div>

    <div class="row">
      <div class="col-md-6">
        <AppInput
          :model-value="ageString.get()"
          type="number"
          label="Age"
          placeholder="25"
          :error="ageError"
          :is-valid="Boolean(age && !ageError)"
          @update:model-value="ageString.set"
        />
      </div>
      <div class="col-md-6">
        <div class="mb-3">
          <label class="form-label fw-semibold">Gender</label>
          <select v-model="gender" class="form-select">
            <option value="male">Male (Чоловік)</option>
            <option value="female">Female (Жінка)</option>
          </select>
          <div v-if="genderError" class="text-danger small mt-1">
            {{ genderError }}
          </div>
        </div>
      </div>
    </div>

    <div class="form-footer">
      <AppButton type="button" variant="secondary" @click="emit('cancel')">
        Скасувати
      </AppButton>
      <AppButton type="submit" variant="primary" :disabled="isSubmitting">
        {{ isSubmitting ? 'Збереження...' : submitLabel }}
      </AppButton>
    </div>
  </form>
</template>

<style scoped lang="scss">
.form-footer {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  margin-top: 0.75rem;
  padding-top: 1rem;
  border-top: 1px solid #e9ecef;
}
</style>
