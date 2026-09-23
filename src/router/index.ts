import { createRouter, createWebHistory } from 'vue-router'

// ----------------------------------------
// Router Configuration
// ----------------------------------------
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),

  routes: [
    // Public Routes
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/LoginView.vue'),
    },

    {
      path: '/register',
      name: 'register',
      component: () => import('@/views/RegisterView.vue'),
    },

    // Protected Routes
    {
      path: '/notes',
      name: 'notes',
      component: () => import('@/views/NotesView.vue'),
      meta: {
        requiresAuth: true,
      },
    },

    {
      path: '/notes/:id',
      name: 'note-detail',
      component: () => import('@/views/NoteDetailView.vue'),
      meta: {
        requiresAuth: true,
      },
    },

    // Redirects
    {
      path: '/',
      redirect: '/login',
    },
  ],
})

// ----------------------------------------
// Global Navigation Guard
// ----------------------------------------
// router.beforeEach((to) => {
//   const token = localStorage.getItem('token')

//   // Protected page
//   if (to.meta.requiresAuth && !token) {
//     return '/login'
//   }

//   // Already logged in
//   if ((to.name === 'login' || to.name === 'register') && token) {
//     return '/notes'
//   }

//   return true
// })

export default router
