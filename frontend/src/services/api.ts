import axios, { type AxiosInstance, type AxiosRequestConfig } from 'axios'
import { useAuthStore } from '@/stores/auth'
import { showErrorToast } from '@/utils/toast.utils.ts'

// Instancia base
const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
})

// Interceptor para manejar automáticamente los tokens
api.interceptors.request.use(async (config: AxiosRequestConfig) => {
  const authStore = useAuthStore()

  // Para endpoints protegidos usa token de sesión
  if (localStorage.getItem('authToken')) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${localStorage.getItem('authToken')}`,
    }
  }

  // Para endpoints públicos (incluyendo login) usa token de invitado
  else if (localStorage.getItem('guestToken')) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${localStorage.getItem('guestToken')}`,
    }
  }

  return config
})

// Interceptor para manejar respuestas y errores
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const authStore = useAuthStore()
      authStore.logout()
      window.location.href = '/login'
    }
    showErrorToast('Error', error.response.data.message)
    return Promise.reject(error)
  },
)

export default {
  get: <T>(url: string, params?: object, config?: AxiosRequestConfig) =>
    api.get<T>(url, { ...config, params }),

  post: <T>(url: string, data?: object, config?: AxiosRequestConfig) =>
    api.post<T>(url, data, config),

  put: <T>(url: string, data?: object, config?: AxiosRequestConfig) =>
    api.put<T>(url, data, config),

  delete: <T>(url: string, params?: object, config?: AxiosRequestConfig) =>
    api.delete<T>(url, { ...config, params }),

  patch: <T>(url: string, data?: object, config?: AxiosRequestConfig) =>
    api.patch<T>(url, data, config),
}

// export default {
//   get: api.get,
//   post: api.post,
//   put: api.put,
//   delete: api.delete,
//   patch: api.patch,
// }
