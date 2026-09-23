<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { useNotesStore } from '@/stores/notes'

import type { Note } from '@/types/note'

const route = useRoute()
const router = useRouter()

const notesStore = useNotesStore()

// ----------------------------------------
// Reactive State
// ----------------------------------------
const note = ref<Note | null>(null)
const loading = ref(true)
const errorMessage = ref('')

// ----------------------------------------
// Get Note ID
// ----------------------------------------
const noteId = Number(route.params.id)

// ----------------------------------------
// Load Note
// ----------------------------------------
async function loadNote() {
  if (!Number.isInteger(noteId)) {
    errorMessage.value = 'Invalid note ID.'
    loading.value = false
    return
  }

  try {
    loading.value = true
    errorMessage.value = ''

    note.value = await notesStore.fetchNoteById(noteId)
  } catch {
    errorMessage.value = 'Failed to load note.'
  } finally {
    loading.value = false
  }
}

// ----------------------------------------
// Go Back
// ----------------------------------------
function goBack() {
  router.push('/notes')
}

// ----------------------------------------
// Edit
// ----------------------------------------
function editNote() {
  if (!note.value) {
    return
  }

  router.push({
    path: '/notes',
    query: {
      edit: note.value.id.toString(),
    },
  })
}

// ----------------------------------------
// Lifecycle
// ----------------------------------------
onMounted(() => {
  loadNote()
})

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
      class="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur-xl transition-colors duration-300 dark:border-slate-800 dark:bg-slate-900/90"
    >
      <div class="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <!-- Logo -->
        <button type="button" @click="goBack" class="flex items-center gap-3">
          <div
            class="flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/20"
          >
            <svg
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
                d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5A3.375 3.375 0 0 0 10.125 2.25H8.25A3.75 3.75 0 0 0 4.5 6v12a3.75 3.75 0 0 0 3.75 3.75h7.5A3.75 3.75 0 0 0 19.5 18v-3.75Z"
              />
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M8.25 12h7.5M8.25 15.75h5.25"
              />
            </svg>
          </div>
          <div class="text-left">
            <h1 class="text-lg font-bold tracking-tight text-slate-900 dark:text-slate-100">
              NotesApp
            </h1>
            <p class="hidden text-xs text-slate-400 sm:block dark:text-slate-500">Note details</p>
          </div>
        </button>
        <!-- Back -->
        <button
          type="button"
          @click="goBack"
          class="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:border-slate-600 dark:hover:bg-slate-700 dark:hover:text-slate-100"
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
              d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
            />
          </svg>
          <span class="hidden sm:inline">Back to Notes</span> <span class="sm:hidden">Back</span>
        </button>
      </div>
    </header>

    <!-- ==================================== -->
    <!-- Main -->
    <!-- ==================================== -->
    <main class="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <!-- ---------------------------------------- -->
      <!-- Loading -->
      <!-- ---------------------------------------- -->
      <div v-if="loading">
        <!-- Breadcrumb skeleton -->
        <div class="mb-6 h-4 w-32 animate-pulse rounded bg-slate-200 dark:bg-slate-800"></div>
        <!-- Main skeleton -->
        <div
          class="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900"
        >
          <div class="border-b border-slate-200 px-6 py-8 dark:border-slate-800 sm:px-10">
            <div class="h-9 w-2/3 animate-pulse rounded-lg bg-slate-200 dark:bg-slate-800"></div>
            <div class="mt-5 flex gap-4">
              <div class="h-4 w-32 animate-pulse rounded bg-slate-100 dark:bg-slate-800"></div>
              <div class="h-4 w-32 animate-pulse rounded bg-slate-100 dark:bg-slate-800"></div>
            </div>
          </div>
          <div class="px-6 py-10 sm:px-10">
            <div class="space-y-4">
              <div class="h-4 animate-pulse rounded bg-slate-100 dark:bg-slate-800"></div>
              <div class="h-4 animate-pulse rounded bg-slate-100 dark:bg-slate-800"></div>
              <div class="h-4 w-5/6 animate-pulse rounded bg-slate-100 dark:bg-slate-800"></div>
              <div class="h-4 w-4/6 animate-pulse rounded bg-slate-100 dark:bg-slate-800"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- ---------------------------------------- -->
      <!-- Error -->
      <!-- ---------------------------------------- -->
      <div v-else-if="errorMessage" class="mx-auto max-w-2xl">
        <div
          class="rounded-3xl border border-red-200 bg-white p-8 text-center shadow-sm dark:border-red-900/50 dark:bg-slate-900 sm:p-12"
        >
          <!-- Icon -->
          <div
            class="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-500 dark:bg-red-950/40 dark:text-red-400"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.8"
              stroke="currentColor"
              class="h-8 w-8"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M12 9v3.75m0 3.75h.008v.008H12v-.008ZM21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
              />
            </svg>
          </div>
          <h2 class="mt-5 text-xl font-bold text-slate-900 dark:text-slate-100">
            Unable to load note
          </h2>
          <p class="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
            {{ errorMessage }}
          </p>
          <button
            type="button"
            @click="goBack"
            class="mt-6 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white"
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
                d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
              />
            </svg>
            Back to Notes
          </button>
        </div>
      </div>

      <!-- ---------------------------------------- -->
      <!-- Note Detail -->
      <!-- ---------------------------------------- -->
      <div v-else-if="note">
        <!--  -->
        <!-- Breadcrumb -->
        <!--  -->
        <div class="mb-6 flex items-center gap-2 text-sm">
          <button
            type="button"
            @click="goBack"
            class="font-medium text-slate-400 transition hover:text-blue-600 dark:text-slate-500 dark:hover:text-blue-400"
          >
            Notes
          </button>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="2"
            stroke="currentColor"
            class="h-3.5 w-3.5 text-slate-300 dark:text-slate-700"
          >
            <path stroke-linecap="round" stroke-linejoin="round" d="m9 18 6-6-6-6" />
          </svg>
          <span class="font-medium text-slate-600 dark:text-slate-300"> View Note </span>
        </div>

        <!--  -->
        <!-- Note Card -->
        <!--  -->
        <article
          class="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition-colors duration-300 dark:border-slate-800 dark:bg-slate-900"
        >
          <!-- --------------------- Header --------------------- -->
          <header
            class="border-b border-slate-200 px-6 py-8 dark:border-slate-800 sm:px-10 lg:px-12"
          >
            <div class="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
              <!-- Title -->
              <div class="min-w-0 flex-1">
                <!-- Badge -->
                <div class="mb-4">
                  <span
                    class="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-600 dark:bg-blue-950/50 dark:text-blue-400"
                  >
                    <span class="h-1.5 w-1.5 rounded-full bg-blue-500"></span> Note
                  </span>
                </div>

                <!-- Title -->
                <h1
                  class="wrap-break-word text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 sm:text-4xl lg:text-5xl"
                >
                  {{ note.title }}
                </h1>

                <!-- Metadata -->
                <div
                  class="mt-6 flex flex-col gap-3 text-sm text-slate-500 dark:text-slate-400 sm:flex-row sm:flex-wrap sm:gap-x-6"
                >
                  <!-- Created -->
                  <div class="flex items-center gap-2">
                    <div
                      class="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400"
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
                          d="M6.75 3v2.25M17.25 3v2.25M3.75 9h16.5M5.25 5.25h13.5A1.5 1.5 0 0 1 20.25 6.75v12A1.5 1.5 0 0 1 18.75 20.25H5.25a1.5 1.5 0 0 1-1.5-1.5v-12a1.5 1.5 0 0 1 1.5-1.5Z"
                        />
                      </svg>
                    </div>
                    <div>
                      <p class="text-xs text-slate-400 dark:text-slate-500">Created</p>
                      <p class="font-medium text-slate-700 dark:text-slate-300">
                        {{ new Date(note.createdAt).toLocaleString() }}
                      </p>
                    </div>
                  </div>

                  <!-- Updated -->
                  <div class="flex items-center gap-2">
                    <div
                      class="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        class="h-4 w-4"
                      >
                        <path
                          d="M19.933 13.041a8 8 0 1 1 -9.925 -8.788c3.899 -1 7.935 1.007 9.425 4.747"
                        />
                        <path d="M20 4v5h-5" />
                      </svg>
                    </div>
                    <div>
                      <p class="text-xs text-slate-400 dark:text-slate-500">Last updated</p>
                      <p class="font-medium text-slate-700 dark:text-slate-300">
                        {{ new Date(note.updatedAt).toLocaleString() }}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Edit -->
              <button
                type="button"
                @click="editNote"
                class="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-linear-to-r from-blue-600 to-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition hover:-translate-y-0.5 hover:from-blue-700 hover:to-indigo-700 hover:shadow-xl"
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
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M18 14.25v4.125A2.625 2.625 0 0 1 15.375 21H6.375A2.625 2.625 0 0 1 3.75 18.375v-9A2.625 2.625 0 0 1 6.375 6.75H10.5"
                  />
                </svg>
                Edit Note
              </button>
            </div>
          </header>

          <!-- -->
          <!-- Content -->
          <!-- -->
          <section class="px-6 py-10 sm:px-10 lg:px-12 lg:py-12">
            <!-- Section Header -->
            <div class="mb-6 flex items-center gap-3">
              <div
                class="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400"
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
                    d="M8.25 6.75h7.5M8.25 12h7.5m-7.5 5.25h4.5"
                  />
                </svg>
              </div>
              <h2
                class="text-sm font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500"
              >
                Content
              </h2>
            </div>

            <!-- Content -->
            <div
              v-if="note.content"
              class="max-w-4xl whitespace-pre-wrap text-base leading-8 text-slate-600 dark:text-slate-300 sm:text-lg"
            >
              {{ note.content }}
            </div>

            <!-- Empty Content -->
            <div
              v-else
              class="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center dark:border-slate-700 dark:bg-slate-800/50"
            >
              <div
                class="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-white text-slate-400 shadow-sm dark:bg-slate-800 dark:text-slate-500"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
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
              <p class="mt-4 text-sm font-medium text-slate-500 dark:text-slate-400">
                This note has no content.
              </p>
            </div>
          </section>

          <!-- -->
          <!-- Footer -->
          <!-- -->
          <footer
            class="flex flex-col gap-3 border-t border-slate-200 bg-slate-50 px-6 py-5 transition-colors dark:border-slate-800 dark:bg-slate-950/50 sm:flex-row sm:items-center sm:justify-between sm:px-10 lg:px-12"
          >
            <!-- Show Note ID -->
            <div class="flex items-center gap-2 text-xs text-slate-400 dark:text-slate-500">
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
                  d="M9 12.75 11.25 15 15 9.75m-3-7.5a9 9 0 1 0 9 9"
                />
              </svg>
              <span>Note ID: {{ note.id }}</span>
            </div>

            <!-- Button Go Back -->
            <button
              type="button"
              @click="goBack"
              class="flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400"
            >
              Back to all notes
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.8"
                stroke="currentColor"
                class="h-4 w-4"
              >
                <path stroke-linecap="round" stroke-linejoin="round" d="M5 12h14m-6-6 6 6-6 6" />
              </svg>
            </button>
          </footer>
        </article>
      </div>
    </main>
  </div>
</template>
