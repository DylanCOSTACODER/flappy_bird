import StartScene from './StartScene.js';
import MainScene, { screenHeight, screenWidth } from './MainScene.js';
/**
 *
 * Game configurations.
 * @name configurations
 */
const configurations = {
    type: Phaser.AUTO,
    backgroundColor: 0x87ceeb,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        parent: 'flappyBird',
        width: screenWidth,
        height: screenHeight,
    },
    pixelArt: true,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {
                y: 0,
            },
        },
    },
    scene: [StartScene, MainScene],
};

/**
 * The main controller for the entire Phaser game.
 * @name game
 * @type {object}
 */
new Phaser.Game(configurations);
