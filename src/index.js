import Phaser from 'phaser';
import logoImg from './assets/logo.png';
import {isStreamScreen, onPlayerJoin, insertCoin, isHost, myPlayer } from "playroomkit";

if (isStreamScreen()) {
    // Show the Stream screen
  } else {
    // Show the Controller screen
  }

class MyGame extends Phaser.Scene {
    constructor() {
        super();
    }

    preload() {
        this.load.image('logo', logoImg);
    }

    create() {

        const logo = this.add.image(400, 150, 'logo');

        this.tweens.add({
            targets: logo,
            y: 450,
            duration: 2000,
            ease: "Power2",
            yoyo: true,
            loop: -1
        });
    }

}


const config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    scene: MyGame
};



insertCoin({streamMode: true}).then(() => {
    const game = new Phaser.Game(config);
});
