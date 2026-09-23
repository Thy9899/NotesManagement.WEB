<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

// ----------------------------------------
// Form State
// ----------------------------------------
const form = reactive({
  name: '',
  email: '',
  password: '',
})

const confirmPassword = ref('')

// ----------------------------------------
// UI State
// ----------------------------------------
const errorMessage = ref('')
const loading = ref(false)
const showPassword = ref(false)
const showConfirmPassword = ref(false)

// ----------------------------------------
// Handle Register
// ----------------------------------------
async function handleRegister() {
  errorMessage.value = ''

  // Check password confirmation
  if (form.password !== confirmPassword.value) {
    errorMessage.value = 'Passwords do not match.'
    return
  }

  loading.value = true

  try {
    await authStore.register(form)
    await router.push('/notes')
  } catch (error: any) {
    errorMessage.value = error.response?.data?.message ?? 'Registration failed. Please try again.'
  } finally {
    loading.value = false
  }
}
</script>

<!-- ---------------------------------------- -->
<!-- UI -->
<!-- ---------------------------------------- -->
<template>
  <div class="relative min-h-screen overflow-hidden bg-slate-900">
    <!-- ==================================== -->
    <!-- Background Image -->
    <!-- ==================================== -->
    <div
      class="absolute inset-0 bg-cover bg-center"
      style="
        background-image: url('https://wallpapercrafter.com/desktop/152210-Angkor-Wat-Cambodia-Hinduism-temple.jpg');
      "
    ></div>

    <!-- ==================================== -->
    <!-- Dark Overlay -->
    <!-- ==================================== -->
    <div class="absolute inset-0 bg-slate-950/55"></div>

    <!-- ==================================== -->
    <!-- Main Content -->
    <!-- ==================================== -->
    <div class="relative z-10 flex min-h-screen items-center justify-center px-4 py-8">
      <div
        class="grid w-full max-w-6xl overflow-hidden rounded-3xl bg-white/10 shadow-2xl backdrop-blur-sm lg:grid-cols-2"
      >
        <!-- ---------------------------------------- -->
        <!-- LEFT SIDE -->
        <!-- ---------------------------------------- -->
        <div class="hidden flex-col justify-center p-10 text-white lg:flex xl:p-14">
          <!-- Logo -->
          <div class="mb-12 flex items-center gap-3">
            <div
              class="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 backdrop-blur-md"
            >
              <!-- Leaf Icon -->
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.8"
                class="h-7 w-7"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78Z"
                />
              </svg>
            </div>

            <span class="text-2xl font-bold tracking-tight"> NotesApp </span>
          </div>

          <!-- Heading -->
          <div class="max-w-lg">
            <h1 class="text-4xl font-bold leading-tight xl:text-5xl">Start Your Journey</h1>

            <p class="mt-5 text-lg leading-relaxed text-white/80">
              Create your account and start organizing your thoughts, ideas, and notes in one place.
            </p>
          </div>

          <!-- Features -->
          <div class="mt-12 space-y-7">
            <!-- Feature 1 -->
            <div class="flex items-center gap-4">
              <div
                class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/15 backdrop-blur-md"
              >
                <!-- User -->
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
                    d="M15.75 6.75a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.5 20.25a7.5 7.5 0 0 1 15 0"
                  />
                </svg>
              </div>

              <div>
                <h3 class="font-semibold">Create your account</h3>

                <p class="mt-1 text-sm text-white/65">Get started in just a few seconds.</p>
              </div>
            </div>

            <!-- Feature 2 -->
            <div class="flex items-center gap-4">
              <div
                class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/15 backdrop-blur-md"
              >
                <!-- Shield -->
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
                    d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.572-.598-3.75A11.96 11.96 0 0 1 12 2.714Z"
                  />
                </svg>
              </div>

              <div>
                <h3 class="font-semibold">Keep your notes secure</h3>

                <p class="mt-1 text-sm text-white/65">Your personal notes stay protected.</p>
              </div>
            </div>

            <!-- Feature 3 -->
            <div class="flex items-center gap-4">
              <div
                class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/15 backdrop-blur-md"
              >
                <!-- Lightning -->
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
                    d="m13 10 4.553-4.276A.5.5 0 0 0 17.212 5H12.5l.5-3L7 10.5h4.5L11 14l2-4Z"
                  />
                </svg>
              </div>

              <div>
                <h3 class="font-semibold">Stay organized</h3>

                <p class="mt-1 text-sm text-white/65">Manage your notes from anywhere.</p>
              </div>
            </div>
          </div>
        </div>

        <!-- ---------------------------------------- -->
        <!-- RIGHT SIDE -->
        <!-- ---------------------------------------- -->
        <div class="flex items-center justify-center bg-white/95 p-6 sm:p-10 lg:p-12">
          <div class="w-full max-w-md">
            <!-- Header -->
            <div class="mb-8 text-center">
              <div
                class="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-sky-100 text-blue-600"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.8"
                  class="h-7 w-7"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78Z"
                  />
                </svg>
              </div>

              <h2 class="text-3xl font-bold tracking-tight text-slate-900">Create an account</h2>

              <p class="mt-2 text-sm text-slate-500">Create your account to get started.</p>
            </div>

            <!-- Form -->
            <form @submit.prevent="handleRegister" class="space-y-5">
              <!-- Name -->
              <div>
                <label for="name" class="mb-2 block text-sm font-semibold text-slate-700">
                  Full name
                </label>

                <div class="relative">
                  <!-- User Icon -->
                  <div
                    class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400"
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
                        d="M15.75 6.75a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.5 20.25a7.5 7.5 0 0 1 15 0"
                      />
                    </svg>
                  </div>

                  <input
                    id="name"
                    v-model="form.name"
                    type="text"
                    autocomplete="name"
                    placeholder="Enter your name"
                    required
                    class="w-full rounded-xl border border-slate-200 bg-white py-3.5 pl-12 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                  />
                </div>
              </div>

              <!-- Email -->
              <div>
                <label for="email" class="mb-2 block text-sm font-semibold text-slate-700">
                  Email
                </label>

                <div class="relative">
                  <!-- Email Icon -->
                  <div
                    class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400"
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
                        d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25H4.5a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15A2.25 2.25 0 0 0 2.25 6.75m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0l-7.5-4.615a2.25 2.25 0 0 1-1.07-1.916V6.75"
                      />
                    </svg>
                  </div>

                  <input
                    id="email"
                    v-model="form.email"
                    type="email"
                    autocomplete="email"
                    placeholder="Enter your email"
                    required
                    class="w-full rounded-xl border border-slate-200 bg-white py-3.5 pl-12 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                  />
                </div>
              </div>

              <!-- Password -->
              <div>
                <label for="password" class="mb-2 block text-sm font-semibold text-slate-700">
                  Password
                </label>

                <div class="relative">
                  <!-- Lock Icon -->
                  <div
                    class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400"
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
                        d="M16.5 10.5V6.75a4.5 4.5 0 0 0-9 0v3.75m-.75 0h10.5A2.25 2.25 0 0 1 19.5 12.75v6.75a2.25 2.25 0 0 1-2.25 2.25h-10.5A2.25 2.25 0 0 1 4.5 19.5v-6.75a2.25 2.25 0 0 1 2.25-2.25Z"
                      />
                    </svg>
                  </div>

                  <input
                    id="password"
                    v-model="form.password"
                    :type="showPassword ? 'text' : 'password'"
                    autocomplete="new-password"
                    placeholder="Minimum 6 characters"
                    minlength="6"
                    required
                    class="w-full rounded-xl border border-slate-200 bg-white py-3.5 pl-12 pr-12 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                  />

                  <!-- Show / Hide -->
                  <button
                    type="button"
                    @click="showPassword = !showPassword"
                    class="absolute inset-y-0 right-0 flex items-center pr-4 text-slate-400 transition hover:text-slate-700"
                    :aria-label="showPassword ? 'Hide password' : 'Show password'"
                  >
                    <!-- Eye -->
                    <svg
                      v-if="!showPassword"
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
                        d="M2.036 12.322a1.012 1.012 0 0 1 0-.644C3.423 7.51 7.36 4.5 12 4.5c4.64 0 8.577 3.01 9.964 7.178.07.21.07.434 0 .644C20.577 16.49 16.64 19.5 12 19.5c-4.64 0-8.577-3.01-9.964-7.178Z"
                      />

                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                      />
                    </svg>

                    <!-- Eye Off -->
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
                        d="M3.98 8.223A10.477 10.477 0 0 0 2.25 12c1.387 4.167 5.324 7.5 9.75 7.5 1.564 0 3.04-.367 4.35-1.018"
                      />

                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M6.228 6.228A10.45 10.45 0 0 1 12 4.5c4.64 0 8.577 3.01 9.964 7.178a10.523 10.523 0 0 1-4.132 5.411M6.228 6.228 3 3m3.228 3.228 3.21 3.21m4.242 4.242 3.21 3.21M9.438 9.438A3 3 0 0 0 13.68 13.68"
                      />

                      <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-3.272-3.272" />
                    </svg>
                  </button>
                </div>
              </div>

              <!-- Confirm Password -->
              <div>
                <label
                  for="confirmPassword"
                  class="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Confirm password
                </label>

                <div class="relative">
                  <!-- Lock Icon -->
                  <div
                    class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400"
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
                        d="M16.5 10.5V6.75a4.5 4.5 0 0 0-9 0v3.75m-.75 0h10.5A2.25 2.25 0 0 1 19.5 12.75v6.75a2.25 2.25 0 0 1-2.25 2.25h-10.5A2.25 2.25 0 0 1 4.5 19.5v-6.75a2.25 2.25 0 0 1 2.25-2.25Z"
                      />
                    </svg>
                  </div>

                  <input
                    id="confirmPassword"
                    v-model="confirmPassword"
                    :type="showConfirmPassword ? 'text' : 'password'"
                    autocomplete="new-password"
                    placeholder="Confirm your password"
                    minlength="6"
                    required
                    class="w-full rounded-xl border border-slate-200 bg-white py-3.5 pl-12 pr-12 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                  />

                  <!-- Show / Hide -->
                  <button
                    type="button"
                    @click="showConfirmPassword = !showConfirmPassword"
                    class="absolute inset-y-0 right-0 flex items-center pr-4 text-slate-400 transition hover:text-slate-700"
                    :aria-label="showConfirmPassword ? 'Hide password' : 'Show password'"
                  >
                    <svg
                      v-if="!showConfirmPassword"
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
                        d="M2.036 12.322a1.012 1.012 0 0 1 0-.644C3.423 7.51 7.36 4.5 12 4.5c4.64 0 8.577 3.01 9.964 7.178.07.21.07.434 0 .644C20.577 16.49 16.64 19.5 12 19.5c-4.64 0-8.577-3.01-9.964-7.178Z"
                      />

                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                      />
                    </svg>

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
                        d="M3.98 8.223A10.477 10.477 0 0 0 2.25 12c1.387 4.167 5.324 7.5 9.75 7.5 1.564 0 3.04-.367 4.35-1.018"
                      />

                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M6.228 6.228A10.45 10.45 0 0 1 12 4.5c4.64 0 8.577 3.01 9.964 7.178a10.523 10.523 0 0 1-4.132 5.411M6.228 6.228 3 3m3.228 3.228 3.21 3.21m4.242 4.242 3.21 3.21M9.438 9.438A3 3 0 0 0 13.68 13.68"
                      />

                      <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-3.272-3.272" />
                    </svg>
                  </button>
                </div>
              </div>

              <!-- Error -->
              <div
                v-if="errorMessage"
                class="flex items-start gap-3 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600"
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

              <!-- Register Button -->
              <button
                type="submit"
                :disabled="loading"
                class="group flex w-full items-center justify-center gap-2 rounded-xl bg-linear-to-r from-blue-600 to-indigo-600 px-4 py-3.5 font-semibold text-white shadow-lg shadow-blue-500/20 transition duration-200 hover:-translate-y-0.5 hover:from-blue-700 hover:to-indigo-700 hover:shadow-xl hover:shadow-blue-500/25 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
              >
                <!-- Loading -->
                <svg
                  v-if="loading"
                  class="h-5 w-5 animate-spin"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    class="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    stroke-width="4"
                  />

                  <path
                    class="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4Z"
                  />
                </svg>

                <!-- User Plus Icon -->
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
                    d="M15 19.128a9.38 9.38 0 0 0 3.75.872c.966 0 1.907-.145 2.8-.414M15 19.128v-.003c0-1.113-.285-2.164-.785-3.07M15 19.128c-1.13.37-2.34.572-3.6.572a11.25 11.25 0 0 1-3.6-.572M15 19.128a9.38 9.38 0 0 0 3.75.872c.966 0 1.907-.145 2.8-.414M9 12.75a3.75 3.75 0 1 0 7.5 0 3.75 3.75 0 0 0-7.5 0Z"
                  />

                  <path stroke-linecap="round" stroke-linejoin="round" d="M18 8.25v6m3-3h-6" />
                </svg>

                <span>
                  {{ loading ? 'Creating account...' : 'Create account' }}
                </span>
              </button>
            </form>

            <!-- Divider -->
            <div class="my-7 flex items-center gap-4">
              <div class="h-px flex-1 bg-slate-200"></div>

              <span class="text-xs font-medium uppercase text-slate-400"> or </span>

              <div class="h-px flex-1 bg-slate-200"></div>
            </div>

            <!-- Login -->
            <p class="text-center text-sm text-slate-500">
              Already have an account?

              <RouterLink
                to="/login"
                class="ml-1 font-semibold text-blue-600 transition hover:text-blue-700 hover:underline"
              >
                Sign in
              </RouterLink>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
