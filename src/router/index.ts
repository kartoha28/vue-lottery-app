import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'

declare module 'vue-router' {
  interface RouteMeta {
    title?: string
    requiresAuth?: boolean
    layout?: 'default' | 'auth'
  }
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/HomeView.vue'),
      meta: {
        title: 'Home | VueLottery',
        layout: 'default',
      },
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('@/views/AboutView.vue'),
      meta: {
        title: 'About Author | VueLottery',
        layout: 'default',
      },
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/LoginView.vue'),
      meta: {
        title: 'Login | VueLottery',
        layout: 'auth',
      },
    },
    {
      path: '/users',
      name: 'users',
      component: () => import('@/views/UsersView.vue'),
      meta: {
        title: 'Users | VueLottery',
        requiresAuth: true,
        layout: 'default',
      },
    },
    {
      path: '/users/:id',
      name: 'user-details',
      component: () => import('@/views/UserDetailsView.vue'),
      props: true,
      meta: {
        title: 'User Details | VueLottery',
        requiresAuth: true,
        layout: 'default',
      },
      children: [
        {
          path: 'edit',
          name: 'user-edit',
          component: () => import('@/views/UserEditView.vue'),
          props: true,
          meta: {
            title: 'Edit User | VueLottery',
            requiresAuth: true,
            layout: 'default',
          },
        },
      ],
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('@/views/NotFoundView.vue'),
      meta: {
        title: '404 Not Found | VueLottery',
        layout: 'default',
      },
    },
  ],
})

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

export default router
