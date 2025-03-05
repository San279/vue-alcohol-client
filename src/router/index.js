import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'
import CompanyView from '../views/CompanyView.vue'
import DepartmentView from '@/views/DepartmentView.vue'
import EquipmentView from '@/views/EquipmentView.vue'
import UserView from '@/views/UserView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: LoginView,
    },
    {
      path: '/',
      name: 'home',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: HomeView,  meta: { requiresAuth: true }
    },
    {
      path: '/company',
      name: 'company',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: CompanyView,  meta: { requiresAuth: true }
    },
    {
      path: '/department',
      name: 'department',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: DepartmentView,  meta: { requiresAuth: true }
    },
    {
      path: '/equipment',
      name: 'equipment',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: EquipmentView,  meta: { requiresAuth: true }
    },
    
    {
      path: '/user',
      name: 'user',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: UserView,  meta: { requiresAuth: true }
    },
  ],
})

router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth && !isAuthenticated()) {
    next('/login');
  } else {
    next();
  }
});

function isAuthenticated() {
  // Check for token in local storage or cookies
  return localStorage.getItem('token');
}


export default router
