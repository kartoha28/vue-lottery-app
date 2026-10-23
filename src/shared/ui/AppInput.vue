<script setup lang="ts">
withDefaults(
  defineProps<{
    modelValue: string
    label?: string
    type?: string
    placeholder?: string
    error?: string
    isValid?: boolean
    id?: string
    required?: boolean
  }>(),
  {
    label: '',
    type: 'text',
    placeholder: '',
    error: '',
    isValid: false,
    id: () => `input-${Math.random().toString(36).substring(2, 9)}`,
    required: false,
  },
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'blur'): void
}>()

const handleInput = (event: Event): void => {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.value)
}
</script>

<template>
  <div class="app-input-group">
    <label v-if="label" :for="id" class="app-input-label">
      {{ label }}
    </label>

    <div class="input-wrapper">
      <input
        :id="id"
        :type="type"
        :value="modelValue"
        :placeholder="placeholder"
        :required="required"
        class="form-control app-input-field"
        :class="{
          'is-invalid': !!error,
          'is-valid': isValid && !error,
        }"
        @input="handleInput"
        @blur="emit('blur')"
      />
      <!-- Green checkmark icon for valid state matching screenshot (page 3) -->
      <span v-if="isValid && !error" class="valid-icon" aria-hidden="true">
        &#10003;
      </span>
    </div>

    <!-- Red error text matching screenshot (page 4) -->
    <div v-if="error" class="app-input-error">
      {{ error }}
    </div>
  </div>
</template>

<style scoped lang="scss">
.app-input-group {
  margin-bottom: 1.25rem;
  display: flex;
  flex-direction: column;
}

.app-input-label {
  font-size: 0.95rem;
  font-weight: 600;
  color: #333333;
  margin-bottom: 0.4rem;
}

.input-wrapper {
  position: relative;
  width: 100%;
}

.app-input-field {
  width: 100%;
  padding: 0.55rem 0.85rem;
  font-size: 0.95rem;
  border-radius: 4px;
  border: 1px solid #ced4da;
  background-color: #ffffff;
  color: #495057;
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;

  &::placeholder {
    color: #adb5bd;
    font-size: 0.9rem;
  }

  &:focus {
    border-color: #80bdff;
    outline: 0;
    box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
  }

  &.is-valid {
    border-color: #28a745;
    padding-right: 2.25rem;

    &:focus {
      box-shadow: 0 0 0 0.2rem rgba(40, 167, 69, 0.25);
    }
  }

  &.is-invalid {
    border-color: #e63946;

    &:focus {
      box-shadow: 0 0 0 0.2rem rgba(230, 57, 70, 0.25);
    }
  }
}

.valid-icon {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #28a745;
  font-weight: bold;
  font-size: 1.1rem;
  pointer-events: none;
}

.app-input-error {
  color: #e63946;
  font-size: 0.825rem;
  margin-top: 0.35rem;
  font-weight: 500;
}
</style>
