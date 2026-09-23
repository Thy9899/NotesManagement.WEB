// ----------------------------------------
// Note Data Models & Request Payloads
// ----------------------------------------

/** Represents a complete Note entity returned from the backend API */
export interface Note {
  id: number
  title: string
  content: string | null
  createdAt: string
  updatedAt: string
}

/** Payload required when creating a new note */
export interface CreateNoteRequest {
  title: string
  content?: string | null
}

/** Payload required when updating an existing note */
export interface UpdateNoteRequest {
  title: string
  content?: string | null
}
