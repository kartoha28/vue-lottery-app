<script setup lang="ts">
import InputText from 'primevue/inputtext'

withDefaults(
  defineProps<{
    modelValue?: string | number
    label?: string
    type?: string
    placeholder?: string
    error?: string
    required?: boolean
    disabled?: boolean
    id?: string
  }>(),
  {
    modelValue: '',
    label: '',
    type: 'text',
    placeholder: '',
    error: '',
    required: false,
    disabled: false,
    id: undefined,
  },
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'blur', event: FocusEvent): void
}>()

const onInput = (event: Event): void => {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.value)
}
</script>

<template>
  <div class="app-input-wrapper">
    <label v-if="label" :for="id" class="form-label">
      {{ label }}
      <span v-if="required" class="required-star">*</span>
    </label>

    <InputText
      :id="id"
      :value="modelValue"
      :type="type"
      :placeholder="placeholder"
      :disabled="disabled"
      :invalid="Boolean(error)"
      class="w-100 app-input-field"
      @input="onInput"
      @blur="$emit('blur', $event)"
    />

    <small v-if="error" class="p-error error-message">
      {{ error }}
    </small>
  </div>
</template>

<style scoped lang="scss">
.app-input-wrapper {
  margin-bottom: 1.15rem;
  display: flex;
  flex-direction: column;
}

.form-label {
  font-size: 0.9rem;
  font-weight: 600;
  color: #343a40;
  margin-bottom: 0.4rem;
}

.required-star {
  color: #dc3545;
  margin-left: 0.2rem;
}

.app-input-field {
  padding: 0.55rem 0.85rem;
  font-size: 0.95rem;
}

.error-message {
  color: #dc3545;
  font-size: 0.825rem;
  margin-top: 0.35rem;
}

:global(html.app-dark-theme) {
  .form-label {
    color: #e0e0e0;
  }

  .app-input-field {
    background-color: #252525;
    color: #e0e0e0;
    border-color: #3e3e3e;

    &:focus {
      border-color: #6ea8fe;
      box-shadow: 0 0 0 0.2rem rgba(110, 168, 254, 0.25);
    }

    &::placeholder {
      color: #6c757d;
    }
  }
}
</style>
