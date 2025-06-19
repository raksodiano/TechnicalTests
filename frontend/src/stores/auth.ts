import { defineStore } from 'pinia'
import { ref } from 'vue'
import router from '@/router'
import API from '@/services/api'

export const useAuthStore = defineStore('auth', () => {
  const authToken = ref<string | null>(localStorage.getItem('authToken') || null)
  const guestToken = ref<string | null>(null)
  const userData = ref<any>(null)

  // Obtener token de invitado desde la API
  const fetchGuestToken = async () => {
    try {
      const response = await API.get('/oauth/guest')
      localStorage.setItem('guestToken', response.data.access_token)
      guestToken.value = response.data.access_token
      return guestToken.value
    } catch (error) {
      console.error('Error obteniendo token de invitado:', error)
      throw error
    }
  }

  // Login usando token de invitado
  const login = async (credentials: { email: string; password: string }) => {
    try {
      const response = await API.post('/oauth/login', { ...credentials })

      authToken.value = response.data.access_token
      userData.value = JSON.stringify(response.data.user)

      localStorage.setItem('authToken', authToken.value)
      localStorage.setItem('user', userData.value)
      router.push('/dashboard')

      return true
    } catch (error) {
      console.error('Login error:', error)
    } finally {
      return false
    }
  }

  // Cerrar sesión
  const logout = () => {
    authToken.value = null
    guestToken.value = null
    userData.value = null
    localStorage.removeItem('authToken')
    window.location.href = '/login'
  }

  // Auto-login si hay token en localStorage
  const tryAutoLogin = () => {
    if (authToken.value) {
      router.push('/dashboard')
    }
  }

  return {
    authToken,
    guestToken,
    userData,
    fetchGuestToken,
    login,
    logout,
    tryAutoLogin,
    isAuthenticated: !!authToken.value,
  }
})
