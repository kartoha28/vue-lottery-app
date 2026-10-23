<script setup lang="ts">
import { AppButton } from '@/shared/ui'
import WinnerBadge from './WinnerBadge.vue'
import type { Winner } from '../model/types'

defineProps<{
  winners: Winner[]
  canPickWinner: boolean
}>()

const emit = defineEmits<{
  (e: 'pick-winner'): void
  (e: 'remove-winner', id: string): void
}>()
</script>

<template>
  <div class="winners-block">
    <div class="winners-display">
      <div v-if="winners.length > 0" class="badges-wrapper">
        <WinnerBadge
          v-for="winner in winners"
          :key="winner.id"
          :winner="winner"
          @remove="(id) => emit('remove-winner', id)"
        />
        <span class="winners-label">Winners</span>
      </div>
      <div v-else class="winners-placeholder">
        Winners
      </div>
    </div>

    <AppButton
      variant="primary"
      :disabled="!canPickWinner || winners.length >= 3"
      class="new-winner-btn"
      @click="emit('pick-winner')"
    >
      New winner
    </AppButton>
  </div>
</template>

<style scoped lang="scss">
.winners-block {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
}

.winners-display {
  flex: 1;
  min-height: 44px;
  background-color: #ffffff;
  border: 1px solid #ced4da;
  border-radius: 4px;
  padding: 0.35rem 0.75rem;
  display: flex;
  align-items: center;
}

.badges-wrapper {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.winners-label {
  color: #6c757d;
  font-size: 0.9rem;
  margin-left: 0.25rem;
}

.winners-placeholder {
  color: #adb5bd;
  font-size: 0.95rem;
}

.new-winner-btn {
  white-space: nowrap;
  background-color: #0d6efd;
  border-color: #0d6efd;
  font-weight: 500;
  padding: 0.5rem 1.15rem;
}

:global(html.app-dark-theme) {
  .winners-display {
    background-color: #252525;
    border-color: #383838;
  }

  .winners-placeholder {
    color: #6c757d;
  }

  .winners-label {
    color: #adb5bd;
  }
}
</style>
