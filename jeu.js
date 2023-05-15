// Définition des dimensions de la fenêtre de jeu
const LARGEUR_FENETRE = 300;
const HAUTEUR_FENETRE = 480;

class Home extends Phaser.Scene {
    constructor() {
        super("home");
        this.missile = null;
        this.cursors = null;
    }

    // Chargement des ressources avant le démarrage de la scène
    preload() {
        this.load.image("missile", "image/missile.png");
        this.load.image("bg", "image/background.png");
        this.load.image("bullet", "image/bullet.png")
    }

    // Création des éléments de la scène
    create() {
        this.add.image(0, 0, "bg")
        this.cursors = this.input.keyboard.createCursorKeys();
        this.missile = this.physics.add.image(0, 0, "missile");
        this.missile.setCollideWorldBounds(true);
    }

    // Mise à jour de la logique du jeu à chaque frame
    update() {
        if (this.missile) {
            if (this.cursors.left.isDown) {
                this.missile.setVelocityX(-200); // Déplacement du missile vers la gauche
            } else if (this.cursors.right.isDown) {
                this.missile.setVelocityX(200); // Déplacement du missile vers la droite
            } else {
                this.missile.setVelocityX(0); // Arrêt du mouvement horizontal du missile
            }


        }
    }
}

// Configuration du jeu Phaser
const config = {
    type: Phaser.AUTO,
    width: LARGEUR_FENETRE,
    height: HAUTEUR_FENETRE,
    physics: {
        default: "arcade",
        arcade: {
            gravity: { y: 450 },
        }
    },
    scene: Home
};

var jeu = new Phaser.Game(config);