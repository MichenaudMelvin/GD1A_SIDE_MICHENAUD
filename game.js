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
    input:{gamepad:true},
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
var directionLaserEnnemi;
var laserAlreadyShotEnnemi = false;
var rechargeEnnemi;
var lastPose = "right";
var hitAstraunaute = false;
var pauseShootEnnemi = false;
var tempsDePauseEnnemi = 0;

//pour joueur qui tire
var laserAlreadyShotPlayer = false;
var rechargePlayer;
var directionLaserPlayer;
var hitAstraunauteByLaserPlayer;
var tempsAnimPlayer = 0;
var animPlayer;

//pour la fireball
var particuleGenerate = false;
var crashFireballTest = false;
var chanceFireball = 0;
var fireballCanBeGenerated = true;
var hitAstraunauteByFireBall = false;
var hitPlayerByFireBall = false;

//pour l'animation du midground
var firstPart = true;
var secondPart = false;
var frameMidground = 0;

//pour controles manette
var paddleConnected = false;
var paddle;

//pour l'écran titre:
var gameCanBeLoad = false;
var gameLoad = false;

function preload (){
    this.load.image('test', 'fichier_de_travail/sideScrollerFichierDeTravail-assets/test.png');
    this.load.image('background', 'fichier_de_travail/sideScrollerFichierDeTravail-assets/background.png');
    this.load.image('ground', 'fichier_de_travail/test.png');
    // this.load.tilemap('ground', 'fichier_de_travail/test.json', null, Phaser.Tilemap.TILED_JSON);
    // this.load.image('tilesGround', 'fichier_de_travail/sideScrollerFichierDeTravail-assets/tileSheet.png');
    this.load.image('coeur', 'fichier_de_travail/sideScrollerFichierDeTravail-assets/coeur.png');
    this.load.image('coeurVide', 'fichier_de_travail/sideScrollerFichierDeTravail-assets/coeurVide.png');
    this.load.image('laser', 'fichier_de_travail/sideScrollerFichierDeTravail-assets/laser.png');
    this.load.image('particule_1', 'fichier_de_travail/sideScrollerFichierDeTravail-assets/particule_1.png');
    this.load.image('particule_2', 'fichier_de_travail/sideScrollerFichierDeTravail-assets/particule_2.png');
    this.load.image('particule_3', 'fichier_de_travail/sideScrollerFichierDeTravail-assets/particule_3.png');
    this.load.image('hereComesTheSun', 'fichier_de_travail/sideScrollerFichierDeTravail-assets/sun.png');
    this.load.image('ecranTitre', 'fichier_de_travail/sideScrollerFichierDeTravail-assets/ecranTitre.png');

    //load de toutes les sprites sheets
    this.load.spritesheet('dude', 'assets/dude.png', {frameWidth: 32, frameHeight: 48});
    this.load.spritesheet('midground', 'fichier_de_travail/spriteSheetFond-assets/midgroundSpriteSheet.png', {frameWidth: 1870, frameHeight: 441});
    this.load.spritesheet('fireball', 'fichier_de_travail/spriteSheetFireBall-assets/spriteSheetFireBall.png', {frameWidth: 67, frameHeight: 114});
    this.load.spritesheet('astraunaute', 'fichier_de_travail/spriteSheetAstraunaute-assets/spriteSheetAstraunaute.png', {frameWidth: 42, frameHeight: 79});
}

function create (){
    //création de l'écran titre
    this.ecranTitre = this.add.image(0, 0, 'ecranTitre');
    this.ecranTitre.setOrigin(0, 0);

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
    // fireball.anims.play('animationFireBall', true);

    //animation midground, tag = midground
    this.anims.create({
        key: 'animatonMidground',
        frames: this.anims.generateFrameNumbers('midground', {start: 0, end: 19}),
        frameRate: 10,
        repeat: -1,
    });
    // midground.anims.play('animatonMidground', true);

    //animation de l'ennemi, tag = astraunaute
    this.anims.create({
        key: 'idleGauche',
        frames: [{key: 'astraunaute', frame: 3}],
        frameRate: 20
    });

    this.anims.create({
        key: 'idleDroit',
        frames: [{key: 'astraunaute', frame: 4}],
        frameRate: 20
    });

    this.anims.create({
        key: 'marcheGauche',
        frames: this.anims.generateFrameNumbers('astraunaute', {start: 2, end: 0}),
        frameRate: 10,
        repeat: -1,
    });

    this.anims.create({
        key: 'marcheDroit',
        // frames: [{key: 'astraunaute', frame: 7}],
        frames: this.anims.generateFrameNumbers('astraunaute', {start: 5, end: 8}),
        frameRate: 10,
        repeat: -1,
    });
    // astraunaute.anims.play('idleGauche', true);
    // astraunaute.anims.play('idleDroit', true);
    // astraunaute.anims.play('marcheGauche', true);
    // astraunaute.anims.play('marcheDroit', true);

    cursors = this.input.keyboard.createCursorKeys();
    keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A)
}

function update (){
    // this.background.tilePositionX = this.cameras.scrollX * .3;


    if(keyA.isDown && gameLoad == false){
        this.cameras.main.fadeOut(500, 0, 0, 0)
        tempsDePauseEcranTitre = 100;
        gameCanBeLoad = true;
    }

    if(gameCanBeLoad == true && gameLoad == false){
        tempsDePauseEcranTitre = tempsDePauseEcranTitre - 1
        if(tempsDePauseEcranTitre <= 0){
            this.cameras.main.fadeIn(500, 0, 0, 0)
            this.ecranTitre.destroy();
            //creation des toutes les images
            this.background = this.add.image(0, 0, 'background');
            this.background.setOrigin(0, 0);
            this.background.setScrollFactor(0);

            sun = this.physics.add.staticGroup();
            sun.create(50, 100, 'hereComesTheSun');

            midground = this.add.sprite(640, 424, 'midground');
            // this.midground.setOrigin(0, 0);
            // this.midground.setScrollFactor(0);
            // midground.addTilesetImage('ground', 'tiles');

            platforms = this.physics.add.staticGroup();

            platforms.create(640, 675, 'ground'); //sol

            player = this.physics.add.sprite(100, 600, 'dude');
            astraunaute = this.physics.add.sprite(700, 500, 'astraunaute');

            player.setBounce(0); //just for debug, when it's done set to 0.5 
            player.setCollideWorldBounds(true);
            astraunaute.setCollideWorldBounds(true);

            //gestion des collisions
            this.physics.add.collider(player, platforms, colliderPlatformPlayer);
            // this.physics.add.collider(laser, platforms, laserCollider);
            this.physics.add.collider(astraunaute, platforms);
            this.physics.add.overlap(player, astraunaute, hitPlayer);
            //quand powerUp est touché
            //this.physics.add.overlap(player, powerUp, powerUpFunction);

            //creation de la caméra
            // this.cameras.main.startFollow(player);
            // this.cameras.main.setSize(1280,720);

            //pour l'interface
            this.coeur_1_vide = this.add.image(player.x-50, player.y-550, 'coeurVide');
            this.coeur_2_vide = this.add.image(player.x+10, player.y-550, 'coeurVide');
            this.coeur_3_vide = this.add.image(player.x+70, player.y-550, 'coeurVide');
            this.coeur_1_vide.setScrollFactor(0);
            this.coeur_2_vide.setScrollFactor(0);
            this.coeur_3_vide.setScrollFactor(0);
            this.coeur_1 = this.add.image(player.x-50, player.y-550, 'coeur');
            this.coeur_2 = this.add.image(player.x+10, player.y-550, 'coeur');
            this.coeur_3 = this.add.image(player.x+70, player.y-550, 'coeur');
            this.coeur_1.setScrollFactor(0);
            this.coeur_2.setScrollFactor(0);
            this.coeur_3.setScrollFactor(0);

            gameLoad = true;
        }
    }
    this.input.gamepad.once('connected',function(pad){
        paddleConnected = true ;
        paddle = pad;
    });
    
    if(gameLoad == true){
        frame = frame + 1;
        if(frame == 70){
            frame = 0
        }
        // if (pv == 0){
        //     player.setVelocityX(0);
        //     player.setVelocityY(0);
        //     player.anims.play('turn', true);
        //     return;
        // }

        //animation du midground en continu
        frameMidground = frameMidground+1;
        midground.anims.play('animatonMidground', true);

        //simples moves
        if(hit == false){
            //controles clavier
            if(paddleConnected == false){
                if (cursors.left.isDown){
                    tempsAnimPlayer = 0;
                    lastPose = "left";
                    player.setVelocityX(-160);
                    player.anims.play('left', true);
                } else if (cursors.right.isDown){
                    tempsAnimPlayer = 0;
                    lastPose = "right";
                    player.setVelocityX(160);
                    player.anims.play('right', true);
                } else {
                    player.setVelocityX(0);
                    player.anims.play('turn');
                }

                //saut + jetpack
                if (player.body.touching.down && cursors.up.isDown && hit == false){
                    player.setVelocityY(-330);
                    ableToUseJet = true;
                }

                if (!player.body.touching.down && cursors.up.isUp && ableToUseJet == true && jetpackValue > 0 && hit == false){
                    checkUpisUp = true;
                } if (cursors.up.isDown && checkUpisUp == true && ableToUseJet == true && jetpackValue > 0){
                    jetpackValue = jetpackValue - 1
                    if(startJetPackDone == true){
                        for(let i = 0; i < 1000; i ++){
                            player.setVelocityY(-1*i);
                            startJetPackDone = true;
                        }
                    } else{player.setVelocityY(-300);}
                    if (jetpackValue < 0){jetpackValue = 0;}
                }
                
                if(cursors.up.isUp && checkUpisUp == true && ableToUseJet == true){
                    startJetPackDone = false;
                    frameCheckOnce = false;
                }

                if(jetpackValue < 100){
                    if(player.x < 100){xJetText = 100;} 
                    else{xJetText = -100;}

                    text = this.add.text(player.x+xJetText, player.y, jetpackValue);
                    if(frameCheckOnce == false){
                        var frameCheck = frame;
                        frameCheckOnce = true;
                    }
                    while(frame <= frameCheck){
                        text.destroy();
                        frame = frame+1;
                    }
                }

                //tir du joueur
                if (keyA.isDown && laserAlreadyShotPlayer == false){
                    if(lastPose == "left" || (cursors.left.isDown && keyA.isDown)){
                        laserPlayer = this.physics.add.sprite(player.x+10, player.y, 'laser');
                        laserAlreadyShotPlayer = true;
                        directionLaserPlayer = "left";
                        animPlayer = "left";
                        tempsAnimPlayer = 20;
                    } else if(lastPose == "right" || cursors.right.isDown && keyA.isDown){
                        laserPlayer = this.physics.add.sprite(player.x-10, player.y, 'laser');
                        laserAlreadyShotPlayer = true;
                        directionLaserPlayer = "right";
                        animPlayer = "right";
                        tempsAnimPlayer = 20;
                    } rechargePlayer = 100;
                } if(tempsAnimPlayer > 0){
                    tempsAnimPlayer = tempsAnimPlayer - 1
                    player.anims.play(animPlayer, true);
                }
            }

            //controles manette
            if (paddleConnected == true){
                if (paddle.left){
                    tempsAnimPlayer = 0;
                    lastPose = "left";
                    player.setVelocityX(-160);
                    player.anims.play('left', true);
                } else if (paddle.right){
                    tempsAnimPlayer = 0;
                    lastPose = "right";
                    player.setVelocityX(160);
                    player.anims.play('right', true);
                } else {
                    player.setVelocityX(0);
                    player.anims.play('turn');
                }
                
                //saut + jetpack
                if (player.body.touching.down && paddle.A && hit == false){
                    player.setVelocityY(-330);
                    ableToUseJet = true;
                }

                if (!player.body.touching.down && paddle.A.isUp && ableToUseJet == true && jetpackValue > 0 && hit == false){
                    checkUpisUp = true;
                } if (paddle.A && checkUpisUp == true && ableToUseJet == true && jetpackValue > 0){
                    jetpackValue = jetpackValue - 1
                    if(startJetPackDone == true){
                        for(let i = 0; i < 1000; i ++){
                            player.setVelocityY(-1*i);
                            startJetPackDone = true;
                        }
                    } else{player.setVelocityY(-300);}
                    if (jetpackValue < 0){jetpackValue = 0;}
                }
                
                if(paddle.A.isUp && checkUpisUp == true && ableToUseJet == true){
                    startJetPackDone = false;
                    frameCheckOnce = false;
                }

                if(jetpackValue < 100){
                    if(player.x < 100){xJetText = 100;} 
                    else{xJetText = -100;}

                    text = this.add.text(player.x+xJetText, player.y, jetpackValue);
                    if(frameCheckOnce == false){
                        var frameCheck = frame;
                        frameCheckOnce = true;
                    }
                    while(frame <= frameCheck){
                        text.destroy();
                        frame = frame+1;
                    }
                }

                //tir du joueur
                if (paddle.B && laserAlreadyShotPlayer == false){
                    if(lastPose == "left" || (paddle.left && paddle.B)){
                        laserPlayer = this.physics.add.sprite(player.x+10, player.y, 'laser');
                        laserAlreadyShotPlayer = true;
                        directionLaserPlayer = "left";
                        animPlayer = "left";
                        tempsAnimPlayer = 20;
                    } else if(lastPose == "right" || paddle.right && paddle.B){
                        laserPlayer = this.physics.add.sprite(player.x-10, player.y, 'laser');
                        laserAlreadyShotPlayer = true;
                        directionLaserPlayer = "right";
                        animPlayer = "right";
                        tempsAnimPlayer = 20;
                    } rechargePlayer = 100;
                } if(tempsAnimPlayer > 0){
                    tempsAnimPlayer = tempsAnimPlayer - 1
                    player.anims.play(animPlayer, true);
                }
            }

            if(laserAlreadyShotPlayer == true){
                this.physics.add.overlap(laserPlayer, astraunaute, hitAstraunauteLaser);
                laserPlayer.setVelocityY(-5);
                if(directionLaserPlayer == "left"){
                    laserPlayer.setVelocityX(-1000);
                } else if(directionLaserPlayer == "right"){
                    laserPlayer.setVelocityX(1000);
                }if(laserPlayer.x >= 1280 || laserPlayer.x <= 0){
                    laserPlayer.disableBody(true, true);
                } rechargePlayer = rechargePlayer - 1;
                if (rechargePlayer == 0){
                    laserAlreadyShotPlayer = false;
                }
            }
        }

        timerEnnemi = timerEnnemi + 1;
        //comportement de l'ennemi
        //sometimes does moonwalk
        if(timerEnnemi >= 0 && timerEnnemi < 100 && pauseShootEnnemi == false){
            if(alreadyShuffle == false){
                frameDePause1 = chiffreAleatoire(10, 250);
                frameDePause2 = chiffreAleatoire(10, 250);
                console.log(frameDePause1);
                console.log(frameDePause2);
                deplacementEnnemi = (-chiffreAleatoire(100, 300));
                alreadyShuffle = true;
            } astraunaute.anims.play('marcheGauche', true);
            astraunaute.setVelocityX(deplacementEnnemi);
            // console.log("gauche");
        } else if (timerEnnemi >= 10 && timerEnnemi <= frameDePause1){
            astraunaute.anims.play('idleGauche', true);
            alreadyShuffle = false;
            astraunaute.setVelocityX(0);
            // console.log("standGauche");
        } else if (timerEnnemi >= frameDePause1 && timerEnnemi <= (frameDePause1+frameDePause2) && pauseShootEnnemi == false ){
            if(alreadyShuffle == false){
                deplacementEnnemi = chiffreAleatoire(100, 300);
                alreadyShuffle = true;
            } astraunaute.anims.play('marcheDroit', true);
            astraunaute.setVelocityX(deplacementEnnemi);
            // console.log("droite");
        } else if (timerEnnemi >= (frameDePause1+frameDePause2) && timerEnnemi <= (frameDePause1+frameDePause2+((frameDePause1+frameDePause2)/2)) && pauseShootEnnemi == false){
            astraunaute.anims.play('idleDroit', true);
            astraunaute.setVelocityX(0);
            // console.log("standDroit");
        } else if (timerEnnemi >= (frameDePause1+frameDePause2+((frameDePause1+frameDePause2)/2)) && pauseShootEnnemi == false){timerEnnemi = 0;alreadyShuffle = false;}
        
        //invulnerabilite du joueur
        if(frameInvulnerable > 0){
            if(pv != 0 && reculDone == false){
                if(pv == 3){this.coeur_1.destroy();}
                else if(pv == 2){this.coeur_2.destroy();}
                else if(pv == 1){this.coeur_3.destroy();}
                pv = pv - 1;
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
            //personnage qui clignote
            if((frameInvulnerable <= 120 && frameInvulnerable >= 110) || (frameInvulnerable <= 100 && frameInvulnerable >= 90) || (frameInvulnerable <= 80 && frameInvulnerable >= 70) || (frameInvulnerable <= 60 && frameInvulnerable >= 50) || (frameInvulnerable <= 40 && frameInvulnerable >= 30) || (frameInvulnerable <= 20 && frameInvulnerable >= 10)){player.setAlpha(0);}
            else if ((frameInvulnerable <= 110 && frameInvulnerable >= 100) || (frameInvulnerable <= 90 && frameInvulnerable >= 80) || (frameInvulnerable <= 70 && frameInvulnerable >= 60) || (frameInvulnerable <= 50 && frameInvulnerable >= 40) || (frameInvulnerable <= 30 && frameInvulnerable >= 20) || (frameInvulnerable <= 10 && frameInvulnerable >= 0)){player.setAlpha(1);}
            else{player.setAlpha(1);}
        }
        
        if(hitPlayerByFireBall == true){
            // this.cameras.main.shake(200);
            pv = 0;
            this.coeur_1.destroy();
            this.coeur_2.destroy();
            this.coeur_3.destroy();
            fireball.disableBody(true, true);
        }

        // } else if(frameInvulnerable == 0){
        //     this.tweens.add({alpha: 1,targets: player,})
        // }

        if(hitAstraunauteByFireBall == true){
            hitAstraunaute = true;
            // this.cameras.main.shake(200);
            hitAstraunauteByFireBall = false;}

        //permetra le tri de l'ennemi
        if(player.y+10 >= astraunaute.y && player.y-10 <= astraunaute.y && hitAstraunaute == false){
            if(laserAlreadyShotEnnemi == false){
                if(player.x < astraunaute.x && player.x > astraunaute.x-800){
                    directionLaserEnnemi = "left";
                    astraunaute.anims.play('idleGauche', true);
                    laser = this.physics.add.sprite(astraunaute.x+10, astraunaute.y, 'laser');
                    laserAlreadyShotEnnemi = true;
                } else if(player.x > astraunaute.x && player.x < astraunaute.x+800){
                    directionLaserEnnemi = "right";
                    astraunaute.anims.play('idleDroit', true);
                    laser = this.physics.add.sprite(astraunaute.x+10, astraunaute.y, 'laser');
                    laserAlreadyShotEnnemi = true;
                } rechargeEnnemi = chiffreAleatoire(250, 500);
                tempsDePauseEnnemi = chiffreAleatoire(100, 250);
                pauseShootEnnemi = true;
            }
        }

        //pour que l'astraunaute arrete de bouger après un tir
        if(pauseShootEnnemi == true){
            astraunaute.setVelocityX(0);
            if(tempsDePauseEnnemi >= 0){
                tempsDePauseEnnemi = tempsDePauseEnnemi - 1;
            } else if(tempsDePauseEnnemi <= 0){
                console.log("test");
                pauseShootEnnemi = false;
            }
        }

        if(laserAlreadyShotEnnemi == true){
            this.physics.add.overlap(player, laser, hitPlayer);
            laser.setVelocityY(-5);
            if(directionLaserEnnemi == "left"){
                laser.setVelocityX(-1000);
            } else if(directionLaserEnnemi == "right"){
                laser.setVelocityX(1000);
            }if(laser.x >= 1280 || laser.x <= 0){
                laser.disableBody(true, true);
            } rechargeEnnemi = rechargeEnnemi - 1;
            if(rechargeEnnemi <= 50){
                console.log("finPause");
                pauseShootEnnemi = false;
            } if (rechargeEnnemi == 0){
                laserAlreadyShotEnnemi = false;
            }
        }
        
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
                this.physics.add.overlap(fireball, astraunaute, fireballHitingOppo);
            }
        } else if (fireballCanBeGenerated == false){
            if(fireball.y >= 1280){
                fireball.disableBody(true, true);
                fireballCanBeGenerated = true;
            }
        }

        if(crashFireballTest == true){
            if(particuleGenerate == false){
                // this.cameras.main.shake(200);
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

//quand en contact avec le powerUp / overlap
function powerUpFunction(){
    powerUp.disableBody(true, true);
    player.setVelocityY(-1500);
}

//quand le joueur tire sur l'ennmi / overlap
function hitAstraunauteLaser(){
    laserPlayer.disableBody(true, true);
    astraunaute.disableBody(true, true);
    hitAstraunauteByLaserPlayer = true;
    hitAstraunaute = true;
}

//quand l'ennemi ou laserEnnmi touche le joueur / overlap
function hitPlayer(){
    if(frameInvulnerable == 0 && pv != 0){
        frameInvulnerable = 120; 
        reculDone = false;
    }
}

//quand la fireball touche le sol / collider
function crashFireball(){particuleGenerate = false;crashFireballTest = true;}

//quand la fireball touche le joueur / overlap
function fireballHitingPlayer(){hitPlayerByFireBall = true; fireballCanBeGenerated = true}

//quand la fireball touche l'ennmi / overlap
function fireballHitingOppo(){
    fireball.disableBody(true, true);
    astraunaute.disableBody(true, true)
    fireballCanBeGenerated = true;
    hitAstraunauteByFireBall = true;
}

//permet la génération d'un chiffre aléatoire
function chiffreAleatoire(min, max){min = Math.ceil(min);max = Math.floor(max);return Math.floor(Math.random() * (max - min)) + min;}