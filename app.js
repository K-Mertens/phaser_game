const gameConfig = {
	width: 800,
	height: 600,
	type: Phaser.AUTO,
	physics: {
		default: 'arcade',
		arcade: {
			gravity: {y: 900}
		},
		//debug: true,
	},
	scene: {
		preload: preload,
		create: create,
		update: update,
	}
}

var sceneConfig = {
  key: "",
  // active: false,
  // visible: true,
  // pack: false,
  // cameras: null,
  // map: {},
  // physics: {},
  // loader: {},
  // plugins: false,
  // input: {}
};

const game = new Phaser.Game(gameConfig);
const scene = new Phaser.Scene(sceneConfig);
let playerOne;
let playerTwo;
let playerOneWidth;
let playerTwoWidth;
let platforms;
let cursors;
let ledge;
let ledge2;
let playerVelocityX = 500;
let playerJumpForce = -500;
let bullets;
let lastFired = 0;

function preload() {
	this.load.image('playerOne', 'assets/player_one.png');
	this.load.image('playerTwo', 'assets/player_two.png');
	this.load.image('background', 'assets/background.png');
	this.load.image('ledge', 'assets/ledge.png');
	this.load.image('bullet', 'assets/bullet.png');
	//scene.load.plugin('rexdynamictextplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexdynamictextplugin.min.js', true);
	//this.load.spritesheet('testSpritesheet', 'assets/test_spritesheet.png');
}

function create() {
	background = this.add.image(400, 300, 'background');
	playerOne = this.physics.add.image(100, 100, 'playerOne');
	playerOne.body.collideWorldBounds = true;
	playerTwo = this.physics.add.image(700, 100, 'playerTwo');
	playerTwo.body.collideWorldBounds = true;

	platforms = this.physics.add.staticGroup();
	platforms.create(150, 575, 'ledge');
	platforms.create(150, 300, 'ledge');
	platforms.create(400, 400, 'ledge');
	platforms.create(700, 500, 'ledge');

	// Weapon creation
	//weapon = this.add.weapon(40, 'bullet');


	// platforms = this.add.group();
	// platforms.enableBody = true;
	// ledge = platforms.create(200, 300, 'ledge');
	// ledge = this.physics.add.image(200, 300, 'ledge');
	// ledge.setImmovable(true);
	// ledge.body.allowGravity = false;
 	// ledge2 = this.physics.add.image(500, 650, 'ledge');
	// ledge2.setImmovable(true);
	// ledge2.body.allowGravity = false;


	cursors = this.input.keyboard.createCursorKeys();
	keyZ = this.input.keyboard.addKey('Z');
	keyQ = this.input.keyboard.addKey('Q');
	keyD = this.input.keyboard.addKey('D');
	keyS = this.input.keyboard.addKey('S');
	keySpace = this.input.keyboard.addKey('SPACE');
	playerOneText = this.add.text(playerOne.body.position.x, playerOne.body.position.y - 30, '1P');
	playerTwoText = this.add.text(playerTwo.body.position.x, playerTwo.body.position.y - 30, '2P');
	this.physics.add.collider(playerOne, playerTwo);
	this.physics.add.collider(playerOne, platforms);
	this.physics.add.collider(playerTwo, platforms);

	//ledge.body.immovable = true;
	// ledge = platforms.create(400, 700, 'ground');
	// ledge.body.immovable = true;
	var Bullet = new Phaser.Class({

        Extends: Phaser.GameObjects.Image,

        initialize: function Bullet (scene)
        {
            Phaser.GameObjects.Image.call(this, scene, 0, 0, 'bullet');

            this.speed = Phaser.Math.GetSpeed(400, 1);
        },

        fire: function (x, y)
        {
            //this.setPosition(x, y - 50);
            this.setPosition(x, y);

            this.setActive(true);
            this.setVisible(true);
        },

        update: function (time, delta)
        {
            this.y -= this.speed * delta;

            if (this.y < -50)
            {
                this.setActive(false);
                this.setVisible(false);
            }
        }

    });

    bullets = this.add.group({
        classType: Bullet,
        maxSize: 10,
        runChildUpdate: true
    });

    speed = Phaser.Math.GetSpeed(300, 1);
}

function update(time, delta) {
	//game.physics.arcade.collide(playerOne, playerTwo);
	playerOne.setVelocityX(0);
	playerTwo.setVelocityX(0);

	playerOneText.x = playerOne.body.position.x + (playerOne.body.width / 2);
	playerOneText.y = playerOne.body.position.y - 30;
	playerTwoText.x = playerTwo.body.position.x + (playerTwo.body.width / 2);
	playerTwoText.y = playerTwo.body.position.y - 30;
	
	if(keyZ.isDown && playerOne.body.blocked.down) {
		playerOne.setVelocityY(playerJumpForce);
	}

	if(keyD.isDown) {
		playerOne.setVelocityX(playerVelocityX);
	}

	if(keyQ.isDown) {
		playerOne.setVelocityX(-playerVelocityX);
	}

	if(cursors.up.isDown && playerTwo.body.blocked.down) {
		playerTwo.setVelocityY(playerJumpForce);
	}

	if(cursors.right.isDown) {
		playerTwo.setVelocityX(playerVelocityX);
	}

	if(cursors.left.isDown) {
		playerTwo.setVelocityX(-playerVelocityX);
	}

	if (keySpace.isDown && time > lastFired) {
        var bullet = bullets.get();
        if (bullet) {
            bullet.fire(playerOne.x, playerOne.y);
            lastFired = time + 50;
        }
    }
}