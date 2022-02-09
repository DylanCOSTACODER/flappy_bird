import MainScene, { screenHeight, screenWidth } from './MainScene.js';

export default class StartScene extends Phaser.Scene {
    constructor() {
        super('StartScene');
    }

    preload() {
        this.load.image('restart', 'assets/restart-button.png');
        this.load.image('background', 'assets/background.png');
    }

    create() {
        let background = this.add.image(this.cameras.main.width, this.cameras.main.height, 'background');
        let scaleX = this.cameras.main.width;
        let scaleY = this.cameras.main.height;
        let scale = Math.max(scaleX, scaleY);
        background.setScale(scale).setScrollFactor(0);
        this.restart = this.physics.add.sprite(this.game.config.width / 2, this.game.config.height / 2, 'restart');
        this.input.on('pointerdown', this.goToMainScene, this);
    }

    goToMainScene() {
        this.scene.start('MainScene');
    }
}
