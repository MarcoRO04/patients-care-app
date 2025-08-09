<script>

export default {
  name: 'RecipeCard',
  mounted() {
    this.change_recipe_status()
  },
  props: {
    patient_name: String,
    doctor_name: String,
    doctor_specialization: String,
    recipe_duration: String,
    distance_between_recipes: String,
    future_prescription_date: String,
    current_prescription_date: String,
    status: String,
    last_prescription_dates: Array,

  },
  data() {
    return {
      recipe: {
        patient:{
          name: this.patient_name,
        },
        doctor:{
          name: this.doctor_name,
          specialization: this.doctor_specialization,
        },
        recipe_duration: this.recipe_duration,
        distance_between_recipes: this.distance_between_recipes,
        future_prescription_date: this.future_prescription_date,
        current_prescription_date: this.current_prescription_date,
        last_prescription_dates: this.last_prescription_dates,
        status: this.status,
      },
      status_color:"",
      name:"mynameButton",
      mylink:"https://www.gsp.ro",
      type:false,
    }
  },
  computed: {
    isFalse() {
      return this.type
    }
  },
  methods: {
    init() {
      console.log("init")
    },
    updateType() {
      this.type = !this.type
    },
    goToDetails(){
      this.$router.push(`/more_details_recipe/${this.patient_name}/${this.doctor_name}/${this.doctor_specialization}/${this.recipe_duration}/${this.distance_between_recipes}/${this.last_prescription_dates}/${this.current_prescription_date}/${this.future_prescription_date}/${this.status}`)
    },
    getMyLink() {
      return this.mylink
    },
    change_recipe_status(){
      switch (this.recipe.status) {
        case "1":
          this.status_color = "red";
          this.mylink = "https://www.prosport.ro"
          break;
        case "2":
          this.status_color = "orange";
          break;
        case "3":
          this.status_color = "greenyellow";
          break;
        default:
          console.log('am ajuns aici');
          break;
      }
    },

  },
}
</script>

<template>
  <div class="recipe-card" @click.prevent="goToDetails" id="recipe_card">
    <div class="recipe-details">
      <p style="font-size: 20px; font-weight: bold">{{ this.patient_name }}</p>
      <p>{{ this.doctor_name }} ({{ this.recipe_duration }})</p>
    </div>
    <div class="days-left-square" id="days_left_square" :style="{backgroundColor: this.status_color}" @click="init">
      <p style="font-size: 30px">{{ this.distance_between_recipes }}</p>
      <p>zile</p>
    </div>

  </div>
  <button class="ucard" v-show="status_color === 'red'" @click="updateType">{{name}}</button>
  <a :href="getMyLink()" target="_blank">Link TO</a>
  {{isFalse}}

</template>

<style>
.recipe-card {
  /* Add shadows to create the "card" effect */
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
  transition: 0.3s;
  background: #fff;
  color: #181818;
  padding: 8px 12px;
  border-radius: 10px;
  display: flex;
  position: relative;
}

 .recipe-card:hover{
   background-color: #dfe2ec;
 }
 /*
 .recipe-card:after {
   position: absolute;
   content: "";
   top: 0;
   left: 0;
   right: 0;
   bottom: 0;
 }*/


.recipe-details {
  flex: 1;
  text-align: left;
  padding: 8px;
  flex-wrap: wrap;
}
.days-left-square {
  align-self: center;
  display: inline-flex;
  background: greenyellow;
  padding: 10px;
  border-radius: 10px;
}
.ucard {
  font-size: 10px;
  background-color: greenyellow;
  border: none;
  border-radius: 40%;
  padding: 10px 10px;
  height: 30px;
  width: 30px;
}
.ucard:hover:after {
  content: " \00AE";
  font-size: 30px;
}

/* On mouse-over, add a deeper shadow */
.recipe-card:hover {
  box-shadow: 0 8px 16px 0 rgba(0, 0, 0, 0.2);
}
</style>
