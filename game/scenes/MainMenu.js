import { Scene } from "phaser";

export class MainMenu extends Scene {
  constructor() {
    super("MainMenu");
  }

  create() {
    this.add.image(0, 0, "menu-background").setOrigin(0, 0);
    // this.logo = this.add.image(logo, 68, "boltpix");
    this.add.image(
      this.cameras.main.centerX, // Half of game width
      this.cameras.main.centerY / 2, // Half of game height
      "boltpix"
    );

    // Add play button in the last 1/3 of screen
    const { width, height } = this.scale;
    const buttonX = width / 2;
    const buttonY = (height / 3) * 2; // Position in last third

    // Create play button using Phaser's built-in button functionality
    const playButton = this.add
      .text(buttonX, buttonY, "PLAY", {
        fontSize: "32px",
        fill: "#fff",
        backgroundColor: "#333",
        padding: { x: 20, y: 10 },
      })
      .setOrigin(0.5) // Center the button
      .setInteractive({ useHandCursor: true }) // Make it clickable with hand cursor
      .on("pointerover", () => {
        playButton.setStyle({ fill: "#ff0" }); // Yellow text on hover
      })
      .on("pointerout", () => {
        playButton.setStyle({ fill: "#fff" }); // White text when not hovering
      })
      .on("pointerdown", () => {
        // Add click effect
        playButton.setScale(0.95);
      })
      .on("pointerup", () => {
        // Reset scale and start play scene
        playButton.setScale(1);
        this.startPlayScene();
      });
  }

  startPlayScene() {
    // Transition to the Play scene with a fade effect
    this.cameras.main.fadeOut(500);
    this.cameras.main.once("camerafadeoutcomplete", () => {
      this.scene.start("Play"); // Make sure 'Play' matches your play scene key
    });
  }

  update() {}
}
