//export const cameras.main.width = window.innerWidth;
//export const this.game.config.height = window.innerHeight;
/**
 *
 * Game configurations.
 * @name configurations
 */

export const gameOptions = {
    // bird gravity, will make bird fall if you dont flap
    birdGravity: 800,

    // flap thrust
    birdFlapPower: 300,

    // pipe group size
    pipeGroupSize: window.innerWidth > window.innerHeight ? 4 : 2,

    // minimum pipe height, in pixels. Affects hole position
    minPipeHeight: window.innerHeight * (150 / 480),

    // distance range from next pipe, in pixels
    pipeDistance: [
        (window.innerWidth * ((window.innerWidth > window.innerHeight ? 220 : 320) / 320)) / 2,
        (window.innerWidth * ((window.innerWidth > window.innerHeight ? 280 : 380) / 320)) / 2,
    ],

    // hole range between pipes, in pixels
    pipeHole: [window.innerHeight * (100 / 480), window.innerHeight * (130 / 480)],

    // local storage object name
    localStorageName: 'bestFlappyScore',
};

let birdSpeed = window.innerWidth > window.innerHeight ? 300 : 100;

export default class MainScene extends Phaser.Scene {
    constructor() {
        super('MainScene');
    }

    init(data) {
        this.choice = data.choice;
    }
    /**
     *   Load the game assets.
     */
    preload() {
        this.load.image('pipe', 'assets/pipe.png');
        this.load.spritesheet('noug-sprite', 'assets/noug-sprite.png', {
            frameWidth: 34,
            frameHeight: 24,
        });
        this.load.spritesheet('doug-sprite', 'assets/doug-sprite.png', {
            frameWidth: 34,
            frameHeight: 24,
        });
        this.load.audio('passPipe', 'assets/passPipe.wav');
        this.load.audio('jump', 'assets/jump.wav');
    }

    /**
     *   Create the game objects (images, groups, sprites and animations).
     */
    create() {
        // init dynamic background
        this.anims.create({
            key: 'backgroundanim',
            frames: this.anims.generateFrameNumbers('backgroundSprite', {
                frame: [0, 1, 2, 3],
            }),
            frameRate: 3,
            repeat: -1,
        });
        this.backgroundSprite = this.physics.add.sprite(0, 0, 'backgroundSprite').setOrigin(0, 0);
        this.backgroundSprite.displayWidth = this.game.config.width;
        this.backgroundSprite.displayHeight = this.game.config.height;
        this.backgroundSprite.play({ key: 'backgroundanim' });
        let scalebird =
            this.game.config.width > this.game.config.height
                ? this.game.config.width * 0.001
                : this.game.config.height * 0.002;

        if (this.choice == 'noug') {
            this.anims.create({
                key: 'nouganim',
                frames: this.anims.generateFrameNumbers('noug-sprite', {
                    frame: [0, 1, 2],
                }),
                frameRate: 8,
                repeat: -1,
            });
            this.noug = this.physics.add.sprite(80, this.game.config.height / 2, 'noug-sprite');
            this.noug.setScale(scalebird).setScrollFactor(0);
            this.noug.play({ key: 'nouganim' });
            this.noug.body.gravity.y = gameOptions.birdGravity;
            this.input.on('pointerdown', this.flap, this);
        } else if (this.choice == 'doug') {
            this.anims.create({
                key: 'douganim',
                frames: this.anims.generateFrameNumbers('doug-sprite', {
                    frame: [0, 1, 2],
                }),
                frameRate: 8,
                repeat: -1,
            });
            this.doug = this.physics.add.sprite(80, this.game.config.height / 2, 'doug-sprite');
            this.doug.setInteractive();
            this.doug.setScale(scalebird).setScrollFactor(0);
            this.doug.play({ key: 'douganim' });
            this.doug.body.gravity.y = 0;

            this.slide();
        }

        this.pipeGroup = this.physics.add.group();
        this.pipePool = [];
        // Set initialization pipes
        for (let i = 0; i < 4; i++) {
            this.pipePool.push(this.pipeGroup.create(0, 0, 'pipe'));
            this.pipePool.push(this.pipeGroup.create(0, 0, 'pipe'));
            this.placePipes(false);
        }
        this.pipeGroup.setVelocityX(-birdSpeed);
        this.score = 0;
        this.topScore =
            localStorage.getItem(gameOptions.localStorageName) == null
                ? 0
                : localStorage.getItem(gameOptions.localStorageName);
        this.scoreText = this.add.text(10, 10, '');
        this.updateScore(this.score);
    }

    /**
     * Add new pipe group and update score if needed
     * @param {*} addScore - True if we have to update the score
     */
    placePipes(addScore) {
        let passPipe = this.sound.add('passPipe');
        let rightmost = this.getRightmostPipe();
        let pipeHoleHeight = Phaser.Math.Between(gameOptions.pipeHole[0], gameOptions.pipeHole[1]);
        let pipeHolePosition = Phaser.Math.Between((this.game.config.height * 5) / 6, this.game.config.height / 6);
        this.pipePool[0].x =
            rightmost +
            this.pipePool[0].getBounds().width +
            Phaser.Math.Between(gameOptions.pipeDistance[0], gameOptions.pipeDistance[1]);
        this.pipePool[0].y = pipeHolePosition - pipeHoleHeight / 2;
        this.pipePool[0].setOrigin(0, 1);
        this.pipePool[1].x = this.pipePool[0].x;
        this.pipePool[1].y = pipeHolePosition + pipeHoleHeight / 2;
        this.pipePool[1].setOrigin(0, 0);
        this.pipePool = [];
        if (addScore) {
            this.updateScore(1);
            if (this.score % 5 == 0) {
                passPipe.play();
                const addSpeed = window.innerWidth > window.innerHeight ? 100 : 100 / 3;
                birdSpeed = birdSpeed + addSpeed;
                this.pipeGroup.setVelocityX(-birdSpeed);
            }
        }
    }

    /**
     * Update the score and the text score of the player
     * @param {*} inc - the incrementation number of the score
     */
    updateScore(inc) {
        this.score += inc;
        this.scoreText.text = 'Score: ' + this.score + '\nMeilleur: ' + this.topScore;
    }

    /**
     * Update y position of noug when the player click
     */
    flap() {
        let jump = this.sound.add('jump');
        jump.play();
        this.noug.body.velocity.y = -gameOptions.birdFlapPower;
    }

    /**
     * For the Doug mode set doug draggable
     */
    slide() {
        this.input.setDraggable(this.doug);
        this.input.on('drag', function (pointer, gameObject, dragX, dragY) {
            // gameObject.x = dragX;
            gameObject.y = dragY;
        });
    }

    /**
     * Get the position of the last pipe group
     * @returns number - the x position of the last pipe group
     */
    getRightmostPipe() {
        let rightmostPipe = 0;
        this.pipeGroup.getChildren().forEach(function (pipe) {
            rightmostPipe = Math.max(rightmostPipe, pipe.x);
        });
        return rightmostPipe;
    }

    /**
     *  Update the scene frame by frame, responsible for move and rotate the bird and to create and move the pipes.
     */
    update() {
        if (this.choice == 'noug') {
            this.physics.world.collide(
                this.noug,
                this.pipeGroup,
                function () {
                    this.die();
                },
                null,
                this
            );
            if (this.noug.y > this.game.config.height || this.noug.y < 0) {
                this.die();
            }
        } else if (this.choice == 'doug') {
            this.physics.world.collide(
                this.doug,
                this.pipeGroup,
                function () {
                    this.die();
                },
                null,
                this
            );
            if (this.doug.y > this.game.config.height || this.doug.y < 0) {
                this.die();
            }
        }

        this.pipeGroup.getChildren().forEach(function (pipe) {
            if (pipe.getBounds().right < 0) {
                this.pipePool.push(pipe);
                if (this.pipePool.length == 2) {
                    this.placePipes(true);
                }
            }
        }, this);
    }

    die() {
        birdSpeed = window.innerWidth > window.innerHeight ? 300 : 100;
        localStorage.setItem(gameOptions.localStorageName, Math.max(this.score, this.topScore));
        this.scene.start('EndScene');
    }
}
