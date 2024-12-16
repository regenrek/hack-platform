import { Boot } from "./scenes/Boot";
import { MainMenu } from "./scenes/MainMenu";
import { Preloader } from "./scenes/Preloader";
import { Play } from "./scenes/Play";
import { EnterName } from "./scenes/EnterName";

export const createGame = (config = {}) =>
  new Phaser.Game({
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: "phaser",
    dom: {
      createContainer: true,
    },
    scale: {
      mode: Phaser.Scale.FIT,
    },
    input: {
      mouse: {
        target: "phaser",
      },
      touch: {
        target: "phaser",
      },
    },
    scale: {
      // Fit to window
      mode: Phaser.Scale.FIT,
    },
    backgroundColor: "#fdf6e3",
    pixelArt: true,
    physics: {
      default: "arcade",
      arcade: {
        gravity: { y: 900 },
      },
    },
    scene: [Boot, Preloader, MainMenu, Play, EnterName],
  });
