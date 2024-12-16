import { Scene } from "phaser";

export class Preloader extends Scene {
  constructor() {
    super("Preloader");
  }

  init() {}
  preload() {
    this.load.setPath("assets");
    this.load.image("menu-background", "menu-background.png");
    this.load.image("game-background", "game-background.png");
    this.load.image("boltpix", "boltpix.png");
    // this.load.image("player", "player/idle/idle01.png");
    this.load.image("ground_tile", "ground/ground1.png");

    // Idle frames
    for (let i = 1; i <= 4; i++) {
      this.load.image("idle01", `player/idle/idle0${i}.png`);
    }

    // Run frames
    for (let i = 1; i <= 8; i++) {
      this.load.image(`run0${i}`, `player/run/run0${i}.png`);
    }

    // Attack frames
    for (let i = 1; i <= 6; i++) {
      this.load.image(`attack0${i}`, `player/attack/attack0${i}.png`);
    }
  }
  create() {
    this.scene.start("MainMenu");
  }
}
