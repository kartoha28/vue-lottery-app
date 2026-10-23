import type { Router } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'

export function setupGuards(router: Router): void {
  router.beforeEach((to) => {
    const authStore = useAuthStore()

    if (to.meta.requiresAuth && !authStore.isAuthenticated) {
      return {
        name: 'login',
        query: { redirect: to.fullPath },
      }
    }

    if (to.name === 'login' && authStore.isAuthenticated) {
      return { name: 'users' }
    }
  })

  router.afterEach((to) => {
    document.title = to.meta.title || 'VueLottery'
  })
}
