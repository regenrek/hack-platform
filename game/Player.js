import Phaser from "phaser";

export const PLAYER_CONFIG = {
  gravity: {
    scale: 800,
    fallMultiplier: 1.2,
    glide: 80,
  },
  speed: {
    walk: 150,
    run: 250,
    crouch: 100,
    maxFall: 500,
    maxUpwards: 300,
    wallSlide: 100,
    glide: 120,
  },
  jump: {
    force: 350,
    maxJumps: 2,
    wallForce: { x: 200, y: 350 },
    coyoteTime: 100, // ms
    bufferTime: 150, // ms
  },
  dash: {
    speed: 600,
    duration: 200, // ms
    maxDashes: 1,
    cooldown: 200, // ms
  },
};

export default class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    // Instead of a single 'player' frame, start with idle01 by default
    super(scene, x, y, "idle01");
    this.initializePlayer(scene);
  }

  initializePlayer(scene) {
    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.state = {
      currentJumps: PLAYER_CONFIG.jump.maxJumps,
      currentDashes: PLAYER_CONFIG.dash.maxDashes,
      facingRight: true,
      lastOnGroundTime: 0,
      dashing: false,
      gliding: false,
      crouching: false,
      attacking: false, // Add attacking state
    };

    this.cursors = scene.input.keyboard.createCursorKeys();
    this.attackKey = scene.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.A
    );

    this.setCollideWorldBounds(true);
    this.setGravityY(PLAYER_CONFIG.gravity.scale);

    // Scale the player up to match 50x50 tiles better
    this.setScale(2);

    // Start idle animation by default
    this.play("idle");
  }

  update(time, delta) {
    // If dashing or attacking, we might temporarily ignore other states
    if (this.state.dashing) return;
    if (this.state.attacking) return;

    this.handleGroundCheck(time);
    this.handleMovement();
    this.handleJump(time);
    this.handleGlide();
    this.handleDash(time);
    this.limitFallSpeed();
    this.handleAttack();

    this.updateAnimationState();
  }

  handleGroundCheck(time) {
    const onGround = this.body.blocked.down;
    if (onGround) {
      this.state.lastOnGroundTime = time + PLAYER_CONFIG.jump.coyoteTime;
      this.state.currentJumps = PLAYER_CONFIG.jump.maxJumps;
    }
  }

  handleMovement() {
    let moveSpeed = PLAYER_CONFIG.speed.run;
    let horizontalInput = 0;

    if (this.cursors.left.isDown) horizontalInput = -1;
    else if (this.cursors.right.isDown) horizontalInput = 1;

    if (this.cursors.down.isDown && this.body.blocked.down) {
      this.state.crouching = true;
      moveSpeed = PLAYER_CONFIG.speed.crouch;
    } else {
      this.state.crouching = false;
    }

    this.setVelocityX(horizontalInput * moveSpeed);
    this.updateFacing(horizontalInput);
  }

  updateFacing(horizontalInput) {
    if (horizontalInput < 0 && this.state.facingRight) {
      this.state.facingRight = false;
      this.setFlipX(true);
    } else if (horizontalInput > 0 && !this.state.facingRight) {
      this.state.facingRight = true;
      this.setFlipX(false);
    }
  }

  handleJump(time) {
    const onGround = this.body.blocked.down;

    if (Phaser.Input.Keyboard.JustDown(this.cursors.up)) {
      if (
        this.state.currentJumps > 0 &&
        (onGround || time < this.state.lastOnGroundTime)
      ) {
        this.setVelocityY(-PLAYER_CONFIG.jump.force);
        this.state.currentJumps--;
      }
    }

    if (Phaser.Input.Keyboard.JustUp(this.cursors.up)) {
      if (this.body.velocity.y < -PLAYER_CONFIG.jump.force / 2) {
        this.setVelocityY(this.body.velocity.y / 2);
      }
    }
  }

  handleGlide() {
    if (
      !this.body.blocked.down &&
      this.cursors.down.isDown &&
      this.body.velocity.y > 0
    ) {
      this.state.gliding = true;
      this.setVelocityY(
        Math.min(this.body.velocity.y, PLAYER_CONFIG.speed.glide)
      );
      this.setGravityY(PLAYER_CONFIG.gravity.glide);
    } else {
      this.state.gliding = false;
      this.setGravityY(PLAYER_CONFIG.gravity.scale);
    }
  }

  handleDash(time) {
    if (
      this.state.currentDashes > 0 &&
      Phaser.Input.Keyboard.JustDown(this.cursors.space)
    ) {
      this.performDash();
    }
  }

  performDash() {
    this.state.dashing = true;
    this.state.currentDashes--;

    const dashDirX = this.state.facingRight ? 1 : -1;
    this.setVelocity(dashDirX * PLAYER_CONFIG.dash.speed, 0);

    this.scene.time.delayedCall(
      PLAYER_CONFIG.dash.duration,
      this.endDash,
      null,
      this
    );
  }

  endDash() {
    this.state.dashing = false;
    this.scene.time.delayedCall(PLAYER_CONFIG.dash.cooldown, () => {
      if (this.state.currentDashes < PLAYER_CONFIG.dash.maxDashes) {
        this.state.currentDashes++;
      }
    });
  }

  limitFallSpeed() {
    if (this.body.velocity.y > PLAYER_CONFIG.speed.maxFall) {
      this.setVelocityY(PLAYER_CONFIG.speed.maxFall);
    }
  }

  handleAttack() {
    if (Phaser.Input.Keyboard.JustDown(this.attackKey)) {
      // Start attacking
      this.state.attacking = true;
      this.setVelocityX(0); // Stop moving while attacking
      this.play("attack");
      // When attack animation finishes, switch back to normal state
      this.once(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
        this.state.attacking = false;
      });
    }
  }

  updateAnimationState() {
    if (this.state.attacking) return; // If attacking, no need to change anim

    const onGround = this.body.blocked.down;
    const velocityX = this.body.velocity.x;
    const isMoving = Math.abs(velocityX) > 10; // Some threshold
    const isFalling = this.body.velocity.y > 10;

    if (!onGround && isFalling && this.state.gliding) {
      // Currently, we have no glide anim, so staying with idle or run might be okay.
      // If you have a glide animation, you can trigger it here.
      // this.play('glide', true);
    } else if (onGround && isMoving) {
      this.play("run", true);
    } else if (onGround && !isMoving) {
      this.play("idle", true);
    }
  }
}
