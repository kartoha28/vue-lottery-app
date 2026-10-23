import type { Router } from 'vue-router'
import { useSessionStore } from '@/entities/session'

export function setupGuards(router: Router): void {
  router.beforeEach((to) => {
    const sessionStore = useSessionStore()

    if (to.meta.requiresAuth && !sessionStore.isAuthenticated) {
      return {
        name: 'login',
        query: { redirect: to.fullPath },
      }
    }

    if (to.name === 'login' && sessionStore.isAuthenticated) {
      return { name: 'users' }
    }
  })

  router.afterEach((to) => {
    document.title = to.meta.title || 'VueLottery'
  })
}
