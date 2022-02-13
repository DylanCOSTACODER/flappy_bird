import StartScene from './StartScene.js';
import MainScene from './MainScene.js';
import EndScene from './EndScene.js';
import SelectScene from './SelectScene.js';

/**
 * Configuration of the game
 */
const configurations = {
    type: Phaser.AUTO,
    backgroundColor: 0x87ceeb,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        parent: 'flappyBird',
        width: window.innerWidth,
        height: window.innerHeight,
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
    scene: [StartScene, SelectScene, MainScene, EndScene],
};

/**
 * The main controller for the entire Phaser game.
 * @name game
 * @type {object}
 */
new Phaser.Game(configurations);
