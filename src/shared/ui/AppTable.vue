<script setup lang="ts">
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'

export interface TableColumn {
  field: string
  header: string
  sortable?: boolean
  style?: string
  class?: string
}

withDefaults(
  defineProps<{
    value: unknown[]
    columns?: TableColumn[]
    loading?: boolean
    paginator?: boolean
    rows?: number
    totalRecords?: number
    lazy?: boolean
    emptyMessage?: string
  }>(),
  {
    columns: () => [],
    loading: false,
    paginator: false,
    rows: 10,
    totalRecords: 0,
    lazy: false,
    emptyMessage: 'Дані відсутні',
  },
)

const emit = defineEmits<{
  (e: 'page', event: { page: number; first: number; rows: number }): void
}>()
</script>

<template>
  <div class="app-table-wrapper">
    <DataTable
      :value="value"
      :loading="loading"
      :paginator="paginator"
      :rows="rows"
      :total-records="totalRecords"
      :lazy="lazy"
      responsive-layout="scroll"
      striped-rows
      class="app-data-table"
      @page="emit('page', $event)"
    >
      <template #empty>
        <div class="p-4 text-center text-muted">
          {{ emptyMessage }}
        </div>
      </template>

      <slot>
        <Column
          v-for="col in columns"
          :key="col.field"
          :field="col.field"
          :header="col.header"
          :sortable="col.sortable"
          :style="col.style"
          :class="col.class"
        />
      </slot>
    </DataTable>
  </div>
</template>

<style scoped lang="scss">
.app-table-wrapper {
  background: var(--card-bg, #ffffff);
  border-radius: 6px;
  overflow: hidden;
  transition: background-color 0.2s ease;
}
</style>
