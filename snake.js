let end = document.querySelector("span.end");
let start = document.querySelector("button.startAgain");

class Game {
    #rows = 12;
    #collums = 16;
    keystrokes = [];
    run;
    score = 0;
    startAgain = false;
    span = document.querySelector("span.number");
    canvas = document.querySelector("div.canvas");

    getRows() {
        return this.#rows;
    }
    getCollums() {
        return this.#collums;
    }

    start() {
        end.innerHTML = "";
        this.canvas.innerHTML = "";
        snake.reset();

        for (let i = 0; i < this.#rows; i++) {
            let row = document.createElement("div");
            row.classList.add("row");
        
            for (let o = 0; o < this.#collums; o++) {
                let box = document.createElement("div");
                box.classList.add("box");
        
                row.appendChild(box);
            }
        
            this.canvas.appendChild(row);
        }

        snake.draw(1, 1);

        fruit.spawnNewFruit();

        this.run = setInterval(() => {
            if (this.keystrokes.length != 0) {
                snake.setFacing(this.keystrokes.shift());
            }
            
            let facing = snake.getFacing();
            let lastSpot = Object.assign({}, snake.body[snake.body.length - 1]);

            switch (facing) {
                case 0:
                    snake.headPosition.row--;
                    if (snake.headPosition.row == 0) {
                        snake.headPosition.row = game.getRows();
                    }
                    break;
            
                case 1:
                    snake.headPosition.collum++;
                    if (snake.headPosition.collum > game.getCollums()) {
                        snake.headPosition.collum = 1;
                    }
                    break;
        
                case 2:
                    snake.headPosition.row++;
                    if (snake.headPosition.row > game.getRows()) {
                        snake.headPosition.row = 1;
                    }
                    break;
        
                case 3:
                    snake.headPosition.collum--;
                    if (snake.headPosition.collum == 0) {
                        snake.headPosition.collum = game.getCollums();
                    }
                    break;
            }

            snake.body.unshift(Object.assign({}, snake.headPosition));

            snake.body.forEach((el, i) => {
                if (i != 0) {
                    if (snake.headPosition.row == el.row && snake.headPosition.collum == el.collum) {
                        this.end();
                    }
                }
            });

            if (snake.headPosition.row == fruit.getRow() && snake.headPosition.collum == fruit.getCollumn()) {
                fruit.spowned = false;
                this.score += 50;
                this.span.innerHTML = this.score;

                fruit.remove(fruit.getRow(), fruit.getCollumn());
                fruit.spawnNewFruit();
            } else {
                snake.remove(lastSpot.row, lastSpot.collum);
                snake.body.pop();
            }

            if (!fruit.spowned) {
                fruit.spawnNewFruit();
            }

            snake.body.forEach((el) => {
                snake.draw(el.row, el.collum);
            });

            console.log(fruit.spowned);
        }, 1000);
    }

    getBox(row, collum) {
        row--;
        collum--;

        let rows = Array.from(this.canvas.querySelectorAll("div.row"));

        let collums = Array.from(rows[row].querySelectorAll("div.box"));

        return collums[collum];
    }

    end() {
        clearInterval(this.run);
        end.innerHTML = "End of the road!";
        this.startAgain = true;
    }
}

class Snake {
    #facing = 1;
    headPosition = {
        row: 1,
        collum: 1
    };
    body = [Object.assign({}, this.headPosition)];

    setFacing(value) {
        if (value != this.#facing) {
            if (value >= 0 & value <= 3) {
                let bigger = this.#facing;
                let smaller = value;
    
                if (value > this.#facing) {
                    bigger = value;
                    smaller = this.#facing;
                }
    
                if (!(bigger - 2 == smaller)) {
                    this.#facing = value;
                }
            }
        }
    };

    getFacing() {
        return this.#facing;
    }

    reset() {
        this.#facing = 1;
        this.body = [Object.assign({}, this.headPosition)];
        this.headPosition = {
            row: 1,
            collum: 1
        };
    }

    draw(row, collum) {
        game.getBox(row, collum).classList.add("snakeBody");
    }

    remove(row, collum) {
        game.getBox(row, collum).classList.remove("snakeBody");
    }
}

class Fruit {
    spowned = false;
    #coordinates = {
        row: 0,
        collum: 0
    };

    getRow() {
        return this.#coordinates.row;
    }

    getCollumn() {
        return this.#coordinates.collum;
    }

    spawnNewFruit() {
        this.#coordinates.row = Math.floor((Math.random() * 16) + 1);
        this.#coordinates.collum = Math.floor((Math.random() * 12) + 1);

        this.draw(this.getRow(), this.getCollumn());

        this.spowned = true;
    }

    draw(row, collum) {
        game.getBox(row, collum).classList.add("fruit");
    }

    remove(row, collum) {
        game.getBox(row, collum).classList.remove("fruit");
    }
}












let game = new Game();
let snake = new Snake();
let fruit = new Fruit();



window.addEventListener("keydown", evt => {
    if (evt.key == "ArrowUp") {
        game.keystrokes.push(0)
    }
    if (evt.key == "ArrowRight") {
        game.keystrokes.push(1);
    }
    if (evt.key == "ArrowDown") {
        game.keystrokes.push(2);
    }
    if (evt.key == "ArrowLeft") {
        game.keystrokes.push(3);
    }
});

start.addEventListener("click", evt => {
    if (game.startAgain) {
        game.startAgain = false;
        game.start();
    }
});

game.start();