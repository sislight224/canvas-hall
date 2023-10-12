<template>
  <v-app>
    <v-main>
      <CanvasHallData/>
      <!-- <CanvasHall/> -->
    </v-main>
  </v-app>
</template>

<script>
import CanvasHallData from './components/CanvasHallData/CanvasHallData.vue';
// import CanvasHall from './components/CanvasHall';

export default {
  name: 'App',

  components: {
    CanvasHallData,
    // CanvasHall
  },

  data: () => ({
    //
  }),
};
</script>
