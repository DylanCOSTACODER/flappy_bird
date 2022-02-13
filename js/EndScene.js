// import { this.game.config.height, this.game.config.width } from './MainScene.js';

export default class EndScene extends Phaser.Scene {
    constructor() {
        super('EndScene');
    }

    /**
     *   Load the game assets.
     */
    preload() {
        this.load.spritesheet('restart', 'assets/rejouer-sprite-button.png', {
            frameWidth: 64,
            frameHeight: 32,
        });
    }

    /**
     *   Create the game objects (images, groups, sprites and animations).
     */
    create() {
        // Set background
        this.backgroundSprite = this.physics.add.sprite(0, 0, 'backgroundSprite').setOrigin(0, 0);
        this.backgroundSprite.displayWidth = this.game.config.width;
        this.backgroundSprite.displayHeight = this.game.config.height;
        this.backgroundSprite.setFrame(0);
        let scaleStart =
            this.game.config.width > this.game.config.height
                ? this.game.config.width * 0.005
                : this.game.config.width * 0.01;
        let restart = this.physics.add
            .sprite(this.game.config.width / 2, this.game.config.height / 2, 'restart')
            .setFrame(0)
            .setInteractive();
        restart.setScale(scaleStart).setScrollFactor(0);
        restart.on('pointerdown', this.goToStartScene, this);

        this.input.on('pointerover', function (e, button) {
            restart.setFrame(1);
        });

        this.input.on('pointerout', function (e, button) {
            restart.setFrame(0);
        });
    }

    /**
     * Navigate to Select scene
     */
    goToStartScene() {
        this.scene.start('SelectScene');
    }
}
