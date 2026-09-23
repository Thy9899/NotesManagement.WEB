import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/services/api'
import type { LoginRequest, LoginResponse, RegisterRequest } from '@/types/auth'

// Authentication Pinia Store
const useAuthStore = defineStore('auth', () => {
  // ----------------------------------------
  // Auth JWT token initialized from local storage
  // ----------------------------------------
  const token = ref<string | null>(localStorage.getItem('token'))

  // ----------------------------------------
  // User details restored from local storage if previously saved
  // ----------------------------------------
  const storedUser = localStorage.getItem('user')
  const user = ref<LoginResponse | null>(storedUser ? JSON.parse(storedUser) : null)

  // ----------------------------------------
  // Authenticates user and persists credentials to state & local storage
  // ----------------------------------------
  async function login(request: LoginRequest) {
    const response = await api.post<LoginResponse>('/auth/login', request)

    const data = response.data

    token.value = data.token
    user.value = data

    localStorage.setItem('token', data.token)
    localStorage.setItem('user', JSON.stringify(data))
  }

  // ----------------------------------------
  // Registers a new user and automatically logs them in
  // ----------------------------------------
  async function register(request: RegisterRequest) {
    const response = await api.post<LoginResponse>('/auth/register', request)

    const data = response.data

    token.value = data.token
    user.value = data

    localStorage.setItem('token', data.token)
    localStorage.setItem('user', JSON.stringify(data))
  }

  // ----------------------------------------
  // Clears active authentication session state and local storage
  // ----------------------------------------
  function logout() {
    token.value = null
    user.value = null

    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }

  return {
    token,
    user,
    login,
    register,
    logout,
  }
})

export { useAuthStore }
