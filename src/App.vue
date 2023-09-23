<template>
  <v-app>
    <v-main>
      <CanvasHall/>
    </v-main>
  </v-app>
</template>

<script>
import CanvasHall from './components/CanvasHall';

export default {
  name: 'App',

  components: {
    CanvasHall,
  },

  data: () => ({
    //
  }),
};
</script>
