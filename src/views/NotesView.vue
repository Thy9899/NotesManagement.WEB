<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'

import { useNotesStore } from '@/stores/notes'
import { useAuthStore } from '@/stores/auth'

import NoteForm from '@/components/NoteForm.vue'
import ConfirmDialog from '@/components/ConfirmDialog.vue'

import { useTheme } from '@/composables/useTheme'

const router = useRouter()

const notesStore = useNotesStore()

const authStore = useAuthStore()

const { notes, loading, errorMessage } = storeToRefs(notesStore)

const { isDark, toggleTheme } = useTheme()

// ----------------------------------------
// UI State
// ----------------------------------------
const showCreateForm = ref(false)
const editingNote = ref<(typeof notes.value)[number] | null>(null)
const confirmingDeleteId = ref<number | null>(null)

// ----------------------------------------
// Search / Filter / Sort
// ----------------------------------------
const searchQuery = ref('')
const sortBy = ref<'newest' | 'oldest' | 'title'>('newest')
const startDate = ref('')
const endDate = ref('')

// ----------------------------------------
// Card Accent Colors
// ----------------------------------------
const accents = ['#C99A2E', '#3B5BA5', '#3E7C6B']

// ----------------------------------------
// Accent Selector
// ----------------------------------------
function accentFor(index: number) {
  return accents[index % accents.length]
}

// ----------------------------------------
// Load Notes
// ----------------------------------------
onMounted(() => {
  notesStore.fetchNotes()
})

// ----------------------------------------
// Filtered Notes
// ----------------------------------------
const filteredNotes = computed(() => {
  const query = searchQuery.value.trim().toLowerCase()

  const start = startDate.value ? new Date(startDate.value).getTime() : null

  const end = endDate.value ? new Date(endDate.value).getTime() + 24 * 60 * 60 * 1000 - 1 : null

  const result = notes.value.filter((note) => {
    const title = note.title?.toLowerCase() ?? ''

    const content = note.content?.toLowerCase() ?? ''

    const matchesQuery = !query || title.includes(query) || content.includes(query)

    const createdTime = new Date(note.createdAt).getTime()

    const afterStart = start === null || createdTime >= start

    const beforeEnd = end === null || createdTime <= end

    return matchesQuery && afterStart && beforeEnd
  })

  result.sort((a, b) => {
    // Sort by title
    if (sortBy.value === 'title') {
      return (a.title ?? '').localeCompare(b.title ?? '')
    }

    const aTime = new Date(a.createdAt).getTime()
    const bTime = new Date(b.createdAt).getTime()

    // Oldest first
    if (sortBy.value === 'oldest') {
      return aTime - bTime
    }

    // Newest first
    return bTime - aTime
  })

  return result
})

// ----------------------------------------
// Filters
// ----------------------------------------
const hasActiveFilters = computed(() => {
  return Boolean(searchQuery.value || startDate.value || endDate.value)
})

// ----------------------------------------
// Clear Filter
// ----------------------------------------
function clearFilters() {
  searchQuery.value = ''
  startDate.value = ''
  endDate.value = ''
}

// ----------------------------------------
// Logout
// ----------------------------------------
function handleLogout() {
  authStore.logout()

  router.push('/login')
}

// ----------------------------------------
// Create Note
// ----------------------------------------
function openCreateForm() {
  editingNote.value = null
  showCreateForm.value = true
}

// ----------------------------------------
// Handle Created Note
// ----------------------------------------
function handleNoteCreated() {
  showCreateForm.value = false
}

// ----------------------------------------
// Cancel Creation
// ----------------------------------------
function cancelCreate() {
  showCreateForm.value = false
  editingNote.value = null
}

// ----------------------------------------
// View Note Detail
// ----------------------------------------
function viewNote(id: number) {
  router.push(`/notes/${id}`)
}

// ----------------------------------------
// Edit Note
// ----------------------------------------
function startEdit(note: (typeof notes.value)[number]) {
  editingNote.value = note
  showCreateForm.value = false
}

// ----------------------------------------
// Cancel Edit
// ----------------------------------------
function cancelEdit() {
  editingNote.value = null
  showCreateForm.value = false
}

// ----------------------------------------
// Delete Note
// ----------------------------------------
function requestDelete(id: number) {
  confirmingDeleteId.value = id
}

// ----------------------------------------
// Cancel Delete
// ----------------------------------------
function cancelDelete() {
  confirmingDeleteId.value = null
}

// ----------------------------------------
// Note To Delete
// ----------------------------------------
const noteToDelete = computed(() => {
  if (confirmingDeleteId.value === null) {
    return null
  }

  return notes.value.find((note) => note.id === confirmingDeleteId.value) ?? null
})

// ----------------------------------------
// Confirm Delete
// ----------------------------------------
async function handleDelete() {
  if (confirmingDeleteId.value === null) {
    return
  }

  const id = confirmingDeleteId.value

  try {
    await notesStore.deleteNote(id)

    confirmingDeleteId.value = null
  } catch {
    // Store handles the error message.
  }
}

// ----------------------------------------
// Content Preview
// ----------------------------------------
function getContentPreview(content: string | null | undefined, maxLength = 150) {
  if (!content) {
    return ''
  }

  if (content.length <= maxLength) {
    return content
  }

  return content.slice(0, maxLength).trimEnd() + '...'
}

// ----------------------------------------
// UI
// ----------------------------------------
</script>

<template>
  <div
    class="min-h-screen bg-slate-50 text-slate-900 transition-colors duration-300 dark:bg-slate-950 dark:text-slate-100"
  >
    <!-- ==================================== -->
    <!-- Top Navigation -->
    <!-- ==================================== -->
    <header
      class="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur-xl transition-colors duration-300 dark:border-slate-800 dark:bg-slate-950/90"
    >
      <div class="mx-auto flex h-18 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <!-- Logo -->
        <div class="flex items-center gap-3">
          <div
            class="flex h-12 w-12 items-center justify-center rounded-xl bg-sky-100 text-blue-600 dark:bg-blue-950 dark:text-blue-400"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.8"
              stroke="currentColor"
              class="h-6 w-6"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78Z"
              />
            </svg>
          </div>

          <div>
            <h1 class="text-lg font-bold tracking-tight text-slate-900 dark:text-slate-100">
              NotesApp
            </h1>

            <p class="hidden text-xs text-slate-400 dark:text-slate-500 sm:block">
              Your personal workspace
            </p>
          </div>
        </div>

        <!-- Right Actions -->
        <div class="flex items-center gap-3">
          <!-- Dark Mode -->
          <button
            type="button"
            @click="toggleTheme"
            :title="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
            class="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
          >
            <!-- Sun -->
            <svg
              v-if="isDark"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.8"
              stroke="currentColor"
              class="h-5 w-5"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M12 3v2.25M12 18.75V21M4.22 4.22l1.59 1.59M18.19 18.19l1.59 1.59M3 12h2.25M18.75 12H21M4.22 19.78l1.59-1.59M18.19 5.81l1.59-1.59"
              />

              <circle cx="12" cy="12" r="4" />
            </svg>

            <!-- Moon -->
            <svg
              v-else
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.8"
              stroke="currentColor"
              class="h-5 w-5"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z"
              />
            </svg>
          </button>

          <!-- User -->
          <div
            class="hidden items-center gap-3 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 transition-colors dark:border-slate-700 dark:bg-slate-900 sm:flex"
          >
            <div
              class="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-600 dark:bg-blue-950 dark:text-blue-400"
            >
              {{ authStore.user?.name?.charAt(0)?.toUpperCase() ?? 'U' }}
            </div>

            <span class="max-w-32 truncate text-sm font-medium text-slate-700 dark:text-slate-200">
              {{ authStore.user?.name ?? 'User' }}
            </span>
          </div>

          <!-- Logout -->
          <button
            type="button"
            @click="handleLogout"
            class="group flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-medium text-slate-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-red-900 dark:hover:bg-red-950/40 dark:hover:text-red-400"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.8"
              stroke="currentColor"
              class="h-4 w-4"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6A2.25 2.25 0 0 0 5.25 5.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15"
              />

              <path stroke-linecap="round" stroke-linejoin="round" d="m12 15 3-3m0 0-3-3m3 3H3" />
            </svg>

            <span class="hidden sm:inline"> Logout </span>
          </button>
        </div>
      </div>
    </header>

    <!-- ==================================== -->
    <!-- Main -->
    <!-- ==================================== -->
    <main class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <!-- ---------------------------------------- -->
      <!-- Welcome Section -->
      <!-- ---------------------------------------- -->
      <section class="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <p
            class="mb-2 text-sm font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400"
          >
            Workspace
          </p>

          <h2
            class="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 sm:text-4xl"
          >
            My Notes
          </h2>

          <p class="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Organize your thoughts and keep your ideas in one place.
          </p>
        </div>

        <!-- Add Note -->
        <button
          v-if="!showCreateForm && !editingNote"
          type="button"
          @click="openCreateForm"
          class="flex items-center justify-center gap-2 rounded-xl bg-linear-to-r from-blue-600 to-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition hover:-translate-y-0.5 hover:from-blue-700 hover:to-indigo-700 hover:shadow-xl"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="2"
            stroke="currentColor"
            class="h-5 w-5"
          >
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>

          New Note
        </button>
      </section>

      <!-- ---------------------------------------- -->
      <!-- Statistics -->
      <!-- ---------------------------------------- -->
      <section class="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <!-- Total Notes -->
        <div
          class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
        >
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-slate-500 dark:text-slate-400">Total Notes</p>

              <p class="mt-2 text-3xl font-bold text-slate-900 dark:text-slate-100">
                {{ notes.length }}
              </p>
            </div>

            <div
              class="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.8"
                stroke="currentColor"
                class="h-6 w-6"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5A3.375 3.375 0 0 0 10.125 2.25H8.25A3.75 3.75 0 0 0 4.5 6v12a3.75 3.75 0 0 0 3.75 3.75h7.5A3.75 3.75 0 0 0 19.5 18v-3.75Z"
                />
              </svg>
            </div>
          </div>
        </div>

        <!-- Showing -->
        <div
          class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
        >
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-slate-500 dark:text-slate-400">Showing</p>

              <p class="mt-2 text-3xl font-bold text-slate-900 dark:text-slate-100">
                {{ filteredNotes.length }}
              </p>
            </div>

            <div
              class="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.8"
                stroke="currentColor"
                class="h-6 w-6"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                />
              </svg>
            </div>
          </div>
        </div>

        <!-- Filters -->
        <div
          class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
        >
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-slate-500 dark:text-slate-400">Filter Status</p>

              <p class="mt-2 text-lg font-bold text-slate-900 dark:text-slate-100">
                {{ hasActiveFilters ? 'Active' : 'All notes' }}
              </p>
            </div>

            <div
              class="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-50 text-violet-600 dark:bg-violet-950 dark:text-violet-400"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.8"
                stroke="currentColor"
                class="h-6 w-6"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M10.5 6h9.75M3.75 6h2.25m4.5 12h9.75M3.75 18h5.25m0-6h11.25M3.75 12h2.25"
                />
              </svg>
            </div>
          </div>
        </div>
      </section>

      <!-- ---------------------------------------- -->
      <!-- Search & Filters -->
      <!-- ---------------------------------------- -->
      <section
        class="mb-8 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-colors dark:border-slate-800 dark:bg-slate-900 sm:p-5"
      >
        <div class="flex flex-col gap-4 lg:flex-row lg:items-center">
          <!-- Search -->
          <div class="relative flex-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.8"
              stroke="currentColor"
              class="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400 dark:text-slate-500"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="m21 21-4.35-4.35m2.1-5.4a7.5 7.5 0 1 1-15 0 7.5 7.5 0 0 1 15 0Z"
              />
            </svg>

            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search your notes..."
              class="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-12 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-blue-500 dark:focus:bg-slate-800"
            />
          </div>

          <!-- Sort -->
          <div class="flex items-center gap-2">
            <label class="hidden text-sm font-medium text-slate-500 dark:text-slate-400 sm:block">
              Sort:
            </label>

            <select
              v-model="sortBy"
              class="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:focus:border-blue-500 dark:focus:bg-slate-800 sm:w-auto"
            >
              <option value="newest">Newest first</option>

              <option value="oldest">Oldest first</option>

              <option value="title">By title</option>
            </select>
          </div>
        </div>

        <!-- Date Filters -->
        <div
          class="mt-4 flex flex-col gap-3 border-t border-slate-100 pt-4 dark:border-slate-800 sm:flex-row sm:items-center"
        >
          <span class="text-sm font-medium text-slate-500 dark:text-slate-400"> Date range </span>

          <div class="flex flex-1 flex-col gap-3 sm:flex-row">
            <!-- From -->
            <div class="relative flex-1">
              <label class="mb-1.5 block text-xs font-medium text-slate-400 dark:text-slate-500">
                From
              </label>

              <input
                v-model="startDate"
                type="date"
                :max="endDate || undefined"
                class="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:focus:border-blue-500 dark:focus:bg-slate-800 dark:scheme-dark"
              />
            </div>

            <!-- To -->
            <div class="flex-1">
              <label class="mb-1.5 block text-xs font-medium text-slate-400 dark:text-slate-500">
                To
              </label>

              <input
                v-model="endDate"
                type="date"
                :min="startDate || undefined"
                class="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:focus:border-blue-500 dark:focus:bg-slate-800 dark:scheme-dark"
              />
            </div>
          </div>

          <!-- Clear -->
          <button
            v-if="hasActiveFilters"
            type="button"
            @click="clearFilters"
            class="rounded-xl border mt-5 border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600 dark:border-slate-700 dark:text-slate-300 dark:hover:border-red-900 dark:hover:bg-red-950/40 dark:hover:text-red-400"
          >
            Clear filters
          </button>
        </div>
      </section>

      <!-- ---------------------------------------- -->
      <!-- Create / Edit Form -->
      <!-- ---------------------------------------- -->
      <div v-if="showCreateForm || editingNote" class="mb-8">
        <NoteForm
          :note="editingNote"
          @created="handleNoteCreated"
          @updated="cancelEdit"
          @cancel="cancelCreate"
        />
      </div>

      <!-- ---------------------------------------- -->
      <!-- Error -->
      <!-- ---------------------------------------- -->
      <div
        v-if="errorMessage"
        class="mb-6 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="2"
          stroke="currentColor"
          class="mt-0.5 h-5 w-5 shrink-0"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M12 9v3.75m0 3.75h.008v.008H12v-.008ZM21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
          />
        </svg>

        <span>
          {{ errorMessage }}
        </span>
      </div>

      <!-- ---------------------------------------- -->
      <!-- Loading -->
      <!-- ---------------------------------------- -->
      <div v-if="loading" class="grid grid-cols-1 gap-5 md:grid-cols-2">
        <div
          v-for="n in 4"
          :key="n"
          class="h-56 animate-pulse rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900"
        ></div>
      </div>

      <!------------------------------------------ -->
      <!-- Empty State -->
      <!-- ---------------------------------------- -->
      <div
        v-else-if="filteredNotes.length === 0"
        class="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-20 text-center shadow-sm transition-colors dark:border-slate-700 dark:bg-slate-900"
      >
        <div
          class="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="h-8 w-8"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5A3.375 3.375 0 0 0 10.125 2.25H8.25A3.75 3.75 0 0 0 4.5 6v12a3.75 3.75 0 0 0 3.75 3.75h7.5A3.75 3.75 0 0 0 19.5 18v-3.75Z"
            />
          </svg>
        </div>

        <h3 class="mt-5 text-lg font-bold text-slate-900 dark:text-slate-100">
          {{ hasActiveFilters ? 'No notes found' : 'Your notebook is empty' }}
        </h3>

        <p class="mx-auto mt-2 max-w-md text-sm leading-relaxed text-slate-500 dark:text-slate-400">
          {{
            hasActiveFilters
              ? 'Try changing your search or date filters.'
              : 'Create your first note and start organizing your ideas.'
          }}
        </p>

        <!-- Button Clear Filter -->
        <button
          v-if="hasActiveFilters"
          type="button"
          @click="clearFilters"
          class="mt-6 rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600 dark:border-slate-700 dark:text-slate-300 dark:hover:border-blue-800 dark:hover:bg-blue-950/40 dark:hover:text-blue-400"
        >
          Clear filters
        </button>

        <!-- Button Open Create Form -->
        <button
          v-else
          type="button"
          @click="openCreateForm"
          class="mt-6 inline-flex items-center gap-2 rounded-xl bg-linear-to-r from-blue-600 to-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition hover:-translate-y-0.5"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="2"
            stroke="currentColor"
            class="h-5 w-5"
          >
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>

          Create your first note
        </button>
      </div>

      <!-- ---------------------------------------- -->
      <!-- Notes Grid -->
      <!-- ---------------------------------------- -->
      <div v-else class="grid grid-cols-1 gap-5 md:grid-cols-2">
        <article
          v-for="(note, index) in filteredNotes"
          :key="note.id"
          @click="viewNote(note.id)"
          class="group relative cursor-pointer overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-slate-300 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700"
          :style="{
            borderTop: `3px solid ${accentFor(index)}`,
          }"
        >
          <!-- Card Header -->
          <div class="flex items-start justify-between gap-4">
            <div class="min-w-0 flex-1">
              <div class="mb-3 flex items-center gap-2">
                <span
                  class="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:bg-slate-800 dark:text-slate-400"
                >
                  Note
                </span>
              </div>

              <h3
                class="line-clamp-2 text-lg font-bold leading-snug text-slate-900 transition group-hover:text-blue-600 dark:text-slate-100 dark:group-hover:text-blue-400"
              >
                {{ note.title }}
              </h3>
            </div>

            <!-- Arrow -->
            <div
              class="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-50 text-slate-400 transition group-hover:bg-blue-50 group-hover:text-blue-600 dark:bg-slate-800 dark:text-slate-500 dark:group-hover:bg-blue-950 dark:group-hover:text-blue-400"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.8"
                stroke="currentColor"
                class="h-5 w-5 transition group-hover:translate-x-0.5"
              >
                <path stroke-linecap="round" stroke-linejoin="round" d="m9 5 7 7-7 7" />
              </svg>
            </div>
          </div>

          <!-- Date -->
          <div class="mt-4 flex items-center gap-2 text-xs text-slate-400 dark:text-slate-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.8"
              stroke="currentColor"
              class="h-4 w-4"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M6.75 3v2.25M17.25 3v2.25M3.75 9h16.5M5.25 5.25h13.5A1.5 1.5 0 0 1 20.25 6.75v12A1.5 1.5 0 0 1 18.75 20.25H5.25a1.5 1.5 0 0 1-1.5-1.5v-12a1.5 1.5 0 0 1 1.5-1.5Z"
              />
            </svg>

            {{
              new Date(note.createdAt).toLocaleDateString(undefined, {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })
            }}
          </div>

          <!-- Content -->
          <p
            v-if="note.content"
            class="mt-4 line-clamp-4 whitespace-pre-wrap text-sm leading-6 text-slate-500 dark:text-slate-400"
          >
            {{ getContentPreview(note.content, 150) }}
          </p>

          <p v-else class="mt-4 text-sm italic text-slate-400 dark:text-slate-500">No content</p>

          <!-- Footer -->
          <div
            class="mt-6 flex items-center justify-between border-t border-slate-100 pt-4 dark:border-slate-800"
          >
            <span
              class="text-xs font-medium text-slate-400 transition group-hover:text-blue-500 dark:text-slate-500 dark:group-hover:text-blue-400"
            >
              Click to view
            </span>

            <div class="flex gap-2">
              <!-- Edit -->
              <button
                type="button"
                title="Edit note"
                @click.stop="startEdit(note)"
                class="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600 dark:border-slate-700 dark:text-slate-400 dark:hover:border-blue-800 dark:hover:bg-blue-950 dark:hover:text-blue-400"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.8"
                  stroke="currentColor"
                  class="h-4 w-4"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 15.07a4.5 4.5 0 0 1-1.897 1.13l-2.685.807.807-2.685a4.5 4.5 0 0 1 1.13-1.897l8.925-8.925Z"
                  />
                </svg>
              </button>

              <!-- Delete -->
              <button
                type="button"
                title="Delete note"
                @click.stop="requestDelete(note.id)"
                class="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600 dark:border-slate-700 dark:text-slate-400 dark:hover:border-red-800 dark:hover:bg-red-950 dark:hover:text-red-400"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.8"
                  stroke="currentColor"
                  class="h-4 w-4"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0C9.91 2.918 9 3.902 9 5.082v.916m6.75 0a48.667 48.667 0 0 0-6.75 0"
                  />
                </svg>
              </button>
            </div>
          </div>
        </article>
      </div>
    </main>

    <!-- ==================================== -->
    <!-- Confirm Delete Dialog -->
    <!-- ==================================== -->
    <ConfirmDialog
      :open="confirmingDeleteId !== null"
      title="Delete note?"
      :message="
        noteToDelete
          ? `Are you sure you want to delete '${noteToDelete.title}'? This action cannot be undone.`
          : 'Are you sure you want to delete this note?'
      "
      confirm-text="Delete"
      cancel-text="Cancel"
      :loading="loading"
      @confirm="handleDelete"
      @cancel="cancelDelete"
    />
  </div>
</template>
