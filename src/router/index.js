import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '@/views/LoginView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
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
      path: '/recipes',
      name: 'recipes',
      component: () => import('../views/RecipesView.vue'),
    },
    {
      path: '/add_new_recipe',
      name: 'add_new_recipe',
      component: () => import('../views/AddNewRecipeView.vue'),
    },
    {
      path: '/more_details_recipe/:patient_name/:doctor_name/:doctor_specialization/:recipe_duration/:distance_between_recipes/:last_prescription_dates/:current_prescription_date/:future_prescription_date/:status',
      name: 'more_details_recipe',
      component: () => import('../views/MoreDetailsRecipe.vue'),
    },
    {
      path: '/test_swipe',
      name: 'test_swipe',
      component: () => import('../views/TestSwipeView.vue'),
    }
  ],
})

export default router
