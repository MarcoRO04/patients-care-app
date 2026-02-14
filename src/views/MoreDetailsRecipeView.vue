<!--This view was created to display more details about a recipe, like the previous renewal dates of the recipe, the duration
  and the doctor specialization. More information regarding prescription plan and pills name and quantity will be added in the future.
    NOTE: recipe and prescription terms are used interchangeably
  -->

<script>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
/* add fontawesome core */
import { library } from '@fortawesome/fontawesome-svg-core'

/* import all the icons in Free Solid, Free Regular, and Brands styles */
import { faAngleLeft, faRotate, fas, faXmark } from '@fortawesome/free-solid-svg-icons'
import { far } from '@fortawesome/free-regular-svg-icons'
import { fab } from '@fortawesome/free-brands-svg-icons'

library.add(fas, far, fab)

export default {
  name: 'MoreDetailRecipe',
  computed: {},
  components: { FontAwesomeIcon },
  mounted() {
    this.initializeRecipe()
  },
  data() {
    return {
      recipe: {
        id: this.$route.params.id,
        patient: {
          name: '',
        },
        doctor: {
          name: '',
          specialization: '',
        },
        future_prescription_date: '',
        recipe_duration: '',
        prescription_dates: [],
        status: '',
        distance_between_prescriptions: '',
      },
      showModal: false,
      renewConfirmationMenu: false,
    }
  },
  methods: {
    /*icon getter functions*/
    faRotate() {
      return faRotate
    },
    faXmark() {
      return faXmark
    },
    faAngleLeft() {
      return faAngleLeft
    },
    /*Initializing the recipe from localStorage (it was set by the RecipeCard)*/
    initializeRecipe() {
      //read the recipe (sent by RecipeCard.vue) from localStorage and initialize de recipe object
      let r = localStorage.getItem('recipe')
      if (r) {
        this.recipe = JSON.parse(r)
        // console.log(this.recipe)
      }
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
    /*send an edit request with the recipe id in the path and the edited recipe in the body of the request (for the recipe renewal)*/
    sendEditRequestToBE(shortFormRecipe) {
      fetch(`http://localhost:3001/recipes/${this.recipe.id}`, {
        method: 'PUT',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(shortFormRecipe), // {recipe: this.recipe}
      })
        .then((d) => {
          // console.log(d.status)
          return d.json()
        })
        .then((response) => {
          if (response['result']) {
            alert('Update ok!')
          } else {
            alert('Failed update recipe')
          }
        })
        .catch((error) => {
          console.log(error)
        })
    },
    /*To renew a recipe means changing the current date to be today
    (the future date calculation will be handled by the BE, when the list of recipes is retrieved*/
    renewRecipe() {
      this.recipe.recipe_duration.split(' ')
      this.recipe.prescription_dates.push(new Date(Date.now()))

      let shortFormRecipe = {}
      shortFormRecipe.id = this.recipe.id
      shortFormRecipe.doctor = this.recipe.doctor
      shortFormRecipe.patient = this.recipe.patient
      shortFormRecipe.recipe_duration = this.recipe.recipe_duration
      shortFormRecipe.prescription_dates = this.recipe.prescription_dates

      this.sendEditRequestToBE(shortFormRecipe)
      this.goToRecipesView()
    },

    /*Going back to RecipesView means firstly removing the recipe from localStorage
     and then pushing the RecipesView path*/
    goToRecipesView() {
      //deleting the recipe entry from localStorage when leaving the view
      localStorage.removeItem('recipe')
      this.$router.push(`/recipes`)
    },
    showRenewConfirmationMenu() {
      this.renewConfirmationMenu = !this.renewConfirmationMenu
    },
  },
}
</script>
<template>
  <div class="more-details-recipe">
    <div class="more-details-header">
      <h3 style="font-weight: bold">Detalii rețetă</h3>
      <button class="button-cancel-x" @click="goToRecipesView">
        <FontAwesomeIcon :icon="faXmark()" />
      </button>
    </div>
    <div class="upper-zone">
      <div class="upper-zone-left">
        <p><span style="font-weight: bold">Pacient: </span> {{ this.recipe.patient.name }}</p>
        <p>
          <span style="font-weight: bold">Tip rețetă: </span>
          {{ this.recipe.doctor.specialization }}
        </p>
        <p><span style="font-weight: bold">Doctor: </span>{{ this.recipe.doctor.name }}</p>
        <p><span style="font-weight: bold">Durata: </span>{{ this.recipe.recipe_duration }}</p>
      </div>
      <div class="upper-zone-right">
        <button
          class="button-renew-recipe"
          @click="showRenewConfirmationMenu()"
          v-show="this.recipe.distance_between_prescriptions <= '1'"
        >
          <FontAwesomeIcon :icon="faRotate()"></FontAwesomeIcon>Reînnoiește
        </button>
        <!-- It needs to be changed back to <= '0'-->
      </div>
    </div>
    <div class="middle-zone">
      <p>
        <span style="font-weight: bold">Data ultimei rețete prescrise: </span
        >{{
          this.formatDate(this.recipe.prescription_dates[this.recipe.prescription_dates.length - 1])
        }}
      </p>
      <p style="margin-bottom: 15px">
        <span style="font-weight: bold">Data următoarei prescrieri: </span
        >{{ this.formatDate(this.recipe.future_prescription_date) }}
      </p>
      <p class="table-header">Rețetele prescrise anterior:</p>
      <div class="table-last-dates">
        <p
          style="padding: 0 0 0 10px"
          v-for="(index, counter) in this.recipe.prescription_dates"
          :key="index"
        >
          {{ counter + 1 }}. {{ this.formatDate(index) }}
        </p>
      </div>
      <button class="back-button" @click="goToRecipesView">
        <FontAwesomeIcon :icon="faAngleLeft()"></FontAwesomeIcon>Înapoi
      </button>
    </div>
  </div>
  <!--Renew confirmation modal-->
  <div class="renew-recipe-confirmation-modal" v-show="renewConfirmationMenu === true">
    <div class="modal-content">
      <h2 style="background-color: firebrick; color: white; font-weight: bold">
        Confirmare reînnoire rețetă
      </h2>
      <p style="margin: 20px 2px 20px 2px; color: black">
        Ești sigur că dorești să reînnoiești această rețetă?<br />
        Rețeta va fi reînnoită pe data de astăzi: {{ this.formatDate(new Date(Date.now())) }}
      </p>

      <button class="button-cancel" @click="showRenewConfirmationMenu">Anulează</button>
      <button class="button-confirm-renewal" @click="renewRecipe">Reînnoiește</button>
    </div>
  </div>
</template>

<style scoped>
* {
  box-sizing: border-box;
}

.more-details-recipe {
  background-color: #fff;
  color: #181818;
  width: 100%;
  height: 100%;
}

.more-details-header {
  background-color: #cf2e2e;
  padding-left: 15px;
  color: white;
  font-weight: bold;
  position: relative;
  display: flex;
}

.button-cancel-x {
  background-color: transparent;
  color: white;
  border: none;
  height: 25px;
  text-align: right;
  margin-left: auto;
}

.table-last-dates {
  height: 120px;
  width: 100%;
  overflow: auto;
  border: 1px solid #181818;
  margin-bottom: 30px;
  padding-top: 5px;
}

.table-header {
  height: 30px;
  width: 100%;
  background-color: #cf2e2e;
  color: white;
  padding-left: 10px;
  padding-top: 3px;
  padding-bottom: 5px;
  font-weight: bold;
  border-bottom: none;
  border-left: 1px solid #181818;
  border-right: 1px solid #181818;
  border-top: 1px solid #181818;
}

.upper-zone {
  display: flex;
  position: relative;
  padding: 10px 15px;
}

.upper-zone-left {
  position: relative;
  flex: 1;
}
.upper-zone-right {
  position: relative;
}

.middle-zone {
  padding: 10px 15px;
}

button {
  width: 115px;
  height: 40px;
  background-color: dodgerblue;
  color: white;
  font-weight: bolder;
  font-size: 14px;
  border-radius: 5px;
}

button:hover {
  opacity: 0.7;
}

.button-renew-recipe {
  border: none;
  display: block;
  margin-bottom: 7px;
}

.back-button {
  width: 90px; /* 90px*/
  height: 36px; /* 36px*/
  background-color: white;
  border-color: #cf2e2e;
  color: #cf2e2e;
}

/*delete confirmation modal*/
.renew-recipe-confirmation-modal {
  text-align: center;
  /*display: none; Hidden by default*/
  position: fixed; /* Stay in place */
  z-index: 1; /* Sit on top */
  left: 0;
  top: 0;
  width: 100%; /* Full width */
  height: 100%; /* Full height */
  overflow: auto; /* Enable scroll if needed */
  padding-top: 150px;
}
.modal-content {
  background-color: #fefefe;
  margin: 5% auto 15% auto; /* 5% from the top, 15% from the bottom and centered */
  border: 1px solid black;
  width: 80%; /* Could be more or less, depending on screen size */
}
.button-cancel {
  width: 130px;
  height: 40px;
  background-color: white;
  border-color: #cf2e2e;
  color: #cf2e2e;
  margin: 0 10px 20px 10px;
  font-weight: bolder;
  font-size: 14px;
  border-radius: 5px;
}
.button-confirm-renewal {
  width: 130px;
  height: 40px;
  background-color: #cf2e2e;
  border: none;
  color: white;
  margin-bottom: 20px;
  font-weight: bolder;
  font-size: 14px;
  border-radius: 5px;
}
</style>
