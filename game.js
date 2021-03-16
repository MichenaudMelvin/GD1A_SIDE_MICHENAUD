console.log("congrats, you opened the console");
var config = {
    type: Phaser.AUTO,
    width: 1280,
    height: 720,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {y: 300},
            debug: false,
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

//all variables
var player;
var speedLaser;
var platforms;
var cursors;
var gameOver = false;

var game = new Phaser.Game(config);
var frame = 0;

//pour gestion de vie
var hit;
var reculDone;
var pv = 3;
var frameInvulnerable = 0;

//variables qui permette le jetpack
var text;
var jetpackValue = 100;
var jetpackValueTxt = "";
var ableToUseJet = false;
var checkUpisUp = false;
var startJetPackDone = false;
var frameCheckOnce = false;


//variables pour ennmis
var timerEnnemi = 0;
var deplacementEnnemi;
var alreadyShuffle = false;
var frameDePause1;
var frameDePause2;
var keyA;

//pour ennemis qui tire
var directionLaser;
var laserAlreadyShotEnnemi = false;
var rechargeEnnemi;
var lastPose = "right";
var hitOppo = false;

//pour joueur qui tire
var laserAlreadyShotPlayer = false;

//pour la fireball
var particuleGenerate = false;
var crashFireballTest = false;
var chanceFireball = 0;
var fireballCanBeGenerated = true;
var hitOppoByFireBall = false;
var hitPlayerByFireBall = false;

//pour l'animation du midground
var firstPart = true;
var secondPart = false;
var frameMidground = 0;

function preload (){
    this.load.image('test', 'assets/testItem.png');
    this.load.image('background', 'fichier_de_travail/sideScrollerFichierDeTravail-assets/background.png');
    this.load.image('ground', 'fichier_de_travail/test.png');
    this.load.image('coeur', 'fichier_de_travail/sideScrollerFichierDeTravail-assets/coeur.png');
    this.load.image('coeurVide', 'fichier_de_travail/sideScrollerFichierDeTravail-assets/coeurVide.png');
    this.load.image('laser', 'assets/laser.png');
    this.load.image('particule_1', 'fichier_de_travail/sideScrollerFichierDeTravail-assets/particule_1.png');
    this.load.image('particule_2', 'fichier_de_travail/sideScrollerFichierDeTravail-assets/particule_2.png');
    this.load.image('particule_3', 'fichier_de_travail/sideScrollerFichierDeTravail-assets/particule_3.png');
    // this.load.image('midground', 'fichier_de_travail/sideScrollerFichierDeTravail-assets/midground.png');

    //load de toutes les sprites sheets
    this.load.spritesheet('dude', 'assets/dude.png', {frameWidth: 32, frameHeight: 48});
    this.load.spritesheet('midground', 'fichier_de_travail/spriteSheetFond-assets/midgroundSpriteSheet.png', {frameWidth: 1870, frameHeight: 440});
    this.load.spritesheet('fireball', 'fichier_de_travail/spriteSheetFireBall-assets/spriteSheetFireBall.png', {frameWidth: 67, frameHeight: 114});
}

function create (){
    //creation des toutes les images
    this.background = this.add.image(0, 0, 'background');
    this.background.setOrigin(0, 0);
    this.background.setScrollFactor(0);
    
    midground = this.add.sprite(640, 424, 'midground');
    // this.midground.setOrigin(0, 0);
    // this.midground.setScrollFactor(0);

    platforms = this.physics.add.staticGroup();
    vie = this.physics.add.staticGroup();

    platforms.create(640, 675, 'ground'); //sol

    player = this.physics.add.sprite(100, 600, 'dude');
    testOppo = this.physics.add.sprite(700, 600, 'test');

    this.coeur_1 = this.add.image(player.x-50, player.y-550, 'coeur');
    this.coeur_2 = this.add.image(player.x+30, player-550, 'coeur');
    this.coeur_3 = this.add.image(player.x+50, player-550, 'coeur');
    this.coeur_1.setScrollFactor(0);
    this.coeur_2.setScrollFactor(0);
    this.coeur_3.setScrollFactor(0);

    player.setBounce(0); //just for debug, when it's done set to 0.5 
    player.setCollideWorldBounds(true);
    testOppo.setCollideWorldBounds(true);
    
    //creation toutes les animations
    //animation personnage joueur, tag = dude
    this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('dude', {start: 0, end: 3}),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'turn',
        frames: [{key: 'dude', frame: 4}],
        frameRate: 20
    });

    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('dude', {start: 5, end: 8}),
        frameRate: 10,
        repeat: -1
    });
    
    //animation fireball, tag = fireball
    this.anims.create({
        key: 'animationFireBall',
        frames: this.anims.generateFrameNumbers('fireball', {start: 0, end: 1}),
        frameRate: 10,
        repeat: -1,
    });

    //animation midground, tag = midground
    this.anims.create({
        key: 'animationMidgroundFirstPart',
        frames: this.anims.generateFrameNumbers('midground', {start: 0, end: 9}),
        frameRate: 10,
        repeat: -1,
    })

    this.anims.create({
        key: 'animationMidgroundSecondPart',
        frames: this.anims.generateFrameNumbers('midground', {start: 10, end: 8}),
        frameRate: 10,
        repeat: -1,
    })

    cursors = this.input.keyboard.createCursorKeys();
    keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A)

    //gestion des collisions
    this.physics.add.collider(player, platforms, colliderPlatformPlayer);
    // this.physics.add.collider(laser, platforms, laserCollider);
    this.physics.add.collider(testOppo, platforms);
    this.physics.add.overlap(player, testOppo, hitPlayer);
    //quand powerUp est touché
    // this.physics.add.overlap(player, powerUp, powerUpFunction);

    //creation de la caméra
    this.cameras.main.startFollow(player);
    this.cameras.main.setSize(1280,720);
}

function update (){
    this.background.tilePositionX = this.cameras.scrollX * .3;
    // this.midground.tilePositionX = this.cameras.scrollX * .8;
    this.coeur_1.tilePositionX = this.cameras.scrollX * 0.6;
    this.coeur_2.tilePositionX = this.cameras.scrollX * 0.6;
    this.coeur_3.tilePositionX = this.cameras.scrollX * 0.6;

    // if (pv == 0){
    //     player.setVelocityX(0);
    //     player.setVelocityY(0);
    //     player.anims.play('turn', true);
    //     return;
    // }

    frame = frame + 1;
    if(frame == 70){
        frame = 0
    }
    frameMidground = frameMidground+1;
    //animation du midground en continu
    if(firstPart == true){
        midground.anims.play('animationMidgroundFirstPart', true);
        if(frameMidground >= 60){
            firstPart = false;
            secondPart = true;
            frameMidground = 0;
        }
    } else if(secondPart == true){
        midground.anims.play('animationMidgroundSecondPart', true);
        if(frameMidground >= 60){
            firstPart = true;
            secondPart = false;
            frameMidground = 0;
        }
    }

    //simples moves
    if(hit == false){
        if (cursors.left.isDown){
            lastPose = "left";
            player.setVelocityX(-160);

            player.anims.play('left', true);
        } else if (cursors.right.isDown){
            lastPose = "right";
            player.setVelocityX(160);

            player.anims.play('right', true);
        } else {
            player.setVelocityX(0);

            player.anims.play('turn');
        }
    }

    //saut + jetpack
    if (player.body.touching.down && cursors.up.isDown){
        hit = false;
        player.setVelocityY(-330);
        ableToUseJet = true;
    }

    if (!player.body.touching.down && cursors.up.isUp && ableToUseJet == true && jetpackValue > 0){
        checkUpisUp = true;
    } if (cursors.up.isDown && checkUpisUp == true && ableToUseJet == true && jetpackValue > 0){
        jetpackValue = jetpackValue - 1
        if(startJetPackDone == true){
            for(let i = 0; i < 1000; i ++){
                player.setVelocityY(-1*i);
                startJetPackDone = true;
            }
        } else{
            player.setVelocityY(-300);
        } if (jetpackValue < 0){
            jetpackValue = 0;
        }
    }
    
    if(cursors.up.isUp && checkUpisUp == true && ableToUseJet == true){
        startJetPackDone = false;
        frameCheckOnce = false;
    }

    if(jetpackValue < 100){
        if(player.x < 100){
            xJetText = 100;
        } else{
            xJetText = -100;
        }
        //make this shit disappear
        text = this.add.text(player.x+xJetText, player.y, jetpackValue);
        if(frameCheckOnce == false){
            var frameCheck = frame+10
            frameCheckOnce = true;
        }
        while(frame <= frameCheck){
            text.destroy();
            frame = frame+1;
        }
    }

    timerEnnemi = timerEnnemi + 1;
    //comportement de l'ennemi
    //working but look at acceleration
    if(timerEnnemi >= 0 && timerEnnemi < 100){
        if(alreadyShuffle == false){
            frameDePause1 = chiffreAleatoire(10, 250);
            frameDePause2 = chiffreAleatoire(10, 250);
            deplacementEnnemi = (-chiffreAleatoire(100, 300));
            alreadyShuffle = true;
        } testOppo.setVelocityX(deplacementEnnemi);
    } else if (timerEnnemi > 100 && timerEnnemi < frameDePause1){
        alreadyShuffle = false;
        testOppo.setVelocityX(0);
    } else if (timerEnnemi > frameDePause1 && timerEnnemi < (frameDePause1+frameDePause2)){
        if(alreadyShuffle == false){
            deplacementEnnemi = chiffreAleatoire(100, 300);
            alreadyShuffle = true;
        } testOppo.setVelocityX(deplacementEnnemi);
    } else if (timerEnnemi > (frameDePause1+frameDePause2) && timerEnnemi < (frameDePause1+frameDePause2+((frameDePause1+frameDePause2)/2))){
        alreadyShuffle = false;
        testOppo.setVelocityX(0);
    } else if (timerEnnemi >= (frameDePause1+frameDePause2+((frameDePause1+frameDePause2)/2))){
        timerEnnemi = 0;
    }

    //invulnerabilite du joueur
    if(frameInvulnerable > 0){
        if(pv != 0 && reculDone == false){
            if(pv == 3){
                this.coeur_1 = this.add.image(player.x-50, player.y-550, 'coeurVide');
            } else if(pv == 2){
                this.coeur_2 = this.add.image(player.x-30, player.y-550, 'coeurVide');
            } else if(pv == 1){
                this.coeur_3 = this.add.image(player.x, player.y-550, 'coeurVide');
            } pv = pv - 1;
        } if(reculDone == false){
            if(lastPose == "left"){
                player.anims.play('left', true);
                player.setVelocityX(200);
            } else if (lastPose == "right"){
                player.anims.play('right', true);
                player.setVelocityX(-200);
            } hit = true;
            player.setVelocityY(-100);
            reculDone = true;
        } frameInvulnerable = frameInvulnerable - 1;
        
        // this.tweens.add({
        //     alpha: 0,
        //     ease: "Back.easeInOut", //https://rexrainbow.github.io/phaser3-rex-notes/docs/site/ease-function/
        //     targets: player,
        //     duration: 5000,
        //     repeat: -1,
        //     yoyo: true,
        // })
        
    }
    if(hitPlayerByFireBall == true){
        // this.cameras.main.shake(200);
        pv = 0;
        this.coeur_1 = this.add.image(player.x-50, player.y-550, 'coeurVide');
        this.coeur_2 = this.add.image(player.x-50, player.y-550, 'coeurVide');
        this.coeur_3 = this.add.image(player.x-50, player.y-550, 'coeurVide');
        fireball.disableBody(true, true);
    }

    // } else if(frameInvulnerable == 0){
    //     this.tweens.add({alpha: 1,targets: player,})
    // }

    if(hitOppoByFireBall == true){hitOppo = true;this.cameras.main.shake(200);hitOppoByFireBall = false;}

    //permetra le tri de l'ennemi
    if(player.y+10 >= testOppo.y && player.y-10 <= testOppo.y && hitOppo == false){
        if(laserAlreadyShotEnnemi == false){
            if(player.x < testOppo.x && player.x > testOppo.x-800){
                directionLaser = "left";
                laser = this.physics.add.sprite(testOppo.x+10, testOppo.y, 'laser');
                laserAlreadyShotEnnemi = true;
            } else if(player.x > testOppo.x && player.x < testOppo.x+800){
                directionLaser = "right";
                laser = this.physics.add.sprite(testOppo.x+10, testOppo.y, 'laser');
                laserAlreadyShotEnnemi = true;
            } rechargeEnnemi = chiffreAleatoire(250, 500);
        }
    }
    
    // if(player.x < testOppo.x && player.x > testOppo.x-200){
    //     directionLaser = "left";
    // } else if(player.x > testOppo.x && player.x < testOppo.x+200){

    if(laserAlreadyShotEnnemi == true){
        this.physics.add.overlap(player, laser, hitPlayer);
        laser.setVelocityY(-5);
        if(directionLaser == "left"){
            laser.setVelocityX(-1000);
        } else if(directionLaser == "right"){
            laser.setVelocityX(1000);
        }if(laser.x >= 1280 || laser.x <= 0){
            laser.disableBody(true, true);
        } rechargeEnnemi = rechargeEnnemi - 1;
        if (rechargeEnnemi == 0){
            laserAlreadyShotEnnemi = false;
        }
    }

    // if (keyA.isDown && hit == false && laserAlreadyShotPlayer == false){
    //     if(lastPose == "left" || cursors.left.isDown && keyA.isDown){
    //         laserPlayer = this.physics.add.sprite(player.x+10, player.y, 'laser');
    //         laserAlreadyShotPlayer = true;
    //     } else if(lastPose == "right" || cursors.right.isDown && keyA.isDown){
    //     }
    // }

    // if(laserAlreadyShotPlayer == true){
    //     this.physics.add.overlap(player, laser, hitPlayer);
    //     laser.setVelocityY(-5);
    //     if(directionLaser == "left"){
    //         laser.setVelocityX(-1000);
    //     } else if(directionLaser == "right"){
    //         laser.setVelocityX(1000);
    //     }if(laser.x >= 1280 || laser.x <= 0){
    //         laser.disableBody(true, true);
    //     } rechargePlayer = rechargePlayer - 1;
    //     if (rechargePlayer == 0){
    //         laserAlreadyShotPlayer = false;
    //     }
    // }
    
    //Pour la fireball (élément qui tue instantanément)
    if(fireballCanBeGenerated == true){
        chanceFireball = chiffreAleatoire(0, 1999);
        if (chanceFireball == 1){
            fireball = this.physics.add.sprite(player.x, player.y-1000, 'fireball');
            fireball.anims.play('animationFireBall', true);
            if(lastPose == "right"){
                for(let i = 0; i < 150; i++){
                    fireball.setVelocityY(i*5);
                    fireball.setVelocityX(i);
                }
            } else if(lastPose == "left"){
                for(let i = 0; i < 150; i++){
                    fireball.setVelocityY(i*5);
                    fireball.setVelocityX(-i);
                }
            } fireballCanBeGenerated = false;
            this.physics.add.collider(fireball, platforms, crashFireball);
            this.physics.add.overlap(fireball, player, fireballHitingPlayer);
            this.physics.add.overlap(fireball, testOppo, fireballHitingOppo);
        }
    } else if (fireballCanBeGenerated == false){
        if(fireball.y >= 1280){
            fireball.disableBody(true, true);
            fireballCanBeGenerated = true;
        }
    }

    if(crashFireballTest == true){
        if(particuleGenerate == false){
            this.cameras.main.shake(200);
            particule_1 = this.physics.add.sprite(fireball.x+10, fireball.y+60, 'particule_1');
            particule_2 = this.physics.add.sprite(fireball.x-20, fireball.y+55, 'particule_2');
            particule_3 = this.physics.add.sprite(fireball.x-5, fireball.y+50, 'particule_3');
            particuleGenerate = true;
        } this.physics.add.collider(particule_1, player, hitPlayer);
        this.physics.add.collider(particule_2, player, hitPlayer);
        this.physics.add.collider(particule_3, player, hitPlayer);
        fireball.disableBody(true, true);
        if(particule_1.y <= 1280){
            for(let i = 0; i < 9; i++){particule_1.setVelocityX(i);}  
        } if(particule_2.y <= 1280){
            for(let i = 0; i < 9; i++){particule_2.setVelocityX(-i);}
        } if(particule_3.y <= 1280){
            for(let i = 0; i < 9; i++){particule_3.setVelocityX(-i);}
        } if(particule_1.y >= 1280 && particule_2.y >= 1280 && particule_3.y >= 1280){
            particule_1.disableBody(true, true);
            particule_2.disableBody(true, true);
            particule_3.disableBody(true, true);
            crashFireballTest = false;
            fireballCanBeGenerated = true;
        }
    }
}

//pour le reset du jetPack
function colliderPlatformPlayer(){
    hit = false;
    checkUpisUp = false;
    ableToUseJet = false;
    for(let i = 0; i < 9; i++){
        jetpackValue = jetpackValue + i;
    } if(jetpackValue > 100){
        jetpackValue = 100;
    }
}

function powerUpFunction(){
    powerUp.disableBody(true, true);
    player.setVelocityY(-1500);
}

function hitPlayer(){
    if(frameInvulnerable == 0 && pv != 0){
        frameInvulnerable = 100; 
        reculDone = false;
    }
}

    function crashFireball(){particuleGenerate = false;crashFireballTest = true;}

function fireballHitingPlayer(){hitPlayerByFireBall = true; fireballCanBeGenerated = true}

function fireballHitingOppo(){
    fireball.disableBody(true, true);
    testOppo.disableBody(true, true)
    fireballCanBeGenerated = true;
    hitOppoByFireBall = true;
}

function chiffreAleatoire(min, max){min = Math.ceil(min);max = Math.floor(max);return Math.floor(Math.random() * (max - min)) + min;}