<script setup lang="ts">
import { onMounted, onUnmounted, watch } from 'vue'

const props = withDefaults(
  defineProps<{
    isOpen: boolean
    title?: string
  }>(),
  {
    title: '',
  },
)

const emit = defineEmits<{
  (e: 'close'): void
}>()

const handleKeydown = (event: KeyboardEvent): void => {
  if (event.key === 'Escape' && props.isOpen) {
    emit('close')
  }
}

watch(
  () => props.isOpen,
  (open) => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
  },
)

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
  document.body.style.overflow = ''
})
</script>

<template>
  <Teleport to="body">
    <Transition name="modal-fade">
      <div
        v-if="isOpen"
        class="modal-backdrop-custom"
        role="dialog"
        aria-modal="true"
        @click.self="emit('close')"
        @keydown.esc="emit('close')"
      >
        <div class="modal-dialog-custom">
          <div class="modal-content-custom">
            <!-- Header Slot -->
            <div class="modal-header-custom">
              <slot name="header">
                <h5 class="modal-title-custom">{{ title }}</h5>
              </slot>
              <button
                type="button"
                class="btn-close-custom"
                aria-label="Close"
                @click="emit('close')"
              >
                &times;
              </button>
            </div>

            <!-- Body Slot -->
            <div class="modal-body-custom">
              <slot name="body" />
            </div>

            <!-- Footer Slot -->
            <div v-if="$slots.footer" class="modal-footer-custom">
              <slot name="footer" />
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped lang="scss">
.modal-backdrop-custom {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1050;
  padding: 1rem;
}

.modal-dialog-custom {
  width: 100%;
  max-width: 520px;
  margin: auto;
}

.modal-content-custom {
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border: 1px solid #dee2e6;
}

.modal-header-custom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.25rem;
  border-bottom: 1px solid #e9ecef;
}

.modal-title-custom {
  margin: 0;
  font-size: 1.15rem;
  font-weight: 600;
  color: #212529;
}

.btn-close-custom {
  background: transparent;
  border: none;
  font-size: 1.5rem;
  line-height: 1;
  color: #6c757d;
  cursor: pointer;
  padding: 0;

  &:hover {
    color: #212529;
  }
}

.modal-body-custom {
  padding: 1.25rem;
  font-size: 0.95rem;
  color: #495057;
}

.modal-footer-custom {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0.75rem;
  padding: 0.85rem 1.25rem;
  border-top: 1px solid #e9ecef;
  background-color: #f8f9fa;
}

/* Modal Vue transition */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.25s ease;

  .modal-dialog-custom {
    transition: transform 0.25s ease;
  }
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;

  .modal-dialog-custom {
    transform: scale(0.95);
  }
}
</style>
