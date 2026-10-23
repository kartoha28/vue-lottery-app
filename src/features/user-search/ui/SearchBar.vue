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
  background-color: #f8f9fa;
  border-right: none;
  font-size: 0.95rem;
  color: #6c757d;
}

.search-input {
  border-left: none;
  padding: 0.45rem 0.75rem;
  font-size: 0.95rem;

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

:global(html.app-dark-theme) {
  .search-icon {
    background-color: #252525;
    border-color: #383838;
    color: #adb5bd;
  }

  .search-input {
    background-color: #252525;
    border-color: #383838;
    color: #e0e0e0;

    &:focus {
      border-color: #6ea8fe;
      box-shadow: 0 0 0 0.2rem rgba(110, 168, 254, 0.25);
    }

    &::placeholder {
      color: #6c757d;
    }
  }

  .clear-btn {
    border-color: #383838;
    color: #adb5bd;

    &:hover {
      background-color: #333333;
      color: #ffffff;
    }
  }
}
</style>
