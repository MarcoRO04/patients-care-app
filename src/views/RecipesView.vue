<script>
import RecipeCard from '@/components/RecipeCard.vue'
export default {
  name:"RecipesView",
  updated() {
    console.log("RecipesView.updated")
  },
  mounted() {
    console.log('Component RecipesView mounted.')
    let recipes = localStorage.getItem("recipes")
    this.recipes_list = (recipes === null) ? [] : JSON.parse(recipes)
    this.recalculate_distance_between_prescriptions()
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
      searched_name:"",
    }
  },
  methods: {
    check_recipe(r){
      return ((r.patient.name.length > 0) && ((r.status === (this.status_btn.toString())) || this.status_btn === 0 || this.status_btn === 4))
    },
    change_filter_button_status(){
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
        document.getElementById("status_filter_btn").style.backgroundColor="greenyellow"
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
    recalculate_distance_between_prescriptions(){
      let status_changed_cnt = 0
      for (let recipe in this.recipes_list) {
        //the difference between the future prescription and the current date, converted from milliseconds to days, and from number to string
        const date_difference = Math.round((Date.parse(this.recipes_list[recipe].future_prescription_date) - Date.now()) / 8.64e7).toString()
        //if the date obtained is different, then modify the status
        if (this.recipes_list[recipe].distance_between_prescriptions !== date_difference) {
          status_changed_cnt++
          this.recipes_list[recipe].distance_between_prescriptions = date_difference
          if (this.recipes_list[recipe].distance_between_prescriptions < 0) {
            this.recipes_list[recipe].status = "1";
          } else if (this.recipes_list[recipe].distance_between_prescriptions >= 0 && this.recipes_list[recipe].distance_between_prescriptions <= 7) {
            this.recipes_list[recipe].status = "1";
          } else if (this.recipes_list[recipe].distance_between_prescriptions >= 8 && this.recipes_list[recipe].distance_between_prescriptions <= 14) {
            this.recipes_list[recipe].status = "2";
          } else {
            this.recipes_list[recipe].status = "3";
          }
        }
      }
      if (status_changed_cnt > 0) {
        localStorage.setItem("recipes", JSON.stringify(this.recipes_list))
      }
    },
    filter_list_by_patient_name(recipe){
      return (recipe.patient.name.includes(this.searched_name) || recipe.doctor.name.includes(this.searched_name))
    },
    goToAddNewRecipeView(){
      this.$router.push(`/add_new_recipe`)
    }
  },
}
</script>

<template>
  <div class="recipe-view-box">
    <div class="filter-options">
      <input
        type="text"
        class="search-patient"
        v-model="this.searched_name"
        placeholder="Caută pacient sau doctor"
      />
      <button
        class="status-filter-button"
        id="status_filter_btn"
        @click="change_filter_button_status"
        style="background-color: gray; color: black"
      >
        Gri
      </button>
      <button class="add-recipe-button" @click="goToAddNewRecipeView">+</button>
    </div>
    <div v-if="this.recipes_list.length > 0">
      <RecipeCard
        style="margin-bottom: 10px"
        v-show="check_recipe(recipe) && filter_list_by_patient_name(recipe)"
        v-for="recipe in recipes_list.sort(
          (recipe1, recipe2) =>
            Number(recipe1.distance_between_prescriptions) -
            Number(recipe2.distance_between_prescriptions),
        )"
        :key="recipe"
        :patient_name="recipe.patient.name"
        :doctor_name="recipe.doctor.name"
        :doctor_specialization="recipe.doctor.specialization"
        :recipe_duration="recipe.recipe_duration"
        :distance_between_recipes="recipe.distance_between_prescriptions"
        :current_prescription_date="recipe.current_prescription_date"
        :future_prescription_date="recipe.future_prescription_date"
        :status="recipe.status"
        :last_prescription_dates="recipe.last_prescription_dates"
      ></RecipeCard>
    </div>
    <p v-else-if="status_btn === 1 && this.recipes_list.length === 0" style="font-size: 18px">
      Momentan nu aveți nicio rețetă cu status roșu.
    </p>
    <p v-else-if="status_btn === 2 && this.recipes_list.length === 0" style="font-size: 18px">
      Momentan nu aveți nicio rețetă cu status portocaliu.
    </p>
    <p v-else-if="status_btn === 3 && this.recipes_list.length === 0" style="font-size: 18px">
      Momentan nu aveți nicio rețetă cu status verde.
    </p>
    <p v-else style="font-size: 18px">Momentan nu aveți nicio rețetă salvată.</p>
  </div>
</template>

<style scoped>
.filter-options {
  display: flex;
  position: relative;
}

.status-filter-button {
  width: 75px;
  height: 38px;
  margin: 2px 4px 2px 2px;
  float: right;
  font-size: 12px;
  font-weight: bold;
  border-radius: 10px;
  border: none;
}

.add-recipe-button {
  width: 75px;
  height: 38px;
  margin: 2px;
  float: right;
  font-size: 20px;
  font-weight: bold;
  border-radius: 10px;
  border: none;
  padding: 3px 3px 3px 3px;
}

.search-patient {
  background: white url('assets/search-icon.svg') no-repeat;
  width: 70%;
  font-size: 14px;
  padding: 12px 20px 12px 40px;
  border: 1px solid #ddd;
  margin-bottom: 40px;
  border-radius: 10px;
  margin-right: 15px;
}
</style>
