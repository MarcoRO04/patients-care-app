import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '@/views/LoginView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'recipes',
      component: () => import('../views/RecipesView.vue'),
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue'),
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
    },
    {
      path: '/recover_password',
      name: 'recover_password',
      component: () => import('../views/RecoverPasswordView.vue'),
    },
    {
      path: '/add_new_recipe',
      name: 'add_new_recipe',
      component: () => import('../views/AddNewRecipeView.vue'),
    },
    {
      path: '/more_details_recipe/:id',
      name: 'more_details_recipe',
      component: () => import('../views/MoreDetailsRecipeView.vue'),
    },
    {
      path: '/edit_recipe/:id',
      name: 'edit_recipe',
      component: () => import('../views/EditRecipeView.vue'),
    }
  ],
})

export default router
