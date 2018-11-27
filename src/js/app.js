import Mouse from './Mouse.mjs'
import Ball from './Ball.mjs';
// ======Canvas======
let screen = {
    height: window.innerHeight,
    width: window.innerWidth
}
let canvas = document.querySelector('.canvas');
let ctx = canvas.getContext('2d');
canvas.height = screen.height;
canvas.width = screen.width;

// ======Control Vars======
let mouseBallRadius = 50;
let littleBallRadius = screen.height * screen.width / 60000;

// ======Mouse ball======
let mouse = new Mouse(canvas);
let mouseBall = new Ball({
    x: mouse.x,
    y: mouse.y,
    radius: mouseBallRadius,
    randomize: false,
    color: '#c1224f'
});

// ======Create little balls======
let balls = [];
for (let i = 0; i < 10; i++) {
    balls.push(new Ball({
        color: '#364e68',
        randomize: true,
        radius: 100
    }));
}

// Each ball colision function
function ballsColision(ballCurrent, ball) {
    // ======Each ball colision ======
    for (let j = 0; j < balls.length; j++) {
        if (j !== ballCurrent) {
            ball.phys(balls[j], mouse);
        }
        else {
            continue
        }
    }
}


function Render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    mouseBall.updatePos(mouse.x, mouse.y);
    mouseBall.draw(ctx)

    balls.forEach((ball, ballCurrent) => {
        ballsColision(ballCurrent, ball);
        // ball.phys(mouseBall, mouse);
        ball.speed();
        ball.sideColision(screen)
        // ball.frict();
        // ball.reduceVxy();
        ball.draw(ctx);
    })
    window.requestAnimationFrame(Render);
}
Render();