import { createStore } from 'vuex'

// Create a new store instance.
export const store = createStore({
  state() {
    return {
      count: 12,
      test_banda: 0,
      test_stick: 0,
      pills_collection: [
        {
          id: 'W43451001',
          name: '5 - FLUOROURACIL EBEWE 50mg/ml',
        },
        {
          id: 'W66137001',
          name: 'ACICLOVIR FITERMAN 50 mg/g',
        },
        {
          id: 'W71207001',
          name: 'ALFAGEM 2 g',
        },
        {
          id: 'W55421015',
          name: 'EMANERA 20 mg',
        },
        {
          id: 'W70417025',
          name: 'KOSTAROX 90 mg',
        },
      ],
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

