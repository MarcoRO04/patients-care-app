<!-- This view is used to test the mechanism of the dispenser.-->

<script>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faCheck, faCirclePlay, faCircleXmark, faSpinner } from '@fortawesome/free-solid-svg-icons'

export default {
  name: 'ControlDispenserView',
  components: { FontAwesomeIcon },
  mounted() {
    this.check_arduino_connection()
  },
  data() {
    return {
      is_loading: false,
      test_result: '',
      arduino_connection_message: '',
      arduino_connection_status: true,
      tubes_status_button_disable: false,
      band_status_button_disable: false,
      stick_status_button_disable: false,
      showStateButton: 0, // 0 -start , 1 - play , 2 - result ok, 3 - result nok
      execution_btn_activation: false,
      tests_results: [], //0 - tube, 1 - band, 2 - stick
    }
  },
  methods: {
    faCircleXmark() {
      return faCircleXmark
    },
    faCheck() {
      return faCheck
    },
    faSpinner() {
      return faSpinner
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
    getDispenseResponse(test_type) {
      // this.is_loading = true
      // if (test_type === 'testBand') {
      //   this.change_test_status_band()
      // } else {
      //   this.change_test_status_tubes_and_tongue()
      // }
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
          if (!data['arduino']) {
            // un comportament al app
            this.test_result = data['result']
            if (test_type === 'testBand') {
              this.tests_results[1] = 1
            }
            if (test_type === 'testTubes') {
              this.tests_results[0] = 1
            }
            if (test_type === 'testStick') {
              this.tests_results[2] = 1
            }
            console.log(this.tests_results)
            if (this.tests_results[0] === 1 && this.tests_results[1] === 1 && this.tests_results[2] === 1) {
              this.execution_btn_activation = true
            }
            // [tubes,bande,stick] = [ 1,1,1] , [{tubes:0},{bande:1},{stick:0}] , '111' , [true,false,true]
            // daca [1,1,1] atunci activeaza buton execution
            // this.execution_btn_activation = true
            // if (test_type === 'testBand') {
            //   this.change_test_status_band()
            // } else {
            //   this.change_test_status_tubes_and_tongue()
            // }
          } else {
            // alt comportament
          }
          console.log(data['result'])
        })
        .catch((err) => console.log(err))
    },
    change_test_status_band() {
      if (this.is_loading && this.test_result.length === 0) {
        document.getElementById('test_status_band').className = 'loader'
        document.getElementById('test_status_band').textContent = ''
        document.getElementById('test_status_tubes_and_tongue').disabled = true
      }
      if (this.is_loading && this.test_result.length > 0) {
        this.is_loading = false
        document.getElementById('test_status_band').className = 'initial-div'
        document.getElementById('test_status_band').style.backgroundColor = 'lightgreen'
        document.getElementById('test_status_band').textContent = 'Done'
        document.getElementById('test_status_tubes_and_tongue').disabled = false
        this.test_result = ''
      }
    },
    change_test_status_tubes_and_tongue() {
      if (this.is_loading && this.test_result.length === 0) {
        document.getElementById('test_status_tubes_and_tongue').className = 'loader'
        document.getElementById('test_status_tubes_and_tongue').textContent = ''
        document.getElementById('test_status_band').disabled = true
      }
      if (this.is_loading && this.test_result.length > 0) {
        this.is_loading = false
        document.getElementById('test_status_tubes_and_tongue').className = 'initial-div'
        document.getElementById('test_status_tubes_and_tongue').style.backgroundColor = 'lightgreen'
        document.getElementById('test_status_tubes_and_tongue').textContent = 'Done'
        document.getElementById('test_status_tubes_and_tongue').disabled = false
        this.test_result = ''
      }
    },
    changeState() {
      if (this.showStateButton === 0) {
        this.showStateButton = 1
        this.tubes_status_button_disable = true
      } else {
        this.showStateButton++
      }
    },
  },
}
</script>
<template>
  <h1 style="text-align: center">Dispenser Test</h1>
  <p>{{ this.arduino_connection_message }}</p>
  <!--  <div style="margin: 10px">-->
  <!--    <div style="display: flex">-->
  <!--      <p style="margin-right: 10px">Test band</p>-->
  <!--      <button-->
  <!--        id="test_status_band"-->
  <!--        class="initial-state"-->
  <!--        @click="getDispenseResponse('testBand')"-->
  <!--        :disabled="!arduino_connection_status"-->
  <!--      >-->
  <!--        Start-->
  <!--      </button>-->
  <!--    </div>-->
  <!--    <div style="display: flex; margin-top: 20px">-->
  <!--      <p style="margin-right: 10px">Test tubes & stick</p>-->
  <!--      <button-->
  <!--        id="test_status_tubes_and_tongue"-->
  <!--        class="initial-state"-->
  <!--        @click="getDispenseResponse('testTubesAndTongue')"-->
  <!--        :disabled="!arduino_connection_status"-->
  <!--      >-->
  <!--        Start-->
  <!--      </button>-->
  <!--    </div>-->
  <!--  </div>-->

  <div class="container">
    <img src="../assets/prototype.png" alt="Pills dispenser" class="img-prototype" />
    <button
      id="tubes-btn-img"
      class="tubes-btn"
      :disabled="tubes_status_button_disable"
      @click="getDispenseResponse('testTubes')"
    >
      <FontAwesomeIcon v-if="showStateButton === 0" :icon="faCirclePlay()" />
      <FontAwesomeIcon v-else-if="showStateButton === 1" :icon="faSpinner()" />
      <FontAwesomeIcon v-else-if="showStateButton === 2" :icon="faCheck()" />
      <FontAwesomeIcon v-else-if="showStateButton === 3" :icon="faCircleXmark()" />
      Tubes
    </button>
    <button id="stick-btn-img" class="stick-btn" @click="getDispenseResponse('testStick')">
      <FontAwesomeIcon :icon="faCirclePlay()" /> Stick
    </button>
    <button id="band-btn-img" class="band-btn" @click="getDispenseResponse('testBand')">
      <FontAwesomeIcon :icon="faCirclePlay()" /> Band
    </button>
  </div>

  <div style="text-align: center">
    <button class="execution-btn" :disabled="execution_btn_activation === false">Go to Execution</button>
  </div>
</template>
<style>
.loader {
  border: 2px solid #f3f3f3; /* Light grey */
  border-top: 2px solid #0eafab; /* Blue */
  border-radius: 50%;
  width: 20px;
  height: 20px;
  animation: spin 2s linear infinite;
}

button:hover {
  background-color: lightseagreen;
}
button:disabled {
  cursor: not-allowed;
  background-color: #555555;
  opacity: 0.6;
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
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
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
