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
        status_btn: 0,
      }
    },
    methods: {
      check_recipe(r){
        return ((r.patient.name.length > 0) && ((r.status === (this.status_btn.toString())) || this.status_btn === 0 || this.status_btn === 4))
      },

      change_status(){
        this.status_btn++
        if(this.status_btn === 0){
          document.getElementById("status_filter_btn").style.backgroundColor="gray"
          document.getElementById("status_filter_btn").style.color = "black"
          document.getElementById("status_filter_btn").textContent="Gri"
        }
        if(this.status_btn === 1){
          document.getElementById("status_filter_btn").style.backgroundColor="red"
          document.getElementById("status_filter_btn").style.color = "black"
          document.getElementById("status_filter_btn").textContent="Rosu"
        }
        if(this.status_btn === 2){
          document.getElementById("status_filter_btn").style.backgroundColor="orange"
          document.getElementById("status_filter_btn").style.color = "black"
          document.getElementById("status_filter_btn").textContent="Portocaliu"
        }
        if(this.status_btn === 3){
          document.getElementById("status_filter_btn").style.backgroundColor="green"
          document.getElementById("status_filter_btn").style.color = "black"
          document.getElementById("status_filter_btn").textContent="Verde"

        }
        if(this.status_btn === 4){
          document.getElementById("status_filter_btn").style.backgroundColor="gray"
          document.getElementById("status_filter_btn").style.color = "black"
          document.getElementById("status_filter_btn").textContent="Gri"
          this.status_btn = 0
        }
      },
    },
  }
</script>

<template>
  <div >
    <button id="status_filter_btn" @click="change_status" style="background-color: gray;color: black">Gri</button>
    <br><br>
    <RecipeCard style="margin-bottom: 10px" v-show="check_recipe(recipe)" v-for="recipe in recipes_list" :key="recipe"
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
