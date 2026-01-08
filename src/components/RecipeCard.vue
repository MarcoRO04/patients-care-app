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
        current_prescription_date: '',
        last_prescription_dates: [],
        status: '',
        renewed_today: false,
      },
      status_color: '',
      cardMenu: false,
      deleteConfirmationMenu: false,
    }
  },

  methods: {
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
    initializeRecipe() {
        if (this.obj) {
          this.recipe.id = this.obj.id
          this.recipe.patient.name = this.obj.patient.name
          this.recipe.doctor.name = this.obj.doctor.name
          this.recipe.doctor.specialization = this.obj.doctor.specialization
          this.recipe.recipe_duration = this.obj.recipe_duration
          this.recipe.current_prescription_date = this.obj.current_prescription_date
          this.recipe.future_prescription_date = this.obj.future_prescription_date
          this.recipe.last_prescription_dates = this.obj.last_prescription_dates
          this.recipe.status = this.obj.status
          this.recipe.distance_between_prescriptions = this.obj.distance_between_prescriptions
        }else{
          alert('null data')
        }
    },
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
    goToDetails() {
      //put the recipe in localStorage and navigate to MoreDetailsRecipe.vue with the recipe's id
      localStorage.setItem('recipe', JSON.stringify(this.recipe))
      this.$router.push(`/more_details_recipe/${this.recipe.id}`)
    },
    goToEditRecipe() {
      this.$router.push(`/edit_recipe/${this.recipe.id}`)
    },
    goToRecipesView() {
      //deleting the recipe entry from localStorage when leaving the view
      localStorage.removeItem('recipe')
      this.$router.push(`/recipes`)
    },
    showCardMenu() {
      this.cardMenu = !this.cardMenu
    },
    showDeleteConfirmationMenu() {
      this.deleteConfirmationMenu = !this.deleteConfirmationMenu
    },
    deleteRecipeInBE() {
      fetch(`http://localhost:3001/recipes/${this.recipe.id}`, {
        method: 'DELETE',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        // body: this.recipe.id // 'id' is already a string
      }).then( d => {
        console.log(d.status)
        return d.json()
      }).then( (response) => {
        if (response['result']) {
          alert('Delete ok!')
          this.showDeleteConfirmationMenu()
          this.emitter.emit("delete_operation",{id : this.recipe.id})
          /*nu merge ca sunt practic deja in acel view. Ar trebuii pur si simplu sa reincarc pagina*/
        }else {
          alert('Failed to delete recipe')
        }
      }).catch( (error) => {
        console.log(error)
      })
      this.goToRecipesView()
    },
  },
}
</script>

<template>
  <div class="recipe-card">
    <div class="recipe-card-elements">
      <div class="recipe-card-info" @click="goToDetails()">
        <div>{{index}}</div>
        <div class="patient-details">
          <p style="font-size: 20px; font-weight: bold">{{ this.recipe.patient.name }}</p>
          <p>{{ this.recipe.doctor.name }}</p>
        </div>
          <button class="extend-recipe-button"
                  v-show="this.recipe.distance_between_prescriptions <= '1'">
            <FontAwesomeIcon :icon="faRotate()">

            </FontAwesomeIcon>Reînnoiește
          </button>
        <div class="days-left-square"
          id="days_left_square"
          :style="{ backgroundColor: this.status_color }"
        >
          <p style="font-size: 30px">{{ this.recipe.distance_between_prescriptions }}</p>
          <p>zile</p>
        </div>
      </div>
      <button @click="showCardMenu()"
              class="vertical-ellipsis-button">
        <FontAwesomeIcon :icon="faEllipsisVertical()"
                         style="font-size: 18px">
        </FontAwesomeIcon></button>
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
  position: relative;  /*the position should by default relative, but just to make sure */
  margin-bottom: 10px;
}

/*just when cardMenu is false, it will reduce the opacity*/
/*.recipe-card:hover {
  opacity: 0.7;
}*/

/*this contains all the elements in the card, includng the 3 dots*/
.recipe-card-elements {
  display: flex;
}

/*I wanted to separate the rest of the details from the 3 dots,
such that I can click on the details to send me to MoreDetailsRecipe
or to click on the 3 dots and show me the card menu*/
.recipe-card-info{
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
  width: 76px;
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
.vertical-ellipsis-button{
  margin: 5px 1px 8px 1px;
  height: 70px;
  width: 70px;
  border-color: transparent;
  background-color: transparent;
}
.vertical-ellipsis-button:hover{
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
