export interface CreateProfileRequest {
  aboutMe?: string
  gitHubLink?: string
  skills?: string[]
  WhatsAppNumber?: string
  dateOfBirth?: string // Format YYYY-MM-DD
}

export interface UpdateProfileRequest {
  aboutMe?: string
  gitHubLink?: string
  skills?: string[]
  WhatsAppNumber?: string
  dateOfBirth?: string // Format YYYY-MM-DD
}

export interface ProfileRequest {
  userId?: string
  aboutMe?: string
  gitHubLink?: string
  skills?: string[]
  WhatsAppNumber?: string
  dateOfBirth?: string // Format YYYY-MM-DD
}
