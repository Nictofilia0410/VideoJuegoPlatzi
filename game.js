const canvas = document.querySelector('#game');
const game = canvas.getContext('2d');
const btnUp = document.querySelector('#up');
const btnLeft = document.querySelector('#left');
const btnRight = document.querySelector('#right');
const btnDown = document.querySelector('#down');
const spanLives = document.querySelector('#lives');
const spanTime = document.querySelector('#time');
const spanRecord = document.querySelector('#record');


window.addEventListener('load', setCanvasSize);
window.addEventListener('resize', setCanvasSize);

let canvasSize;
let elementsSize;
let level = 0;
let lives = 3;
let Time;
let record = localStorage.getItem('record');

let timeStart;
let timePlayer;
let timeInterval;

const playerPosition = {
    x: undefined,
    y: undefined,
};
const giftPosition = {
    x: undefined,
    y: undefined,
};

let enemyPositions = [];


function setCanvasSize() {
    if (window.innerHeight > window.innerWidth) {
        canvasSize = window.innerWidth * 0.7;
    } else {
        canvasSize = window.innerHeight * 0.7;
    }
    
    canvasSize = Number(canvasSize.toFixed(0));

    canvas.setAttribute('width', canvasSize);
    canvas.setAttribute('height', canvasSize);
    elementsSize = canvasSize / 10;

    playerPosition.x = undefined;
    playerPosition.y = undefined;
    startGame();
}

function startGame() {
    
    game.font = elementsSize + 'px Verdana';
    game.textAlign = 'end';

    const map = maps[level];

    if (!map) {
        gameWin();
        return;
    }

    if (!timeStart) {
        timeStart = Date.now();
        timeInterval = setInterval(showTime,100);
        spanRecord.innerHTML = record;
    }

    showLives();

    const mapRows = map.trim().split('\n');
    const mapRowCols = mapRows.map(row => row.trim().split(''))
    
    enemyPositions = [];
    game.clearRect(0,0,canvasSize,canvasSize);
    

    mapRowCols.forEach((row, rowI) => {
        row.forEach((col, colI) => {
            const emoji = emojis[col];
            const posX = elementsSize * (colI + 1);
            const posY = elementsSize * (rowI + 1);
            
            if (col == 'O') {
                if (!playerPosition.x && !playerPosition.y) {
                    playerPosition.x = posX;
                    playerPosition.y = posY;
                }
            } else if (col == 'I') {
                giftPosition.x = posX;
                giftPosition.y = posY;
            } else if (col == 'X') {
                enemyPositions.push({
                    x: posX,
                    y: posY,
                })
            }
            
            game.fillText(emoji, posX, posY);
        });
    });
    movePlayer();
}

function movePlayer () {
    const giftColisionX = playerPosition.x.toFixed(3) == giftPosition.x.toFixed(3);
    const giftColisionY = playerPosition.y.toFixed(3) == giftPosition.y.toFixed(3);
    const giftColision = giftColisionX && giftColisionY;

    if (giftColision){
        levelWin();
    }

    const enemyColision = enemyPositions.find(enemy => {
        const enemyColisionX = enemy.x.toFixed(3) == playerPosition.x.toFixed(3);
        const enemyColisionY = enemy.y.toFixed(3) == playerPosition.y.toFixed(3);
        return enemyColisionX && enemyColisionY;
    });

    if (enemyColision) {
        levelFail();
    }

    game.fillText(emojis['PLAYER'], playerPosition.x, playerPosition.y);
}

function gameWin() {
    console.log('Terminaste el juegoo');
    clearInterval(timeInterval);
    if (record > Time) {
        localStorage.setItem('record',Time);
    }
}

function showLives() {
    const heartArray = Array(lives).fill(emojis['HEART']);
    spanLives.innerHTML = "";
    heartArray.forEach(heart => spanLives.append(heart));
    //spanLives.innerHTML = heartArray;
}

function showTime() {
    Time = (Date.now() - timeStart)/1000
    spanTime.innerHTML = Time.toFixed(1);
}

function levelFail() {
    lives--;

    if (lives <= 0) {
        level = 0;
        lives = 3;
        timeStart = undefined;
    } 
    playerPosition.x = undefined;
    playerPosition.y = undefined;
    console.log('Chocaste', lives);
    startGame();
}

function levelWin() {
    console.log('Subiste de nivel');
    level++;
    startGame();
}

window.addEventListener('keydown', moveKeys);
btnUp.addEventListener('click', moveUp);
btnLeft.addEventListener('click', moveLeft);
btnRight.addEventListener('click', moveRight);
btnDown.addEventListener('click', moveDown);

function moveKeys(event) {
    if (event.code == 'ArrowUp') moveUp();
    else if (event.code == 'ArrowRight') moveRight();
    else if (event.code == 'ArrowLeft') moveLeft();
    else if (event.code == 'ArrowDown') moveDown();
}
function moveUp() {
    if ((playerPosition.y - elementsSize) < elementsSize){
    }else{
        playerPosition.y -= elementsSize;
        startGame();
    }
}

function moveLeft() {
    if ((playerPosition.x - elementsSize) < elementsSize){
    }else{
        playerPosition.x -= elementsSize;
        startGame();
    }
}

function moveRight () {
    if ((playerPosition.x + elementsSize) > (canvasSize)){
    }else{
        playerPosition.x += elementsSize;
        startGame();
    }
}

function moveDown () {
    if ((playerPosition.y + elementsSize) > (canvasSize)){
    }else{
        playerPosition.y += elementsSize;
        startGame();
    }
}