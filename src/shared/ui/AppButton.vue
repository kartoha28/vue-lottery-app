<script setup lang="ts">
import { computed } from 'vue'
import Button from 'primevue/button'

const props = withDefaults(
  defineProps<{
    label?: string
    variant?: string
    severity?: 'secondary' | 'success' | 'info' | 'warn' | 'help' | 'danger' | 'contrast'
    size?: 'small' | 'large' | 'sm' | 'lg'
    loading?: boolean
    disabled?: boolean
    type?: 'button' | 'submit' | 'reset'
    icon?: string
    outlined?: boolean
  }>(),
  {
    label: undefined,
    variant: 'primary',
    severity: undefined,
    size: undefined,
    loading: false,
    disabled: false,
    type: 'button',
    icon: undefined,
    outlined: undefined,
  },
)

defineEmits<{
  (e: 'click', event: MouseEvent): void
}>()

const computedSeverity = computed(() => {
  if (props.severity) return props.severity
  if (props.variant?.includes('danger')) return 'danger'
  if (props.variant?.includes('secondary')) return 'secondary'
  if (props.variant?.includes('info')) return 'info'
  if (props.variant?.includes('success')) return 'success'
  return undefined
})

const isOutlined = computed(() => {
  if (props.outlined !== undefined) return props.outlined
  return props.variant?.includes('outline') || false
})

const computedSize = computed(() => {
  if (props.size === 'sm' || props.size === 'small') return 'small'
  if (props.size === 'lg' || props.size === 'large') return 'large'
  return undefined
})
</script>

<template>
  <Button
    :label="label"
    :severity="computedSeverity"
    :outlined="isOutlined"
    :size="computedSize"
    :loading="loading"
    :disabled="disabled"
    :type="type"
    :icon="icon"
    class="app-button"
    @click="$emit('click', $event)"
  >
    <slot />
  </Button>
</template>

<style scoped lang="scss">
.app-button {
  font-weight: 500;
  transition: all 0.15s ease;
}
</style>
