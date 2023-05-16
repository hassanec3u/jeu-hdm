const LARGEUR_FENETRE = 300;
const HAUTEUR_FENETRE = 480;
const VELOCITE_LATERAL_VAISSEAU = 200;
const VELOCITE_HORIZONTALE_VAISSEAU = 250;
const VELOCITE_HORIZONTALE_BULLET = 700;
let SCORE = 0;
let NB_ENNEMIES_TUEE = 0;
const VELOCITE_ENNEMI = 200;
const INTERVALLE_ENNEMI = 2000;


class Home extends Phaser.Scene {
    constructor() {
        super("home");
        this.vaisseau = null;
        this.cursors = null;
        this.bullets = null;
        this.bomb = null;
        this.bulletSound = null;
        this.explosionSound = null;
        this.enemyTimer = null;
        this.enemies = null;
        this.scoreText = null;
    }

    preload() {
        this.load.image("vaisseau", "image/vaisseau.png");
        this.load.image("bg", "image/background.png");
        this.load.image("bullet", "image/bullet.png");
        this.load.audio("bulletSound", "audio/shoot.wav");
        this.load.audio("explosionSound", "audio/explosion.wav");
        this.load.image("enemy", "image/enemy.png");
    }

    create() {
        this.add.image(0, 0, "bg");
        this.scoreText = this.add.text(10, 10, 'Score: ' + SCORE, { fontSize: '24px', fill: '#ffffff' });
        this.cursors = this.input.keyboard.createCursorKeys();
        this.bullets = this.physics.add.group();
        this.vaisseau = this.physics.add.image(LARGEUR_FENETRE / 2, HAUTEUR_FENETRE, "vaisseau");
        this.vaisseau.setCollideWorldBounds(true);
        this.bulletSound = this.sound.add("bulletSound");
        this.explosionSound = this.sound.add("explosionSound");
        this.input.keyboard.on('keydown-SPACE', this.fireBullet, this);
        this.enemies = this.physics.add.group();
        this.startEnemyTimer();

        this.physics.add.overlap(this.vaisseau, this.enemies, this.enemyCollision, null, this);
    }

    update() {
        this.vaisseau.setVelocityX(0);
        this.vaisseau.setVelocityY(0);

        if (this.vaisseau) {
            if (this.cursors.left.isDown) {
                this.vaisseau.setVelocityX(-VELOCITE_LATERAL_VAISSEAU);
            } else if (this.cursors.right.isDown) {
                this.vaisseau.setVelocityX(VELOCITE_LATERAL_VAISSEAU);
            } else if (this.cursors.up.isDown) {


                this.vaisseau.setVelocityY(-VELOCITE_HORIZONTALE_VAISSEAU);
            } else if (this.cursors.down.isDown) {
                this.vaisseau.setVelocityY(VELOCITE_HORIZONTALE_VAISSEAU);
            }
        }

        this.bullets.getChildren().forEach((bullet) => {
            if (bullet.y < 0) {
                bullet.destroy();
            }
        });
        this.physics.overlap(this.bullets, this.enemies, this.bulletEnemyCollision, null, this);

    }



    fireBullet() {
        const bullet = this.bullets.create(this.vaisseau.x, this.vaisseau.y, 'bullet');
        bullet.setVelocityY(-VELOCITE_HORIZONTALE_BULLET);
        this.bulletSound.play();
    }



    bulletEnemyCollision(bullet, enemy) {
        // Supprimer le projectile et l'ennemi
        bullet.destroy();
        enemy.destroy();

        // Mettre à jour le score
        SCORE++;
        this.scoreText.setText('Score: ' + SCORE);
    }




    createEnemy() {

        const x = Phaser.Math.Between(0, LARGEUR_FENETRE);
        const y = -10;
        const enemy = this.enemies.create(x, y, "enemy");
        enemy.setVelocityY(VELOCITE_ENNEMI);
    }

    enemyCollision(vaisseau, enemy) {
        enemy.destroy();
        this.explosionSound.play()
        if (SCORE > 0) {
            SCORE -= 1;
        }
        this.scoreText.setText('Score: ' + SCORE);
    }

    startEnemyTimer() {
        this.enemyTimer = this.time.addEvent({
            delay: INTERVALLE_ENNEMI,
            callback: this.createEnemy,
            callbackScope: this,
            loop: true
        });
    }
}

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
    scene: Home
};

var jeu = new Phaser.Game(config);