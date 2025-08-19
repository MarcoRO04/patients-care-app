<script>
export default {
  name: 'RecipeCard',
  mounted() {
    this.change_recipe_status()
  },
  props: {
    patient_name: String,
    doctor_name: String,
    doctor_specialization: String,
    recipe_duration: String,
    distance_between_recipes: String,
    future_prescription_date: String,
    current_prescription_date: String,
    status: String,
    last_prescription_dates: Array,
  },
  data() {
    return {
      recipe: {
        patient: {
          name: this.patient_name,
        },
        doctor: {
          name: this.doctor_name,
          specialization: this.doctor_specialization,
        },
        recipe_duration: this.recipe_duration,
        distance_between_recipes: this.distance_between_recipes,
        future_prescription_date: this.future_prescription_date,
        current_prescription_date: this.current_prescription_date,
        last_prescription_dates: this.last_prescription_dates,
        status: this.status,
      },
      status_color: '',
    }
  },
  methods: {
    goToDetails() {
      this.$router.push(
        `/more_details_recipe/${this.patient_name}/${this.doctor_name}/${this.doctor_specialization}/${this.recipe_duration}/${this.distance_between_recipes}/${this.last_prescription_dates}/${this.current_prescription_date}/${this.future_prescription_date}/${this.status}`,
      )
    },
    change_recipe_status() {
      switch (this.recipe.status) {
        case '1':
          this.status_color = 'red'
          break
        case '2':
          this.status_color = 'orange'
          break
        case '3':
          this.status_color = 'greenyellow'
          break
        default:
          console.log('no status')
          break
      }
    },
  },
}
</script>

<template>
  <div class="recipe-card" @click.prevent="goToDetails" id="recipe_card">
    <div class="recipe-details">
      <p style="font-size: 20px; font-weight: bold">{{ this.patient_name }}</p>
      <p>{{ this.doctor_name }} ({{ this.recipe_duration }})</p>
    </div>
    <div class="div-update-button">
      <button class="update-button" v-show="this.recipe.status === '1'">Update</button>
    </div>
    <div class="days-left-square" id="days_left_square" :style="{ backgroundColor: this.status_color }">
      <p style="font-size: 30px">{{ this.distance_between_recipes }}</p>
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

.recipe-card:hover {
  background-color: #dfe2ec;
}

.recipe-details {
  flex: 1;
  text-align: left;
  flex-wrap: wrap;
  padding: 8px 0 8px 8px;
}
.days-left-square {
  align-self: center;
  display: inline-flex;
  background: greenyellow;
  padding: 10px;
  border-radius: 10px;
  width: 18%;
}

/* On mouse-over, add a deeper shadow */
.recipe-card:hover {
  box-shadow: 0 8px 16px 0 rgba(0, 0, 0, 0.2);
}

.update-button {
  background-color: dodgerblue;
  color: white;
  font-weight: bolder;
  font-size: 13px;
  border-radius: 10px;
  border: none;

  display: block;
  margin-left: auto;
  margin-right: auto;
  width:55px;
  padding: 2px;
}

.div-update-button{
  width:58px;
  height: 100%;
  margin-right: 5px;
}
</style>
