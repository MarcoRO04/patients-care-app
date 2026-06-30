<!--
  This component was created for displaying a pop-up.
  Multiple pop-ups are used in the application and reusing the same component
  in different views is better than hardcoding them in each view.
  Remark: This is view is not currently used. It still needs improvement.
  NOTE: recipe and prescription terms are used interchangeably
 -->

<script>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faXmark } from '@fortawesome/free-solid-svg-icons'

export default {
  name: 'PopUp',
  components: { FontAwesomeIcon },
  methods: {
    faXmark() {
      return faXmark
    },
  },
}
</script>

<template>
  <div id="recipes-pop-up">
    <div class="recipes-modal-content">
      <div class="header">
        <h2 class="header-content">Alertă</h2>
        <button class="button-cancel-x">
          <FontAwesomeIcon :icon="faXmark()" />
        </button>
      </div>
      <p style="margin: 20px 2px 10px 2px; color: black; font-size: 20px">Test error</p>
      <button class="button-ok">Ok</button>
    </div>
  </div>
</template>

<style scoped>
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
}
.button-cancel-x {
  background-color: transparent;
  color: white;
  margin-right: 0;
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
  padding-top: 200px;
  background-color: rgb(0, 0, 0); /* Fallback color */
  background-color: rgba(0, 0, 0, 0.4); /* Black w/ opacity */
}
.recipes-modal-content {
  background-color: #fefefe;
  margin: 5% auto 15% auto; /* 5% from the top, 15% from the bottom and centered */
  border: 1px solid black;
  width: 80%; /* Could be more or less, depending on screen size */
}
.button-ok {
  background-color: #cf2e2e;
  color: white;
  margin-right: 10px;
  margin-left: 10px;
  margin-bottom: 20px;
}
</style>
