<script setup>
import PhaserGame from "nuxtjs-phaser/phaserGame.vue";
</script>

<template>
  <PhaserGame :createGame="createGame" v-if="createGame" />
</template>
<style>
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
#phaser {
  width: 90vw;
  height: 90vh;
}
</style>
