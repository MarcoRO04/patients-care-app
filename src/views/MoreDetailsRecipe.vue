<script>
export default {
  name: 'MoreDetailRecipe',
  components: {},
  mounted() {
    let recipes = localStorage.getItem('recipes')
    this.recipes_list = recipes === null ? [] : JSON.parse(recipes)
  },
  data() {
    return {
      recipe: {
        patient: {
          name: this.$route.params.patient_name,
        },
        doctor: {
          name: this.$route.params.doctor_name,
          specialization: this.$route.params.doctor_specialization,
        },
        future_prescription_date: this.$route.params.future_prescription_date,
        current_prescription_date: this.$route.params.current_prescription_date,
        recipe_duration: this.$route.params.recipe_duration,
        last_prescription_dates: this.$route.params.last_prescription_dates.split(','),
        status: this.$route.params.status,
        distance_between_prescriptions: this.$route.params.distance_between_prescriptions,
      },
      recipes_list: [],
    }
  },
  methods: {
    formatDate(date_string) {
      let date = new Date(date_string)
      let formatted_date = ''
      if (date.getMonth() < 10 && date.getDate() > 10) {
        formatted_date = `${date.getFullYear()}-0${date.getMonth() + 1}-${date.getDate()}`
      } else if (date.getDate() < 10 && date.getMonth() > 10) {
        formatted_date = `${date.getFullYear()}-${date.getMonth() + 1}-0${date.getDate()}`
      } else {
        formatted_date = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
      }
      return formatted_date
    },
    calculateFuturePrescriptionDate() {
      for (let r in this.recipes_list) {
        if (
          this.$route.params.patient_name === this.recipes_list[r].patient.name &&
          this.$route.params.doctor_name === this.recipes_list[r].doctor.name &&
          this.$route.params.recipe_duration === this.recipes_list[r].recipe_duration
        ) {
          this.recipes_list[r].recipe_duration.split(" ");
          let unformatted_current_date = new Date(Date.now())
          this.recipes_list[r].current_prescription_date = `${unformatted_current_date.getFullYear()}-${unformatted_current_date.getMonth() + 1}-${unformatted_current_date.getDate()}`
          let unformatted_future_date = new Date(Date.now() + (this.recipes_list[r].recipe_duration[0] * 1000 * 60 * 60 * 24 * 30))
          this.recipes_list[r].future_prescription_date = `${unformatted_future_date.getFullYear()}-${unformatted_future_date.getMonth() + 1}-${unformatted_future_date.getDate()}`

          this.recipes_list[r].last_prescription_dates.push(this.recipes_list[r].current_prescription_date)
          this.recipe = this.recipes_list[r]
          localStorage.setItem("recipes", JSON.stringify(this.recipes_list))
          this.goToRecipesView()
          break;
        }
      }
    },
    goToRecipesView(){
      this.$router.push(`/recipes`)
    },
  },
}
</script>
<template>
  <div class="more-details-recipe">
    <div class="upper-zone">
      <div class="upper-zone-left">
        <p>Pacient: {{ $route.params.patient_name }}</p>
        <p>Tip rețetă: {{ $route.params.doctor_specialization }}</p>
        <p>Doctor: {{ $route.params.doctor_name }}</p>
        <p>Durata: {{ $route.params.recipe_duration }}</p>
      </div>
      <div class="upper-zone-right">
        <button class="button-update" @click="calculateFuturePrescriptionDate" v-show="$route.params.status === '1'">Update</button>
        <button class="button-delete">Delete</button>
        <button class="button-edit">Edit</button>
      </div>
    </div>
    <div class="middle-zone">
      <p>Data ultimei rețete prescrise: {{ $route.params.current_prescription_date }}</p>
      <p>
        Data următoarei prescrieri: {{ this.formatDate($route.params.future_prescription_date) }}
      </p>
      <p>Rețetele prescrise anterior:</p>
    </div>
    <div class="table-last-dates">
      <p v-for="(index,counter) in recipe.last_prescription_dates" :key="index"> {{counter+1}}. {{index}}</p>
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

.upper-zone {
  display: flex;
  position: relative;
}
.upper-zone-left {
  position: relative;
  flex: 1;
}
.upper-zone-right {
  position: relative;
  text-align: right;
}

.button-update,
.button-delete,
.button-edit {
  display: block;
  width: 70px;
  height: 30px;
  margin-top: 3px;
  margin-right: 20px;
  margin-bottom: 6px;

  background-color: dodgerblue;
  color: white;
  font-weight: bolder;
  font-size: 13px;
  border-radius: 3px;
  border: none;
}

.button-edit {
  background-color: forestgreen;
}

.button-delete {
  background-color: firebrick;
}
</style>
