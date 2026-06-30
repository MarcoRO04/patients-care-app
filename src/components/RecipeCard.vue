<!--
  This component was created for displaying the most important recipe details.
  Each recipe will be represented like this.
  They can be viewed in RecipesView.vue, in the form of a list of cards.

  NOTE: recipe and prescription terms are used interchangeably
 -->

<script>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faEdit, faEllipsisVertical, faRotate, faTrashCan } from '@fortawesome/free-solid-svg-icons'
export default {
  name: 'RecipeCard',
  components: { FontAwesomeIcon },

  props: {
    obj: Object,
    index: Number,
  },

  mounted() {
    this.initializeRecipe()
    this.set_recipe_status_color()
  },

  data() {
    return {
      recipe: {
        id: '',
        patient: {
          name: '',
        },
        doctor: {
          name: '',
          specialization: '',
        },
        recipe_duration: '',
        distance_between_prescriptions: '',
        future_prescription_date: '',
        prescription_dates: [],
        status: '',
      },
      status_color: '',
      cardMenu: false,
      deleteConfirmationMenu: false,
    }
  },

  methods: {
    /*icon getter functions*/
    faEdit() {
      return faEdit
    },
    faTrashCan() {
      return faTrashCan
    },
    faEllipsisVertical() {
      return faEllipsisVertical
    },
    faRotate() {
      return faRotate
    },
    /*initialize the recipe object with the one received from the parent view via props (RecipesView.vue)*/
    initializeRecipe() {
      if (this.obj) {
        this.recipe.id = this.obj.id
        this.recipe.patient.name = this.obj.patient.name
        this.recipe.doctor.name = this.obj.doctor.name
        this.recipe.doctor.specialization = this.obj.doctor.specialization
        this.recipe.recipe_duration = this.obj.recipe_duration
        this.recipe.future_prescription_date = this.obj.future_prescription_date
        this.recipe.prescription_dates = this.obj.prescription_dates
        this.recipe.status = this.obj.status
        this.recipe.distance_between_prescriptions = this.obj.distance_between_prescriptions
      } else {
        alert('null data')
      }
    },
    /*based on the property status of the recipe object, set
    the status_color variable with a color represented as a string.

    status_color will be used to color the square that shows the days left*/
    set_recipe_status_color() {
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

    /*The following two functions change the current view with another one by pushing a new path on top.
     Here local storage is used to share the current recipe between the views.
     When the user clicks a button to go to EditRecipeView or MoreDetailsRecipeView,
     the recipe will be saved into the localStorage.
     The recipe will be then deleted, when the user leaves those views.*/
    goToDetails() {
      //put the recipe in localStorage and navigate to MoreDetailsRecipe.vue with the recipe's id
      localStorage.setItem('recipe', JSON.stringify(this.recipe))
      this.$router.push(`/more_details_recipe/${this.recipe.id}`)
    },
    goToEditRecipe() {
      //put the recipe in localStorage and navigate to EditRecipeView.vue with the recipe's id
      localStorage.setItem('recipe', JSON.stringify(this.recipe))
      this.$router.push(`/edit_recipe/${this.recipe.id}`)
    },
    showCardMenu() {
      this.cardMenu = !this.cardMenu
    },
    showDeleteConfirmationMenu() {
      this.deleteConfirmationMenu = !this.deleteConfirmationMenu
    },
    /*send a delete request to the BE, to delete the current recipe.
     The id of the recipe is sent in the path, to achieve this.
     The BE will search that respective recipe and delete it, sending back an object with a boolean value
     with the status of the delete operation.

     Although the recipe is deleted in the BE, the list of recipes will not be updated, until the page is refreshed.
     That happens because the view is not changed. The user is in the same view basically.
     And because the list of recipes is fetched from the BE, it won't be updated until the next fetch (when the page is reloaded)

     For EditRecipeView.vue, this doesn't happen because we change the view. (see there why this isn't happening)

     So, in order to solve this problem, an emitter object is created ( emitter is like a pipe, used to pass data between components)

     The method emitter.emit() is used to send data, in our case, the id of the deleted recipe, wrapped in an object,
     to RecipesView.vue in order to eliminate the recipe from the list.
     The list of recipes is in RecipesView, that's why it is sent there. (This is the current working solution employed)
     */
    deleteRecipeInBE() {
      fetch(`http://localhost:3001/recipes/${this.recipe.id}`, {
        method: 'DELETE',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      })
        .then((d) => {
          return d.json()
        })
        .then((response) => {
          if (response['result']) {
            alert('Delete ok!')
            this.showDeleteConfirmationMenu()
            this.emitter.emit('delete_operation', { id: this.recipe.id })
          } else {
            alert('Failed to delete recipe')
          }
        })
        .catch((error) => {
          console.log(error)
        })
    },
  },
}
</script>

<template>
  <div>
    <!-- this div is used as a root to solve the vue warning: [Vue warn]: Extraneous non-props attributes
    (id, style) were passed to component but could not be automatically inherited because component renders
    fragment or text or teleport root nodes.  -->
    <div class="recipe-card">
      <!-- General recipe details-->
      <div class="recipe-card-elements">
        <div class="recipe-card-info" @click="goToDetails()">
          <div class="patient-details">
            <p style="font-size: 20px; font-weight: bold">{{ this.recipe.patient.name }}</p>
            <p>{{ this.recipe.doctor.name }}</p>
          </div>
          <button
            class="extend-recipe-button"
            v-show="this.recipe.distance_between_prescriptions <= '1'"
          >
            <FontAwesomeIcon :icon="faRotate()"> </FontAwesomeIcon>Reînnoiește
          </button>
          <div
            class="days-left-square"
            id="days_left_square"
            :style="{ backgroundColor: this.status_color }"
          >
            <p style="font-size: 30px">{{ this.recipe.distance_between_prescriptions }}</p>
            <p>zile</p>
          </div>
        </div>
        <button @click="showCardMenu()" class="vertical-ellipsis-button">
          <FontAwesomeIcon :icon="faEllipsisVertical()" style="font-size: 18px"> </FontAwesomeIcon>
        </button>
      </div>
      <!--    Card menu-->
      <div v-show="this.cardMenu === true" class="card-menu">
        <button @click="goToEditRecipe()" class="button-edit">
          <FontAwesomeIcon :icon="faEdit()"></FontAwesomeIcon>Editează
        </button>
        <button @click="showDeleteConfirmationMenu()" class="button-delete">
          <FontAwesomeIcon :icon="faTrashCan()"></FontAwesomeIcon>Șterge
        </button>
      </div>
    </div>
    <!--Delete confirmation modal-->
    <div class="delete-recipe-modal" v-show="deleteConfirmationMenu === true">
      <div class="modal-content">
        <h2 style="background-color: firebrick; color: white; font-weight: bold">
          Confirmare ștergere rețetă
        </h2>
        <p style="margin: 20px 2px 20px 2px; color: black">
          Ești sigur că dorești să ștergi această rețetă?
        </p>

        <button class="button-cancel" @click="showDeleteConfirmationMenu">Anulează</button>
        <button class="button-confirm-deletion" @click="deleteRecipeInBE()">Șterge</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
/*the frame of the card*/
.recipe-card {
  /* Add shadows to create the "card" effect */
  /*box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);*/
  /*transition: 0.3s;*/

  background: #fff;
  color: #181818;
  padding: 8px 12px;
  border-radius: 10px;
  position: relative; /*the position should by default relative, but just to make sure */
  margin-bottom: 10px;
}

/*just when cardMenu is false, it will reduce the opacity*/
/*.recipe-card:hover {
  opacity: 0.7;
}*/

/*this contains all the elements in the card, including the 3 dots*/
.recipe-card-elements {
  display: flex;
}

/*I wanted to separate the rest of the details from the 3 dots,
such that I can click on the details to send me to MoreDetailsRecipe
or to click on the 3 dots and show me the card menu*/
.recipe-card-info {
  display: flex;
  margin: 0 auto;
  width: 100%;
}

/*to make the doctor appear under the patient*/
.patient-details {
  flex: 1;
  text-align: left;
  flex-wrap: wrap;
  padding: 8px 0 8px 8px;
  overflow: visible;
}

/*the square that displays the days remaining until the next prescription renewal*/
.days-left-square {
  align-self: center;
  display: inline-flex;
  background: none;
  padding: 10px;
  border-radius: 10px;
  width: 80px;
  margin-left: 8px;
}

/*extend recipe button for visual purposes (no action)*/
.extend-recipe-button {
  background-color: dodgerblue;
  color: white;
  font-weight: bolder;
  font-size: 11px;
  border-radius: 10px;
  border: none;

  width: 90px;
  height: 22px;
  padding: 2px;
  margin-top: 5px;
}

/*button that show the menu with edit and delete*/
.vertical-ellipsis-button {
  margin: 5px 1px 8px 1px;
  height: 70px;
  width: 70px;
  border-color: transparent;
  background-color: transparent;
}
.vertical-ellipsis-button:hover {
  opacity: 0.7;
}

/*Menu with edit and delete buttons*/
.card-menu {
  height: 50px;
  width: 200px;
  background-color: transparent;
  margin: 0 auto;
  display: flex;
}
.button-edit {
  width: 130px;
  height: 40px;
  background-color: forestgreen;
  display: block;
  border: none;
  color: white;
  font-weight: bolder;
  font-size: 14px;
  border-radius: 5px;
  margin-right: 20px;
}
.button-delete {
  width: 130px;
  height: 40px;
  background-color: #cf2e2e;
  display: block;
  border: none;
  color: white;
  font-weight: bolder;
  font-size: 14px;
  border-radius: 5px;
}

/*delete confirmation modal*/
.delete-recipe-modal {
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
.button-confirm-deletion {
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
