<script>
 export default {
   name: 'ReteteView',
   components: {},
   mounted() {

   },
   data(){
     return {
       recipe:{
         id:"",
         recipe_name:"",
         patient_name:"",
         doctor_name:"",
         future_prescription_date:"",
         recipe_duration:"",
         last_prescription_dates:[],
         status:"",
         distance_between_prescriptions:""
       },
       recipes_list: [],
     }
   },
   methods:{

   },
 }
</script>
<template>
  <p>Lista retete</p>
</template>
<style>

</style>
