const canvas = document.querySelector("canvas")
const context = canvas.getContext("2d")
let grid = 14;
let count = 0;
let lastMove = 'right';
let score = document.querySelector('#score');
let isMoving = false;
let keys = "";
const level3 = document.querySelector('.level3')

for (let i = 0; i < localStorage.length; i++) {
    keys += localStorage.key(i)
}

let wall = {
    wallcells: [{ x: 210, y: 0 }, { x: 210, y: 14 }, { x: 210, y: 28 }, { x: 210, y: 42 }, { x: 210, y: 56 }, { x: 210, y: 70 }, { x: 210, y: 84 }, { x: 210, y: 98 },
    { x: 0, y: 210 }, { y: 210, x: 14 }, { y: 210, x: 28 }, { y: 210, x: 42 }, { y: 210, x: 56 }, { y: 210, x: 70 }, { y: 210, x: 84 }, { y: 210, x: 98 },
    { x: 406, y: 210 }, { x: 392, y: 210 }, { x: 378, y: 210 }, { x: 364, y: 210 }, { x: 350, y: 210 }, { x: 336, y: 210 }, { x: 322, y: 210 }, { x: 308, y: 210 },
    { y: 406, x: 210 }, { y: 392, x: 210 }, { y: 378, x: 210 }, { y: 364, x: 210 }, { y: 350, x: 210 }, { y: 336, x: 210 }, { y: 322, x: 210 }, { y: 308, x: 210 },
    ]
}

const DrawWall = () => {
    context.fillStyle = 'red'
    for (let i = 0; i < wall.wallcells.length; i++) {
        context.fillRect(wall.wallcells[i].x, wall.wallcells[i].y, grid - 1, grid - 1)
    }
}
// DrawWall()

let snake =
{
    x: 140,
    y: 140,
    cells: [{ x: 140, y: 140 }, { x: 126, y: 140 }],
    die: false,
    eatApple: false,
};

let apple = {
    x: 280,
    y: 280
};

if (keys.includes("move2")) {
    let alldata = JSON.parse(localStorage.getItem("move2"))
    snake.cells = alldata.cells;
    if (alldata.cells.length > 0) {
        snake.x = alldata.cells[0].x;
        snake.y = alldata.cells[0].y;
        count = alldata.score;
        score.innerHTML = "Score : " + count;
        lastMove = alldata.lastMove;
        apple = alldata.apple;
    }
}

const drawApple = () => {
    context.fillStyle = '#1100ff';
    context.fillRect(apple.x, apple.y, grid - 1, grid - 1);
}
// drawApple();

const drawSnake = () => {
    context.fillStyle = '#00ffd5';
    if (snake.cells.length > 0) {
        context.fillRect(snake.cells[0].x, snake.cells[0].y, grid - 1, grid - 1);
        context.fillStyle = '#ebfa1e';
        for (let i = 1; i < snake.cells.length; i++)
            context.fillRect(snake.cells[i].x, snake.cells[i].y, grid - 1, grid - 1);
    }
}
// drawSnake();

const moveSnake = (dx, dy) => {
    snake.x += dx;
    snake.y += dy;
    snake.cells.unshift({ x: snake.x, y: snake.y });
    if (!snake.eatApple) snake.cells.pop();
    else snake.eatApple = false;
}

const checkBoundary = () => {
    if (snake.x < 0 || snake.x >= canvas.width || snake.y < 0 || snake.y >= canvas.height) {
        snake.die = true;
    }
}

const getRandomInt = () => {
    return Math.floor(Math.random() * 25) * grid;
}

const checkAppleIsOnSnake = () => {
    for (let i = 0; i < snake.cells.length; i++) {
        if (apple.x == snake.cells[i].x && apple.y == snake.cells[i].y) {
            return true;
        }
    }
}

const checkSnakeBiteItself = () => {
    for (let i = 4; i < snake.cells.length; i++) {
        if (snake.x == snake.cells[i].x && snake.y == snake.cells[i].y) {
            snake.die = true;
        }
    }
}

const checkWall = () => {
    for (let i = 0; i < wall.wallcells.length; i++) {
        if (apple.x == wall.wallcells[i].x && apple.y == wall.wallcells[i].y) {
            return true;
        }
    }
}

const checkSnakeReachedWall = () => {
    for (let i = 0; i < wall.wallcells.length; i++) {
        if (snake.x == wall.wallcells[i].x && snake.y == wall.wallcells[i].y) {
            snake.die = true;
        }
    }
}

const generateApple = () => {
    apple.x = getRandomInt();
    apple.y = getRandomInt();
    if (checkAppleIsOnSnake()) {
        generateApple();
    }
    else if (checkWall()) {
        generateApple();
    }
}

const checkEatApple = () => {
    if (snake.x == apple.x && snake.y == apple.y) {
        snake.eatApple = true;
        generateApple();
        drawApple();
        count += 10;
    }
    score.innerHTML = "Score : " + count;
}

const gameOver = () => {
    context.clearRect(0, 0, canvas.width, canvas.height);
    snake.cells = [];
    wall.wallcells = []
    apple = {}
    context.fillStyle = 'red';
    context.font = "30px Arial";
    context.textAlign = "center";
    context.fillText("Game Over", canvas.width / 2, canvas.height / 2);
    if (keys.includes("move2")) {
        localStorage.removeItem("move2")
    }
    setTimeout(function () {
        location.replace("../index.html")
    }, 500)
}

document.addEventListener('keydown', e => {
    let dx = 0, dy = 0;
    // left key
    if (e.keyCode == 37 && lastMove != 'right' && isMoving == true) {
        dx = -grid;
        dy = 0;
        lastMove = 'left';
        if (e.keyCode == 37) {
            return false
        }
    }
    // up key
    else if (e.keyCode == 38 && lastMove != 'down' && isMoving == true) {
        dy = -grid;
        dx = 0;
        lastMove = 'up';
        if (e.keyCode == 38) {
            return false
        }
    }
    // right key
    else if (e.keyCode == 39 && lastMove != 'left' && isMoving == true) {
        dx = grid;
        dy = 0;
        lastMove = 'right';
        if (e.keyCode == 39) {
            return false
        }
    }
    // down key
    else if (e.keyCode == 40 && lastMove != 'up' && isMoving == true) {
        dy = grid;
        dx = 0;
        lastMove = 'down';
        if (e.keyCode == 40) {
            return false
        }
    } else {
        return;
    }
    context.clearRect(0, 0, canvas.width, canvas.height);
    moveSnake(dx, dy);
    checkBoundary();
    checkSnakeBiteItself();
    checkEatApple();
    checkSnakeReachedWall();
    if (snake.die) {
        gameOver();
        return;
    }
    DrawWall();
    drawSnake();
    drawApple();
});

let setinterval;
const resume = () => {
    setinterval = setInterval(() => {
        dx = 0;
        dy = 0;
        if (lastMove == 'left') {
            dx = -grid;
            dy = 0;
            lastMove = 'left';
        }
        else if (lastMove == 'up') {
            dy = -grid;
            dx = 0;
            lastMove = 'up';
        }
        else if (lastMove == 'right') {
            dx = grid;
            dy = 0;
            lastMove = 'right';
        }
        else if (lastMove == 'down') {
            dy = grid;
            dx = 0;
            lastMove = 'down';
        }
        context.clearRect(0, 0, canvas.width, canvas.height);
        moveSnake(dx, dy);
        checkBoundary();
        checkSnakeBiteItself();
        checkEatApple();
        checkSnakeReachedWall();
        if (snake.die) {
            gameOver();
        }
        DrawWall();
        drawSnake();
        drawApple();
        isMoving = true;
        if (count >= 100) {
            level3.classList.remove('disabled');
        }
    }, 200)
}
resume();
const pause = () => {
    clearInterval(setinterval);
    isMoving = false;
}

// pause
document.querySelector('.pause').addEventListener('click', () => {
    pause();
    let data = {
        cells: snake.cells,
        score: count,
        lastMove: lastMove,
        apple: apple
    }
    localStorage.setItem('move2', JSON.stringify(data));
    document.querySelector('.pause').disabled = true;
    document.querySelector('.pause').disabled = false;
});

// resume
document.querySelector('.resume').addEventListener('click', () => {
    if (!isMoving) {
        if (keys.includes('move2')) {
            let data = JSON.parse(localStorage.getItem('move2'));
            snake.cells = data.cells;
            snake.x = data.cells[0].x;
            snake.y = data.cells[0].y;
            count = data.score;
            score.innerHTML = "Score : " + count;
            lastMove = data.lastMove;
            apple = data.apple;
        }
        resume();
        isMoving = true;
    }
    document.querySelector('.resume').disabled = true;
    document.querySelector('.resume').disabled = false;
});

document.addEventListener('keydown', e => {
    if (e.keyCode == 32) {
        pause();
        let data = {
            cells: snake.cells,
            score: count,
            lastMove: lastMove,
            apple: apple
        }
        localStorage.setItem('move2', JSON.stringify(data));
        isMoving = false;
    }
    else if (e.keyCode == 13) {
        if (!isMoving) {
            if (keys.includes('move2')) {
                let data = JSON.parse(localStorage.getItem('move2'));
                snake.cells = data.cells;
                snake.x = data.cells[0].x;
                snake.y = data.cells[0].y;
                count = data.score;
                score.innerHTML = "Score : " + count;
                lastMove = data.lastMove;
                apple = data.apple;
            }
            resume();
            isMoving = true;
        }
    }
    // else if (e.ctrlKey && e.altKey && e.keyCode == 78) {
    //     if (keys.includes('move2')) {
    //         localStorage.removeItem('move2');
    //     }
    //     location = location.href;
    //     resume();
    //     isMoving = true;
    // }
})

level3.addEventListener('click', () => {
    if (level3.classList.contains("disabled")) {
        return false
    } else {
        if (keys.includes("move2")) {
            localStorage.removeItem("move2")
        }
        if (keys.includes("move3")) {
            localStorage.removeItem("move3")
        }
        location.replace('../level3/level3.html');
    }
})