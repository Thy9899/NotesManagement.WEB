<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'

import { useNotesStore } from '@/stores/notes'

import type { Note, CreateNoteRequest, UpdateNoteRequest } from '@/types/note'

// ----------------------------------------
// Props & Emits
// ----------------------------------------
const props = defineProps<{
  note?: Note | null
}>()

const emit = defineEmits<{
  (e: 'created'): void
  (e: 'updated'): void
  (e: 'cancel'): void
}>()

// ----------------------------------------
// Store & State
// ----------------------------------------
const notesStore = useNotesStore()

const isEditMode = computed(() => {
  return !!props.note
})

const form = reactive({
  title: '',
  content: '',
})

const loading = ref(false)
const errorMessage = ref('')

// ----------------------------------------
// Load note data when editing
// ----------------------------------------
function loadNote() {
  if (props.note) {
    form.title = props.note.title
    form.content = props.note.content ?? ''
  } else {
    form.title = ''
    form.content = ''
  }

  errorMessage.value = ''
}

watch(
  () => props.note,
  () => {
    loadNote()
  },
  {
    immediate: true,
  },
)

// ----------------------------------------
// Submit
// ----------------------------------------
async function handleSubmit() {
  errorMessage.value = ''

  const title = form.title.trim()
  const content = form.content.trim()

  if (!title) {
    errorMessage.value = 'Title is required.'
    return
  }

  loading.value = true

  try {
    if (isEditMode.value && props.note) {
      // UPDATE
      const request: UpdateNoteRequest = {
        title,
        content: content || null,
      }

      await notesStore.updateNote(props.note.id, request)

      emit('updated')
    } else {
      // CREATE
      const request: CreateNoteRequest = {
        title,
        content: content || null,
      }

      await notesStore.createNote(request)

      emit('created')

      // Reset form
      form.title = ''
      form.content = ''
    }
  } catch (error: any) {
    errorMessage.value =
      error.response?.data?.message ?? `Failed to ${isEditMode.value ? 'update' : 'create'} note.`
  } finally {
    loading.value = false
  }
}

// ----------------------------------------
// Cancel
// ----------------------------------------
function handleCancel() {
  if (loading.value) {
    return
  }

  emit('cancel')
}
</script>

<!-- ---------------------------------------- -->
<!-- UI -->
<!-- ---------------------------------------- -->
<template>
  <div
    class="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition-colors duration-300 dark:border-slate-800 dark:bg-slate-900"
  >
    <!-- ==================================== -->
    <!-- Header -->
    <!-- ==================================== -->
    <div
      class="flex items-start justify-between border-b border-slate-200 px-6 py-6 transition-colors duration-300 dark:border-slate-800 sm:px-8"
    >
      <div class="flex items-start gap-4">
        <!-- Icon -->
        <div
          class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400"
        >
          <!-- Edit Icon -->
          <svg
            v-if="isEditMode"
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
              d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 15.07a4.5 4.5 0 0 1-1.897 1.13l-2.685.807.807-2.685a4.5 4.5 0 0 1 1.13-1.897l8.925-8.925Z"
            />
          </svg>

          <!-- Plus Icon -->
          <svg
            v-else
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.8"
            stroke="currentColor"
            class="h-5 w-5"
          >
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
        </div>

        <!-- Heading -->
        <div>
          <h2 class="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            {{ isEditMode ? 'Edit Note' : 'Create New Note' }}
          </h2>

          <p class="mt-1 text-sm leading-5 text-slate-500 dark:text-slate-400">
            {{
              isEditMode
                ? 'Update the title or content of your note.'
                : 'Capture your thoughts, ideas, and important information.'
            }}
          </p>
        </div>
      </div>

      <!-- Close -->
      <button
        type="button"
        @click="handleCancel"
        :disabled="loading"
        aria-label="Close"
        class="flex h-9 w-9 items-center justify-center rounded-xl text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-50 dark:text-slate-500 dark:hover:bg-slate-800 dark:hover:text-slate-200"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="2"
          stroke="currentColor"
          class="h-5 w-5"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
        </svg>
      </button>
    </div>

    <!-- ==================================== -->
    <!-- Error -->
    <!-- ==================================== -->
    <div
      v-if="errorMessage"
      class="mx-6 mt-6 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-4 text-sm text-red-700 transition-colors duration-300 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-300 sm:mx-8"
    >
      <div
        class="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-red-100 text-red-600 dark:bg-red-500/10 dark:text-red-400"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="2"
          stroke="currentColor"
          class="h-4 w-4"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M12 9v3.75m0 3.75h.008v.008H12v-.008ZM21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
          />
        </svg>
      </div>

      <div>
        <p class="font-semibold">Something went wrong</p>

        <p class="mt-0.5 text-red-600/80 dark:text-red-300/80">
          {{ errorMessage }}
        </p>
      </div>
    </div>

    <!-- ==================================== -->
    <!-- Form -->
    <!-- ==================================== -->
    <form @submit.prevent="handleSubmit" class="px-6 py-6 sm:px-8">
      <!-- ---------------------------------------- -->
      <!-- Title -->
      <!-- ---------------------------------------- -->
      <div>
        <div class="mb-2 flex items-center justify-between">
          <label for="note-title" class="text-sm font-semibold text-slate-800 dark:text-slate-200">
            Title

            <span class="text-red-500">*</span>
          </label>

          <span class="text-xs text-slate-400 dark:text-slate-500">
            {{ form.title.length }}/200
          </span>
        </div>

        <input
          id="note-title"
          v-model="form.title"
          type="text"
          maxlength="200"
          placeholder="Give your note a clear title..."
          :disabled="loading"
          required
          class="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-600 dark:focus:border-blue-500 dark:focus:bg-slate-900 [&:-webkit-autofill]:shadow-[0_0_0_1000px_white_inset] [&:-webkit-autofill]:[-webkit-text-fill-color:#0f172a] dark:[&:-webkit-autofill]:shadow-[0_0_0_1000px_#0f172a_inset] dark:[&:-webkit-autofill]:[-webkit-text-fill-color:#f1f5f9]"
        />
      </div>

      <!-- ---------------------------------------- -->
      <!-- Content -->
      <!-- ---------------------------------------- -->
      <div class="mt-6">
        <div class="mb-2 flex items-center justify-between">
          <label
            for="note-content"
            class="text-sm font-semibold text-slate-800 dark:text-slate-200"
          >
            Content

            <span class="ml-1 font-normal text-slate-400 dark:text-slate-500"> Optional </span>
          </label>

          <span class="text-xs text-slate-400 dark:text-slate-500">
            {{ form.content.length }} characters
          </span>
        </div>

        <div class="relative">
          <textarea
            id="note-content"
            v-model="form.content"
            rows="10"
            placeholder="Start writing your note..."
            :disabled="loading"
            class="w-full resize-y rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-7 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-600 dark:focus:border-blue-500 dark:focus:bg-slate-900"
          ></textarea>
        </div>

        <p class="mt-2 text-xs text-slate-400 dark:text-slate-500">
          Write anything you want to remember. Your note will be saved securely.
        </p>
      </div>

      <!-- ---------------------------------------- -->
      <!-- Actions -->
      <!-- ---------------------------------------- -->
      <div
        class="mt-8 flex flex-col-reverse gap-3 border-t border-slate-200 pt-6 transition-colors duration-300 dark:border-slate-800 sm:flex-row sm:justify-end"
      >
        <!-- Cancel -->
        <button
          type="button"
          @click="handleCancel"
          :disabled="loading"
          class="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-600 transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-100"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.8"
            stroke="currentColor"
            class="h-4 w-4"
          >
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
          </svg>

          Cancel
        </button>

        <!-- Submit -->
        <button
          type="submit"
          :disabled="loading"
          class="inline-flex items-center justify-center gap-2 rounded-xl bg-linear-to-r from-blue-600 to-indigo-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition hover:-translate-y-0.5 hover:from-blue-700 hover:to-indigo-700 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
        >
          <!-- Loading spinner -->
          <svg
            v-if="loading"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            class="h-4 w-4 animate-spin"
          >
            <circle
              cx="12"
              cy="12"
              r="9"
              stroke="currentColor"
              stroke-width="3"
              class="opacity-25"
            />

            <path
              fill="currentColor"
              d="M4 12a8 8 0 0 1 8-8v2a6 6 0 0 0-6 6H4Z"
              class="opacity-75"
            />
          </svg>

          <!-- Save icon -->
          <svg
            v-else
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
              d="M17 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V7l-4-4Z"
            />

            <path stroke-linecap="round" stroke-linejoin="round" d="M7 3v5h8V3M7 21v-6h10v6" />
          </svg>

          {{
            loading
              ? isEditMode
                ? 'Updating...'
                : 'Creating...'
              : isEditMode
                ? 'Update Note'
                : 'Create Note'
          }}
        </button>
      </div>
    </form>
  </div>
</template>
