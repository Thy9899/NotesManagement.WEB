import axios from 'axios'

// ----------------------------------------
// Axios Instance Configuration
// ----------------------------------------
const api = axios.create({
  baseURL: 'https://chanthykean-001-site1.dtempurl.com/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

// ----------------------------------------
// Request Interceptor
// ----------------------------------------
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

export default api
