<script>
export default {
  name:"RecipesView",
  mounted() {
    let recipes = localStorage.getItem("recipes")
    this.recipes_list = (recipes === null) ? [] : JSON.parse(recipes)
  },
  components: {
  },

  data(){
    return {
      recipe: {
        patients_list:{
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
  <p v-for="(recipe,index) in recipes_list" :key="index">
    {{recipe.patient.name}} -
    {{recipe.doctor.name}} - {{recipe.doctor.specialization}} -
    {{recipe.distance_between_prescriptions}} zile - {{recipe.status}}</p>
</template>

<style scoped>

</style>
