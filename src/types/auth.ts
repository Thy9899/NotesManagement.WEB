// ----------------------------------------
// Authentication Request & Response Types
// ----------------------------------------

/** Payload required when registering a new account */
export interface RegisterRequest {
  name: string
  email: string
  password: string
}

/** Payload required when logging in */
export interface LoginRequest {
  email: string
  password: string
}

/** Server response object returned upon successful authentication */
export interface LoginResponse {
  userId: number
  name: string
  email: string
  token: string
}
