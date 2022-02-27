// import { this.game.config.height, this.game.config.width } from './MainScene.js';

export default class StartScene extends Phaser.Scene {
    constructor() {
        super('StartScene');
    }

    /**
     *   Load the game assets.
     */
    preload() {
        // this.load.image('start', 'assets/button-play.png');
        this.load.spritesheet('start', 'assets/jouer-sprite-button.png', {
            frameWidth: 64,
            frameHeight: 32,
        });
        this.load.spritesheet('backgroundSprite', 'assets/backgroundforest.png', {
            frameWidth: 1448 / 6,
            frameHeight: 1448 / 6,
        });
        this.load.bitmapFont('pressstart', 'assets/pressstart.png', 'assets/pressstart.fnt');
    }

    /**
     *   Create the game objects (images, groups, sprites and animations).
     */
    create() {
        this.backgroundSprite = this.physics.add.sprite(0, 0, 'backgroundSprite').setOrigin(0, 0);
        this.backgroundSprite.displayWidth = this.game.config.width;
        this.backgroundSprite.displayHeight = this.game.config.height;
        this.backgroundSprite.setFrame(0);
        let scaleStart =
            this.game.config.width > this.game.config.height
                ? this.game.config.width * 0.005
                : this.game.config.width * 0.01;
        let start = this.physics.add
            .sprite(this.game.config.width / 2, this.game.config.height / 2, 'start')
            .setFrame(0)
            .setInteractive();
        start.setScale(scaleStart).setScrollFactor(0);
        start.on('pointerdown', this.goToSelectScene, this);
        this.input.on('pointerover', function (e, button) {
            start.setFrame(1);
        });
        this.input.on('pointerout', function (e, button) {
            start.setFrame(0);
        });
        // let instructions = this.add.bitmapText(
        //     this.game.config.width / 2.75,
        //     this.game.config.height / 4,
        //     'pressstart',
        //     ['CLIQUE POUR JOUER', 'I', 'I', 'V'],
        //     32,
        //     1
        // );
    }
    /**
     * Go to select scene
     */
    goToSelectScene() {
        this.scene.start('SelectScene');
    }
}
