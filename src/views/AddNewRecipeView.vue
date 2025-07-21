<script>
  export default {
    mounted() {
      let recipes = localStorage.getItem('recipes');
      this.recipes_list = (recipes === null) ? [] : JSON.parse(recipes);
    },
    data(){
      return {
        recipe:{
          recipe_type:"",
          patient_name:"",
          doctor_name:"",
          future_prescription_date:"",
          current_prescription_date:"",
          duration:"",
          last_prescription_dates:[],
          status:"",
          distance_between_prescriptions:""
        },
        recipes_list: [],
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
    },
  }
</script>

<template>
  <div id="add_recipe_form">
    <label for="patients">Selectează pacient:</label>
    <br>
    <select name="patients" id="patients" v-model="recipe.patient_name">
      <option></option>
      <option>Zora Chelici</option>
      <option>Maria Loredana</option>
      <option>Miroslav Liubita</option>
      <option>Mirabela Jovic</option>
      <option>Marian Neamtu</option>
    </select>

    <br>

    <label for="recipe_type">Selectează tip rețetă:</label>
    <br>
    <select name="recipe_type" id="recipe_type" v-model="recipe.recipe_type">
      <option></option>
      <option>Neurolog</option>
      <option>Psihiatru</option>
    </select>

    <br>

    <label for="doctors">Selectează doctor:</label>
    <br>
    <select name="doctors" id="doctors" v-model="recipe.doctor_name">
      <option></option>
      <option>Dr. Mihai Elena</option>
      <option>Dr. Albina Alina</option>
      <option>Dr. Leu Izabela</option>
      <option>Dr. Leustean Ana</option>
    </select>

    <br>

    <label for="prescription_date">Alege data prescrierii rețetei:</label>
    <br>
    <input type="date" id="prescription_date" v-model="recipe.current_prescription_date">
    <br>

    <label for="recipe_duration">Selectează durata rețetei:</label>
    <br>
    <select name="recipe_duration" id="recipe_duration" v-model="recipe.duration">
      <option></option>
      <option>1 lună</option>
      <option>2 luni</option>
      <option>3 luni</option>
    </select>

    <br>
    <br>

    <button style="margin-right: 16px" @click="saveRecipe">Salvare</button>
    <button>Anulare</button>
  </div>
</template>

<style>

</style>
