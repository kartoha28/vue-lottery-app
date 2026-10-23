import { useToast as usePrimeToast } from 'primevue/usetoast'
import { useConfirm as usePrimeConfirm } from 'primevue/useconfirm'

export function useAppToast() {
  const toast = usePrimeToast()

  return {
    success(summary: string, detail = '') {
      toast.add({ severity: 'success', summary, detail, life: 3000 })
    },
    error(summary: string, detail = '') {
      toast.add({ severity: 'error', summary, detail, life: 4000 })
    },
    info(summary: string, detail = '') {
      toast.add({ severity: 'info', summary, detail, life: 3000 })
    },
    warn(summary: string, detail = '') {
      toast.add({ severity: 'warn', summary, detail, life: 3500 })
    },
  }
}

export function useAppConfirm() {
  const confirm = usePrimeConfirm()

  return {
    require(options: {
      message: string
      header?: string
      icon?: string
      acceptLabel?: string
      rejectLabel?: string
      acceptClass?: string
      rejectClass?: string
      accept?: () => void
      reject?: () => void
    }) {
      confirm.require({
        header: options.header || 'Підтвердження',
        message: options.message,
        icon: options.icon || 'pi pi-exclamation-triangle',
        acceptProps: {
          label: options.acceptLabel || 'Так',
          severity: 'danger',
        },
        rejectProps: {
          label: options.rejectLabel || 'Ні',
          severity: 'secondary',
          outlined: true,
        },
        accept: options.accept,
        reject: options.reject,
      })
    },
  }
}
