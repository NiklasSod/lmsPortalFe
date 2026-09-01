export interface AuthResponse {
  accessToken: string
  expiresAt: string
}

export interface LoginRequest {
  email: string
  password: string
}
