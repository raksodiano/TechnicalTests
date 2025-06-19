import { useToast } from 'primevue/usetoast'

let toastInstance: ReturnType<typeof useToast> | null = null

export function setToastInstance(instance: ReturnType<typeof useToast>) {
  toastInstance = instance
}

export function showErrorToast(summary: string, detail: string) {
  if (toastInstance) {
    toastInstance.add({ severity: 'error', summary, detail, life: 4000 })
  } else {
    console.warn('Toast instance not set yet.')
  }
}

export function showToast(severity: string, summary: string, detail: string) {
  if (toastInstance) {
    toastInstance.add({ severity, summary, detail, life: 3000 })
  } else {
    console.warn('Toast instance not set yet.')
  }
}
