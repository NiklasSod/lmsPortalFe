export interface ProfileRequest {
  userId?: string
  aboutMe?: string
  gitHubLink?: string
  skills?: string[]
  whatsAppNumber?: string
  dateOfBirth?: string // Format YYYY-MM-DD
}

export interface CreateProfileRequest {
  aboutMe?: string
  gitHubLink?: string
  skills?: string[]
  whatsAppNumber?: string
  dateOfBirth?: string // Format YYYY-MM-DD
}
