export default class SelectScene extends Phaser.Scene {
    constructor() {
        super('SelectScene');
    }
    /**
     *   Load the game assets.
     */
    preload() {
        this.load.image('doug', 'assets/doug.png');
        this.load.image('noug', 'assets/noug.png');
    }

    /**
     *  Create the game objects (images, groups, sprites and animations).
     */
    create() {
        // Set background fixed
        this.backgroundSprite = this.physics.add.sprite(0, 0, 'backgroundSprite').setOrigin(0, 0);
        this.backgroundSprite.displayWidth = this.game.config.width;
        this.backgroundSprite.displayHeight = this.game.config.height;
        this.backgroundSprite.setFrame(0);
        // Init doug and noug
        let doug = this.add.image(this.game.config.width / 4, this.game.config.height / 2, 'doug').setInteractive();
        let noug = this.add
            .image((this.game.config.width * 3) / 4, this.game.config.height / 2, 'noug')
            .setInteractive();
        doug.setScale(this.game.config.width > this.game.config.height ? 10 : 3);
        noug.setScale(this.game.config.width > this.game.config.height ? 10 : 3);

        // Y position of names
        let offsetYName = this.game.config.width > this.game.config.height ? 100 : 25;

        // Init instructions
        let instructions = this.add.bitmapText(
            0,
            this.game.config.height / 4,
            'pressstart',
            ['Clique sur un personnage'],
            this.game.config.width > this.game.config.height ? 32 : 16
        );
        instructions.tint = 0;
        instructions.x = this.game.config.width / 2 - instructions.width / 2;

        // Init doug name
        let dougName = this.add.bitmapText(
            this.game.config.width / 4,
            this.game.config.height / 2,
            'pressstart',
            ['Doug'],
            this.game.config.width > this.game.config.height ? 32 : 16
        );
        dougName.tint = 0;
        dougName.x = this.game.config.width / 4 - dougName.width / 2;
        dougName.y = doug.y + offsetYName;

        // Init noug name
        let nougName = this.add.bitmapText(
            (this.game.config.width * 3) / 4,
            this.game.config.height / 2,
            'pressstart',
            ['Noug'],
            this.game.config.width > this.game.config.height ? 32 : 16
        );
        nougName.tint = 0;
        nougName.x = (this.game.config.width * 3) / 4 - nougName.width / 2;
        nougName.y = noug.y + offsetYName;

        doug.on(
            'pointerdown',
            () => {
                //introSong.stop();
                this.goToMainScene('doug');
            },
            this
        );
        noug.on(
            'pointerdown',
            () => {
                //introSong.stop();
                this.goToMainScene('noug');
            },
            this
        );
    }

    /**
     * Go to Main Scene with character choice
     * @param {*} choice name of
     */
    goToMainScene(choice) {
        this.scene.start('MainScene', { choice: choice });
    }
}
