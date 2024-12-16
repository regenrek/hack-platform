import { Scene } from "phaser";

export class MainMenu extends Scene {
  constructor() {
    super("MainMenu");
  }

  create() {
    this.add.image(0, 0, "menu-background").setOrigin(0, 0);
    this.add.image(
      this.cameras.main.centerX,
      this.cameras.main.centerY / 2,
      "boltpix"
    );

    const { width, height } = this.scale;

    const playButton = this.add
      .text(width / 2, (height / 3) * 2 - 50, "PLAY", {
        fontSize: "32px",
        fill: "#fff",
        backgroundColor: "#333",
        padding: { x: 20, y: 10 },
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true })
      .on("pointerover", () => playButton.setStyle({ fill: "#ff0" }))
      .on("pointerout", () => playButton.setStyle({ fill: "#fff" }))
      .on("pointerdown", () => playButton.setScale(0.95))
      .on("pointerup", () => {
        playButton.setScale(1);
        this.startEnterNameScene();
      });

    const highscoreButton = this.add
      .text(width / 2, (height / 3) * 2 + 20, "HIGHSCORES", {
        fontSize: "24px",
        fill: "#fff",
        backgroundColor: "#333",
        padding: { x: 20, y: 10 },
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true })
      .on("pointerover", () => highscoreButton.setStyle({ fill: "#ff0" }))
      .on("pointerout", () => highscoreButton.setStyle({ fill: "#fff" }))
      .on("pointerdown", () => highscoreButton.setScale(0.95))
      .on("pointerup", () => {
        highscoreButton.setScale(1);
        // Emit fetchHighscores and show in the scene as before, if desired.
        // Omitted for brevity since focus is on name input and saving scores.
      });
  }

  startEnterNameScene() {
    this.cameras.main.fadeOut(500);
    this.cameras.main.once("camerafadeoutcomplete", () => {
      this.scene.start("EnterName");
    });
  }
}
