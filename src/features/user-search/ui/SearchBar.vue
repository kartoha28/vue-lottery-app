<script setup lang="ts">
import { onUnmounted, ref, watch } from 'vue'

const props = withDefaults(
  defineProps<{
    initialQuery?: string
  }>(),
  {
    initialQuery: '',
  },
)

const emit = defineEmits<{
  (e: 'filter-by-name', query: string): void
}>()

const searchQuery = ref(props.initialQuery)
let timer: ReturnType<typeof setTimeout> | null = null

watch(
  () => props.initialQuery,
  (val) => {
    if (val !== searchQuery.value) {
      searchQuery.value = val
    }
  },
)

// Передача події filter-by-name за допомогою watch з debounce 300 мс
watch(searchQuery, (newVal) => {
  if (timer) {
    clearTimeout(timer)
  }
  timer = setTimeout(() => {
    emit('filter-by-name', newVal.trim())
  }, 300)
})

onUnmounted(() => {
  if (timer) {
    clearTimeout(timer)
  }
})
</script>

<template>
  <div class="search-bar-wrapper">
    <div class="input-group">
      <span class="input-group-text search-icon" aria-hidden="true">&#128269;</span>
      <input
        v-model="searchQuery"
        type="text"
        class="form-control search-input"
        placeholder="Пошук користувачів за іменем..."
        aria-label="Пошук користувачів за іменем"
      />
      <button
        v-if="searchQuery"
        type="button"
        class="btn btn-outline-secondary clear-btn"
        title="Очистити пошук"
        @click="searchQuery = ''"
      >
        &times;
      </button>
    </div>
  </div>
</template>

<style scoped lang="scss">
.search-bar-wrapper {
  margin-bottom: 1.25rem;
}

.search-icon {
  background-color: var(--surface-muted, #f8f9fa);
  border-color: var(--border-color, #ced4da);
  border-right: none;
  font-size: 0.95rem;
  color: var(--text-secondary, #6c757d);
  transition: background-color 0.2s ease, border-color 0.2s ease, color 0.2s ease;
}

.search-input {
  background-color: var(--card-bg, #ffffff);
  border-color: var(--border-color, #ced4da);
  color: var(--text-primary, #212529);
  border-left: none;
  padding: 0.45rem 0.75rem;
  font-size: 0.95rem;
  transition: background-color 0.2s ease, border-color 0.2s ease, color 0.2s ease;

  &:focus {
    box-shadow: none;
    border-color: #80bdff;
  }
}

.clear-btn {
  font-size: 1.1rem;
  line-height: 1;
  padding: 0 0.75rem;
}
</style>
