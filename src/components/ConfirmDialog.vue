<script setup lang="ts">
// ----------------------------------------
// Props Definition
// ----------------------------------------
defineProps<{
  open: boolean
  title?: string
  message?: string
  confirmText?: string
  cancelText?: string
  loading?: boolean
}>()

// ----------------------------------------
// Event Emits
// ----------------------------------------
const emit = defineEmits<{
  confirm: []
  cancel: []
}>()
</script>

<!-- ---------------------------------------- -->
<!-- UI -->
<!-- ---------------------------------------- -->
<template>
  <Teleport to="body">
    <div
      v-if="open"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
      @click.self="emit('cancel')"
    >
      <div
        class="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
      >
        <!-- ---------------------------------------- -->
        <!-- Dialog Content -->
        <!-- ---------------------------------------- -->
        <div class="flex items-start gap-4">
          <!-- Warning Icon -->
          <div
            class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#FBEFEC] text-[#C9503B]"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M12 9v4m0 4h.01M10.29 3.86l-7.82 13a2 2 0 001.71 3h15.64a2 2 0 001.71-3l-7.82-13a2 2 0 00-3.42 0z"
              />
            </svg>
          </div>

          <!-- Text -->
          <div class="flex-1">
            <h2 id="confirm-dialog-title" class="text-lg font-semibold text-[#1C2033]">
              {{ title || 'Confirm action' }}
            </h2>

            <p class="mt-2 text-sm leading-relaxed text-[#6B7080]">
              {{ message || 'Are you sure you want to continue?' }}
            </p>
          </div>

          <!-- Close Button -->
          <button
            type="button"
            :disabled="loading"
            aria-label="Close dialog"
            class="text-2xl leading-none text-[#A3A8B5] transition-colors hover:text-[#1C2033] disabled:cursor-not-allowed disabled:opacity-50"
            @click="emit('cancel')"
          >
            &times;
          </button>
        </div>

        <!-- ---------------------------------------- -->
        <!-- Actions -->
        <!-- ---------------------------------------- -->
        <div class="mt-6 flex justify-end gap-3">
          <!-- Cancel -->
          <button
            type="button"
            :disabled="loading"
            class="rounded-lg border border-[#E1DED4] bg-white px-4 py-2 text-sm font-medium text-[#1C2033] transition-colors hover:border-[#3B5BA5] hover:text-[#3B5BA5] disabled:cursor-not-allowed disabled:opacity-50"
            @click="emit('cancel')"
          >
            {{ cancelText || 'Cancel' }}
          </button>

          <!-- Confirm -->
          <button
            type="button"
            :disabled="loading"
            class="rounded-lg bg-[#C9503B] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#B3432B] disabled:cursor-not-allowed disabled:opacity-50"
            @click="emit('confirm')"
          >
            <span v-if="loading"> Deleting... </span>

            <span v-else>
              {{ confirmText || 'Confirm' }}
            </span>
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>
