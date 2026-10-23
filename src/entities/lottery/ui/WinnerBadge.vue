<script setup lang="ts">
import type { Winner } from '../model/types'

defineProps<{
  winner: Winner
}>()

const emit = defineEmits<{
  (e: 'remove', id: string): void
}>()
</script>

<template>
  <span class="winner-badge">
    <span class="winner-name">{{ winner.name }}</span>
    <button
      type="button"
      class="remove-btn"
      title="Видалити переможця"
      aria-label="Видалити переможця"
      @click="emit('remove', winner.id)"
    >
      &times;
    </button>
  </span>
</template>

<style scoped lang="scss">
.winner-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  background-color: #38bdf8;
  color: #ffffff;
  padding: 0.2rem 0.55rem;
  border-radius: 4px;
  font-size: 0.85rem;
  font-weight: 500;
  line-height: 1.2;
}

.winner-name {
  max-width: 140px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.remove-btn {
  background: transparent;
  border: none;
  color: #ffffff;
  font-size: 1rem;
  line-height: 1;
  padding: 0;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  opacity: 0.85;
  transition: opacity 0.15s ease;

  &:hover {
    opacity: 1;
  }
}
</style>
