
const LARGERUR_FENETRE = 300
const HAUTEUR_FENETRE = 480
class home extends Phaser.Scene {
    constructor() {
        super();
    }

    preload() {
        this.load.image('background', 'image/space-background.bmp');
    }

    create() {
        this.add.image(0 , 0, 'background');
    }
}
const config = {
    type: Phaser.AUTO,
    width: LARGERUR_FENETRE,
    height: HAUTEUR_FENETRE,
    physics: {
        default: 'arcade',
    },
    scene: home
};

var jeu = new Phaser.Game(config)
