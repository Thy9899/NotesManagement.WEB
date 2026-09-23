<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

// Routing & Auth Store
const router = useRouter()
const authStore = useAuthStore()

// ----------------------------------------
// UI State
// ----------------------------------------
const form = reactive({
  email: '',
  password: '',
})

// ----------------------------------------
// UI state variables
// ----------------------------------------
const errorMessage = ref('')
const loading = ref(false)
const showPassword = ref(false)

// ----------------------------------------
// Handle Login
// ----------------------------------------
async function handleLogin() {
  errorMessage.value = ''
  loading.value = true

  try {
    await authStore.login(form)
    await router.push('/notes')
  } catch (error: any) {
    errorMessage.value =
      error.response?.data?.message ?? 'Login failed. Please check your email and password.'
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
    <!-- Main -->
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

          <!-- Welcome -->
          <div class="max-w-lg">
            <h1 class="text-4xl font-bold leading-tight xl:text-5xl">Welcome Back!</h1>

            <p class="mt-5 text-lg leading-relaxed text-white/80">
              Sign in to your account and continue your journey with NotesApp.
            </p>
          </div>

          <!-- Features -->
          <div class="mt-12 space-y-7">
            <!-- Feature 1 -->
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
                <h3 class="font-semibold">Keep your notes safe</h3>

                <p class="mt-1 text-sm text-white/65">Your data is always protected.</p>
              </div>
            </div>

            <!-- Feature 2 -->
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
                <h3 class="font-semibold">Access anywhere</h3>

                <p class="mt-1 text-sm text-white/65">Work from any device, anytime.</p>
              </div>
            </div>

            <!-- Feature 3 -->
            <div class="flex items-center gap-4">
              <div
                class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/15 backdrop-blur-md"
              >
                <!-- Heart -->
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
                    d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733C11.285 4.876 9.623 3.75 7.688 3.75 5.099 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
                  />
                </svg>
              </div>

              <div>
                <h3 class="font-semibold">Stay productive</h3>

                <p class="mt-1 text-sm text-white/65">Turn your ideas into action.</p>
              </div>
            </div>
          </div>
        </div>

        <!-- ---------------------------------------- -->
        <!-- RIGHT SIDE LOGIN -->
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
                  class="h-8 w-8"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78Z"
                  />
                </svg>
              </div>

              <h2 class="text-3xl font-bold tracking-tight text-slate-900">Login</h2>

              <p class="mt-2 text-sm text-slate-500">Enter your email and password to continue.</p>
            </div>

            <!-- Form -->
            <form @submit.prevent="handleLogin" class="space-y-5">
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
                    autocomplete="current-password"
                    placeholder="Enter your password"
                    required
                    class="w-full rounded-xl border border-slate-200 bg-white py-3.5 pl-12 pr-12 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                  />

                  <!-- Show / Hide Password -->
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

              <!-- Error Message -->
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

              <!-- Login Button -->
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

                <!-- Login Icon -->
                <svg
                  v-else
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.8"
                  stroke="currentColor"
                  class="h-5 w-5 transition group-hover:translate-x-0.5"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6A2.25 2.25 0 0 0 5.25 5.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15"
                  />

                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="m12 15 3-3m0 0-3-3m3 3H3"
                  />
                </svg>

                <span>
                  {{ loading ? 'Logging in...' : 'Login' }}
                </span>
              </button>
            </form>

            <!-- Divider -->
            <div class="my-7 flex items-center gap-4">
              <div class="h-px flex-1 bg-slate-200"></div>

              <span class="text-xs font-medium uppercase text-slate-400"> or </span>

              <div class="h-px flex-1 bg-slate-200"></div>
            </div>

            <!-- Register -->
            <p class="text-center text-sm text-slate-500">
              Don't have an account?

              <RouterLink
                to="/register"
                class="ml-1 font-semibold text-blue-600 transition hover:text-blue-700 hover:underline"
              >
                Create an account
              </RouterLink>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
