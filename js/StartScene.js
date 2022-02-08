import MainScene from './MainScene.js';

export default class StartScene extends Phaser.Scene {
    constructor() {
        super('StartScene');
    }

    preload() {
        this.load.image('restart', 'assets/restart-button.png');
    }

    create() {
        this.restart = this.physics.add.sprite(this.game.config.width / 2, this.game.config.height / 2, 'restart');
        this.input.on('pointerdown', this.goToMainScene, this);
    }

    goToMainScene() {
        this.scene.start('MainScene');
    }
}
