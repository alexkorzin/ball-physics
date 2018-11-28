import Mouse from './Mouse.mjs'
import Ball from './Ball.mjs';

// Game starts set
let countSet = document.querySelector('.counts');
let levelCounter = document.querySelector('.level_counter');
let levelCurrent = document.querySelector('.level_number');
let count = 0;
let level = 0;

// ======Canvas======
let screen = {
    height: window.innerHeight,
    width: window.innerWidth
}
let canvas = document.querySelector('.canvas');
let ctx = canvas.getContext('2d');
canvas.height = screen.height - levelCounter.offsetHeight;
canvas.width = screen.width;

console.log(canvas.height)

function levelChecker() {
    if (level == 0) {
        let percent = count/10
        levelCounter.style.width = percent + '%';
        if (count > 1000) {
            level++;
            levelCurrent.innerHTML = level;
            levelCounter.style.width = '0%';
        }
    } else {
        let percent = (count - (1000 *level) +1000) / 10
        levelCounter.style.width = percent + '%';
        if (count > level * 1000) {
            level++;
            levelCurrent.innerHTML = level;
            levelCounter.style.width = '0%';
        }
    }
}

// ======Control Vars======
let mouseBallRadius = 50;
let littleBallRadius = screen.height * screen.width / 60000;

// Get random number 
function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}

// Each ball colision function
function ballsColision(ballCurrent, ball) {
    for (let j = 0; j < balls.length; j++) {
        if (j !== ballCurrent) {
            let is = ball.phys(balls[j], mouse);
            if (is == true) {
                count++;
            }
        }
        else {
            continue
        }
    }
}

// ======Mouse ball======
let mouse = new Mouse(canvas);
let mouseBall = new Ball({
    x: mouse.x,
    y: mouse.y,
    radius: mouseBallRadius,
    color: '#c1224f'
});

// ======Create little balls======
let balls = [];
for (let i = 0; i < 20; i++) {
    let radius = getRandomArbitrary(5, 100);
    let newBallCoords = {};
    newBallCoords = {
        x: getRandomArbitrary(radius, window.innerWidth - radius),
        y: getRandomArbitrary(radius, window.innerHeight - radius),
    }
    if (i != 0) {
        for (let j = 0; j < balls.length; j++) {
            if (balls[0].getDistance(newBallCoords, balls[j]) < balls[j].radius + radius) {
                newBallCoords.x = getRandomArbitrary(radius, window.innerWidth - radius);
                newBallCoords.y = getRandomArbitrary(radius, window.innerHeight - radius);
                j = -1;
            }
        }
    }
    balls.push(new Ball({
        color: '#0d627a',
        radius: radius,
        x: newBallCoords.x,
        y: newBallCoords.y
    }));
}

function Render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    mouseBall.updatePos(mouse.x, mouse.y);
    mouseBall.draw(ctx, 'fill')

    balls.forEach((ball, ballCurrent) => {
        ballsColision(ballCurrent, ball);
        ball.phys(mouseBall, mouse);
        ball.speed();
        ball.sideColision(canvas)
        ball.frict();
        // ball.reduceVxy();
        ball.draw(ctx, 'fill');
        countSet.innerHTML = count;
        levelChecker();
    })
    window.requestAnimationFrame(Render);
}

Render();
