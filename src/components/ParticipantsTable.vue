<script setup lang="ts">
import AppButton from './AppButton.vue'
import type { Participant, SortDirection, SortField } from '../types/participant'

defineProps<{
  participants: Participant[]
  currentSortField: SortField | null
  currentSortDirection: SortDirection
}>()

const emit = defineEmits<{
  (e: 'sort', field: SortField): void
  (e: 'edit', participant: Participant): void
  (e: 'delete', participant: Participant): void
}>()

const formatDate = (dateStr: string): string => {
  if (!dateStr) return ''
  const parts = dateStr.split('-')
  if (parts.length === 3) {
    // dd/mm/yyyy matching screenshot format (page 6)
    return `${parts[2]}/${parts[1]}/${parts[0]}`
  }
  return dateStr
}
</script>

<template>
  <div class="table-responsive participants-table-wrapper">
    <table class="table participants-table">
      <thead>
        <tr>
          <th scope="col" class="col-num">#</th>
          <th scope="col" class="col-sortable" @click="emit('sort', 'name')">
            <span class="header-cell-content">
              Name
              <span class="sort-icon" aria-hidden="true">
                <template v-if="currentSortField === 'name'">
                  {{ currentSortDirection === 'asc' ? '&#8679;' : '&#8681;' }}
                </template>
                <template v-else>
                  &#8645;
                </template>
              </span>
            </span>
          </th>
          <th scope="col" class="col-sortable" @click="emit('sort', 'dateOfBirth')">
            <span class="header-cell-content">
              Date of Birth
              <span class="sort-icon" aria-hidden="true">
                <template v-if="currentSortField === 'dateOfBirth'">
                  {{ currentSortDirection === 'asc' ? '&#8679;' : '&#8681;' }}
                </template>
                <template v-else>
                  &#8645;
                </template>
              </span>
            </span>
          </th>
          <th scope="col">Email</th>
          <th scope="col">Phone number</th>
          <th scope="col" class="text-end">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="participants.length === 0">
          <td colspan="6" class="text-center py-4 text-muted">
            Список учасників порожній
          </td>
        </tr>
        <tr
          v-for="(participant, index) in participants"
          :key="participant.id"
          class="participant-row"
        >
          <td class="col-num">{{ index + 1 }}</td>
          <td class="fw-medium text-dark">{{ participant.name }}</td>
          <td class="text-secondary">{{ formatDate(participant.dateOfBirth) }}</td>
          <td class="text-secondary">{{ participant.email }}</td>
          <td class="text-secondary">{{ participant.phoneNumber }}</td>
          <td class="text-end actions-cell">
            <AppButton
              size="sm"
              variant="outline-primary"
              class="action-btn"
              @click="emit('edit', participant)"
            >
              Редагувати дані
            </AppButton>
            <AppButton
              size="sm"
              variant="outline-danger"
              class="action-btn"
              @click="emit('delete', participant)"
            >
              Видалити учасника
            </AppButton>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped lang="scss">
.participants-table-wrapper {
  margin-top: 1rem;
}

.participants-table {
  width: 100%;
  margin-bottom: 0;
  border-collapse: separate;
  border-spacing: 0;

  thead th {
    font-size: 0.9rem;
    font-weight: 600;
    color: #495057;
    border-bottom: 2px solid #dee2e6;
    padding: 0.75rem 0.65rem;
    white-space: nowrap;
  }

  tbody td {
    font-size: 0.9rem;
    padding: 0.75rem 0.65rem;
    vertical-align: middle;
    border-bottom: 1px solid #e9ecef;
  }

  .col-num {
    width: 40px;
    color: #6c757d;
  }

  .col-sortable {
    cursor: pointer;
    user-select: none;
    transition: background-color 0.15s ease;

    &:hover {
      background-color: #f1f3f5;
    }
  }

  .header-cell-content {
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
  }

  .sort-icon {
    font-size: 0.9rem;
    color: #0d6efd;
  }

  .actions-cell {
    white-space: nowrap;
    display: flex;
    justify-content: flex-end;
    gap: 0.4rem;
  }

  .action-btn {
    font-size: 0.8rem;
    padding: 0.25rem 0.55rem;
  }
}
</style>
