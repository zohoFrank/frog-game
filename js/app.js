// canvas
var WIDTH = 505;
var HEIGHT = 523;
var ENEMY_PNG = 'images/enemy-bug.png';
var PLAYER_IMAGE = 'images/char-horn-girl.png';
// block
var HORIZON_UNIT_LEN = 101;
var VERTICAL_UNIT_LEN = 83;
var ENEMY_MIN_SPEED = 100;
var ENEMY_MAX_SPEED = 200;
var INITIAL_Y = -20;
// game
var LIFE = 3;
var MOVE_SCORE = 10;

/*** Helpers ***/
function randomStart() {
    return Math.floor(Math.random() * 500);
}

function randomSpeed() {
    return Math.floor(Math.random() * (ENEMY_MAX_SPEED - ENEMY_MIN_SPEED) + ENEMY_MIN_SPEED);
}

// Enemies our player must avoid
var Enemy;
(function() {
    Enemy = function(info) {
        // Variables applied to each of our instances go here,
        // we've provided one for you to get started

        // The image/sprite for our enemies, this uses
        // a helper we've provided to easily load images
        this.sprite = info.png;
        this.x = info.x;
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
        if (this.x > WIDTH) {
            this.x = -randomStart();
            this.unit = randomSpeed();
        }
    };

    // Draw the enemy on the screen, required method for game
    Enemy.prototype.render = function() {
        Resources.load(this.sprite);
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    };

})();

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player;
(function() {
    Player = function(info) {
        Enemy.call(this, info);
        this.initPos = {
            x: info.x,
            y: info.y
        };
        this.life = LIFE;
    };
    Player.prototype = Object.create(Enemy.prototype);

    Player.prototype.constructor = Player;

    // helper: out of field
    Player.prototype.outField = function() {
        var upper = 0;
        var downer = HEIGHT - VERTICAL_UNIT_LEN;
        var lefter = 0;
        var righter = WIDTH - HORIZON_UNIT_LEN;
        if (this.x < lefter || this.x > righter || this.y < upper || this.y > downer) {
            this.x = this.initPos.x;
            this.y = this.initPos.y;
            this.life--;
        }
    };

    Player.prototype.render = function() {
        // render player pic
        Enemy.prototype.render.call(this);
    };

    Player.prototype.update = function() {
        this.outField();
    };

    Player.prototype.handleInput = function(keydown) {
        switch (keydown) {
            case 'up':
                this.y -= VERTICAL_UNIT_LEN;
                break;
            case 'down':
                this.y += VERTICAL_UNIT_LEN;
                break;
            case 'left':
                this.x -= HORIZON_UNIT_LEN;
                break;
            case 'right':
                this.x += HORIZON_UNIT_LEN;
                break;
            default:
                break;
        }
    };
})();


/** Score board **/
var ScoreBoard;
(function() {
    ScoreBoard = function(enemies, extras, player) {
        this.enemies = enemies;
        this.extras = extras;
        this.player = player;
        this.score = 0;
        this.life = LIFE;
    };
    
    // Update the score
    ScoreBoard.prototype.update = function() {
        this.lifeCal();
        this.scoreCal();
    };

    // Render the score text
    ScoreBoard.prototype.render = function() {
        // lives
        ctx.font = "20px Monaco";
        ctx.fillStyle = "Brown";
        ctx.fillText('HP: ' + player.life, 370, 90);
        // scores
        ctx.fillText('Scores: ' + this.score, 370, 115);
    };

    // helper: life calculator
    ScoreBoard.prototype.lifeCal = function() {
        // player out of field
        // 
    };
    
    // helper: score calculator
    ScoreBoard.prototype.scoreCal = function() {
        // todo
    };

})();

/**** Objects ****/


// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var allEnemies = [
    new Enemy({
        png: ENEMY_PNG,
        x: -randomStart(),
        y: INITIAL_Y + VERTICAL_UNIT_LEN
    }),
    new Enemy({
        png: ENEMY_PNG,
        x: -randomStart(),
        y: INITIAL_Y + VERTICAL_UNIT_LEN * 2
    }),
    new Enemy({
        png: ENEMY_PNG,
        x: -randomStart(),
        y: INITIAL_Y + VERTICAL_UNIT_LEN * 3
    })
];
var player = new Player({
    png: PLAYER_IMAGE,
    x: HORIZON_UNIT_LEN * 2,
    y: VERTICAL_UNIT_LEN * 4 - 10 // modified the pic's position
});

var scoreBoard = new ScoreBoard(allEnemies, null, player);

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