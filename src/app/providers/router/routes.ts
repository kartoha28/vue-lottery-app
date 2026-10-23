import type { RouteRecordRaw } from 'vue-router'

export const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/pages/home').then((m) => m.HomeView),
    meta: {
      title: 'Home | VueLottery',
      layout: 'default',
    },
  },
  {
    path: '/about',
    name: 'about',
    component: () => import('@/pages/about').then((m) => m.AboutView),
    meta: {
      title: 'About Author | VueLottery',
      layout: 'default',
    },
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/pages/login').then((m) => m.LoginView),
    meta: {
      title: 'Login | VueLottery',
      layout: 'auth',
    },
  },
  {
    path: '/users',
    name: 'users',
    component: () => import('@/pages/users').then((m) => m.UsersView),
    meta: {
      title: 'Users | VueLottery',
      requiresAuth: true,
      layout: 'default',
    },
  },
  {
    path: '/users/:id',
    name: 'user-details',
    component: () => import('@/pages/user-details').then((m) => m.UserDetailsView),
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
        component: () => import('@/pages/user-details').then((m) => m.UserEditView),
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
    component: () => import('@/pages/not-found').then((m) => m.NotFoundView),
    meta: {
      title: '404 Not Found | VueLottery',
      layout: 'default',
    },
  },
]
