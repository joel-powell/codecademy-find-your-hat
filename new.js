const prompt = require('prompt-sync')({sigint: true});

const hat = '^';
const hole = 'O';
const fieldCharacter = '░';
const pathCharacter = '*';

const getCo = (value, width) => {
    return {x: Math.floor((value - 1) % width), y: Math.floor((value - 1) / width)}
  }

class Field {
    constructor(width, height, density) {
        this.fieldSize = {x: width, y: height};
        this.holeDensity = density / 100;
        this.totalPoints = width * height;

        this.pointsArr = []
        this.holesArr = []
        this.pathArr = []
        this.field = []
        
        this.generateField(this.fieldSize, this.holeDensity)
    }

    print() {
        this.field.forEach(e => console.log(e.join('')));
      }

    generateField(size, density) {
        //generate array of ░
        this.fieldArr = Array.from({length: this.totalPoints}, () => fieldCharacter);

        //generate array of random positions for start, hat, holes
        while (this.pointsArr.length < this.totalPoints * density) {
            var r = Math.floor(Math.random() * (this.totalPoints - 1) + 1);
            if (!this.pointsArr.includes(r)) this.pointsArr.push(r);
        }

        //move start and hat position from pointsArr
        this.startPoint = this.pointsArr.pop();
        this.hatPoint = this.pointsArr.pop();

        //populate fieldArr with start, hat, holes
        this.fieldArr[this.startPoint - 1] = pathCharacter;
        this.fieldArr[this.hatPoint - 1] = hat;
        this.pointsArr.map(e => this.fieldArr[e - 1] = hole);
        
        //split fieldArr into field
        for (var i = 0; i < this.totalPoints; i += size.x) {
            this.field.push(this.fieldArr.slice(i, i+size.x));
        }

        //get coords from points
        this.holes = this.pointsArr.map(e => getCo(e, size.x));
        this.currentPos = getCo(this.startPoint, size.x);
        this.hatPos = getCo(this.hatPoint, size.x);
        this.pathArr.push(getCo(this.startPoint, size.x));
    }

    updField(direction) {
        var proposedPos = Object.assign({}, this.currentPos);
        var falseInput = false;
      
        switch(direction) {
          case 'w':
            proposedPos.y -= 1
            break;
          case 'a':
            proposedPos.x -= 1
            break;
          case 's':
            proposedPos.y += 1
            break;
          case 'd':
            proposedPos.x += 1
            break;
          default:
            falseInput = true;
            break;
        }
      
        if (proposedPos.x < 0 || proposedPos.x > (this.fieldSize.x - 1) || proposedPos.y < 0 || proposedPos.y > (this.fieldSize.y - 1)) {
          return 1;
        } else if (this.holes.some(e => e.x === proposedPos.x && e.y === proposedPos.y)) {
          return 2
        } else if (proposedPos.x === this.hatPos.x && proposedPos.y === this.hatPos.y) {
            this.currentPos = Object.assign({}, proposedPos);
          return 3;
        } else if (falseInput === true) {
            falseInput = false;
            return 4;
        } else if (this.pathArr.some(e => e.x === proposedPos.x && e.y === proposedPos.y)) {
          return 5;
        } else {
          this.currentPos = Object.assign({}, proposedPos);
          return 6;
        }
      }
    
      play() {
        var playing = true;
    
        this.print()
    
        while (playing === true) {
          var direction = prompt("Which way?");
          var val = this.updField(direction)
    
          switch (val) {
            case 1:
              console.log("You fell off the board!")
              playing = false;
              break;
            case 2:
              console.log("You fell in a hole!")
              playing = false;
              break;
            case 3:
              this.field[this.currentPos.y][this.currentPos.x] = '!'
              this.print()
              console.log("You win!")
              playing = false;
              break;
            case 4:
                console.log('Please enter w, a, s or d')
                break;
            case 5:
              console.log("You've already been there!")
              break;

            case 6:
              this.pathArr.push({x: this.currentPos.x, y: this.currentPos.y})
              this.field[this.currentPos.y][this.currentPos.x] = '*'
              this.print()
              break;
          }
        }
      }
}


console.log("Oh no you've lost your hat, can you find it?")

var game = true;

while (game === true) {


var size;
var difficulty;

var sizeSelected = false;
while (sizeSelected === false) {
    const sizeInput = prompt("Please enter a grid size (small, medium, large)");
    switch (sizeInput) {
        case 'small':
            size = {x: 6, y: 6}
            sizeSelected = true;
            break;
        case 'medium':
            size = {x: 12, y: 12}
            sizeSelected = true;
            break;
        case 'large':
            size = {x: 24, y: 24}
            sizeSelected = true;
            break;
        default:
            console.log('Please enter a valid size')
            break;
    }
}

var difficultySelected = false;
while (difficultySelected === false) {
    const difficultyInput =  prompt("Please enter a difficulty (easy, medium, hard, impossible)");
    switch (difficultyInput) {
        case 'easy':
            difficulty = 20;
            difficultySelected = true;
            break;
        case 'medium':
            difficulty = 40;
            difficultySelected = true;
            break;
        case 'hard':
            difficulty = 60;
            difficultySelected = true;
            break;
        case 'impossible':
            difficulty = 80;
            difficultySelected = true;
            break;
        default:
            console.log('Please enter a valid difficulty')
            break;
    }
}

const myField = new Field(size.x, size.y, difficulty);
myField.play()


var playSelected = false;
while (playSelected === false) {
    const playInput =  prompt("Would you like you like to play again? (y, n)");
    switch (playInput) {
        case 'y':
            playSelected = true;

            break;
        case 'n':
            playSelected = true;
            game = false;
            break;
        default:
            console.log('Please enter y or n')
            break;
    }
}


}