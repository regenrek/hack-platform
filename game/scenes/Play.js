import { Scene } from "phaser";
import Player, { PLAYER_CONFIG } from "../Player";

export class Play extends Scene {
  constructor() {
    super("Play");
  }

  create() {
    this.playerScore = 0;
    // Access the game store

    console.log("Scene created");
    // Create and add player
    this.add.image(0, 0, "game-background").setOrigin(0, 0);

    // Create animations using the loaded frames:
    this.anims.create({
      key: "idle",
      frames: [
        { key: "idle01" },
        { key: "idle02" },
        { key: "idle03" },
        { key: "idle04" },
      ],
      frameRate: 8,
      repeat: -1,
    });

    this.anims.create({
      key: "run",
      frames: [
        { key: "run01" },
        { key: "run02" },
        { key: "run03" },
        { key: "run04" },
        { key: "run05" },
        { key: "run06" },
        { key: "run07" },
        { key: "run08" },
      ],
      frameRate: 12,
      repeat: -1,
    });

    this.anims.create({
      key: "attack",
      frames: [
        { key: "attack01" },
        { key: "attack02" },
        { key: "attack03" },
        { key: "attack04" },
        { key: "attack05" },
        { key: "attack06" },
      ],
      frameRate: 10,
      repeat: 0,
    });

    this.player = new Player(this, 100, 300);
    // Optionally modify config:
    // PLAYER_CONFIG.speed.run = 300;

    // Setup world, platforms, collision layers, etc.
    const platforms = this.physics.add.staticGroup();
    platforms.create(400, 568, "ground").setScale(2).refreshBody();
    // ... Add more platforms

    this.physics.add.collider(this.player, platforms);

    // this.player = this.physics.add.sprite(x, y, "player");
    // this.player.setCollideWorldBounds(true);
    // this.player.setGravityY(this.gravityScale); // Set your desired gravity here

    // Create a static group to hold ground tiles
    const groundGroup = this.physics.add.staticGroup();

    // We'll place 16 tiles of 50px each along the bottom to cover 800px width:
    const tileSize = 50;
    const numTiles = 800 / tileSize; // 800 / 50 = 16
    for (let i = 0; i < numTiles; i++) {
      // Position each tile so that they line up at the bottom of the screen
      // screen bottom is at y=600, tile is 50px, center at 600 - (tileSize/2)=575
      groundGroup.create(
        i * tileSize + tileSize / 2,
        600 - tileSize / 2,
        "ground_tile"
      );
    }

    // Refresh the static bodies so physics calculations are correct
    groundGroup.refresh();

    // Now your player can collide with these tiles:
    this.physics.add.collider(this.player, groundGroup);
  }

  update(time, delta) {
    // Update player
    this.player.update(time, delta);
  }
}
