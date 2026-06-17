import { createStore } from 'vuex'

// Create a new store instance.
export const store = createStore({
  state() {
    return {
      count: 12,
      test_banda: 0,
      test_stick:0,
    }
  },
  mutations: {
    increment(state) {
      state.count++
    },
    changeTestBand(state,value) {
      state.test_banda = value
    },
    changeTestStick(state,value) {
      state.test_stick = value
    }
  },
})

