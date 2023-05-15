const LARGEUR_FENETRE = 300;
const HAUTEUR_FENETRE = 480;

class Home extends Phaser.Scene {
    constructor() {
        super("home");
        this.missile = null;
        this.cursors = null;
        this.bullets = null;
        this.bomb = null;
        this.bulletSound = null;

    }

    preload() {
        this.load.image("missile", "image/missile.png");
        this.load.image("bg", "image/background.png");
        this.load.image("bullet", "image/bullet.png");
        this.load.audio("bulletSound", "audio/shoot.wav");


    }

    create() {
        this.add.image(0, 0, "bg");

        this.cursors = this.input.keyboard.createCursorKeys();
        this.bullets = this.physics.add.group(); // Création d'un groupe de projectiles
        this.missile = this.physics.add.image(140, 0, "missile");

        this.missile.setCollideWorldBounds(true);

        // Chargement du son du tir de projectile
        this.bulletSound = this.sound.add("bulletSound");
        this.input.keyboard.on('keydown-SPACE', this.fireBullet, this); // Écouteur d'événement pour la touche Espace

    }

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

        // Suppression des projectiles sortis de la zone de jeu
        this.bullets.getChildren().forEach((bullet) => {
            if (bullet.y < 0) {
                bullet.destroy();
            }
        });

    }

    fireBullet() {
        if (this.missile) {
            const bullet = this.bullets.create(this.missile.x, this.missile.y, 'bullet'); // Création d'un projectile à la position du missile
            bullet.setVelocityY(-700); // Déplacement du projectile vers le haut
            this.bulletSound.play();
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