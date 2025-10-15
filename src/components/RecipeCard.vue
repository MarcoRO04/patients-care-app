<script>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faRotate } from '@fortawesome/free-solid-svg-icons'

export default {
  name: 'RecipeCard',
  components: { FontAwesomeIcon },
  mounted() {
    let recipes = localStorage.getItem('recipes')
    this.recipes_list = recipes === null ? [] : JSON.parse(recipes)
    this.initializeRecipe()
    this.change_recipe_status()
    // this.fetchData2()
  },
  props: {
    id: String,
  },
  data() {
    return {
      recipe: {
        id: this.id,
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
        last_prescription_dates: '',
        status: '',
      },
      status_color: '',
      recipes_list: [],
      img_url: '',
    }
  },

  methods: {
    faRotate() {
      return faRotate
    },
    initializeRecipe() {
      for (let r in this.recipes_list) {
        if (this.recipes_list[r].id === this.id) {
          this.recipe.id = this.recipes_list[r].id
          this.recipe.patient.name = this.recipes_list[r].patient.name
          this.recipe.doctor.name = this.recipes_list[r].doctor.name
          this.recipe.doctor.specialization = this.recipes_list[r].doctor.specialization
          this.recipe.recipe_duration = this.recipes_list[r].recipe_duration
          this.recipe.current_prescription_date = this.recipes_list[r].current_prescription_date
          this.recipe.future_prescription_date = this.recipes_list[r].future_prescription_date
          this.recipe.last_prescription_dates = this.recipes_list[r].last_prescription_dates
          this.recipe.status = this.recipes_list[r].status
          this.recipe.distance_between_prescriptions =
            this.recipes_list[r].distance_between_prescriptions
          break
        }
      }
    },
    goToDetails() {
      this.$router.push(`/more_details_recipe/${this.id}`)
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
    async fetchData() {
      let randomNumber = Math.floor(Math.random() * 20 + 1)
      try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${randomNumber}`)

        if (!response.ok) {
          throw new Error(
            `Could not fetch data for https://pokeapi.co/api/v2/pokemon/${randomNumber}`,
          )
        } else {
          const result = await response.json()
          this.img_url = result.sprites.front_default
        }
      } catch (error) {
        console.error(error)
      }
    },
    fetchData2() {
      let randomNumber = Math.floor(Math.random() * 20 + 1)
      fetch(`https://pokeapi.co/api/v2/pokemon/${randomNumber}`)
        .then(response => {
        return response.json()
      }).then(data => {
        console.log(data)
        if (!data) {
          throw new Error(
            `Could not fetch data for https://pokeapi.co/api/v2/pokemon/${randomNumber}`,
          )
        } else {
          this.img_url = data.sprites.front_default
        }
      }).catch(error => {
        console.error(error)
      })
    },

  },
}
</script>

<template>
  <div class="recipe-card" @click.prevent="goToDetails" id="recipe_card">
    <div class="recipe-details">
<!--      <img :src="img_url" v-show="img_url !== ''" />-->
      <p style="font-size: 20px; font-weight: bold">{{ this.recipe.patient.name }}</p>
      <p>{{ this.recipe.doctor.name }}</p>
    </div>
    <div class="div-update-button">
      <button
        class="extend-recipe-button"
        v-show="this.recipe.distance_between_prescriptions <= '1'"
      >
        <FontAwesomeIcon :icon="faRotate()"></FontAwesomeIcon>Reînnoiește
      </button>
    </div>
    <div
      class="days-left-square"
      id="days_left_square"
      :style="{ backgroundColor: this.status_color }"
    >
      <p style="font-size: 30px">{{ this.recipe.distance_between_prescriptions }}</p>
      <p>zile</p>
    </div>
  </div>
</template>

<style scoped>
.recipe-card {
  /* Add shadows to create the "card" effect */
  /*box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);*/
  /*transition: 0.3s;*/

  background: #fff;
  color: #181818;
  padding: 8px 12px;
  border-radius: 10px;
  display: flex;
  /*position: relative;*/
}
.recipe-card:hover {
  opacity: 0.7;
}
.recipe-details {
  flex: 1;
  text-align: left;
  flex-wrap: wrap;
  padding: 8px 0 8px 8px;
  overflow: visible;
}
.days-left-square {
  align-self: center;
  display: inline-flex;
  background: none;
  padding: 10px;
  border-radius: 10px;
  width: 76px;
  margin-left: 8px;
}
/* On mouse-over, add a deeper shadow
.recipe-card:hover {
  box-shadow: 0 8px 16px 0 rgba(255, 255, 255, 0.89);
}
 */
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
}
</style>
