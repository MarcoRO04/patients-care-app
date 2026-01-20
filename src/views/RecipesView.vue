<!--This is the main view of the application, and it contains a list of cards
(multiple RecipeCard.vue) and a menu with some operations that you can make on the list.
E.g.
- searching a prescription by patient name or doctor name (the search bar)
- filtering prescriptions by status, showing just the prescriptions with status red, or orange, or green (the gray button 'Toate')
- adding a new prescription - it will redirect the user to AddNewRecipeView.vue (the '+' button)
- viewing the prescriptions that were renewed today ('the green man with a check' button).
  The renewal procedure is described in RecipeCard.vue

  Besides this, there are also some user level operations that can be done
  from this view, like logging out or seeing the user profile (not yet implemented)

  NOTE: recipe and prescription terms are used interchangeably
  -->
<script>
import RecipeCard from '@/components/RecipeCard.vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import {
  faBell,
  faCircleUser,
  faPersonCircleCheck,
  faPlus,
  faRightFromBracket,
  faXmark,
} from '@fortawesome/free-solid-svg-icons'

export default {
  name: 'RecipesView',
  components: {
    FontAwesomeIcon,
    RecipeCard,
  },
  data() {
    return {
      recipes_list: [],
      status_btn: 0,
      searched_name: '',
      show_red_status_recipe_alert: false,
      text_popUp_alert_recipe: '',
      renewed_recipes_button: false,
      renewed_recipes_counter: 0,
      red_recipes_counter: 0,
      cardsNumberFlag: true,
    }
  },
  mounted() {
    this.getRecipesListFromBE()
    // console.log(this.recipes_list)
    this.emitter.on('delete_operation', (event) => this.handleDelete(event.id)) // delete or edit
  },
  updated() {
    // console.log(this.recipes_list) /*test if the list updates after I delete a recipe*/
  },
  methods: {
    /*When a recipe is deleted, the RecipeCard of that recipe won't be deleted until a page refresh.
     * So, to solve this problem, using the emitter object, we listen for the deletion event and filter out
     * the deleted recipe by the id received from emitter.emit() and then we delete the recipe.*/
    handleDelete(id) {
      this.recipes_list = this.recipes_list.filter((recipe) => recipe.id !== id)

      for (let index = 0; index < this.recipes_list; index++) {
        if (this.recipes_list[index].id === id) {
          this.recipes_list.splice(index, 1)
          break
        } else {
          console.log("Recipe with that id wasn't found\n")
        }
      }
    },
    /*icon getter functions*/
    faRightFromBracket() {
      return faRightFromBracket
    },
    faCircleUser() {
      return faCircleUser
    },
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
    /*get the list of recipes from the BE*/
    getRecipesListFromBE() {
      fetch('http://localhost:3001/recipes', {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },

        /*Preflight si apoi raspunsul - e inca in pending*/
      })
        .then((rsp) => {
          return rsp.json()
        })
        .then((response) => {
          // console.log(response['list'])
          for (let i = 0; i < response['list'].length; i++) {
            this.recipes_list[i] = response['list'][i]
          }
          // console.log(this.recipes_list)
          // this.recipes_list = response['list']
        })
        .catch(() => {
          alert('backend error')
        })
    },
    /*check the recipe and don't shoe the recipes that don't have a patient name (could be also doctor, but patient name it's enough)
      Depending on the recipe status button (the gray button 'Toate'), show the recipes that have that status (green/red/orange/all)
    * */
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
    searchRecipeInListByPatientName(recipe) {
      return (
        recipe.patient.name.includes(this.searched_name) ||
        recipe.doctor.name.includes(this.searched_name)
      )
    },
    count_red_recipes() {
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
      this.show_red_status_recipe_alert = !this.show_red_status_recipe_alert
    },
    show_renewed_recipes_list() {
      // console.log(this.renewed_recipes_button)
      this.renewed_recipes_button = !this.renewed_recipes_button
    },
    formatDate(date_string) {
      let date = new Date(date_string)
      let formatted_date = ''
      if (date.getMonth() + 1 < 10 && date.getDate() >= 10) {
        formatted_date = `${date.getDate()}/0${date.getMonth() + 1}/${date.getFullYear()}`
      } else if (date.getDate() < 10 && date.getMonth() + 1 >= 10) {
        formatted_date = `0${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`
      } else if (date.getDate() < 10 && date.getMonth() + 1 < 10) {
        formatted_date = `0${date.getDate()}/0${date.getMonth() + 1}/${date.getFullYear()}`
      } else {
        formatted_date = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`
      }
      return formatted_date
    },
    /*check if the recipe was renewed today. If it was display it. Also checked that it's not a recipe that was added today*/
    check_renewed_today(r) {
      let unformatted_current_date = Date.now()
      if (r.prescription_dates.length > 1) {
        let last_date_index = r.prescription_dates.length - 1
        // console.log(r.prescription_dates)
        if (
          this.formatDate(r.prescription_dates[last_date_index]) ===
          this.formatDate(unformatted_current_date)
        ) {
          // console.log(r.patient.name + " " + r.doctor.name)
          return true
        }
      }
      return false
    },
    /*a renewed recipe is a recipe in which the last date in the table of previous prescription dates, is today
     * This function is used to display the renewed recipes in the renewed recipe pop-up.*/
    count_renewed_recipes() {
      let renewed_recipes_counter = 0
      for (let r in this.recipes_list) {
        if (this.check_renewed_today(this.recipes_list[r])) {
          renewed_recipes_counter++
        }
      }
      return renewed_recipes_counter
    },
    /*instead of having three separate functions, it's better to have one in which you pass the status
     * This function is used to display the messages that "For the moment are no recipes with status x"
     * There may be other recipes with other statuses, for example recipes with orange and green statuses, but no recipes
     * with red statuses*/
    count_recipes_by_status(status) {
      let recipes_counter = 0
      for (let r in this.recipes_list) {
        if (this.recipes_list[r].status === status) {
          recipes_counter++
        }
      }
      return recipes_counter
    },
    goToAddNewRecipeView() {
      this.$router.push(`/add_new_recipe`)
    },
    logout() {
      this.emitter.emit('login_process', { my_login: false })
    },
  },
}
</script>

<template>
  <!-- Menu and the list of recipes-->
  <div class="recipes-view-box">
    <!--User operations-->
    <div class="user-div">
      <button class="user-profile-btn"><FontAwesomeIcon :icon="faCircleUser()" /> Profil</button>
      <button class="logout-btn" @click="logout">
        <FontAwesomeIcon :icon="faRightFromBracket()" />Logout</button
      ><br />
    </div>
    <!--Filter options-->
    <div class="filter-options">
      <input
        type="text"
        class="search-patient"
        v-model="this.searched_name"
        placeholder="Caută pacient sau doctor"
      />
      <div class="buttons">
        <button
          class="status-filter-button"
          id="status_filter_btn"
          @click="change_filter_button_status"
          style="background-color: #95aac3; color: black; font-size: 12px"
        >
          Toate
        </button>
        <button class="add-recipe-button" @click="goToAddNewRecipeView">
          <FontAwesomeIcon :icon="faPlus()" />
        </button>
        <button
          v-show="red_recipes_counter > 0"
          style="border: none; background-color: transparent; color: red"
          @click="showAlertModal"
        >
          <FontAwesomeIcon :icon="faBell()" />{{ red_recipes_counter }}
        </button>
        <button
          id="renewed_recipes_list_btn"
          @click="this.show_renewed_recipes_list()"
          style="
            background-color: white;
            border-radius: 10px;
            height: 38px;
            width: 75px;
            margin-left: 8px;
          "
        >
          <FontAwesomeIcon
            :icon="faPersonCircleCheck()"
            style="font-size: 30px; color: limegreen"
          />
        </button>
      </div>
    </div>

    <!-- The list of RecipeCards-->
    <!--v-show="check_recipe(recipe) && searchRecipeInListByPatientName(recipe)" -->
    <div v-if="this.recipes_list.length > 0" class="recipes-list">
      <!--there may be no x status recipes in the list for the moment, display a message if there are none-->
      <p v-if="count_recipes_by_status('1') === 0 && this.status_btn === 1" style="font-size: 18px">
        Momentan nu aveți nicio rețetă cu status roșu.
      </p>
      <p
        v-else-if="count_recipes_by_status('2') === 0 && this.status_btn === 2"
        style="font-size: 18px"
      >
        Momentan nu aveți nicio rețetă cu status portocaliu.
      </p>
      <p
        v-else-if="count_recipes_by_status('3') === 0 && this.status_btn === 3"
        style="font-size: 18px"
      >
        Momentan nu aveți nicio rețetă cu status verde.
      </p>
      <div v-else>
        <div
          v-for="(recipe, index) in recipes_list.sort(
            (recipe1, recipe2) =>
              Number(recipe1.distance_between_prescriptions) -
              Number(recipe2.distance_between_prescriptions),
          )"
          :key="recipe"
        >
          <RecipeCard
            id="filter-card"
            v-if="check_recipe(recipe) && searchRecipeInListByPatientName(recipe)"
            style="margin-bottom: 10px"
            :obj="recipe"
            :index="index"
          >
          </RecipeCard>
        </div>
      </div>
    </div>

    <!--If there are no recipes, show specifically the message depending on the filter button -->
    <div v-else>
      <p v-if="this.status_btn === 1" style="font-size: 18px">
        Momentan nu aveți nicio rețetă cu status roșu.
      </p>
      <p v-else-if="this.status_btn === 2" style="font-size: 18px">
        Momentan nu aveți nicio rețetă cu status portocaliu.
      </p>
      <p v-else-if="this.status_btn === 3" style="font-size: 18px">
        Momentan nu aveți nicio rețetă cu status verde.
      </p>
      <p v-else style="font-size: 18px">Momentan nu aveți nicio rețetă salvată.</p>
    </div>
  </div>

  <!-- Pop-up with the renewed recipes-->
  <div id="renewed-recipes-popUp" v-show="renewed_recipes_button === true">
    <div class="renewed-recipes-modal-content">
      <div class="renewed-recipes-header">
        <h2 class="renewed-recipes-header-content">Rețete reînnoite azi</h2>
        <button class="button-cancel-x" @click="show_renewed_recipes_list">
          <FontAwesomeIcon :icon="faXmark()" />
        </button>
      </div>
      <p v-if="count_renewed_recipes() === 0" style="margin-top: 15px">
        Momentan nu ați reînnoit nicio rețetă...
      </p>
      <div v-else style="overflow: auto; padding: 10px">
        <RecipeCard
          v-show="check_renewed_today(recipe)"
          v-for="recipe in recipes_list.sort(
            (recipe1, recipe2) =>
              Number(recipe1.distance_between_prescriptions) -
              Number(recipe2.distance_between_prescriptions),
          )"
          :key="recipe"
          :obj="recipe"
        ></RecipeCard>
        <!-- creating an RecipeCard for every recipe in the list and passing the recipe details from the list th  -->
      </div>
    </div>
  </div>

  <!-- Pop-up to alert the user about the red status recipes-->
  <div id="recipes-alert" v-show="red_recipes_counter > 0 && show_red_status_recipe_alert === true">
    <div class="recipes-alert-modal-content">
      <div class="alert-header">
        <h2 class="alert-header-content">Alertă</h2>
        <button class="button-cancel-x" @click="showAlertModal">
          <FontAwesomeIcon :icon="faXmark()" />
        </button>
      </div>
      <p style="margin: 20px 2px 10px 2px; color: black; font-size: 20px">
        Aveți {{ this.red_recipes_counter }} {{ this.text_popUp_alert_recipe }} cu status roșu!
      </p>
      <button class="button-ok" @click="showAlertModal">Ok</button>
    </div>
  </div>
</template>

<style scoped>
.user-div {
  background-color: transparent;
  padding-bottom: 25px;
}

.user-profile-btn {
  background-color: white;
  font-size: 16px;
  border-radius: 10px;
  height: 40px;
  width: 85px;
}

.logout-btn {
  background-color: white;
  font-size: 15px;
  border-radius: 10px;
  height: 40px;
  width: 85px;
  /*right: 0;*/
  position: absolute;
}
#renewed-recipes-popUp {
  text-align: center;
  /*display: none; Hidden by default*/
  position: fixed; /* Stay in place */
  z-index: 1; /* Sit on top */
  left: 0;
  top: 0;
  width: 100%; /* Full width */
  height: 100%; /* Full height */
  background-color: rgb(0, 0, 0); /* Fallback color */
  background-color: rgba(0, 0, 0, 0.4); /* Black w/ opacity */
  /*overflow: auto;*/ /* Enable scroll if needed */
  -webkit-animation-name: fadeIn; /* Fade in the background */
  -webkit-animation-duration: 0.4s;
  animation-name: fadeIn;
  animation-duration: 0.4s;
}

.renewed-recipes-modal-content {
  position: fixed;
  bottom: 0;
  background-color: #ddd;
  border-top-left-radius: 15px;
  border-top-right-radius: 15px;
  width: 100%; /* Could be more or less, depending on screen size */
  height: 90%;
  -webkit-animation-name: slideIn;
  -webkit-animation-duration: 0.4s;
  animation-name: slideIn;
  animation-duration: 0.4s;
}

.renewed-recipes-header {
  background-color: forestgreen;
  position: relative;
  display: flex;
  width: 100%;
  height: 38px;
  border-top-left-radius: 15px;
  border-top-right-radius: 15px;
}

.renewed-recipes-header-content {
  width: 100%;
  padding-left: 55px;
  color: white;
  font-weight: bold;
}

@-webkit-keyframes slideIn {
  from {
    bottom: -500px;
    opacity: 0;
  }
  to {
    bottom: 0;
    opacity: 1;
  }
}

@keyframes slideIn {
  from {
    bottom: -500px;
    opacity: 0;
  }
  to {
    bottom: 0;
    opacity: 1;
  }
}

@-webkit-keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/*----------------------------------*/
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
  background-color: rgb(0, 0, 0); /* Fallback color */
  background-color: rgba(0, 0, 0, 0.4); /* Black w/ opacity */
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
  border-radius: 10px;
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
.recipes-list {
  overflow: auto;
  height: 80%; /*over 77% is good */
}
.filter-options {
  display: flex;
  /*position: relative;*/
}

.buttons {
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

.search-patient:hover {
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
  .recipes-view-box {
    padding: 25px 10px 10px 10px;
  }

  .filter-options {
    display: block;
  }

  .buttons {
    place-content: center;
    margin-bottom: 15px;
  }
}

@media (min-width: 530px) {
}
</style>
