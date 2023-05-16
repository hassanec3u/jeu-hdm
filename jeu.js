const LARGEUR_FENETRE = 300;
const HAUTEUR_FENETRE = 480;
var VELOCITE_LATERAL_VAISSEAU = 200
var VELOCITE_HORIZONTALE_VAISSEAU = 250
var VELOCITE_HORIZONTALE_BULLET = 700
var SCORE = 0
var NB_ENNEMIES_TUEE = 0
const VELOCITE_ENNEMI = 200; // la vitesse de l'ennemi
const INTERVALLE_ENNEMI = 2000; //  l'intervalle de temps entre chaque création d'ennemi


class Home extends Phaser.Scene {
    constructor() {
        super("home");
        this.vaisseau = null;
        this.cursors = null;
        this.bullets = null;
        this.bomb = null;
        this.bulletSound = null;
        this.enemyTimer = null;

    }



    preload() {
        this.load.image("vaisseau", "image/vaisseau.png");
        this.load.image("bg", "image/background.png");
        this.load.image("bullet", "image/bullet.png");
        this.load.audio("bulletSound", "audio/shoot.wav");
        this.load.image("enemy", "image/enemy.png")

    }

    create() {
        this.add.image(0, 0, "bg");
        this.scoreText = this.add.text(10, 10, 'Score:' + SCORE, { fontSize: '24px', fill: '#ffffff' }); //affichage du score        
        this.cursors = this.input.keyboard.createCursorKeys();
        this.bullets = this.physics.add.group(); // Création d'un groupe de projectiles
        this.vaisseau = this.physics.add.image(LARGEUR_FENETRE / 2, HAUTEUR_FENETRE, "vaisseau");
        this.vaisseau.setCollideWorldBounds(true);

        // Chargement du son du tir de projectile
        this.bulletSound = this.sound.add("bulletSound");
        this.input.keyboard.on('keydown-SPACE', this.fireBullet, this); // Écouteur d'événement pour la touche Espace
        this.enemies = this.physics.add.group();

        this.startEnemyTimer();

    }

    update() {
        this.vaisseau.setVelocityX(0); // Arrêt du mouvement horizontal du vaisseau
        this.vaisseau.setVelocityY(0); // Arrêt du mouvement verticale du vaisseau


        if (this.vaisseau) {
            if (this.cursors.left.isDown) {
                this.vaisseau.setVelocityX(-VELOCITE_LATERAL_VAISSEAU); // Déplacement du vaisseau vers la gauche
            } else if (this.cursors.right.isDown) {
                this.vaisseau.setVelocityX(VELOCITE_LATERAL_VAISSEAU); // Déplacement du vaisseau vers la droite

            } else if (this.cursors.up.isDown) {
                SCORE++
                this.scoreText.setText('Score: ' + SCORE);
                this.vaisseau.setVelocityY(-VELOCITE_HORIZONTALE_VAISSEAU)
            } else if (this.cursors.down.isDown) {
                this.vaisseau.setVelocityY(VELOCITE_HORIZONTALE_VAISSEAU)
            }
        }

        // Suppression des projectiles sortis de la zone de jeu
        this.bullets.getChildren().forEach((bullet) => {
            if (bullet.y < 0) {
                bullet.destroy();
            }
        });
        this.physics.world.collide(this.vaisseau, this.enemies, this.enemyCollision, null, this);

    }

    fireBullet() {
        const bullet = this.bullets.create(this.vaisseau.x, this.vaisseau.y, 'bullet'); // Création d'un projectile à la position du vaisseau
        bullet.setVelocityY(-VELOCITE_HORIZONTALE_BULLET); // Déplacement du projectile vers le haut
        this.bulletSound.play();
    }


    createEnemy() {
        const x = Phaser.Math.Between(0, LARGEUR_FENETRE);
        const y = -10;
        const enemy = this.physics.add.image(x, y, "enemy");
        enemy.setVelocityY(VELOCITE_ENNEMI);
    }




    startEnemyTimer() {
        this.enemyTimer = setInterval(() => {
            this.createEnemy();
        }, INTERVALLE_ENNEMI);
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
            gravity: { y: 0 },
        }
    },
    scene: Home
};

var jeu = new Phaser.Game(config);