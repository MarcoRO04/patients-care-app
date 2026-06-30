<!--
  This component was created for displaying the pills distribution table in multiple views.
  NOTE: recipe and prescription terms are used interchangeably
 -->

<script>
export default {
  name: 'PillsConfigurationTable',
  props: {
    prescription_id: String,
  },
  mounted() {
    this.getPillsConfigurationFromBE(this.prescription_id)
  },
  data() {
    return {
      pills_table: [],
      morning: [],
      lunch: [],
      dinner: [],
      before_bed: [],
    }
  },
  methods: {
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
          // this.pills_configuration = response['result'][0]
          this.computeData()
        })
        .catch(() => {
          alert('backend error pills configuration table')
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
    },

    // search for the pill name based on the pill id
    getPillName(id) {
      for (let index = 0; index < this.$store.state.pills_collection.length; index++) {
        if (this.$store.state.pills_collection[index].id === id) {
          return this.$store.state.pills_collection[index].name
        }
      }
    },
  },
}
</script>

<template>
  <div>
    <p style="font-weight: bold; margin-bottom: 6px">Distribuție pastile:</p>
    <table>
      <tbody>
        <tr>
          <th>Nr. crt.</th>
          <th>Denumire</th>
          <th>Dimineața</th>
          <th>Prânz</th>
          <th>Cina</th>
          <th>Înainte de culcare</th>
        </tr>
        <tr v-for="(pill, index) in pills_table" :key="index">
          <td>{{ index + 1 }}.</td>
          <td>{{ pill.name }}</td>
          <td>{{ pill.morning_pill_number }}</td>
          <td>{{ pill.lunch_pill_number }}</td>
          <td>{{ pill.dinner_pill_number }}</td>
          <td>{{ pill.before_bed_pill_number }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style>
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
