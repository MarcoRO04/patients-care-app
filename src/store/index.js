import { createStore } from 'vuex'

// The mock-up array of pills is store here in order to be reused in multiple views.
export const store = createStore({
  state() {
    return {
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
  },
})

