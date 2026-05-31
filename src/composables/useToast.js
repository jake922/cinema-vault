import { readonly, ref } from 'vue'

const toasts = ref([])
const timers = new Map()

let nextId = 1

const removeToast = (id) => {
  toasts.value = toasts.value.filter((toast) => toast.id !== id)

  const timer = timers.get(id)

  if (timer) {
    window.clearTimeout(timer)
    timers.delete(id)
  }
}

const showToast = ({
  title,
  message,
  type = 'success',
  duration = 3200,
}) => {
  const id = nextId++

  toasts.value.push({
    id,
    title,
    message,
    type,
  })

  if (duration > 0) {
    const timer = window.setTimeout(() => {
      removeToast(id)
    }, duration)

    timers.set(id, timer)
  }

  return id
}

export const useToast = () => {
  const success = (message, title = 'Success') =>
    showToast({
      title,
      message,
      type: 'success',
    })

  const warning = (message, title = 'Warning') =>
    showToast({
      title,
      message,
      type: 'warning',
    })

  const error = (message, title = 'Error') =>
    showToast({
      title,
      message,
      type: 'error',
    })

  return {
    toasts: readonly(toasts),
    showToast,
    removeToast,
    success,
    warning,
    error,
  }
}