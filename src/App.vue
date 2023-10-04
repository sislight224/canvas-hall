<template>
  <v-app>
    <v-main>
      <CanvasHallData/>
    </v-main>
  </v-app>
</template>

<script>
import CanvasHallData from './components/CanvasHallData/CanvasHallData.vue';

export default {
  name: 'App',

  components: {
    CanvasHallData,
  },

  data: () => ({
    //
  }),
};
</script>
