import Phaser from "phaser";
import { onPlayerJoin, insertCoin, isHost, myPlayer, isStreamScreen } from "playroomkit";

import LeftArrow from './assets/left.png';
import RightArrow from './assets/right.png';
import UpArrow from './assets/up.png';
import DownArrow from './assets/down.png';
import player from "./assets/Player.png";


class Main extends Phaser.Scene {
  controls = {};
  players = [];



  preload() {
    this.load.image('player', player);
  }



  create() {
    // 1. Handle players joining and quiting.
    onPlayerJoin(playerState => this.addPlayer(playerState));


  }

  addPlayer(playerState) {
    const sprite = this.add.rectangle(
      Phaser.Math.Between(100, 500), 200, 50, 50, playerState.getProfile().color.hex);

    // const sprite = this.add.sprite(Phaser.Math.Between(100, 500), 200, player);

    this.physics.add.existing(sprite, false);
    sprite.body.setCollideWorldBounds(true);
    this.players.push({
      sprite,
      state: playerState
    });
    playerState.onQuit(() => {
      sprite.destroy();
      this.players = this.players.filter(p => p.state !== playerState);
    });
  }


  update() {
    // 3. Pass your game state to Playroom.
    if (isHost()) {
      for (const player of this.players) {

        // TODO: Movement goes here

        player.state.setState("pos", {
          x: player.sprite.body.x,
          y: player.sprite.body.y,
        });
      }
    }
    else {
      for (const player of this.players) {
        const pos = player.state.getState("pos");
        if (pos) {
          player.sprite.body.x = pos.x;
          player.sprite.body.y = pos.y;
        }
      }
    }
  }
}

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  parent: 'game',
  backgroundColor: '#3498db',
  physics: {
    default: 'arcade',
  },
  scene: Main
};



// controls
class Control extends Phaser.Scene {
  constructor() {
    super('Control');
  }

  preload() {
    this.load.image('left', LeftArrow);
    this.load.image('right', RightArrow);
    this.load.image('up', UpArrow);
    this.load.image('down', DownArrow);
  }

  create() {
    const left = this.add.image(100, 400, 'left').setInteractive();
    const right = this.add.image(700, 400, 'right').setInteractive();
    const up = this.add.image(400, 100, 'up').setInteractive();
    const down = this.add.image(400, 700, 'down').setInteractive();


    // set scale to 0.7
    left.setScale(0.4);
    right.setScale(0.4);
    up.setScale(0.4);
    down.setScale(0.4);

    left.on('pointerdown', () => {
      alert('Left key clicked!');
    });

    right.on('pointerdown', () => {
      alert('right key clicked!');
    });

    up.on('pointerdown', () => {
      alert('up key clicked!');
    });

    down.on('pointerdown', () => {
      alert('down key clicked!');
    });

  }

  update() {

    // if(isHost()) {
    //   // if (this.controls.left.isDown) {
    //   //   console.log("left");
    //   // }
    //   //


  }
}

const controlConfig = {
  type: Phaser.AUTO,

  // mode: Phaser.Scale.FIT, for full screen

  width: 800,
  height: 800,
  parent: 'controller',
  // backgroundColor: '#3498db',
  scene: Control
};



insertCoin({ streamMode: true, baseUrl: '192.168.10.12:8080' }).then(() => {

  if (isStreamScreen()) {
    const game = new Phaser.Game(config);

  } else {
    const controlScene = new Control();
    const game = new Phaser.Game(controlConfig);
    game.scene.add('Control', controlScene, true);
  }
});