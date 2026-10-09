<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from 'vue'
import AppButton from './components/AppButton.vue'
import AppInput from './components/AppInput.vue'
import AppModal from './components/AppModal.vue'
import ParticipantsTable from './components/ParticipantsTable.vue'
import RegisterForm from './components/RegisterForm.vue'
import SearchBar from './components/SearchBar.vue'
import WinnersBlock from './components/WinnersBlock.vue'
import type { Participant, SortDirection, SortField, Winner } from './types/participant'

// Стан списку учасників та переможців
const participants = ref<Participant[]>([])
const winners = ref<Winner[]>([])

// Стан фільтрації та сортування
const searchQuery = ref('')
const sortField = ref<SortField | null>(null)
const sortDirection = ref<SortDirection>('asc')

// Стан модальних вікон
const isEditModalOpen = ref(false)
const isDeleteModalOpen = ref(false)
const editingParticipant = ref<Participant | null>(null)
const deletingParticipant = ref<Participant | null>(null)

// Форма редагування учасника в модальному вікні
const editFormData = reactive({
  name: '',
  dateOfBirth: '',
  email: '',
  phoneNumber: '',
})

const editErrors = reactive({
  name: '',
  dateOfBirth: '',
  email: '',
  phoneNumber: '',
})

const PHONE_REGEX = /^\+380\d{9}$/
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// Відновлення даних при завантаженні застосунку
onMounted(() => {
  const savedParticipants = localStorage.getItem('lottery_participants')
  if (savedParticipants) {
    try {
      participants.value = JSON.parse(savedParticipants)
    } catch {
      participants.value = []
    }
  } else {
    // Початкові демонстраційні учасники зі скріншоту методички (стор. 6)
    participants.value = [
      {
        id: '1',
        name: 'Amsterdam',
        dateOfBirth: '1990-10-01',
        email: 'amsterdam@example.com',
        phoneNumber: '+380635555555',
      },
      {
        id: '2',
        name: 'Washington',
        dateOfBirth: '1985-05-02',
        email: 'washington@example.com',
        phoneNumber: '+380635555556',
      },
      {
        id: '3',
        name: 'Sydney',
        dateOfBirth: '1987-08-15',
        email: 'sydney@example.com',
        phoneNumber: '+380635555557',
      },
    ]
  }

  const savedWinners = localStorage.getItem('lottery_winners')
  if (savedWinners) {
    try {
      winners.value = JSON.parse(savedWinners)
    } catch {
      winners.value = []
    }
  }
})

// Збереження списку юзерів у localStorage за допомогою watcher з deep: true
watch(
  participants,
  (newVal) => {
    localStorage.setItem('lottery_participants', JSON.stringify(newVal))
  },
  { deep: true },
)

// Збереження переможців у localStorage за допомогою watcher з deep: true
watch(
  winners,
  (newVal) => {
    localStorage.setItem('lottery_winners', JSON.stringify(newVal))
  },
  { deep: true },
)

// Список електронних адрес для перевірки унікальності
const existingEmails = computed(() => {
  return participants.value.map((p) => p.email)
})

// Учасники, які ще не стали переможцями
const eligibleParticipants = computed(() => {
  const winnerIds = new Set(winners.value.map((w) => w.id))
  return participants.value.filter((p) => !winnerIds.has(p.id))
})

// Умова доступності кнопки New winner (не більше 3 і є кого обирати)
const canPickWinner = computed(() => {
  return winners.value.length < 3 && eligibleParticipants.value.length > 0
})

// Випадковий вибір переможця
const handlePickWinner = (): void => {
  if (!canPickWinner.value) return
  const pool = eligibleParticipants.value
  const randomIndex = Math.floor(Math.random() * pool.length)
  const selected = pool[randomIndex]
  if (selected) {
    winners.value.push({
      id: selected.id,
      name: selected.name,
      email: selected.email,
    })
  }
}

// Видалення переможця з блоку
const handleRemoveWinner = (winnerId: string): void => {
  winners.value = winners.value.filter((w) => w.id !== winnerId)
}

// Додавання нового учасника
const handleAddParticipant = (data: Omit<Participant, 'id'>): void => {
  const newParticipant: Participant = {
    id: Date.now().toString(),
    ...data,
  }
  participants.value.push(newParticipant)
}

// Пошук за іменем з SearchBar (з debounce 300мс)
const handleFilterByName = (query: string): void => {
  searchQuery.value = query
}

// Сортування (зміна напрямку при повторному кліку)
const handleSort = (field: SortField): void => {
  if (sortField.value === field) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortField.value = field
    sortDirection.value = 'asc'
  }
}

// Фільтрація + сортування за допомогою computed (вихідний список не мутується)
const displayedParticipants = computed(() => {
  let result = [...participants.value]

  // 1. Фільтрація
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    result = result.filter((p) => p.name.toLowerCase().includes(q))
  }

  // 2. Сортування
  if (sortField.value) {
    const field = sortField.value
    const dir = sortDirection.value === 'asc' ? 1 : -1

    result.sort((a, b) => {
      if (field === 'name') {
        return a.name.localeCompare(b.name, 'uk') * dir
      }
      if (field === 'dateOfBirth') {
        return a.dateOfBirth.localeCompare(b.dateOfBirth) * dir
      }
      return 0
    })
  }

  return result
})

// Відкриття модального вікна редагування
const openEditModal = (participant: Participant): void => {
  editingParticipant.value = participant
  editFormData.name = participant.name
  editFormData.dateOfBirth = participant.dateOfBirth
  editFormData.email = participant.email
  editFormData.phoneNumber = participant.phoneNumber

  editErrors.name = ''
  editErrors.dateOfBirth = ''
  editErrors.email = ''
  editErrors.phoneNumber = ''

  isEditModalOpen.value = true
}

const closeEditModal = (): void => {
  isEditModalOpen.value = false
  editingParticipant.value = null
}

// Валідація та оновлення даних учасника
const handleUpdateParticipant = (): void => {
  if (!editingParticipant.value) return

  let isValid = true

  if (!editFormData.name.trim()) {
    editErrors.name = 'This value is required'
    isValid = false
  } else {
    editErrors.name = ''
  }

  if (!editFormData.dateOfBirth) {
    editErrors.dateOfBirth = 'This value is required'
    isValid = false
  } else {
    const today = new Date().toISOString().split('T')[0] ?? ''
    if (today && editFormData.dateOfBirth > today) {
      editErrors.dateOfBirth = 'Дата народження не повинна бути у майбутньому'
      isValid = false
    } else {
      editErrors.dateOfBirth = ''
    }
  }

  const trimmedEmail = editFormData.email.trim()
  if (!trimmedEmail) {
    editErrors.email = 'This value is required'
    isValid = false
  } else if (!EMAIL_REGEX.test(trimmedEmail)) {
    editErrors.email = 'Невірний формат електронної пошти'
    isValid = false
  } else {
    // Власний email при редагуванні дублікатом не вважається!
    const isDuplicate = participants.value.some(
      (p) =>
        p.id !== editingParticipant.value?.id &&
        p.email.toLowerCase() === trimmedEmail.toLowerCase(),
    )
    if (isDuplicate) {
      editErrors.email = 'Учасник з такою електронною поштою вже існує'
      isValid = false
    } else {
      editErrors.email = ''
    }
  }

  const trimmedPhone = editFormData.phoneNumber.trim()
  if (!trimmedPhone) {
    editErrors.phoneNumber = 'This value is required'
    isValid = false
  } else if (!PHONE_REGEX.test(trimmedPhone)) {
    editErrors.phoneNumber = 'Формат повинен бути +380XXXXXXXXX (9 цифр)'
    isValid = false
  } else {
    editErrors.phoneNumber = ''
  }

  if (isValid) {
    const idToUpdate = editingParticipant.value.id
    const target = participants.value.find((p) => p.id === idToUpdate)
    if (target) {
      target.name = editFormData.name.trim()
      target.dateOfBirth = editFormData.dateOfBirth
      target.email = trimmedEmail
      target.phoneNumber = trimmedPhone
    }

    // Якщо учасник у списку переможців — синхронізувати його ім'я та email
    const winnerTarget = winners.value.find((w) => w.id === idToUpdate)
    if (winnerTarget) {
      winnerTarget.name = editFormData.name.trim()
      winnerTarget.email = trimmedEmail
    }

    closeEditModal()
  }
}

// Відкриття модального вікна видалення
const openDeleteModal = (participant: Participant): void => {
  deletingParticipant.value = participant
  isDeleteModalOpen.value = true
}

const closeDeleteModal = (): void => {
  isDeleteModalOpen.value = false
  deletingParticipant.value = null
}

// Підтвердження видалення
const confirmDelete = (): void => {
  if (!deletingParticipant.value) return
  const idToDelete = deletingParticipant.value.id

  // Видалити з таблиці
  participants.value = participants.value.filter((p) => p.id !== idToDelete)

  // Якщо видалений учасник є переможцем — видалити його з блоку переможців (п. 5.2)
  winners.value = winners.value.filter((w) => w.id !== idToDelete)

  closeDeleteModal()
}
</script>

<template>
  <main class="lottery-card-container">
    <!-- 1. Блок переможців -->
    <WinnersBlock
      :winners="winners"
      :can-pick-winner="canPickWinner"
      @pick-winner="handlePickWinner"
      @remove-winner="handleRemoveWinner"
    />

    <!-- 2. Блок з формою реєстрації нових учасників -->
    <RegisterForm
      :existing-emails="existingEmails"
      @add-participant="handleAddParticipant"
    />

    <!-- Поле пошуку з debounce 300мс -->
    <SearchBar @filter-by-name="handleFilterByName" />

    <!-- 3. Блок з таблицею зі списком учасників -->
    <ParticipantsTable
      :participants="displayedParticipants"
      :current-sort-field="sortField"
      :current-sort-direction="sortDirection"
      @sort="handleSort"
      @edit="openEditModal"
      @delete="openDeleteModal"
    />

    <!-- Модальне вікно редагування даних учасника -->
    <AppModal
      :is-open="isEditModalOpen"
      title="Редагувати дані учасника"
      @close="closeEditModal"
    >
      <template #body>
        <form class="edit-modal-form" @submit.prevent="handleUpdateParticipant">
          <AppInput
            v-model="editFormData.name"
            label="Name"
            placeholder="Enter user name"
            :error="editErrors.name"
            :is-valid="!editErrors.name"
          />

          <AppInput
            v-model="editFormData.dateOfBirth"
            type="date"
            label="Date of Birth"
            :error="editErrors.dateOfBirth"
            :is-valid="!editErrors.dateOfBirth"
          />

          <AppInput
            v-model="editFormData.email"
            type="email"
            label="Email"
            placeholder="Enter email"
            :error="editErrors.email"
            :is-valid="!editErrors.email"
          />

          <AppInput
            v-model="editFormData.phoneNumber"
            type="tel"
            label="Phone number"
            placeholder="Enter Phone number"
            :error="editErrors.phoneNumber"
            :is-valid="!editErrors.phoneNumber"
          />
        </form>
      </template>
      <template #footer>
        <AppButton variant="secondary" size="sm" @click="closeEditModal">
          Скасувати
        </AppButton>
        <AppButton variant="primary" size="sm" @click="handleUpdateParticipant">
          Оновити дані
        </AppButton>
      </template>
    </AppModal>

    <!-- Модальне вікно підтвердження видалення учасника -->
    <AppModal
      :is-open="isDeleteModalOpen"
      title="Підтвердження видалення"
      @close="closeDeleteModal"
    >
      <template #body>
        <p v-if="deletingParticipant" class="delete-confirmation-text">
          Ви дійсно бажаєте видалити учасника
          <strong>"{{ deletingParticipant.name }}"</strong>,
          <strong>"{{ deletingParticipant.email }}"</strong>?
        </p>
      </template>
      <template #footer>
        <AppButton variant="secondary" size="sm" @click="closeDeleteModal">
          Ні
        </AppButton>
        <AppButton variant="danger" size="sm" @click="confirmDelete">
          Так
        </AppButton>
      </template>
    </AppModal>
  </main>
</template>

<style scoped lang="scss">
.delete-confirmation-text {
  font-size: 1rem;
  color: #333333;
  margin: 0;
  line-height: 1.5;

  strong {
    color: #0d6efd;
  }
}

.edit-modal-form {
  display: flex;
  flex-direction: column;
}
</style>
