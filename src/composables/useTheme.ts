import { ref, onMounted } from 'vue'

const isDark = ref(false)

// ----------------------------------------
// Theme Composable
// ----------------------------------------
function useTheme() {
  // Apply Theme DOM & Storage Updates
  function applyTheme() {
    if (isDark.value) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }

  // Toggle Theme
  function toggleTheme() {
    isDark.value = !isDark.value
    applyTheme()
  }

  // Lifecycle / Initialization
  onMounted(() => {
    const savedTheme = localStorage.getItem('theme')

    if (savedTheme === 'dark') {
      isDark.value = true
    } else {
      isDark.value = false
    }

    applyTheme()
  })

  return {
    isDark,
    toggleTheme,
  }
}

export { useTheme }
