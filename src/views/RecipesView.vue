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
            name:"Marco Rotunjanu",
          },
          doctor:{
            name:"Dr. Daniel Nan",
            specialization:"",
          },
          future_prescription_date:"",
          current_prescription_date:"",
          recipe_duration:"1 luna",
          last_prescription_dates:[],
          status:"",
          distance_between_prescriptions:"30",
        },
        recipes_list: [],
        doctors_list:[],
        patients_list:[],
        recipe_periods_list:[],
      }
    },
    methods: {
    },
  }
</script>

<template>
  <RecipeCard :patient_name="recipe.patient.name" :doctor_name="recipe.doctor.name"  :recipe_duration="recipe.recipe_duration" :distance_between_recipes="recipe.distance_between_prescriptions"></RecipeCard>
</template>

<style scoped>

</style>
