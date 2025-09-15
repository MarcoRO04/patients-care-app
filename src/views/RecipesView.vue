<script>
import RecipeCard from '@/components/RecipeCard.vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faBell, faPersonCircleCheck, faPlus, faXmark } from '@fortawesome/free-solid-svg-icons'

export default {
  name: 'RecipesView',

  mounted() {
    let recipes = localStorage.getItem('recipes')
    this.recipes_list = recipes === null ? [] : JSON.parse(recipes)
    this.recalculate_distance_between_prescriptions()
    this.count_red_status_recipes()
    this.check_renewed_today()
  },
  components: {
    FontAwesomeIcon,
    RecipeCard,
  },

  data() {
    return {
      recipes_list: [],
      status_btn: 0,
      renewed_recipes_list_button: 0,
      searched_name: '',
      show_red_status_recipe_alert: false,
      red_recipes_counter: 0,
      text_popUp_alert_recipe: '',
    }
  },
  methods: {
    faPersonCircleCheck() {
      return faPersonCircleCheck
    },
    faBell() {
      return faBell
    },
    faXmark() {
      return faXmark
    },
    faPlus() {
      return faPlus
    },
    check_recipe(r) {
      return (
        r.patient.name.length > 0 &&
        (r.status === this.status_btn.toString() || this.status_btn === 0 || this.status_btn === 4)
      )
    },
    change_filter_button_status() {
      this.status_btn++
      if (this.status_btn === 0) {
        document.getElementById('status_filter_btn').style.backgroundColor = 'lightgrey'
        document.getElementById('status_filter_btn').style.color = 'black'
        document.getElementById('status_filter_btn').textContent = 'Toate'
      }
      if (this.status_btn === 1) {
        document.getElementById('status_filter_btn').style.backgroundColor = 'red'
        document.getElementById('status_filter_btn').style.color = 'black'
        document.getElementById('status_filter_btn').textContent = 'Roșu'
      }
      if (this.status_btn === 2) {
        document.getElementById('status_filter_btn').style.backgroundColor = 'orange'
        document.getElementById('status_filter_btn').style.color = 'black'
        document.getElementById('status_filter_btn').textContent = 'Portocaliu'
      }
      if (this.status_btn === 3) {
        document.getElementById('status_filter_btn').style.backgroundColor = 'greenyellow'
        document.getElementById('status_filter_btn').style.color = 'black'
        document.getElementById('status_filter_btn').textContent = 'Verde'
      }
      if (this.status_btn === 4) {
        document.getElementById('status_filter_btn').style.backgroundColor = '#95aac3'
        document.getElementById('status_filter_btn').style.color = 'black'
        document.getElementById('status_filter_btn').textContent = 'Toate'
        this.status_btn = 0
      }
    },
    recalculate_distance_between_prescriptions() {
      let status_changed_cnt = 0
      for (let recipe in this.recipes_list) {
        //the difference between the future prescription and the current date, converted from milliseconds to days, and from number to string
        const date_difference = Math.round(
          (Date.parse(this.recipes_list[recipe].future_prescription_date) - Date.now()) / 8.64e7,
        ).toString()
        //if the date obtained is different, then modify the status
        if (this.recipes_list[recipe].distance_between_prescriptions !== date_difference) {
          status_changed_cnt++
          this.recipes_list[recipe].distance_between_prescriptions = date_difference
          if (this.recipes_list[recipe].distance_between_prescriptions < 0) {
            this.recipes_list[recipe].status = '1'
          } else if (
            this.recipes_list[recipe].distance_between_prescriptions >= 0 &&
            this.recipes_list[recipe].distance_between_prescriptions <= 7
          ) {
            this.recipes_list[recipe].status = '1'
          } else if (
            this.recipes_list[recipe].distance_between_prescriptions >= 8 &&
            this.recipes_list[recipe].distance_between_prescriptions <= 14
          ) {
            this.recipes_list[recipe].status = '2'
          } else {
            this.recipes_list[recipe].status = '3'
          }
        }
      }
      if (status_changed_cnt > 0) {
        localStorage.setItem('recipes', JSON.stringify(this.recipes_list))
      }
    },
    filter_list_by_patient_name(recipe) {
      return (
        recipe.patient.name.includes(this.searched_name) ||
        recipe.doctor.name.includes(this.searched_name)
      )
    },
    goToAddNewRecipeView() {
      this.$router.push(`/add_new_recipe`)
    },
    count_red_status_recipes() {
      for (let r in this.recipes_list) {
        if (this.recipes_list[r].status === '1') {
          this.red_recipes_counter++
        }
      }
      if (this.red_recipes_counter === 1) {
        this.text_popUp_alert_recipe = 'rețetă'
      } else {
        this.text_popUp_alert_recipe = 'rețete'
      }
    },
    showAlertModal() {
      this.show_red_status_recipe_alert = !this.show_red_status_recipe_alert;
    },
    show_renewed_recipes_list(){
      this.renewed_recipes_list_button++
      if (this.renewed_recipes_list_button === 0) {
        document.getElementById('renewed_recipes_list_btn').style.backgroundColor = 'red'
      }
      if (this.renewed_recipes_list_button === 1) {
        document.getElementById('renewed_recipes_list_btn').style.backgroundColor = 'green'
      }
      if (this.renewed_recipes_list_button === 2) {
        document.getElementById('renewed_recipes_list_btn').style.backgroundColor = 'red'
        this.renewed_recipes_list_button = 0;
      }
    },
    formatDate(date_string) {
      let date = new Date(date_string)
      let formatted_date = ''
      if (((date.getMonth() + 1) < 10) && (date.getDate() >= 10)) {
        formatted_date = `${date.getDate()}/0${date.getMonth() + 1}/${date.getFullYear()}`
      } else if (date.getDate() < 10 && date.getMonth() + 1 >= 10) {
        formatted_date = `0${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`
      } else if ((date.getDate() < 10 && date.getMonth() + 1 < 10)){
        formatted_date = `0${date.getDate()}/0${date.getMonth() + 1}/${date.getFullYear()}`
      }else{
        formatted_date = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`
      }
      return formatted_date
    },
    check_renewed_today() {
      let unformatted_current_date = Date.now();
      for (let r in this.recipes_list) {
        if (this.recipes_list[r].last_prescription_dates.length > 1){
          if (this.formatDate(this.recipes_list[r].last_prescription_dates[this.recipes_list[r].last_prescription_dates.length - 1]) !== this.formatDate(unformatted_current_date)) {
            console.log(this.recipes_list[r].patient.name + " " + this.recipes_list[r].doctor.name)
            this.recipes_list[r].renewed_today = 0
          }
        }
      }
      localStorage.setItem('recipes', JSON.stringify(this.recipes_list))
    },
  },
}
</script>

<template>
  <div class="recipes-view-box">
    <div class="filter-options">
      <input type="text" class="search-patient" v-model="this.searched_name" placeholder="Caută pacient sau doctor" />
      <div class="buttons">
        <button class="status-filter-button" id="status_filter_btn" @click="change_filter_button_status" style="background-color: #95aac3; color: black; font-size: 12px">Toate</button>
        <button class="add-recipe-button" @click="goToAddNewRecipeView" ><FontAwesomeIcon :icon="faPlus()" /></button>
        <button v-show="red_recipes_counter > 0" style="border: none; background-color: transparent; color: red" @click="showAlertModal"><FontAwesomeIcon :icon="faBell()" />{{red_recipes_counter}}</button>
        <button id="renewed_recipes_list_btn" @click="this.show_renewed_recipes_list()" style="background-color: red; border-radius: 50px; height: 80px"><FontAwesomeIcon :icon="faPersonCircleCheck()" style="font-size: 30px; color: limegreen;"/></button>
      </div>
    </div>


    <div v-if="this.recipes_list.length > 0" class="recipes-list">
      <RecipeCard
        style="margin-bottom: 10px"
        v-show="check_recipe(recipe) && filter_list_by_patient_name(recipe)"
        v-for="recipe in recipes_list.sort(
          (recipe1, recipe2) =>
            Number(recipe1.distance_between_prescriptions) -
            Number(recipe2.distance_between_prescriptions),
        )"
        :key="recipe"
        :id="recipe.id"
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

  <div id="recipes-alert" v-show="red_recipes_counter > 0 && show_red_status_recipe_alert === true">
    <div class="recipes-alert-modal-content">
      <div class="alert-header">
        <h2 class="alert-header-content">Alertă</h2>
        <button class="button-cancel-x" @click="showAlertModal"><FontAwesomeIcon :icon="faXmark()" /></button>
      </div>
      <p style="margin: 20px 2px 10px 2px; color: black; font-size: 20px">
        Aveți {{ this.red_recipes_counter }} {{ this.text_popUp_alert_recipe }} cu status roșu!
      </p>
      <button class="button-ok" @click="showAlertModal">Ok</button>
    </div>
  </div>
</template>

<style scoped>
.alert-header {
  background-color: #cf2e2e;
  position: relative;
  display: flex;
  width: 100%;
  height: 38px;
}
.alert-header-content {
  width: 100%;
  padding-left: 70px;
  color: white;
  font-weight: bold;
}
.button-cancel-x {
  background-color: transparent;
  color: white;
  margin-right: 0;
}
#recipes-alert {
  text-align: center;
  /*display: none; Hidden by default*/
  position: fixed; /* Stay in place */
  z-index: 1; /* Sit on top */
  left: 0;
  top: 0;
  width: 100%; /* Full width */
  height: 100%; /* Full height */
  overflow: auto; /* Enable scroll if needed */
  padding-top: 200px;
}
.recipes-alert-modal-content {
  background-color: #fefefe;
  margin: 5% auto 15% auto; /* 5% from the top, 15% from the bottom and centered */
  border: 1px solid black;
  width: 80%; /* Could be more or less, depending on screen size */
}
.button-ok {
  background-color: #cf2e2e;
  color: white;
  margin-right: 10px;
  margin-left: 10px;
  margin-bottom: 20px;
}
button {
  width: 80px;
  height: 33px;
  margin-top: 3px;
  margin-right: 20px;
  margin-bottom: 6px;

  background-color: white;
  color: black;
  font-weight: bolder;
  font-size: 19px;
  border-radius: 3px;
  border: none;
  opacity: 1;
}
button:hover {
  opacity: 0.7;
}

.recipes-view-box {
  background-color: #ddd;
  height: 100vh;
  padding: 20px;
  /*margin: 0 200px 0 200px;*/
}
.recipes-list{
  overflow: auto;
  height: 82%;
}
.filter-options {
  display: flex;
  /*position: relative;*/
}

.buttons{
  display: flex;
}
.status-filter-button {
  width: 75px;
  height: 38px;
  margin: 2px 4px 2px 15px;
  font-size: 12px;
  font-weight: bold;
  border-radius: 10px;
  /*border: 1.5px solid black;*/
}
.add-recipe-button {
  width: 75px;
  height: 38px;
  margin-right: 2px;
  margin-left: 5px;
  float: right;
  font-size: 20px;
  font-weight: bold;
  border-radius: 10px;
  /*border: 1.5px solid black;*/
  padding: 3px 3px 3px 3px;
}
.search-patient {
  background: white url('assets/search-icon.svg') no-repeat;
  width: 80%;
  height: 45px;
  font-size: 18px;
  padding: 12px 5px 12px 45px;
  border: none;
  margin-bottom: 35px;
  border-radius: 10px;
  margin-right: 15px;
}

.search-patient:hover{
  opacity: 0.7;
}

@media (max-width: 530px) {
  .search-patient {
    margin-bottom: 20px;
    width: 100%;
    height: 45px;
    font-size: 18px;
    padding: 12px 5px 12px 45px;
  }
  .recipes-view-box{
    padding: 25px 10px 10px 10px;
  }

  .filter-options {
    display: block;
  }

  .buttons{
    place-content: center;
    margin-bottom: 15px;
  }
}

@media (min-width: 530px) {

}
</style>
