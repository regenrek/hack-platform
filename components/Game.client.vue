<script setup lang="ts">
import PhaserGame from "nuxtjs-phaser/phaserGame.vue";
const { $bus } = useNuxtApp();
import { useHighscores } from "~/composables/useHighscores";

const { fetchTopHighscores, saveHighscore } = useHighscores();
const userData = useUserData("userData");

const highscores = ref([]);

const createGame = ref(undefined);
async function getGame() {
  const { createGame: createGameFn } = await import("~/game/main");
  createGame.value = createGameFn;
}
function setPhaserFocus() {
  const phaser = document.getElementById("phaser");
  if (phaser) phaser.focus();
}

// Handle event bus here
function onGameOver(payload) {
  const { score } = payload;
  // Save the score
  saveHighscore(player.id, score).then(async () => {
    // After saving, fetch new highscores
    highscores.value = await fetchTopHighscores();
    // We don't necessarily need to emit anything here unless the scene wants to know.
    // If the scene is still running or we want to show updated results next time highscores are fetched, it's fine.
  });
}

// When main menu requests highscores:
async function onFetchHighscores() {
  highscores.value = await fetchTopHighscores();
  // Emit fetched results back to scene
  $bus.emit("highscoresFetched", { highscores: highscores.value });
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

$bus.on("gameOver", onGameOver);
$bus.on("fetchHighscores", onFetchHighscores);

onUnmounted(() => {
  $bus.off("gameOver", onGameOver);
  $bus.off("fetchHighscores", onFetchHighscores);
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
