// Enemies our player must avoid
var ENEMY_PNG = 'images/enemy-bug.png';
var ENEMY_MIN_SPEED = 100;
var ENEMY_MAX_SPEED = 200;
var INITIAL_Y = -20;
var FINISH_X = 510;     // canvas width

function randomStart() {
    return Math.floor(Math.random() * 500);
}

function randomSpeed() {
    return Math.floor(Math.random() * (ENEMY_MAX_SPEED - ENEMY_MIN_SPEED) + ENEMY_MIN_SPEED);
}

var Enemy = function(info) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = info.png;
    this.x = info.x - randomStart();
    this.y = info.y;
    this.unit = randomSpeed();
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    this.x += dt * this.unit;
    if (this.x > FINISH_X) {
        this.x =  -randomStart();
        this.unit = randomSpeed();
    }
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    Resources.load(this.sprite);
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function (info) {
    Enemy.call(this, info);
    this.unit = SQUARE_SIDE_LENGTH;
};
Player.prototype = Object.create(Enemy.prototype);
Player.prototype.constructor = Player;
Player.prototype.handleInput = function (keydown) {
    this.x = 100;
};


// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var SQUARE_SIDE_LENGTH = 85;
var allEnemies = [
    new Enemy({
        png: ENEMY_PNG,
        x: 0,
        y: INITIAL_Y + SQUARE_SIDE_LENGTH
    }),
    new Enemy({
        png: ENEMY_PNG,
        x: 0,
        y: INITIAL_Y + SQUARE_SIDE_LENGTH * 2
    }),
    new Enemy({
        png: ENEMY_PNG,
        x: 0,
        y: INITIAL_Y + SQUARE_SIDE_LENGTH * 3
    })
];
var PLAYER_IMAGE = 'images/char-horn-girl.png';
var player = new Player({
    png: PLAYER_IMAGE,
    x: SQUARE_SIDE_LENGTH * 2.5,
    y: SQUARE_SIDE_LENGTH * 4
});

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
