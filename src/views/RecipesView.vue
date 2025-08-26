<script>
import RecipeCard from '@/components/RecipeCard.vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faPlus, faXmark } from '@fortawesome/free-solid-svg-icons'

export default {
  name: 'RecipesView',
  computed: {
  },
  mounted() {
    let recipes = localStorage.getItem('recipes')
    this.recipes_list = recipes === null ? [] : JSON.parse(recipes)
    this.recalculate_distance_between_prescriptions()
    this.count_red_status_recipes()
  },
  components: {
    FontAwesomeIcon,
    RecipeCard,
  },

  data() {
    return {
      recipes_list: [],
      status_btn: 0,
      searched_name: '',
      show_red_status_recipe_alert: true,
      red_recipes_counter: 0,
      text_popUp_alert_recipe: '',
    }
  },
  methods: {
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
        document.getElementById('status_filter_btn').style.backgroundColor = 'lightgrey'
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
      this.show_red_status_recipe_alert = false
    },
  },
}
</script>

<template>
  <div class="recipe-view-box">
    <div class="filter-options">
      <input type="text" class="search-patient" v-model="this.searched_name" placeholder="Caută pacient sau doctor" />
      <button
        class="status-filter-button"
        id="status_filter_btn"
        @click="change_filter_button_status"
        style="background-color: lightgrey; color: black; font-size: 12px"
      >
        Toate
      </button>
      <button class="add-recipe-button" @click="goToAddNewRecipeView">
        <FontAwesomeIcon :icon="faPlus()" />
      </button>
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
      <div class="header">
        <h2 class="header-content">Alertă</h2>
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
.header {
  background-color: #cf2e2e;
  position: relative;
  display: flex;
  width: 100%;
  height: 38px;
}
.header-content {
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
  opacity: 0.85;
}
button:hover {
  opacity: 1;
}
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
