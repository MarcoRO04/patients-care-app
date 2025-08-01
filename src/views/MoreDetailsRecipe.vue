<script>

  export default {
    name: "MoreDetailRecipe",
    components: {
    },
    mounted() {
      let recipes = localStorage.getItem("recipes");
      this.recipes_list = (recipes === null) ? [] : JSON.parse(recipes);
    },
    data() {
      return {
        recipe:{
          patient: {
            name:"",
          },
          doctor: {
            name:"",
            specialization:"",
          },
          future_prescription_date: "",
          current_prescription_date:"",
          recipe_duration:"",
          last_prescription_dates: [],
          status:"",
          distance_between_prescriptions:"",
        },
        recipes_list:[]
      }
    },
    methods: {
      formatDate(date_string) {
        let date = new Date(date_string);
        let formatted_date =""
        if (date.getMonth() < 10 && date.getDate() > 10) {
          formatted_date = `${date.getFullYear()}-0${date.getMonth() + 1}-${date.getDate()}`;
        }
        else if (date.getDate() < 10 && date.getMonth() > 10) {
          formatted_date =`${date.getFullYear()}-${date.getMonth() + 1}-0${date.getDate()}`
        } else{
          formatted_date =`${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
        }
        return formatted_date;
      },
    },
  }
</script>

<template>
  <div class="more-details-recipe">
    <p>Pacient: {{ $route.params.patient_name}}</p>
    <p>Tip rețetă: {{$route.params.doctor_specialization}}</p>
    <p>Doctor: {{$route.params.doctor_name}}</p>
    <p>Data ultimei rețete prescrise: {{$route.params.current_prescription_date}}</p>
    <p>Data următoarei prescrieri: {{this.formatDate($route.params.future_prescription_date)}}</p>
    <p>Durata: {{$route.params.recipe_duration}}</p>
    <p>Rețete prescrise anterior: </p>
    <p>{{$route.params.last_prescription_dates.toString()}}</p>
    <div class="table-last-dates">
      <p v-for="index in recipe.last_prescription_dates" :key="index"> {{index + 1}}.  {{recipe.last_prescription_dates[index].toString()}}</p>
    </div>
  </div>
</template>

<style scoped>
.more-details-recipe {
  background-color: #fff;
  color: #181818;
  padding: 10px 15px;
}
.table-last-dates {
  height: 100px;
  width: 80%;
  overflow: auto;

}
</style>
