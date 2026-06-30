<!-- This view is used to test the mechanism of the dispenser.
  NOTE: recipe and prescription terms are used interchangeably

  Remark: The run all tests button is not implemented yet.
-->

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

      testSoftwareErrors: false,
      tests_results: [], // 0 - tube, 1 - band, 2 - stick
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
            this.tubes_status_button_disable = true
            this.tubes_and_stick_status_button_disable = true
            this.stick_status_button_disable = true
            this.band_status_button_disable = true
          }
        })
    },
    disable_test_buttons(test_type) {
      if (test_type === 'testBandOk' || test_type === 'testBandError') {
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
      } else if (test_type === 'testTubesAndStick') {
        this.tubes_status_button_disable = true
        this.band_status_button_disable = true
        this.stick_status_button_disable = true
        this.showStateButtonTubesAndStick = 1
      } else {
        this.tubes_status_button_disable = true
        this.band_status_button_disable = true
        this.stick_status_button_disable = true
        this.tubes_and_stick_status_button_disable = true
        alert('Unknown test type')
      }
    },

    change_button_color(button_state_name) {
      if ((button_state_name === 0 || button_state_name === 1) && this.arduino_connection_status) {
        return 'lightcoral'
      } else if (button_state_name === 2) {
        return 'yellowgreen'
      } else if (button_state_name === 3) {
        return 'red'
      }
    },
    sendTestType() {
      if (this.testSoftwareErrors) {
        this.getTestDispenserResponse('testBandError')
      } else {
        this.getTestDispenserResponse('testBandOk')
      }
    },
    getTestDispenserResponse(test_type) {
      this.disable_test_buttons(test_type)
      fetch(`http://localhost:3001/pills/test/${test_type}`, {
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
            if (test_type === 'testBandOk') {
              this.tests_results[1] = 1
              this.tubes_status_button_disable = false
              this.stick_status_button_disable = false
              this.tubes_and_stick_status_button_disable = false
              this.showStateButtonBand = 2
            }
            if (test_type === 'testBandError') {
              this.tests_results[1] = 0
              this.tubes_status_button_disable = false
              this.stick_status_button_disable = false
              this.tubes_and_stick_status_button_disable = false
              this.showStateButtonBand = 3
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
          }
          console.log(data['result'])
        })
        .catch((err) => console.log(err))
    },

    /*work in progress*/
    runAllTests() {
      this.getTestDispenserResponse('testBandOk')
      this.getTestDispenserResponse('testStick')
      this.getTestDispenserResponse('testTubes')
      this.getTestDispenserResponse('testTubesAndStick')
    },

    goToPillDispensingView() {
      this.$router.push('/dispense_pills')
    },

    goToRecipesView() {
      this.$router.push(`/recipes`)
    },
  },
}
</script>
<template>
  <h1 style="text-align: center">Dispenser Components Test</h1>
  <p>{{ this.arduino_connection_message }}</p>
  <div style="display: flex; margin-top: 10px">
    <div style="margin-top: 10px; margin-bottom: 10px">
      Simulated Arduino Errors:
      <label class="switch">
        <input v-model="this.testSoftwareErrors" type="checkbox" />
        <span class="slider round"></span>
      </label>
    </div>
    <div
      @click="this.runAllTests()"
      style="margin-top: 10px; margin-right: 10px; margin-left: 10px"
    >
      Run all tests
      <label class="switch">
        <input v-model="this.testSoftwareErrors" type="checkbox" />
        <span class="slider round"></span>
      </label>
    </div>
  </div>

  <div class="container">
    <img src="../assets/prototypeEdited.png" alt="Pills dispenser" class="img-prototype" />
    <button
      id="tubes-btn-img"
      class="tubes-btn"
      @click="getTestDispenserResponse('testTubes')"
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
      @click="getTestDispenserResponse('testTubesAndStick')"
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
      @click="getTestDispenserResponse('testStick')"
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
      @click="sendTestType()"
      :disabled="
        band_status_button_disable || showStateButtonBand === 3 || showStateButtonBand === 2
      "
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
      <FontAwesomeIcon
        v-else-if="showStateButtonBand === 3"
        :icon="faCircleXmark()"
        class="fa-shake"
        style="animation-duration: 5s"
      />
      <span v-if="showStateButtonBand === 0">Band</span>
      <span v-if="showStateButtonBand === 1">Running...</span>
      <span v-if="showStateButtonBand === 2">Band Ok</span>
      <span v-if="showStateButtonBand === 3">Band Nok</span>
    </button>
  </div>

  <div style="text-align: center">
    <button class="cancel-button" @click="goToRecipesView()">Return to Home</button>
    <button
      class="execution-btn"
      :disabled="execution_btn_activation === false"
      @click="goToPillDispensingView()"
    >
      Go to Execution
    </button>
  </div>
</template>

<style>
button:hover {
  background-color: lightgrey;
}
button:disabled {
  cursor: not-allowed;
  background-color: gray;
  /*opacity: 0.6;*/
}

.img-prototype {
  width: 100%;
  height: 425px;
}

.container {
  position: relative;
  width: 100%;

  margin: auto;
}

.cancel-button {
  border-color: #cf2e2e;
  width: 120px;
  height: 34px;
  background-color: white;
  color: #cf2e2e;
  font-weight: bolder;
  font-size: 13px;
  border-radius: 5px;
  position: relative;
  margin-right: 20px;
}

.execution-btn {
  width: 120px;
  height: 34px;
  background-color: #cf2e2e;
  color: white;
  //padding: 12px 24px;
  position: relative;
  border: none;
  cursor: pointer;
  border-radius: 5px;
  font-weight: bolder;
  font-size: 13px;
}
.run-all-tests-btn {
  background-color: darkgray;
  color: white;
  font-size: 16px;
  padding: 12px 24px;
  border: none;
  cursor: pointer;
  border-radius: 7px;
  margin-bottom: 10px;
  margin-top: 5px;
  margin-right: 70px;
}
.tubes-btn {
  position: absolute;
  top: 10%;
  left: 45%;
  background-color: cornflowerblue;
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
  background-color: cornflowerblue;
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
  background-color: cornflowerblue;
  color: white;
  font-size: 16px;
  padding: 12px 24px;
  border: none;
  cursor: pointer;
  border-radius: 5px;
}
.band-btn {
  position: absolute;
  top: 50%;
  left: 70%;
  background-color: #555;
  color: white;
  font-size: 16px;
  padding: 12px 24px;
  border: none;
  cursor: pointer;
  border-radius: 5px;
}

/* The switch - the box around the slider */
.switch {
  position: relative;
  display: inline-block;
  width: 60px;
  height: 34px;
}

/* Hide default HTML checkbox */
.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

/* The slider */
.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  -webkit-transition: 0.4s;
  transition: 0.4s;
}

.slider:before {
  position: absolute;
  content: '';
  height: 26px;
  width: 26px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  -webkit-transition: 0.4s;
  transition: 0.4s;
}

input:checked + .slider {
  background-color: #2196f3;
}

input:focus + .slider {
  box-shadow: 0 0 1px #2196f3;
}

input:checked + .slider:before {
  -webkit-transform: translateX(26px);
  -ms-transform: translateX(26px);
  transform: translateX(26px);
}

/* Rounded sliders */
.slider.round {
  border-radius: 34px;
}

.slider.round:before {
  border-radius: 50%;
}
</style>
