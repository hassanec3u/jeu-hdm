import Accueil from "./Acceuil.js"
const LARGEUR_FENETRE = 300; // Définition de la largeur de la fenêtre du jeu
const HAUTEUR_FENETRE = 480; // Définition de la hauteur de la fenêtre du jeu
const VELOCITE_LATERAL_VAISSEAU = 200; // Définition de la vitesse latérale (horizontale) du vaisseau du joueur
const VELOCITE_HORIZONTALE_VAISSEAU = 250; // Définition de la vitesse horizontale du vaisseau du joueur
const VELOCITE_HORIZONTALE_BULLET = 700; // Définition de la vitesse horizontale des projectiles tirés par le vaisseau
var SCORE = 0; // Initialisation du score à 0
var NB_VIE = 3;
var gameOver = false;
let NB_ENNEMIES_TUEE = 0; // Initialisation du nombre d'ennemis tués à 0
const VELOCITE_ENNEMI = 200; // Définition de la vitesse des ennemis
const INTERVALLE_ENNEMI = 2000; // Définition de l'intervalle de temps entre chaque création d'un nouvel ennemi


class Home extends Phaser.Scene {
    constructor() {
        super("home");
        this.vaisseau = null; // Variable pour stocker le vaisseau du joueur
        this.cursors = null; // Variable pour stocker les touches du clavier
        this.bullets = null; // Variable pour stocker les projectiles tirés par le vaisseau
        this.bomb = null; // Variable pour stocker la bombe utilisée pour attaquer les ennemis
        this.bulletSound = null; // Variable pour stocker le son associé au tir du vaisseau
        this.explosionSound = null; // Variable pour stocker le son associé à l'explosion des ennemis
        this.enemyTimer = null; // Variable pour stocker le minuteur de création des ennemis
        this.enemies = null; // Variable pour stocker les ennemis présents dans la scène
        this.scoreText = null; // Variable pour stocker le texte affichant le score du joueur
        this.vieText = null
        this.isPaused = false; // Variable pour indiquer si le jeu est en pause ou non
    }

    preload() {
        this.load.image("vaisseau", "image/vaisseau.png");
        this.load.image("heart", "image/heart.png");
        this.load.image("bg", "image/bgStars.png");
        this.load.image("bullet", "image/bullet.png");
        this.load.audio("bulletSound", "audio/shoot.wav");
        this.load.audio("explosionSound", "audio/explosion.wav");
        this.load.image("enemy", "image/enemy.png");
    }

    // ===============================================================================================//
    displayGameOver() {
        const gameOverText = this.add.text(
            this.cameras.main.width / 2,
            this.cameras.main.height / 2,
            'Game Over', { fontSize: '32px', fill: '#fff' }
        );
        gameOverText.setOrigin(0.5);
        this.physics.pause(); // Met  jeu en pause
        this.enemyTimer.paused = true; // Met en pause les  ennemis

    }

    togglePause() {
        this.isPaused = !this.isPaused; // Inverse la valeur de la variable isPaused

        if (this.isPaused) {
            this.physics.pause(); // Met  jeu en pause
            this.enemyTimer.paused = true; // Met en pause les  ennemis
            this.pauseText.setVisible(true); // Affiche le texte de pause
        } else {
            this.physics.resume(); // Reprend  le jeu
            this.enemyTimer.paused = false; // Reprend le minuteur des ennemis
            this.pauseText.setVisible(false); // Masque le texte de pause
        }
    }


    // ===============================================================================================//


    create() {
        this.add.image(0, 0, "bg"); // Ajoute une image de fond
        this.add.image(LARGEUR_FENETRE - 20, 30, "heart"); // Ajoute une image du nombre de vie restantes

        this.scoreText = this.add.text(10, 10, 'Score: ' + SCORE, { fontSize: '24px', fill: '#ffffff' }); // Ajoute un texte pour afficher le score
        this.vieText = this.add.text(LARGEUR_FENETRE - 60, 15, NB_VIE, { fontSize: '24px', fill: '#ffffff' })
        this.cursors = this.input.keyboard.createCursorKeys(); // Crée les touches du clavier pour le contrôle du vaisseau
        this.bullets = this.physics.add.group(); // Crée un groupe de projectiles
        this.vaisseau = this.physics.add.image(LARGEUR_FENETRE / 2, HAUTEUR_FENETRE, "vaisseau"); // Ajoute le vaisseau du joueur
        this.vaisseau.setCollideWorldBounds(true); // Définit les limites de collision du vaisseau avec le monde
        this.bulletSound = this.sound.add("bulletSound"); // Ajoute le son associé au tir du vaisseau
        this.explosionSound = this.sound.add("explosionSound"); // Ajoute le son associé à l'explosion des ennemis
        this.input.keyboard.on('keydown-SPACE', this.fireBullet, this); // Associe la touche d'espace à la fonction de tir des projectiles
        this.enemies = this.physics.add.group(); // Crée un groupe pour les ennemis
        this.startEnemyTimer(); // Démarre le minuteur pour la création des ennemis

        this.physics.add.overlap(this.vaisseau, this.enemies, this.enemyCollision, null, this); // Gère la collision entre le vaisseau et les ennemis
        this.input.keyboard.on('keydown-P', this.togglePause, this); // Associe la touche P à la fonction de mise en pause/reprise du jeu
        this.pauseText = this.add.text(
            LARGEUR_FENETRE / 2,
            HAUTEUR_FENETRE / 2,
            'Jeu en pause', { fontSize: '32px', fill: '#ffffff' }
        ); // Ajoute un texte pour afficher l'état de pause du jeu
        this.pauseText.setOrigin(0.5); // Définit l'origine du texte de pause
        this.pauseText.setVisible(false); // Masque le texte de pause par défaut
    }

    // ===============================================================================================//


    update() {

        if (NB_VIE >= 0) {
            this.vieText.setText(NB_VIE); // Met à jour le texte affichant le score
        }
        this.scoreText.setText('Score: ' + SCORE); // Met à jour le texte affichant le score

        if (this.isPaused) {
            return; // Si le jeu est en pause, on arrête l'exécution du reste du code dans cette fonction
        }
        if (gameOver) {
            this.displayGameOver();
        }


        this.vaisseau.setVelocityX(0); // Réinitialise la vitesse horizontale du vaisseau
        this.vaisseau.setVelocityY(0); // Réinitialise la vitesse verticale du vaisseau

        if (this.vaisseau) {
            if (this.cursors.left.isDown) {
                this.vaisseau.setVelocityX(-VELOCITE_LATERAL_VAISSEAU); // Déplace le vaisseau vers la gauche
            } else if (this.cursors.right.isDown) {
                this.vaisseau.setVelocityX(VELOCITE_LATERAL_VAISSEAU); // Déplace le vaisseau vers la droite
            } else if (this.cursors.up.isDown) {
                this.vaisseau.setVelocityY(-VELOCITE_HORIZONTALE_VAISSEAU); // Déplace le vaisseau vers le haut
            } else if (this.cursors.down.isDown) {
                this.vaisseau.setVelocityY(VELOCITE_HORIZONTALE_VAISSEAU); // Déplace le vaisseau vers le bas
            }
        }

        this.bullets.getChildren().forEach((bullet) => {
            if (bullet.y < 0) {
                bullet.destroy(); // Supprime les projectiles qui sortent de l'écran en haut
            }
        });

        this.physics.overlap(this.bullets, this.enemies, this.bulletEnemyCollision, null, this); // Gère la collision entre les projectiles et les ennemis
    }


    // ===============================================================================================//


    fireBullet() {
        const bullet = this.bullets.create(this.vaisseau.x, this.vaisseau.y, 'bullet'); // Crée un projectile à partir de la position actuelle du vaisseau
        bullet.setVelocityY(-VELOCITE_HORIZONTALE_BULLET); // Définit la vitesse verticale du projectile
        this.bulletSound.play(); // Joue le son associé au tir du vaisseau
    }


    // ===============================================================================================//


    bulletEnemyCollision(bullet, enemy) {
            SCORE++; // Incrémente le score
            bullet.destroy(); // Supprime le projectile
            enemy.destroy(); // Supprime l'ennemi
            // this.scoreText.setText('Score: ' + SCORE); // Met à jour le texte affichant le score
        }
        // ===============================================================================================//

    createEnemy() {
        const x = Phaser.Math.Between(0, LARGEUR_FENETRE); // Génère une position horizontale aléatoire pour l'ennemi
        const y = -10; // Position verticale de départ de l'ennemi (au-dessus de l'écran)
        const enemy = this.enemies.create(x, y, "enemy"); // Crée un ennemi à la position générée
        enemy.setVelocityY(VELOCITE_ENNEMI); // Définit la vitesse verticale de l'ennemi
    }

    // ===============================================================================================//

    enemyCollision(vaisseau, enemy) {
        enemy.destroy(); // Supprime l'ennemi
        this.explosionSound.play(); // Joue le son d'explosion

        NB_VIE--; // Réduit le score d'1 point si le score est supérieur à 0
        if (NB_VIE < 0) {
            gameOver = true
        }
    }

    // ===============================================================================================//

    startEnemyTimer() {
        this.enemyTimer = this.time.addEvent({
            delay: INTERVALLE_ENNEMI, // Délai entre chaque création d'ennemi
            callback: this.createEnemy, // Fonction de création de l'ennemi
            callbackScope: this, // Portée du callback (cette scène)
            loop: true // Indique que l'événement doit se répéter en boucle
        });
    }

}

// ===============================================================================================//

const config = {
    type: Phaser.AUTO,
    width: LARGEUR_FENETRE,
    height: HAUTEUR_FENETRE,
    physics: {
        default: "arcade",
        arcade: {
            gravity: { y: 0 }
        }
    },
    scene: [Accueil, Home]
};
// ===============================================================================================//

var jeu = new Phaser.Game(config);