import Phaser from "phaser";
import { onPlayerJoin, insertCoin, isHost, myPlayer, isStreamScreen } from "playroomkit";
 
class Main extends Phaser.Scene {
  controls = {};
  players = []; 
 
  create() {
    // 1. Handle players joining and quiting.
    onPlayerJoin(playerState => this.addPlayer(playerState));
 
   
  }
 
  addPlayer(playerState) {
    const sprite = this.add.rectangle(
      Phaser.Math.Between(100, 500), 200, 50, 50, playerState.getProfile().color.hex);
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
    if (isHost()){
      for (const player of this.players) {

        // TODO: Movement goes here

        player.state.setState("pos", {
          x: player.sprite.body.x,
          y: player.sprite.body.y,
        });
      }
    }
    else{
      for (const player of this.players) {
        const pos = player.state.getState("pos");
        if (pos){
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
  parent: 'root',
  backgroundColor: '#3498db',
  physics: {
    default: 'arcade',
  },
  scene: Main
};

if (isStreamScreen()) {
    // Show the Stream screen
  } else {
    // TODO: Show the Controller screen on mobile
  }
 
// 4. Insert Coin! Start the game.
insertCoin({streamMode: false}).then(() => {
  const game = new Phaser.Game(config);
});