import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/Login.vue'
import DashboardView from '../views/Dashboard.vue'
import DashboardCreateView from '../views/DashboardCreate.vue'
import DashboardUpdateView from '../views/DashboardUpdate.vue'
import ClientesView from '../views/Clientes.vue'

const routes = [
  {
    path: '/',
    redirect: '/login',
    name: 'home',
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/login',
    component: LoginView,
    name: 'login',
    meta: {
      requiresAuth: false,
    },
  },
  {
    path: '/dashboard',
    component: DashboardView,
    name: 'dashboard',
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/dashboard/create',
    component: DashboardCreateView,
    name: 'dashboard-create',
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/dashboard/update',
    component: DashboardUpdateView,
    name: 'dashboard-update',
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/clientes',
    component: ClientesView,
    name: 'clientes',
    meta: {
      requiresAuth: true,
    },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth) {
    if (localStorage.getItem('authToken')) {
      next() // Permitir acceso
    } else {
      next({ name: 'login' }) // Redirigir a login
    }
  } else {
    next() // Rutas públicas: acceso libre
  }
})

export default router
