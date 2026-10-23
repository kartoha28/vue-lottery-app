<script setup lang="ts">
withDefaults(
  defineProps<{
    variant?: 'primary' | 'secondary' | 'danger' | 'outline-primary' | 'outline-secondary' | 'outline-danger'
    type?: 'button' | 'submit' | 'reset'
    disabled?: boolean
    size?: 'sm' | 'md' | 'lg'
  }>(),
  {
    variant: 'primary',
    type: 'button',
    disabled: false,
    size: 'md',
  },
)

const emit = defineEmits<{
  (e: 'click', event: MouseEvent): void
}>()
</script>

<template>
  <button
    :type="type"
    :disabled="disabled"
    class="btn custom-btn"
    :class="[
      `btn-${variant}`,
      size === 'sm' ? 'btn-sm' : size === 'lg' ? 'btn-lg' : '',
    ]"
    @click="(e) => emit('click', e)"
  >
    <slot />
  </button>
</template>

<style scoped lang="scss">
.custom-btn {
  font-weight: 500;
  transition: all 0.2s ease-in-out;
  border-radius: 4px;

  &:disabled {
    cursor: not-allowed;
    opacity: 0.65;
  }
}
</style>
