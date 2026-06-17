<!-- This view is used to test the mechanism of the dispenser.-->

<script>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

import {
  faCheck,
  faCircleNotch,
  faCirclePlay,
  faCircleXmark,
} from '@fortawesome/free-solid-svg-icons'
import PopUp from '@/components/PopUp.vue'

export default {
  name: 'TestDispenserView',
  components: { Modal: PopUp, FontAwesomeIcon },
  mounted() {
    this.check_arduino_connection()
    this.$store.commit('changeTestBand', 1)
  },
  updated() {
    console.log('update')
    window.addEventListener('beforeunload', (event) => {
      console.log('beforeunload')
      console.log('event', event)
    })
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
      tests_results: [], //0 - tube, 1 - band, 2 - stick

      showModal: false,

      i: 0,
      speed: 50,
      txt: '\nAm inceput sa testez......\n'
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
            this.showModal = false
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
      // ? ??? ce inseamna sau ce reprezinta 0 -arduino disconnected

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
        this.getDispenseResponse('testBandError')
      } else {
        this.getDispenseResponse('testBandOk')
      }
    },
    getDispenseResponse(test_type) {
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
            // un comportament al app
            // this.test_result = data['result']
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
            // [tubes,bande,stick] = [ 1,1,1] , [{tubes:0},{bande:1},{stick:0}] , '111' , [true,false,true]
            // daca [1,1,1] atunci activeaza buton execution
          } else {
            // alt comportament
          }
          console.log(data['result'])
        })
        .catch((err) => console.log(err))
    },

    goToPillDispensingView() {
      this.$router.push('/dispense_pills')
    },
    updateTerminal() {
      const terminal = document.getElementById('terminal')
      if (terminal) {
        terminal.innerText += '\n@cursor: Raspuns Arduino : Banda ok'
      }
    },
    typeWriter() {
      if (this.i < this.txt.length) {
        document.getElementById('terminal').innerHTML += this.txt.charAt(this.i);
        this.i++;
        setTimeout(this.typeWriter, this.speed);
      }
      else
      {
        this.i = 0;
      }
    },
  },
}
</script>
<template>
  <Modal v-show="showModal"></Modal>

  <h1 style="text-align: center">Dispenser Test</h1>
  <p>{{ this.arduino_connection_message }}</p>
  <div style="display: flex; margin-top: 10px">
    <div style="margin-top: 10px; margin-bottom: 10px">
      Simulated Arduino Errors:
      <label class="switch">
        <input v-model="this.testSoftwareErrors" type="checkbox" />
        <span class="slider round"></span>
      </label>
    </div>
    <div style="margin-top: 10px; margin-right: 10px; margin-left: 10px">
      Run all tests
      <label class="switch">
        <input v-model="this.testSoftwareErrors" type="checkbox" />
        <span class="slider round"></span>
      </label>
    </div>
    <!--    <button id="run-all-tests-btn-img" class="run-all-tests-btn">Run all tests</button>-->
  </div>

  <button @click="typeWriter()">Test</button>
  <div class="container">
    <img src="../assets/prototypeEdited.png" alt="Pills dispenser" class="img-prototype" />
    <div id="terminal" style="background-color: #555555; color: yellowgreen; height: 100px; overflow: scroll">
    cursor
    </div>
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

  <!--  <div>-->
  <!--    <p style="background-color: red">-->
  <!--      {{ test_result }}-->
  <!--      {{ arduino_connection_message }}-->
  <!--    </p>-->
  <!--  </div>-->

  <div style="text-align: center">
    <button
      class="execution-btn"
      :disabled="execution_btn_activation === true"
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
  background-color: gray;
  /*opacity: 0.6;*/
}

.img-prototype {
  width: 100%;
  height: auto;
}

.container {
  position: relative;
  width: 100%;

  margin: auto;
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
