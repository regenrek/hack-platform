import { Scene } from "phaser";
import InputText from "phaser3-rex-plugins/plugins/inputtext.js";
import { useUserData } from "~/composables/userData";
import { usePlayersDb } from "~/composables/usePlayersDb";

export class EnterName extends Scene {
  constructor() {
    super("EnterName");
    this.userData = useUserData();
  }

  create() {
    // Get the center coordinates of the game
    const centerX = this.cameras.main.centerX;
    const centerY = this.cameras.main.centerY;

    // Add background
    this.add.image(0, 0, "menu-background").setOrigin(0, 0);

    // Add text input background centered
    this.add.image(centerX, centerY - 40, "text-input").setOrigin(0.5);

    // Add text prompt above input field
    this.add
      .text(centerX, centerY - 80, "enter your name here", {
        fontSize: "16px",
        color: "#fff",
        fontFamily: "sans-serif",
      })
      .setOrigin(0.5);

    // Create InputText field
    const nameInput = new InputText(this, centerX, centerY - 40, 125, 35, {
      type: "text",
      id: "nameInput",
      fontSize: "16px",
      color: "#ffffff",
      backgroundColor: "transparent",
      border: 0,
      outline: "none",
      align: "center",
      fontFamily: "sans-serif",
    }).setOrigin(0.5);
    this.add.existing(nameInput);

    // Create confirm button
    const confirmButton = this.add
      .text(centerX, centerY + 40, "CONFIRM", {
        fontSize: "32px",
        fill: "#fff",
        backgroundColor: "#333",
        padding: { x: 20, y: 10 },
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true })
      .on("pointerover", () => confirmButton.setStyle({ fill: "#ff0" }))
      .on("pointerout", () => confirmButton.setStyle({ fill: "#fff" }))
      .on("pointerdown", () => confirmButton.setScale(0.95))
      .on("pointerup", async () => {
        confirmButton.setScale(1);

        const playerName = nameInput.text.trim();
        if (!playerName) {
          return;
        }

        const { createPlayer } = usePlayersDb();
        const newPlayer = await createPlayer(playerName);

        if (newPlayer && newPlayer.id) {
          this.userData.value.name = playerName;
          this.userData.value.id = newPlayer.id;
          this.startPlayScene();
        }
      });
  }

  startPlayScene() {
    this.cameras.main.fadeOut(500);
    this.cameras.main.once("camerafadeoutcomplete", () => {
      this.scene.start("Play");
    });
  }
}
