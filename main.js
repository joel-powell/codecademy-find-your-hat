const prompt = require('prompt-sync')({sigint: true});

const hat = '^';
const hole = 'O';
const fieldCharacter = '░';
const pathCharacter = '*';

const getCo = (value, width) => {
  return {x: Math.floor((value - 1) % width), y: Math.floor((value - 1) / width)}
}

class Field {


  print() {
    this.field.forEach(e => console.log(e.join('')));
  }



  constructor(width, height, density) {
    this.fieldSize = {x: width, y: height};
    var totalPoints = width * height;
    var points = []


    while (points.length < totalPoints * (density / 100)) {
      var r = Math.floor(Math.random() * (totalPoints - 1)) + 1;
      if (!points.includes(r)) points.push(r);
    }

    var start = points.pop()
    var hatLoc = points.pop()
    this.path = []
    this.currentPos = Object.assign({}, getCo(start, width));
    this.path.push(Object.assign({}, this.currentPos));
    this.hatPos = Object.assign({}, getCo(hatLoc, width));
    this.holes = points.map(element => Object.assign({}, getCo(element, width)));

    var newField = Array.from({length: totalPoints}, () => fieldCharacter);
    points.map(element => newField[element] = hole);
    newField[start] = pathCharacter;
    newField[hatLoc] = hat;

    this.field = []

    for (var index = 0; index < totalPoints; index += width) {
      var temp = newField.slice(index, index+width);
      this.field.push(temp);
    }


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
      return 3;
    } else if (this.path.some(e => e.x === proposedPos.x && e.y === proposedPos.y)) {
      return 4;
    } else if (falseInput === true) {
      falseInput = false;
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
          console.log("You win!")
          playing = false;
          break;
        case 4:
          console.log("You've already been there!")
          break;
        case 5:
          console.log('Please enter w, a, s or d')
          break;
        case 6:
          this.path.push({x: this.currentPos.x, y: this.currentPos.y})
          this.field[this.currentPos.y][this.currentPos.x] = '*'
          this.print()
          break;
      }
    }
  }
}

const myField = new Field(4, 4, 50);

//myField.generateField()
console.log(myField.currentPos)
console.log(myField.path)


myField.play()


//var width = prompt("How wide would you like the grid?");
//var height = prompt("How high would you like the grid?");




