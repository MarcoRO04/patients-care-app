<script>
export default {
  name: 'RecipeCard',
  mounted() {},
  props: {
    patient_name: String,
    doctor_name: String,
    doctor_specialization: String,
    recipe_duration: String,
    distance_between_recipes: Number,
    future_prescription_date: String,
    current_prescription_date: String,
    status: String,
    last_prescription_dates: Array,

  },
  data() {
    return {}
  },
  methods: {
    goToDetails(){
      this.$router.push(`/more_details_recipe/${this.patient_name}/${this.doctor_name}/${this.doctor_specialization}/${this.recipe_duration}/${this.distance_between_recipes}/${this.last_prescription_dates}/${this.current_prescription_date}/${this.future_prescription_date}/${this.status}`)
    }
  },
}
</script>

<template>
  <div class="recipe-card" @click="goToDetails">
    <div class="recipe-details">
      <p style="font-size: 20px; font-weight: bold">{{ patient_name }}</p>
      <p>{{ doctor_name }} ({{ recipe_duration }})</p>
    </div>
    <div class="days-left-square">
      <p style="font-size: 30px">{{ distance_between_recipes }}</p>
      <p>zile</p>
    </div>
  </div>
</template>

<style scoped>
.recipe-card {
  /* Add shadows to create the "card" effect */
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
  transition: 0.3s;
  background: #fff;
  color: #181818;
  padding: 8px 12px;
  border-radius: 10px;
  display: flex;
  position: relative;
}

 .recipe-card:hover{
   background-color: #dfe2ec;
 }
 .recipe-card:after {
   position: absolute;
   content: "";
   top: 0;
   left: 0;
   right: 0;
   bottom: 0;
 }


.recipe-details {
  flex: 1;
  text-align: left;
  padding: 8px;
  flex-wrap: wrap;
}
.days-left-square {
  align-self: center;
  display: inline-flex;
  background: greenyellow;
  padding: 10px;
  border-radius: 10px;
}

/* On mouse-over, add a deeper shadow */
.recipe-card:hover {
  box-shadow: 0 8px 16px 0 rgba(0, 0, 0, 0.2);
}
</style>
