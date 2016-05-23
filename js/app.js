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

/*** Helpers ***/
function randomNumber(min, max) {
    return function() {
        return Math.floor(Math.random() * (max - min) + min);
    }
}

var randomStart = randomNumber(500, 0);
var randomSpeed = randomNumber(ENEMY_MAX_SPEED, ENEMY_MIN_SPEED);
function randomPos() {
    return [(randomNumber(1, 4))(), (randomNumber(0, 5))()];
}


function getPos(row, col) {
    return [col * HORIZON_UNIT_LEN, row * VERTICAL_UNIT_LEN];
}

/*** Enemies and player ***/
// Enemies our player must avoid
var Enemy;
(function() {
    Enemy = function(info) {
        this.sprite = info.png;
        this.x = info.x;
        this.y = info.y;
        this.unit = randomSpeed();
    };

    Enemy.prototype.update = function(dt) {
        this.x += dt * this.unit;
        if (this.x > WIDTH) {
            this.x = -randomStart();
            this.unit = randomSpeed();
        }
    };

    Enemy.prototype.render = function() {
        Resources.load(this.sprite);
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    };

})();


var Player;
(function() {
    Player = function(info) {
        Enemy.call(this, info);
        this.initPos = {
            x: info.x,
            y: info.y
        };
        this.life = LIFE;
        this.items = [];
    };
    Player.prototype = Object.create(Enemy.prototype);

    Player.prototype.constructor = Player;
    
    // helper: dead and reset
    Player.prototype.resetDead = function() {
        this.x = this.initPos.x;
        this.y = this.initPos.y;
        this.life--;
    };
    
    // helper: out of field
    Player.prototype.outField = function() {
        var upper = 0;
        var downer = HEIGHT - VERTICAL_UNIT_LEN;
        var lefter = 0;
        var righter = WIDTH - HORIZON_UNIT_LEN;
        if (this.x < lefter || this.x > righter || this.y < upper || this.y > downer) {
            this.resetDead();
        }
    };
    
    // interface: get items
    Player.prototype.getItem = function(item) {
        // just append the list: items

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
        this.enemies = allEnemies;
        this.extras = extras;
        this.player = player;
        this.score = 0;
        this.info = "";
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
        ctx.fillText('HP: ' + this.player.life, 340, 90);
        // scores
        ctx.fillText('Scores: ' + this.score, 340, 115);
        // game over
        ctx.font = "60px Monaco";
        ctx.fillText(this.info, 100, 300);
    };

    // helper: crash into an item?
    ScoreBoard.prototype.isCrashed = function(item) {
        var x, y;
        if (item.pos === undefined) {
            x = item.x;
            y = item.y;
        } else {
            var realPos = getPos(item.pos[0], item.pos[1]);
            x = realPos[0];
            y = realPos[1];
        }
        return (Math.abs(x - this.player.x) < 40 &&
        Math.abs(y - this.player.y) < 40);
    };

    // helper: life calculator
    ScoreBoard.prototype.lifeCal = function() {
        // player out of field
        // bug crashed
        for (var i = 0; i < this.enemies.length; i++) {
            var bug = this.enemies[i];
            if (this.isCrashed(bug)) {
                this.player.resetDead();
            }
        }
    };

    // helper: score calculator
    ScoreBoard.prototype.scoreCal = function() {
        // whether crashed
        for (var i = 0; i < this.extras.length; i++) {
            var item = this.extras[i];
            if (this.isCrashed(item) && item.shown) {
                this.score += item.value;
            }
        }

    };

})();


/**** Extras ****/
// helper: produce a temp object
function extraDef(v, tf, tl, pr, pic) {
    return {
        value: v,
        timeFreq: tf,
        timeLast: tl,
        prereq: pr,
        picture: pic
    };
}

// Definition of different extras: score, time frequency, time last, prerequisite, picture
var EXTRAS = {
    // only star is applied
    heart: extraDef(10, 200, 300, "", 'images/Heart.png'),
    keys: extraDef(10, 200, 300, "", 'images/Key.png'),
    rock: extraDef(10, 200, 300, "", 'images/Rock.png'),
    star: extraDef(10, 100, 150, "", 'images/Star.png'),
    boxStar: extraDef(10, 200, 300, "keys", 'images/Selector.png'),
    blueGem: extraDef(10, 220, 300, "", 'images/Gem Blue.png'),
    greenGem: extraDef(10, 200, 330, "", 'images/Gem Green.png'),
    orangeGem: extraDef(10, 20, 30, "", 'images/Gem Orange.png')
};

var Extra;
(function() {
    Extra = function(name) {
        this.name = name;
        var obj = EXTRAS[name];
        this.value = obj.value;
        this.resetClock = [obj.timeFreq, obj.timeLast];
        this.clock = randomNumber(0, obj.timeFreq)();
        this.prereq = EXTRAS[obj.prereq];       // an object
        this.pic = obj.picture;
        this.shown = false;
        this.pos = randomPos();
    };

    Extra.prototype.update = function() {
        this.clock++;
        if (this.shown) {
            if (this.clock > this.resetClock[1]) {
                this.shown = false;
                this.clock = 0;
            }
        } else {
            if (this.clock > this.resetClock[0]) {
                this.pos = randomPos();
                this.shown = true;
                this.clock = 0;
            }
        }
    };
    
    Extra.prototype.render = function() {
        if (this.shown) {
            Resources.load(this.pic);
            var cord = getPos(this.pos[0], this.pos[1]);
            ctx.drawImage(Resources.get(this.pic), cord[0], cord[1]);       // fixme
        }
    }
    
})();


// Instances
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

var extras = [
    new Extra("star"),
    new Extra("star")
];

var scoreBoard = new ScoreBoard(allEnemies, extras, player);

document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});