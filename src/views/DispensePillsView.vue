<!--View to dispense the pills for the patient.
    Remark: This view cannot be accessed if the tests in TestDispenserView are not successful.
    NOTE: recipe and prescription terms are used interchangeably
  -->

<script>
import { faXmark } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import PillsConfigurationTable from '@/components/PillsConfigurationTable.vue'

export default {
  name: 'DispensePillsView',
  components: { PillsConfigurationTable, FontAwesomeIcon },
  mounted() {
    this.getRecipesListFromBE()
  },

  data() {
    return {
      recipe_id: '',
      recipes_list: [],
      pills_configuration: '',

      pills_table: [],
      morning: [],
      lunch: [],
      dinner: [],
      before_bed: [],

      tubes_total_list: [],
      show_distribution_modal: false,
      show_putPill_modal: false,
      show_pills_distribution_table: false,
      test: '',
    }
  },
  methods: {
    faXmark() {
      return faXmark
    },
    /*get the list of recipes from the BE*/
    getRecipesListFromBE() {
      fetch('http://localhost:3001/recipes', {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      })
        .then((rsp) => {
          return rsp.json()
        })
        .then((response) => {
          this.recipes_list = response['list']
        })
        .catch(() => {
          alert('backend error')
        })
    },

    /*this function retrieves from the backend the prescription pills distribution
     * and it assigns to each part of the day a list of strings of the form id:quantity and then
     * it calls computeData function that is creating the rows that will appear in the table*/
    getPillsConfigurationFromBE(id) {
      fetch(`http://localhost:3001/pills/pills_configuration/${id}`, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      })
        .then((rsp) => {
          return rsp.json()
        })
        .then((response) => {
          //console.log(response['result'][0]['morning'].split('#'))
          this.morning = response['result'][0]['morning'].split('#')
          //console.log(response['result'][0]['lunch'].split('#'))
          this.lunch = response['result'][0]['lunch'].split('#')
          //console.log(response['result'][0]['dinner'].split('#'))
          this.dinner = response['result'][0]['dinner'].split('#')
          //console.log(response['result'][0]['before_bed'].split('#'))
          this.before_bed = response['result'][0]['before_bed'].split('#')
          this.computeData()
        })
        .catch(() => {
          alert('backend error')
        })
    },

    /* get the pills distribution string that is going to be sent to the prototype and then
     * pass it to the getDispenseResponse function to send it further to the prototype*/
    getSortingStringFromBE(id) {
      fetch(`http://localhost:3001/pills/sort/${id}`, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      })
        .then((rsp) => {
          return rsp.json()
        })
        .then((response) => {
          this.pills_configuration = response['result']
          this.getDispenseResponse(this.pills_configuration) // send string of digits to start sort
          this.show_putPill_modal = false
          this.show_pills_distribution_table = true
        })
        .catch(() => {
          alert('backend error')
        })
    },
    /*form the rows of the table*/
    computeData() {
      for (let index = 0; index < this.morning.length; index++) {
        let row = {
          name: '',
          morning_pill_number: '0',
          lunch_pill_number: '0',
          dinner_pill_number: '0',
          before_bed_pill_number: '0',
        }

        row.name = this.getPillName(this.morning[index].split(':')[0])
        row.morning_pill_number = this.morning[index].split(':')[1]
        row.lunch_pill_number = this.lunch[index].split(':')[1]
        row.dinner_pill_number = this.dinner[index].split(':')[1]
        row.before_bed_pill_number = this.before_bed[index].split(':')[1]

        this.pills_table.push(row)
      }
      this.computePillSumTubeDistribution()
    },

    // search for the pill name based on the pill id
    getPillName(id) {
      for (let index = 0; index < this.$store.state.pills_collection.length; index++) {
        if (this.$store.state.pills_collection[index].id === id) {
          return this.$store.state.pills_collection[index].name
        }
      }
    },

    /*compute the sum of pills that need to be put in each tube*/
    computePillSumTubeDistribution() {
      for (let index = 0; index < this.pills_table.length; index++) {
        let tube = {
          pill_name: '',
          pills_total: 0,
        }

        tube.pill_name = this.pills_table[index].name
        tube.pills_total +=
          Number(this.pills_table[index].morning_pill_number) +
          Number(this.pills_table[index].lunch_pill_number) +
          Number(this.pills_table[index].dinner_pill_number) +
          Number(this.pills_table[index].before_bed_pill_number)
        this.tubes_total_list.push(tube)
        // console.log(tube)
      }
      if (this.tubes_total_list.length < 5) {
        for (let index = this.tubes_total_list.length; index < 5; index++) {
          let tube = {
            pill_name: '-',
            pills_total: '-',
          }
          this.tubes_total_list.push(tube)
        }
      }
      console.log('Tubes:', this.tubes_total_list)
      this.show_distribution_modal = true
    },

    // this function sends the dispense request string to the backend
    // that will send it further to the prototype
    getDispenseResponse(type) {
      fetch(`http://localhost:3001/pills/test/${type}`, {
        method: 'GET',
        headers: {
          accept: 'application/json',
          'Content-Type': 'application/json',
        },
      })
        .then((rsp) => {
          return rsp.json()
        })
        .then((data) => {
          if (data['arduino']) {
            console.log(data['result'])
          }
        })
        .catch((error) => {
          console.log(error)
        })
    },
    goToRecipesView() {
      this.$router.push(`/recipes`)
    },
    showDistributionModal() {
      this.show_distribution_modal = !this.show_distribution_modal
    },

    setPuttPillModal() {
      this.show_putPill_modal = true
      this.show_distribution_modal = false
      this.tubes_total_list = []
    },
    showPutPillModal() {
      this.show_putPill_modal = !this.show_putPill_modal
    },
  },
}
</script>

<template>
  <div class="execution-box">
    <h1>Sortează Medicamentația</h1>
    <br />

    <label>Selectează un pacient: </label>
    <br />
    <select name="patients_mock-ups" v-model="this.recipe_id">
      <option>--Alege pacient--</option>
      <option v-for="(recipe, index) in this.recipes_list" :key="index" :value="recipe.id">
        {{ recipe.patient.name }}, {{ recipe.doctor.name }}
      </option>
    </select>
    <br />
    <br />

    <PillsConfigurationTable
      v-if="this.show_pills_distribution_table === true"
      :prescription_id="this.recipe_id"
    ></PillsConfigurationTable>

    <br />
    <button class="cancel-button" @click="goToRecipesView()">Return to Home</button>
    <button
      style="border: none; width: 120px; margin-right: 5px"
      @click="getPillsConfigurationFromBE(recipe_id)"
    >
      Get Distribution
    </button>
  </div>

  <div v-if="this.show_distribution_modal === true" id="recipes-pop-up">
    <div class="recipes-modal-content">
      <div class="header">
        <h2 class="header-content">Confirmare plasare pastile în tuburi</h2>
        <button class="button-cancel-x" @click="this.showDistributionModal()">
          <FontAwesomeIcon :icon="faXmark()" />
        </button>
      </div>
      <div style="display: flex">
        <table>
          <tbody>
            <tr>
              <td>Tuburi</td>
              <td>
                <canvas
                  width="40"
                  height="100"
                  style="border: 1px solid #000000; margin-right: 40px; background-color: green"
                ></canvas>
              </td>
              <td>
                <canvas
                  width="40"
                  height="100"
                  style="border: 1px solid #000000; margin-right: 40px; background-color: yellow"
                ></canvas>
              </td>
              <td>
                <canvas
                  width="40"
                  height="100"
                  style="border: 1px solid #000000; margin-right: 40px; background-color: red"
                ></canvas>
              </td>
              <td>
                <canvas
                  width="40"
                  height="100"
                  style="border: 1px solid #000000; margin-right: 40px; background-color: blue"
                ></canvas>
              </td>
              <td>
                <canvas
                  width="40"
                  height="100"
                  style="border: 1px solid #000000; margin-right: 40px; background-color: black"
                ></canvas>
              </td>
            </tr>
            <tr>
              <td>Denumire pastilă</td>
              <td>
                <p>{{ this.tubes_total_list[0].pill_name }}</p>
              </td>
              <td>
                <p>{{ this.tubes_total_list[1].pill_name }}</p>
              </td>
              <td>
                <p>{{ this.tubes_total_list[2].pill_name }}</p>
              </td>
              <td>
                <p>{{ this.tubes_total_list[3].pill_name }}</p>
              </td>
              <td>
                <p>{{ this.tubes_total_list[4].pill_name }}</p>
              </td>
            </tr>
            <tr>
              <td>Cantitate</td>
              <td>
                <p>{{ this.tubes_total_list[0].pills_total }}</p>
              </td>
              <td>
                <p>{{ this.tubes_total_list[1].pills_total }}</p>
              </td>
              <td>
                <p>{{ this.tubes_total_list[2].pills_total }}</p>
              </td>
              <td>
                <p>{{ this.tubes_total_list[3].pills_total }}</p>
              </td>
              <td>
                <p>{{ this.tubes_total_list[4].pills_total }}</p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <br />
      <button class="button-cancel" @click="this.showDistributionModal()">Anulează</button>
      <button class="button-ok" @click="this.setPuttPillModal()">Am pus</button>
    </div>
  </div>

  <div v-if="this.show_putPill_modal === true" id="recipes-pop-up">
    <div class="recipes-modal-content">
      <div class="header">
        <h2 class="header-content">Confirmare cutie pe bandă</h2>
        <button class="button-cancel-x">
          <FontAwesomeIcon :icon="faXmark()" />
        </button>
      </div>
      <p style="margin: 20px 2px 10px 2px; color: black; font-size: 20px">
        Puneți o cutie pe bandă.
      </p>
      <button class="button-cancel" @click="showPutPillModal()">Anulează</button>
      <button class="button-ok" @click="getSortingStringFromBE(this.recipe_id)">Start</button>
    </div>
  </div>
</template>

<style scoped>
.execution-box {
  border: 1px solid black; /* Light grey */
  width: 60%;
  height: auto;
  text-align: center;
  margin: 20% auto auto;
}

select {
  background: white;
  width: 60%;
  font-size: 14px;
  padding: 12px 20px 12px 10px;
  border: 1px solid #ddd;
  margin-bottom: 18px;
  border-radius: 10px;
  margin-right: 15px;
}

.cancel-button {
  background-color: white;
  border-color: #cf2e2e;
  color: #cf2e2e;
  width: 120px;
}

button {
  width: 90px;
  height: 33px;
  margin-top: 3px;
  margin-right: 20px;
  margin-bottom: 6px;

  background-color: #cf2e2e;
  color: white;
  font-weight: bolder;
  font-size: 13px;
  border-radius: 5px;
  position: relative;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

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
  font-size: 19px;
}
.button-cancel-x {
  background-color: transparent;
  color: white;
  margin-right: 0;
  border: none;
}

.button-cancel {
  background-color: white;
  color: red;
  margin-right: 0;
  border-color: red;
}
#recipes-pop-up {
  text-align: center;
  /*display: none; Hidden by default*/
  position: fixed; /* Stay in place */
  z-index: 1; /* Sit on top */
  left: 0;
  top: 0;
  width: 100%; /* Full width */
  height: 100%; /* Full height */
  overflow: auto; /* Enable scroll if needed */
  padding-top: 110px;
  background-color: rgb(0, 0, 0); /* Fallback color */
  background-color: rgba(0, 0, 0, 0.4); /* Black w/ opacity */
}
.recipes-modal-content {
  background-color: #fefefe;
  margin: 5% auto 15% auto; /* 5% from the top, 15% from the bottom and centered */
  border: 1px solid black;
  width: 90%; /* Could be more or less, depending on screen size */
}
.button-ok {
  background-color: #cf2e2e;
  color: white;
  margin-right: 10px;
  margin-left: 10px;
  margin-bottom: 20px;
}

table {
  font-family: arial, sans-serif;
  border-collapse: collapse;
  width: 100%;
}

td,
th {
  border: 1px solid #dddddd;
  text-align: left;
  padding: 8px;
}
th {
  font-weight: bold;
}
</style>
