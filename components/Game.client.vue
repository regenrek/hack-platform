<script setup lang="ts">
import PhaserGame from "nuxtjs-phaser/phaserGame.vue";
const { $bus } = useNuxtApp();

const gameState = useGameState("gameState");

const createGame = ref(undefined);
async function getGame() {
  const { createGame: createGameFn } = await import("~/game/main");
  createGame.value = createGameFn;
}
function setPhaserFocus() {
  const phaser = document.getElementById("phaser");
  if (phaser) phaser.focus();
}

onMounted(async () => {
  await getGame();
  nextTick(() => setPhaserFocus());
});

function gameStateBus() {
  send(
    JSON.stringify({
      type: "gamestate",
      uuid: userData.value.uuid,
      id: userData.value.id,
      content: { roomKey: args.roomKey, name: userData.value.name },
    })
  );
}

$bus.on("gameState", gameStateBus);

onUnmounted(async () => {
  $bus.off("gameState", gameStateBus);
});
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
