export const screenWidth = window.innerWidth;
export const screenHeight = window.innerHeight;
const gameOptions = {
    // bird gravity, will make bird fall if you dont flap
    birdGravity: 800,

    // horizontal bird speed
    birdSpeed: 125,

    // flap thrust
    birdFlapPower: 300,

    // minimum pipe height, in pixels. Affects hole position
    minPipeHeight: screenHeight * (100 / 480),

    // distance range from next pipe, in pixels
    pipeDistance: [screenWidth * (220 / 320), screenWidth * (280 / 320)],

    // hole range between pipes, in pixels
    pipeHole: [screenHeight * (100 / 480), screenHeight * (130 / 480)],

    // local storage object name
    localStorageName: 'bestFlappyScore',
};

export default class MainScene extends Phaser.Scene {
    constructor() {
        super('MainScene');
    }

    /**
     *   Load the game assets.
     */
    preload() {
        this.load.image('pipe', 'assets/pipe.png');
        this.load.image('background', 'assets/background.png');
        this.load.spritesheet('bird', 'assets/bird-sprite.png', {
            frameWidth: 34,
            frameHeight: 24,
        });
    }

    /**
     *   Create the game objects (images, groups, sprites and animations).
     */
    create() {
        let background = this.add.image(this.cameras.main.width, this.cameras.main.height, 'background');
        let scaleX = this.cameras.main.width;
        let scaleY = this.cameras.main.height;
        let scale = Math.max(scaleX, scaleY);
        background.setScale(scale).setScrollFactor(0);
        this.anims.create({
            key: 'birdanim',
            frames: this.anims.generateFrameNumbers('bird', {
                frame: [0, 1, 2],
            }),
            frameRate: 8,
            repeat: -1,
        });

        this.pipeGroup = this.physics.add.group();
        this.pipePool = [];
        for (let i = 0; i < 4; i++) {
            this.pipePool.push(this.pipeGroup.create(0, 0, 'pipe'));
            this.pipePool.push(this.pipeGroup.create(0, 0, 'pipe'));
            this.placePipes(false);
        }
        this.pipeGroup.setVelocityX(-gameOptions.birdSpeed);

        this.bird = this.physics.add.sprite(80, this.game.config.height / 2, 'bird');
        this.bird.play({ key: 'birdanim' });
        this.bird.body.gravity.y = gameOptions.birdGravity;
        this.input.on('pointerdown', this.flap, this);
        this.score = 0;
        this.topScore =
            localStorage.getItem(gameOptions.localStorageName) == null
                ? 0
                : localStorage.getItem(gameOptions.localStorageName);
        this.scoreText = this.add.text(10, 10, '');
        this.updateScore(this.score);
    }

    placePipes(addScore) {
        let rightmost = this.getRightmostPipe();
        let pipeHoleHeight = Phaser.Math.Between(gameOptions.pipeHole[0], gameOptions.pipeHole[1]);
        let pipeHolePosition = Phaser.Math.Between(
            gameOptions.minPipeHeight + pipeHoleHeight / 2,
            this.game.config.height - gameOptions.minPipeHeight - pipeHoleHeight / 2
        );
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
        }
    }

    updateScore(inc) {
        this.score += inc;
        this.scoreText.text = 'Score: ' + this.score + '\nMeilleur: ' + this.topScore;
    }

    flap() {
        this.bird.body.velocity.y = -gameOptions.birdFlapPower;
    }

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
        this.physics.world.collide(
            this.bird,
            this.pipeGroup,
            function () {
                this.die();
            },
            null,
            this
        );
        if (this.bird.y > this.game.config.height || this.bird.y < 0) {
            this.die();
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
        localStorage.setItem(gameOptions.localStorageName, Math.max(this.score, this.topScore));
        this.scene.start('StartScene');
    }
}
