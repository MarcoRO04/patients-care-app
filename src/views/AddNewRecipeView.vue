<script>
export default {
  name: 'AddNewRecipeView',
  mounted() {
    let recipes = localStorage.getItem('recipes')
    let patients = localStorage.getItem('patients')
    let doctors = localStorage.getItem('doctors')
    let recipe_duration = localStorage.getItem('recipe_duration')

    if(doctors === "") {
      this.doctors_list = [{"name":"Dr. Mihai Elena","specialization":"Neurolog"},
        {"name":"Dr. Ana Azuga","specialization":"Psihiatru"},
        {"name":"Dr. Maria Blandiana","specialization":"Neurolog"},
        {"name":"Dr. Alin Mircea","specialization":"Psihiatru"}]
      localStorage.setItem('doctors', JSON.stringify(this.doctors_list))
    } else if(doctors === null) {
      this.doctors_list = [{"name":"Dr. Mihai Elena","specialization":"Neurolog"},
        {"name":"Dr. Ana Azuga","specialization":"Psihiatru"},
        {"name":"Dr. Maria Blandiana","specialization":"Neurolog"},
        {"name":"Dr. Alin Mircea","specialization":"Psihiatru"}]
      localStorage.setItem('doctors', JSON.stringify(this.doctors_list))
    } else{
      this.doctors_list = JSON.parse(doctors)
    }
    if(patients === "") {
      this.patients_list = [{"name":"Zora Chelici"},{"name":"Mirabela Jovic"},{"name":"Alin Mircea"},{"name":"Maria Popescu"}]
      localStorage.setItem('patients', JSON.stringify(this.patients_list))
    } else if(patients === null) {
      this.patients_list = [{"name":"Zora Chelici"},{"name":"Mirabela Jovic"},{"name":"Alin Mircea"},{"name":"Maria Popescu"}]
      localStorage.setItem('patients', JSON.stringify(this.patients_list))
    } else{
      this.patients_list = JSON.parse(patients)
    }
    if(recipe_duration === "") {
      this.recipe_periods_list = ["1 lună","2 luni","3 luni"]
      localStorage.setItem('recipe_duration', JSON.stringify(this.recipe_periods_list))
    } else if(recipe_duration === null) {
      this.recipe_periods_list = ["1 lună","2 luni","3 luni"]
      localStorage.setItem('recipe_duration', JSON.stringify(this.recipe_periods_list))
    } else{
      this.recipe_periods_list = JSON.parse(recipe_duration)
    }

    this.recipes_list = (recipes === null) ? [] : JSON.parse(recipes)

    console.log(this.generateID())
  },
  data() {
    return {
      recipe: {
        id:'',
        patient: {
          name: '',
        },
        doctor: {
          name: '',
          specialization: '',
        },
        future_prescription_date: '',
        current_prescription_date: '',
        recipe_duration: '',
        last_prescription_dates: [],
        status: '',
        distance_between_prescriptions: '',
      },
      recipes_list: [],
      doctors_list: [],
      patients_list: [],
      recipe_periods_list: [],
      submission_ok: false,
    }
  },
  methods: {
    goToRecipesView() {
      this.$router.push(`/recipes`)
    },
    generateID(){
      return new Date().getTime().toString();
    },
    saveRecipe() {
      this.calculateFuturePrescriptionDate()
      this.recipe.last_prescription_dates.push(this.recipe.current_prescription_date)
      this.recipe.id = this.generateID()
      //saving also the doctor's specialization
      for (let i = 0; i < this.doctors_list.length; i++) {
        if (this.recipe.doctor.name === this.doctors_list[i].name) {
          this.recipe.doctor.specialization = this.doctors_list[i].specialization
          break;
        }
      }
      let new_recipe = this.recipe
      this.recipes_list.push(new_recipe)
      localStorage.setItem('recipes', JSON.stringify(this.recipes_list))
      this.goToRecipesView()
    },
    check_submission() {
      //all field have to be completed, to be true
      this.submission_ok =
        this.recipe.patient.name.length !== 0 &&
        this.recipe.doctor.name.length !== 0 &&
        this.recipe.recipe_duration.length !== 0 &&
        this.recipe.current_prescription_date.length !== 0 &&
        this.calculateFuturePrescriptionDate() &&
        this.check_recipe_existence()
    },
    calculateFuturePrescriptionDate() {
      // I want that format in the combo box with "1 luna", "2 luni", that's why I want to do this.
      let recipe_period = [];
      recipe_period = this.recipe.recipe_duration.split(" ")

      //The future prescription date is the current date in milliseconds + the recipe duration converted in milliseconds
      this.recipe.future_prescription_date = (new Date(Date.parse(this.recipe.current_prescription_date)
                                                        + recipe_period[0] * 30 * 24 * 60 * 60 * 1000))

      console.log(this.recipe.future_prescription_date)

      // I could do it a lot simpler by multiplying 30 to the recipe_duration.

      // The current method will be more useful for RecipeView.vue where I have to calculate it each day.
      if(Date.parse(this.recipe.future_prescription_date) > Date.now()) {

        const dates_difference = Date.parse(this.recipe.future_prescription_date) - Date.now()
        const day = 8.64e7 // how many milliseconds in a day

        //set the initial difference between dates (it will be changed later, every day)
        this.recipe.distance_between_prescriptions = Math.round(dates_difference / day)
        console.log(`${this.recipe.distance_between_prescriptions} days`)
        // the status should be always '3'
        // but if, idk, the recipe was prescribed 2-3 weeks ago, we check it, and put the status accordingly
        if (this.recipe.distance_between_prescriptions >= 0 && this.recipe.distance_between_prescriptions <= 7) {
          console.log("rosu")
          this.recipe.status = "1"
        }
        else if (this.recipe.distance_between_prescriptions >= 8 && this.recipe.distance_between_prescriptions <= 14) {
          console.log("portocaliu")
          this.recipe.status = "2"
        } else{
          console.log("verde")
          this.recipe.status = "3"
        }
        return true;
      } else{
        alert("Nu poți adăuga o rețetă unde data următoare de prescriere a rețetei este mai mică decât ziua curentă!")
        return false;
      }
    },
    check_recipe_existence(){
      for (let r in this.recipes_list) {
        if (this.recipe.patient.name === this.recipes_list[r].patient.name) {
          if(this.recipe.doctor.name === this.recipes_list[r].doctor.name) {
            alert("Nu poți să ai două rețete de același tip la același medic")
            return false;
          }
        }
      }
    }
  },
}
</script>

<template>
  <div id="add_recipe_form" class="add_recipe_form">
    <label for="patients">Selectează pacient:</label>
    <br />
    <select name="patients" id="patients" v-model="this.recipe.patient.name" @change="check_submission">
      <option></option>
      <option v-for="(patient, index) in this.patients_list" :key="index">{{ patient.name }}</option>
    </select>

    <br />

    <label for="doctors">Selectează doctor:</label>
    <br />
    <select name="doctors" id="doctors" v-model="this.recipe.doctor.name" @change="check_submission">
      <option></option>
      <option v-for="(doctor, index) in this.doctors_list" :key="index">{{ doctor.name }}</option>
    </select>

    <br />

    <label for="prescription_date">Alege data prescrierii rețetei:</label>
    <br />
    <input
      type="date"
      id="prescription_date"
      v-model="this.recipe.current_prescription_date"
      @change="check_submission"
    />
    <br />

    <label for="recipe_duration">Selectează durata rețetei:</label>
    <br />
    <select
      name="recipe_duration"
      id="recipe_duration"
      v-model="this.recipe.recipe_duration"
      @change="check_submission"
    >
      <option></option>
      <option v-for="(duration, index) in this.recipe_periods_list" :key="index">{{ duration }}</option>
    </select>

    <br />
    <br />

    <button style="margin-right: 16px"
            @click="saveRecipe"
            :disabled="(this.submission_ok === false)">
      Salvare
    </button>

    <RouterLink to="/recipes">Anulare</RouterLink>
    <br />
    <br />
  </div>
</template>

<style scoped>
.add_recipe_form {
  width: 300px;
  margin: 100px auto;
  padding: 5px 10px;
  border: 2px solid black;
  background-color: white;
  color: black;
}
</style>
