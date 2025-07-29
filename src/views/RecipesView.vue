<script>
  import RecipeCard from '@/components/RecipeCard.vue'
  export default {
    name:"RecipesView",
    mounted() {
      let recipes = localStorage.getItem("recipes")
      this.recipes_list = (recipes === null) ? [] : JSON.parse(recipes)
    },
    components: {
      RecipeCard
    },

    data(){
      return {
        recipe: {
          patient:{
            name:"",
          },
          doctor:{
            name:"",
            specialization:"",
          },
          future_prescription_date:"",
          current_prescription_date:"",
          recipe_duration:"",
          last_prescription_dates:[],
          status:"",
          distance_between_prescriptions:"",
        },
        recipes_list: [],
        status_button:true,
      }
    },
    methods: {
      check_recipe(r){
        return (r.patient.name.length > 0)
      },
      show_status(r){
        return(r.status === 'green')
      },
      change_status(){
        if (this.status_button === true){
          this.status_button = false
        } else{
          this.status_button = true
        }
      }
    },
  }
</script>

<template>
  <div >
    <button class="status-filter" @click="change_status">status</button>
    <br><br>
    <RecipeCard style="margin-bottom: 10px" v-show="check_recipe(recipe) && status_button" v-for="recipe in recipes_list" :key="recipe"
              :patient_name= "recipe.patient.name"
              :doctor_name= "recipe.doctor.name"
              :doctor_specialization="recipe.doctor.specialization"
              :recipe_duration= "recipe.recipe_duration"
              :distance_between_recipes= "recipe.distance_between_prescriptions"
              :current_prescription_date= "recipe.current_prescription_date"
              :future_prescription_date= "recipe.future_prescription_date"
              :status="recipe.status"
              :last_prescription_dates=recipe.last_prescription_dates></RecipeCard>
  </div>
</template>

<style scoped>

</style>
