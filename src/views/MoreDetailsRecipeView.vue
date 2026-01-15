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
        current_prescription_date: '',
        recipe_duration: '',
        last_prescription_dates: [],
        status: '',
        distance_between_prescriptions: '',
        renewed_today: '',
      },
      showModal: false,
    }
  },
  methods: {
    faRotate() {
      return faRotate
    },
    faXmark() {
      return faXmark
    },
    faAngleLeft() {
      return faAngleLeft
    },
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
    sendEditRequestToBE() {
      fetch(`http://localhost:3001/recipes/${this.recipe.id}`, {
        method: 'PUT',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(this.recipe), // {recipe: this.recipe}
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
    renewRecipe() {
      /*why is recipe_duration a string, and why I transform it afterward in an array*/
      this.recipe.recipe_duration.split(' ')
      this.recipe.current_prescription_date = new Date(Date.now())
      this.recipe.future_prescription_date = new Date(
        Date.now() + this.recipe.recipe_duration[0] * 1000 * 60 * 60 * 24 * 30,
      )
      this.recipe.last_prescription_dates.push(this.recipe.current_prescription_date)
      if (this.recipe.last_prescription_dates.length === 2) {
        this.recipe.renewed_today = true /*it's enough to set this property just once, when the prescription is renewed for the first time. It will be the same after.*/
      }
      this.sendEditRequestToBE()
      this.goToRecipesView()
    },

    goToRecipesView() {
      //deleting the recipe entry from localStorage when leaving the view
      localStorage.removeItem('recipe')
      this.$router.push(`/recipes`)
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
          @click="renewRecipe"
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
        >{{ this.formatDate(this.recipe.current_prescription_date) }}
      </p>
      <p style="margin-bottom: 15px">
        <span style="font-weight: bold">Data următoarei prescrieri: </span
        >{{ this.formatDate(this.recipe.future_prescription_date) }}
      </p>
      <p class="table-header">Rețetele prescrise anterior:</p>
      <div class="table-last-dates">
        <p
          style="padding: 0 0 0 10px"
          v-for="(index, counter) in this.recipe.last_prescription_dates"
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
</style>
