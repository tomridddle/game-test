function init() {
    var fireButton = document.getElementById("fireButton");
    fireButton.onclick = handlerFireButton;
    var guessInput = document.getElementById("guessInput");
    guessInput.onkeypress = handlerGuessInput;

    model.generateShips();
    console.log(model.ships);

};

function handlerFireButton() {
    var guessInput = document.getElementById("guessInput");
    var guess = guessInput.value;

    controller.processGuess(guess);
    guess="";
    guessInput.value = guess;
};

function handlerGuessInput(e) {
    var fireButton = document.getElementById("fireButton");

    if (e.keyCode === 13) {
        fireButton.click();
        return false;
    }
};

window.onload = init;

function parseInput(guess) {
    var convertRows = ["A", "B", "C", "D", "E", "F", "G"];
    var row = convertRows.indexOf(guess[0]);
    var column = guess.charAt(1);

    if (guess.length != 2) {
        alert("Invalid input! Please enter a character with a number");
    }
    else if (row < 0 || column > model.boardSize - 1 || isNaN(column)) {
        alert("Invalid input! Please enter right row and right column");
    }
    else {
        return "item" + row + column;
    }

    return null;
};


var controller = {
    guesses:0,

    processGuess: function(guess) {
        var guessConvert = parseInput(guess);
        if (guessConvert) {
            this.guesses++;
            var hit = model.fire(guessConvert);
            
            if (hit) {
                for (var i = 0; i < copyNumShips; ++i) {
                    if (model.isSunk(shipsSunk[i])) {
                        view.displayMessage("You destroyed a ship");
                        view.displayHit(guessConvert);
                        shipsSunk.splice(i,1);
                        copyNumShips--;
                        break;  
                    }
                    else {
                        view.displayMessage("HIT!");
                        view.displayHit(guessConvert);
                    }
                }
                if (model.shipsSunk === model.numShip) {
                    alert(`You win the game with ${this.guesses} guesses, meaning that your accuracy is ${Math.round(9/this.guesses*100)}%`);
                    alert(`Very interesting huh? F5 to play again`)
                }
            }
            else {
                view.displayMessage("MISS!");
                view.displayMiss(guessConvert);
            }
        }
    }
};

var model = {
    boardSize: 7,
    numShip: 3,
    shipsSunk: 0,
    isSunk: function(ship) {
        for (var i = 0; i < ship.hit.length; ++i) {
            if (ship.hit[i] !== "hit") {
                return false;
            }
        }

        return true;
    },
    ships : [
        {
            location:["", "", ""],
            hit:["", "", ""]
        },

        {
            location:["", "", ""],
            hit:["", "", ""]
        },

        {
            location:["", "", ""],
            hit:["", "", ""]
        }
    ],
    fire: function(guessConvert) {
        for (var i = 0; i < this.numShip; ++i) {
            var shipLocation = this.ships[i].location;
            var index = shipLocation.indexOf(guessConvert);
            if (index >= 0) {
                this.ships[i].hit[index] = "hit";
                if (this.isSunk(this.ships[i])) {
                    this.shipsSunk++;
                }
                return true;
            }
        }

        return false;
    },

    generateShips: function() {
        for (var i = 0; i < this.numShip; i++) {
            do {
                var locations = this.generateShip();
            } while(this.collision(locations));

            this.ships[i].location = locations;
        }
    },

    generateShip: function() {
        var shipLocation = [];
        var direction = Math.floor(Math.random()*2);
        if (direction == 1) {
            var row = Math.floor(Math.random()*7);
            var column = Math.floor(Math.random() * (this.boardSize - 2));
        }
        else {
            var row = Math.floor(Math.random()* (this.boardSize - 2));
            var column = Math.floor(Math.random()*7);
        }

        for (var i = 0; i < this.numShip; ++i) {
            if (direction == 1) {
                shipLocation.push("item" + row + (column+i))
            }
            else {
                shipLocation.push("item" + (row+i) + column);
            }
        }

        return shipLocation;
    },

    collision: function(shipLocation) {
        for (var i = 0; i < this.numShip; ++i) {
            var ship = this.ships[i];
            for (var j = 0; j < shipLocation.length; ++j) {
                if (ship.location.indexOf(shipLocation[j]) >= 0) {
                    return true;
                }
            }
        }
        return false;
    }
};

var view = {
    displayMessage: function(message) {
        var messageArea = document.getElementById("messageArea");
        messageArea.innerHTML = message;
    },
    displayHit:function(convertGuess) {
        var cell = document.getElementById(convertGuess);
        cell.setAttribute("class", "hit");
    },
    displayMiss: function(convertGuess) {
        var cell = document.getElementById(convertGuess);
        cell.setAttribute("class", "miss");
    }
};

var shipsSunk = [];
var copyNumShips = model.numShip;
for (var i = 0; i < copyNumShips; ++i) {
    shipsSunk.push(model.ships[i]);
};