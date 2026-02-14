<!-- This view is used to test the mechanism of the dispenser.-->

<script>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

import {
  faCheck,
  faCircleNotch,
  faCirclePlay,
  faCircleXmark,
} from '@fortawesome/free-solid-svg-icons'

export default {
  name: 'TestDispenserView',
  components: { FontAwesomeIcon },
  mounted() {
    this.check_arduino_connection()
  },
  data() {
    return {
      test_result: '',
      arduino_connection_message: '',
      arduino_connection_status: true,
      tubes_status_button_disable: false,
      band_status_button_disable: false,
      stick_status_button_disable: false,
      tubes_and_stick_status_button_disable: false,
      showStateButtonTubes: 0, // 0 -start , 1 - play , 2 - result ok, 3 - result nok
      showStateButtonStick: 0,
      showStateButtonBand: 0,
      showStateButtonTubesAndStick: 0,
      execution_btn_activation: false,
      tests_results: [], //0 - tube, 1 - band, 2 - stick
    }
  },
  methods: {
    faCircleNotch() {
      return faCircleNotch
    },
    faCircleXmark() {
      return faCircleXmark
    },
    faCheck() {
      return faCheck
    },
    faCirclePlay() {
      return faCirclePlay
    },
    check_arduino_connection() {
      fetch(`http://localhost:3001/pills/connect`, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      })
        .then((rsp) => {
          return rsp.json()
        })
        .then((data) => {
          if (data['arduino']) {
            console.log('arduino connected')
            this.arduino_connection_message = 'Arduino board connected'
          } else {
            console.log('arduino not connected')
            this.arduino_connection_message = 'Arduino board not connected'
            this.arduino_connection_status = false
          }
        })
    },
    disable_test_buttons(test_type) {
      if (test_type === 'testBand') {
        this.tubes_status_button_disable = true
        this.stick_status_button_disable = true
        this.tubes_and_stick_status_button_disable = true
        this.showStateButtonBand = 1
      } else if (test_type === 'testStick') {
        this.tubes_status_button_disable = true
        this.band_status_button_disable = true
        this.tubes_and_stick_status_button_disable = true
        this.showStateButtonStick = 1
      } else if (test_type === 'testTubes') {
        this.tubes_and_stick_status_button_disable = true
        this.band_status_button_disable = true
        this.stick_status_button_disable = true
        this.showStateButtonTubes = 1
      } else {
        this.tubes_status_button_disable = true
        this.band_status_button_disable = true
        this.stick_status_button_disable = true
        this.showStateButtonTubesAndStick = 1
      }
    },

    change_button_color(button_state_name) {
      if (button_state_name === 2) {
        return 'yellowgreen'
      } else {
        return '#555'
      }
    },
    getDispenseResponse(test_type) {
      this.disable_test_buttons(test_type)
      fetch(`http://localhost:3001/pills/${test_type}`, {
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
            // un comportament al app
            // this.test_result = data['result']
            if (test_type === 'testBand') {
              this.tests_results[1] = 1
              this.tubes_status_button_disable = false
              this.stick_status_button_disable = false
              this.tubes_and_stick_status_button_disable = false
              this.showStateButtonBand = 2
            }
            if (test_type === 'testTubes') {
              this.tests_results[0] = 1
              this.tubes_and_stick_status_button_disable = false
              this.band_status_button_disable = false
              this.stick_status_button_disable = false
              this.showStateButtonTubes = 2
            }
            if (test_type === 'testStick') {
              this.tests_results[2] = 1
              this.tubes_status_button_disable = false
              this.band_status_button_disable = false
              this.tubes_and_stick_status_button_disable = false
              this.showStateButtonStick = 2
            }
            if (test_type === 'testTubesAndStick') {
              this.tests_results[3] = 1
              this.tubes_status_button_disable = false
              this.band_status_button_disable = false
              this.stick_status_button_disable = false
              this.showStateButtonTubesAndStick = 2
            }
            console.log(this.tests_results)
            if (
              this.tests_results[0] === 1 &&
              this.tests_results[1] === 1 &&
              this.tests_results[2] === 1 &&
              this.tests_results[3] === 1
            ) {
              this.execution_btn_activation = true
            }
            // [tubes,bande,stick] = [ 1,1,1] , [{tubes:0},{bande:1},{stick:0}] , '111' , [true,false,true]
            // daca [1,1,1] atunci activeaza buton execution
          } else {
            // alt comportament
          }
          console.log(data['result'])
        })
        .catch((err) => console.log(err))
    },
    // changeState() {
    //   if (this.showStateButtonTubes === 0) {
    //     this.showStateButtonTubes = 1
    //     this.tubes_status_button_disable = true
    //   } else {
    //     this.showStateButtonTubes++
    //   }
    // },
    goToPillDispensingView() {
      this.$router.push('/dispense_pills')
    },
  },
}
</script>
<template>
  <h1 style="text-align: center">Dispenser Test</h1>
  <p>{{ this.arduino_connection_message }}</p>

  <div class="container">
    <img src="../assets/prototype.png" alt="Pills dispenser" class="img-prototype" />
    <button
      id="tubes-btn-img"
      class="tubes-btn"
      @click="getDispenseResponse('testTubes')"
      :disabled="tubes_status_button_disable"
      :style="{ backgroundColor: this.change_button_color(showStateButtonTubes) }"
    >
      <FontAwesomeIcon v-if="showStateButtonTubes === 0" :icon="faCirclePlay()" />
      <FontAwesomeIcon
        v-else-if="showStateButtonTubes === 1"
        :icon="faCircleNotch()"
        class="fa-spin"
      />
      <FontAwesomeIcon
        v-else-if="showStateButtonTubes === 2"
        :icon="faCheck()"
        class="fa-beat"
        style="animation-duration: 5s"
      />
      <span v-if="showStateButtonTubes === 0">Tubes</span>
      <span v-if="showStateButtonTubes === 1">Running...</span>
      <span v-if="showStateButtonTubes === 2">Tubes Ok</span>
    </button>
    <button
      id="tubes-and-stick-btn-img"
      class="tubes-and-stick-btn"
      @click="getDispenseResponse('testTubesAndStick')"
      :disabled="tubes_and_stick_status_button_disable"
      :style="{ backgroundColor: this.change_button_color(showStateButtonTubesAndStick) }"
    >
      <FontAwesomeIcon v-if="showStateButtonTubesAndStick === 0" :icon="faCirclePlay()" />
      <FontAwesomeIcon
        v-else-if="showStateButtonTubesAndStick === 1"
        :icon="faCircleNotch()"
        class="fa-spin"
      />
      <FontAwesomeIcon
        v-else-if="showStateButtonTubesAndStick === 2"
        :icon="faCheck()"
        class="fa-beat"
        style="animation-duration: 5s"
      />
      <span v-if="showStateButtonTubesAndStick === 0">Tubes & Stick</span>
      <span v-if="showStateButtonTubesAndStick === 1">Running...</span>
      <span v-if="showStateButtonTubesAndStick === 2">Tubes & Stick Ok</span>
    </button>
    <button
      id="stick-btn-img"
      class="stick-btn"
      @click="getDispenseResponse('testStick')"
      :disabled="stick_status_button_disable"
      :style="{ backgroundColor: this.change_button_color(showStateButtonStick) }"
    >
      <FontAwesomeIcon v-if="showStateButtonStick === 0" :icon="faCirclePlay()" />
      <FontAwesomeIcon
        v-else-if="showStateButtonStick === 1"
        :icon="faCircleNotch()"
        class="fa-spin"
      />
      <FontAwesomeIcon
        v-else-if="showStateButtonStick === 2"
        :icon="faCheck()"
        class="fa-beat"
        style="animation-duration: 5s"
      />
      <span v-if="showStateButtonStick === 0">Stick</span>
      <span v-if="showStateButtonStick === 1">Running...</span>
      <span v-if="showStateButtonStick === 2">Stick Ok</span>
    </button>
    <button
      id="band-btn-img"
      class="band-btn"
      @click="getDispenseResponse('testBand')"
      :disabled="band_status_button_disable"
      :style="{ backgroundColor: this.change_button_color(showStateButtonBand) }"
    >
      <FontAwesomeIcon v-if="showStateButtonBand === 0" :icon="faCirclePlay()" />
      <FontAwesomeIcon
        v-else-if="showStateButtonBand === 1"
        :icon="faCircleNotch()"
        class="fa-spin"
      />
      <FontAwesomeIcon
        v-else-if="showStateButtonBand === 2"
        :icon="faCheck()"
        class="fa-beat"
        style="animation-duration: 5s"
      />
      <span v-if="showStateButtonBand === 0">Band</span>
      <span v-if="showStateButtonBand === 1">Running...</span>
      <span v-if="showStateButtonBand === 2">Band Ok</span>
    </button>
  </div>

  <div style="text-align: center">
    <button
      class="execution-btn"
      :disabled="execution_btn_activation === false"
      @click="goToPillDispensingView()"
    >
      Go to Execution
    </button>
  </div>

  <!--<FontAwesomeIcon v-if="showStateButtonTubes === 0" :icon="faCirclePlay()" />-->
  <!--<FontAwesomeIcon v-else-if="showStateButtonTubes === 1" :icon="faSpinner()" />-->
  <!--<FontAwesomeIcon v-else-if="showStateButtonTubes === 2" :icon="faCheck()" />-->
  <!--<FontAwesomeIcon v-else-if="showStateButtonTubes === 3" :icon="faCircleXmark()" />-->
</template>

<style>
button:hover {
  background-color: lightseagreen;
}
button:disabled {
  cursor: not-allowed;
  background-color: #555555;
  opacity: 0.6;
}

.done {
  background-color: yellowgreen;
}

.initial-state {
  border: 2px solid #0d0c0c;
  height: 30px;
  width: 45px;
  border-radius: 10px;
  background-color: lightgrey;
  font-weight: bold;
  padding: 5px;
  font-size: 10px;
}
.final-state {
  border: 2px solid #0d0c0c;
  height: 30px;
  width: 45px;
  border-radius: 10px;
  background-color: yellowgreen;
  font-weight: bold;
  padding: 5px;
  font-size: 10px;
  content: 'Done';
}

.img-prototype {
  width: 100%;
  height: auto;
}

.container {
  position: relative;
  width: 100%;
}

.execution-btn {
  background-color: orange;
  color: white;
  font-size: 16px;
  padding: 12px 24px;
  border: none;
  cursor: pointer;
  border-radius: 50px;
}
.tubes-btn {
  position: absolute;
  top: 10%;
  left: 45%;
  background-color: #555;
  color: white;
  font-size: 16px;
  padding: 12px 24px;
  border: none;
  cursor: pointer;
  border-radius: 5px;
}
.stick-btn {
  position: absolute;
  top: 33%;
  left: 30%;
  background-color: #555;
  color: white;
  font-size: 16px;
  padding: 12px 24px;
  border: none;
  cursor: pointer;
  border-radius: 5px;
}

.tubes-and-stick-btn {
  position: absolute;
  top: 53%;
  left: 20%;
  background-color: #555;
  color: white;
  font-size: 16px;
  padding: 12px 24px;
  border: none;
  cursor: pointer;
  border-radius: 5px;
}
.band-btn {
  position: absolute;
  top: 38%;
  left: 70%;
  background-color: #555;
  color: white;
  font-size: 16px;
  padding: 12px 24px;
  border: none;
  cursor: pointer;
  border-radius: 5px;
}
</style>
