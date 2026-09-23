import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/services/api'
import type { Note, CreateNoteRequest, UpdateNoteRequest } from '@/types/note'

// Notes Pinia Store
const useNotesStore = defineStore('notes', () => {
  // ----------------------------------------
  // Reactive State
  // ----------------------------------------
  const notes = ref<Note[]>([])
  const loading = ref(false)
  const errorMessage = ref('')

  // ----------------------------------------
  // Reactive State
  // ----------------------------------------
  async function fetchNotes() {
    loading.value = true
    errorMessage.value = ''

    try {
      const response = await api.get<Note[]>('/notes')

      notes.value = response.data
    } catch (error: any) {
      errorMessage.value = error.response?.data?.message ?? 'Failed to load notes.'

      throw error
    } finally {
      loading.value = false
    }
  }

  // ----------------------------------------
  // Fetch Single Note
  // ----------------------------------------
  async function fetchNoteById(id: number) {
    try {
      const response = await api.get<Note>(`/notes/${id}`)

      return response.data
    } catch (error: any) {
      errorMessage.value = error.response?.data?.message ?? 'Failed to load note.'

      throw error
    }
  }

  // ----------------------------------------
  // Create Note
  // ----------------------------------------
  async function createNote(request: CreateNoteRequest) {
    try {
      const response = await api.post<Note>('/notes', request)

      notes.value.unshift(response.data)

      return response.data
    } catch (error: any) {
      errorMessage.value = error.response?.data?.message ?? 'Failed to create note.'

      throw error
    }
  }

  // ----------------------------------------
  // Update Note
  // ----------------------------------------
  async function updateNote(id: number, request: UpdateNoteRequest) {
    try {
      await api.put(`/notes/${id}`, request)

      const index = notes.value.findIndex((note) => note.id === id)

      if (index !== -1) {
        const updatedNote = await fetchNoteById(id)

        notes.value[index] = updatedNote
      }
    } catch (error: any) {
      errorMessage.value = error.response?.data?.message ?? 'Failed to update note.'

      throw error
    }
  }

  // ----------------------------------------
  // Delete Note
  // ----------------------------------------
  async function deleteNote(id: number) {
    try {
      await api.delete(`/notes/${id}`)

      notes.value = notes.value.filter((note) => note.id !== id)
    } catch (error: any) {
      errorMessage.value = error.response?.data?.message ?? 'Failed to delete note.'

      throw error
    }
  }

  // ----------------------------------------
  // Helper Utilities
  // ----------------------------------------
  function clearError() {
    errorMessage.value = ''
  }

  return {
    notes,
    loading,
    errorMessage,
    fetchNotes,
    fetchNoteById,
    createNote,
    updateNote,
    deleteNote,
    clearError,
  }
})

export { useNotesStore }
