import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
// import "pixi";
// import "p2";
// import * as Phaser from "phaser-ce";

// import { Game } from 'phaser';

declare let Phaser;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})


export class HomePage {
  private phaserObj: any;
  private wheel;
  // can the wheel spin?
  private canSpin;
  // slices (prizes) placed in the wheel
  private slices = 8;
  // prize names, starting from 12 o'clock going clockwise
  private slicePrizes = ["A KEY!!!", "50 STARS", "500 STARS", "BAD LUCK!!!", "200 STARS", "100 STARS", "150 STARS", "BAD LUCK!!!"];
  // the prize you are about to win
  private prize;
  // text field where to show the prize
  private prizeText;
  constructor(public navCtrl: NavController) {
  }

  ionViewDidLoad() {
    this.phaserObj = new Phaser.Game(window.innerWidth, window.innerHeight, Phaser.CANVAS, 'game0', {
      preload: this.preload.bind(this),
      create: this.create.bind(this),
      spin: this.spin.bind(this),
      winPrize: this.winPrize.bind(this)
    });
  }

  preload() {
    this.phaserObj.load.image("wheel", "./assets/wheel.png");
    this.phaserObj.load.image("pin", "./assets/pin.png");
  }

  create() {
    // giving some color to background
    this.phaserObj.stage.backgroundColor = "#FFFFFF";
    // adding the wheel in the middle of the canvas
    this.wheel = this.phaserObj.add.sprite(this.phaserObj.width / 2, this.phaserObj.width / 2, "wheel");
    this.wheel.scale.setTo(0.6,0.6);
    // setting wheel registration point in its center
    this.wheel.anchor.set(0.5);
    // adding the pin in the middle of the canvas
    let pin = this.phaserObj.add.sprite(this.phaserObj.width / 2, this.phaserObj.width / 2, "pin");
    pin.scale.setTo(0.7,0.7);    
    // setting pin registration point in its center
    pin.anchor.set(0.5);
    // adding the text field
    this.prizeText = this.phaserObj.add.text(this.phaserObj.world.centerX, 480, "");
    // setting text field registration point in its center
    this.prizeText.anchor.set(0.5);
    // aligning the text to center
    this.prizeText.align = "center";
    // the this.phaserObj has just started = we can spin the wheel
    this.canSpin = true;
    // waiting for your input, then calling "spin" function
    this.phaserObj.input.onDown.add(this.spin, this);
  }
  // function to spin the wheel
  spin() {
    // can we spin the wheel?
    if (this.canSpin) {
      // resetting text field
      this.prizeText.text = "";
      // the wheel will spin round from 4 to 8 times. This is just coreography
      let rounds = this.phaserObj.rnd.between(5, 15);
      // then will rotate by a random number from 0 to 360 degrees. This is the actual spin
      let degrees = this.phaserObj.rnd.between(0, 360);
      // before the wheel ends spinning, we already know the prize according to "degrees" rotation and the number of slices
      this.prize = this.slices - 1 - Math.floor(degrees / (360 / this.slices));
      // now the wheel cannot spin because it's already spinning
      this.canSpin = false;
      // animation tweeen for the spin: duration 3s, will rotate by (360 * rounds + degrees) degrees
      // the quadratic easing will simulate friction
      let spinTween = this.phaserObj.add.tween(this.wheel).to({
        angle: 360 * rounds + degrees
      }, 6000, Phaser.Easing.Quadratic.Out, true);
      // once the tween is completed, call winPrize function
      spinTween.onComplete.add(this.winPrize, this);
    }
  }
  // function to assign the prize
  winPrize() {
    // now we can spin the wheel again
    this.canSpin = true;
    // writing the prize you just won
    this.prizeText.text = this.slicePrizes[this.prize];
  }

}
