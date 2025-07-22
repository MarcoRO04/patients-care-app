<script>
  export default {
    name: 'AddNewRecipeView',
    mounted() {
      let recipe_duration = localStorage.getItem('recipe_duration');
      let patients = localStorage.getItem("patients");
      let doctors = localStorage.getItem("doctors");
      let recipes = localStorage.getItem('recipes');

      this.recipes_list = (recipes === null) ? [] : JSON.parse(recipes);
      this.patients_list = (patients === null) ? [] : JSON.parse(patients);
      this.doctors_list = (doctors === null) ? [] : JSON.parse(doctors);
      this.recipe_periods_list = (recipe_duration === null) ? [] : JSON.parse(recipe_duration);
    },
    data(){
      return {
        recipe:{
          recipe_type:"",
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
        doctors_list: [],
        patients_list: [],
        recipe_periods_list:[],
        submission_ok:false,
      }
    },
    methods: {
      saveRecipe(){
        this.recipe.last_prescription_dates.push(this.recipe.current_prescription_date);
        this.recipe.status="green";
        let new_recipe = this.recipe;
        this.recipes_list.push(new_recipe);
        localStorage.setItem("recipes",JSON.stringify(this.recipes_list));
        },

      check_submission(){
        //all field have to be completed, for empty_fields to be false
        this.submission_ok = this.recipe.patient.name.length !== 0 &&
          this.recipe.doctor.name.length !== 0 &&
          this.recipe.doctor.specialization.length !== 0 &&
          this.recipe.recipe_duration.length !== 0 &&
          this.recipe.current_prescription_date.length !== 0;
      },
    },
  }
</script>

<template>
  <div id="add_recipe_form" class="add_recipe_form">
    <label for="patients">Selectează pacient:</label>
    <br>
    <select name="patients" id="patients" v-model="recipe.patient_name" @change="check_submission">
      <option></option>
      <option v-for="(patient,index) in patients_list" :key="index">{{patient}}</option>
    </select>

    <br>

    <label for="doctors">Selectează doctor:</label>
    <br>
    <select name="doctors" id="doctors" v-model="recipe.doctor.name" @change="check_submission">
      <option></option>
      <option v-for="(doctor,index) in doctors_list" :key="index">{{doctor.name}}</option>
    </select>

    <br>

    <label for="prescription_date">Alege data prescrierii rețetei:</label>
    <br>
    <input type="date" id="prescription_date" v-model="recipe.current_prescription_date" @change="check_submission">
    <br>

    <label for="recipe_duration">Selectează durata rețetei:</label>
    <br>
    <select name="recipe_duration" id="recipe_duration" v-model="recipe.recipe_duration" @change="check_submission">
      <option></option>
      <option v-for="(duration,index) in recipe_periods_list" :key="index">{{duration}}</option>
    </select>

    <br>
    <br>

    <button style="margin-right: 16px"
            @click="saveRecipe"
            :disabled="submission_ok === false">Salvare</button>

    <button>Anulare</button>
    <br>
    <br>
  </div>
</template>

<style scoped>
  .add_recipe_form{
    width: 300px;
    margin: 100px auto;
    padding: 5px 10px;
    border: 2px solid black;
  }
</style>
