import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),

  routes: [
    {
      path: '/',
      name: 'login',
      component: () => import('../views/LoginView.vue'),
    },
    {
      path: '/error',
      name: 'error',
      component: () => import('../views/ErrorView.vue'),
    },
    {
      path: '/recipes',
      name: 'recipes',
      component: () => import('../views/RecipesView.vue'),
      beforeEnter: (to, from, next) => {
        if (localStorage.getItem('context') === '123') {
          next()
        }else{
          next('/error')
        }
      }
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
      beforeEnter: (to, from, next) => {
        if (localStorage.getItem('context') === '123') {
          next()
        }else{
          next('/error')
        }
      }
    },
    {
      path: '/more_details_recipe/:id',
      name: 'more_details_recipe',
      component: () => import('../views/MoreDetailsRecipeView.vue'),
      beforeEnter: (to, from, next) => {
        if (localStorage.getItem('context') === '123') {
          next()
        }else{
          next('/error')
        }
      }
    },
    {
      path: '/edit_recipe/:id',
      name: 'edit_recipe',
      component: () => import('../views/EditRecipeView.vue'),
      beforeEnter: (to, from, next) => {
        if (localStorage.getItem('context') === '123') {
          next()
        }else{
          next('/error')
        }
      }
    }
  ],
})
export default router
