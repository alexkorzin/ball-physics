'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function (global, factory) {
    (typeof exports === 'undefined' ? 'undefined' : _typeof(exports)) === 'object' && typeof module !== 'undefined' ? factory() : typeof define === 'function' && define.amd ? define(factory) : factory();
})(undefined, function () {
    'use strict';

    var Mouse = function Mouse(canvas) {
        var _this = this;

        _classCallCheck(this, Mouse);

        this.x = 0;
        this.y = 0;
        var rect = canvas.getBoundingClientRect();

        canvas.addEventListener('mousemove', function (evt) {
            _this.x = evt.clientX - rect.left, _this.y = evt.clientY - rect.top;
        });
    };

    var Ball = function () {
        function Ball(obj) {
            _classCallCheck(this, Ball);

            this.radius = obj.radius || 10;

            // Get random position
            this.x = obj.x;
            this.y = obj.y;

            this.velocity = {
                x: obj.velocityX || 0,
                y: obj.velocityX || 0
            };

            this.color = obj.color || '#98ccd3';
            this.friction = 0.93;
            this.mass = this.radius;
        }

        _createClass(Ball, [{
            key: 'draw',
            value: function draw(ctx, colorType) {
                var type = colorType || 'stroke';
                ctx.save();
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
                ctx.strokeStyle = this.color;
                ctx.fillStyle = this.color;
                ctx.lineWidth = 1;
                if (type == 'stroke') {
                    ctx.stroke();
                }
                if (type == 'fill') {
                    ctx.fill();
                }
                ctx.closePath();
                ctx.restore();
            }
        }, {
            key: 'updatePos',
            value: function updatePos(x, y) {
                this.x = x;
                this.y = y;
            }
        }, {
            key: 'getDistance',
            value: function getDistance(self, object) {
                var dx = self.x - object.x;
                var dy = self.y - object.y;
                return Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
            }
        }, {
            key: 'rotate',
            value: function rotate(obj, angle) {
                var rotatedVelocities = {
                    x: obj.x * Math.cos(angle) - obj.y * Math.sin(angle),
                    y: obj.x * Math.sin(angle) + obj.y * Math.cos(angle)
                };
                return rotatedVelocities;
            }
        }, {
            key: 'phys',
            value: function phys(object, mouse) {
                var distance = this.getDistance(this, object);
                // Colision Moment
                if (distance < this.radius + object.radius) {

                    var xVelocityDiff = object.velocity.x - this.velocity.x;
                    var yVelocityDiff = object.velocity.y - this.velocity.y;

                    var xDist = this.x - object.x;
                    var yDist = this.y - object.y;

                    var angle = -Math.atan2(this.y - object.y, this.x - object.x);

                    if (object.x === mouse.x & object.y === mouse.y) {

                        var ex = object.x + Math.cos(angle) * (object.radius + this.radius);
                        var ey = object.y - Math.sin(angle) * (object.radius + this.radius);

                        var inX = ex - this.x;
                        var inY = ey - this.y;
                        // console.log('x: ', inX, 'y:', inY)
                        this.velocity.x += (ex - this.x) * 0.8;
                        this.velocity.y += (ey - this.y) * 0.8;
                    } else {
                        // If objects are not overlaping
                        if (xVelocityDiff * xDist + yVelocityDiff * yDist >= 0) {

                            var m2 = object.mass;
                            var m1 = this.mass;

                            // Velocity before
                            var u2 = this.rotate(object.velocity, angle);
                            var u1 = this.rotate(this.velocity, angle);

                            // Velocity after
                            var v2 = { x: -u1.x + 2 * ((u1.x * m1 + u2.x * m2) / (m2 + m1)), y: u1.y };
                            var v1 = { x: -u2.x + 2 * ((u1.x * m1 + u2.x * m2) / (m2 + m1)), y: u2.y };

                            // Final velocity
                            var vFinal2 = this.rotate(v1, -angle);
                            var vFinal1 = this.rotate(v2, -angle);

                            // Update velocity
                            object.velocity.x = vFinal2.x;
                            object.velocity.y = vFinal2.y;
                            this.velocity.x = vFinal1.x;
                            this.velocity.y = vFinal1.y;

                            return true;
                        }
                    }
                }
            }
        }, {
            key: 'sideColision',
            value: function sideColision(screen) {
                //Left side colision
                if (this.x - this.radius < 0) {
                    var ex = this.radius;
                    this.velocity.x += ex - this.x;
                }
                //Right side colision
                if (this.x + this.radius > screen.width) {
                    var _ex = screen.width - this.radius;
                    this.velocity.x += _ex - this.x;
                }
                //Top side colision
                if (this.y - this.radius < 0) {
                    var ey = this.radius;
                    this.velocity.y += ey - this.y;
                }
                //Bottom side colision
                if (this.y + this.radius > screen.height) {
                    var _ey = screen.height - this.radius;
                    this.velocity.y += _ey - this.y;
                }
            }
        }, {
            key: 'reduceVxy',
            value: function reduceVxy() {
                if (Math.abs(this.velocity.y) < this.radius / 100 & Math.abs(this.velocity.x) < this.radius / 100) {
                    this.velocity.y = 0;
                    this.velocity.x = 0;
                }
            }
        }, {
            key: 'frict',
            value: function frict() {
                this.velocity.y *= this.friction;
                this.velocity.x *= this.friction;
            }
        }, {
            key: 'speed',
            value: function speed() {
                this.x += this.velocity.x;
                this.y += this.velocity.y + 0.0 * this.radius;
            }
        }]);

        return Ball;
    }();

    // Game starts set


    var countSet = document.querySelector('.counts');
    var levelCounter = document.querySelector('.level_counter');
    var levelCurrent = document.querySelector('.level_number');
    var count = 0;
    var level = 0;

    // ======Canvas======
    var screen = {
        height: window.innerHeight,
        width: window.innerWidth
    };
    var canvas = document.querySelector('.canvas');
    var ctx = canvas.getContext('2d');
    canvas.height = screen.height - levelCounter.offsetHeight;
    canvas.width = screen.width;

    console.log(canvas.height);

    function levelChecker() {
        if (level == 0) {
            var percent = count / 10;
            levelCounter.style.width = percent + '%';
            if (count > 1000) {
                level++;
                levelCurrent.innerHTML = level;
                levelCounter.style.width = '0%';
            }
        } else {
            var _percent = (count - 1000 * level + 1000) / 10;
            levelCounter.style.width = _percent + '%';
            if (count > level * 1000) {
                level++;
                levelCurrent.innerHTML = level;
                levelCounter.style.width = '0%';
            }
        }
    }

    // ======Control Vars======
    var mouseBallRadius = 50;

    // Get random number 
    function getRandomArbitrary(min, max) {
        return Math.random() * (max - min) + min;
    }

    // Each ball colision function
    function ballsColision(ballCurrent, ball) {
        for (var j = 0; j < balls.length; j++) {
            if (j !== ballCurrent) {
                var is = ball.phys(balls[j], mouse);
                if (is == true) {
                    count++;
                }
            } else {
                continue;
            }
        }
    }

    // ======Mouse ball======
    var mouse = new Mouse(canvas);
    var mouseBall = new Ball({
        x: mouse.x,
        y: mouse.y,
        radius: mouseBallRadius,
        color: '#c1224f'
    });

    // ======Create little balls======
    var balls = [];
    for (var i = 0; i < 20; i++) {
        var radius = getRandomArbitrary(5, 100);
        var newBallCoords = {};
        newBallCoords = {
            x: getRandomArbitrary(radius, window.innerWidth - radius),
            y: getRandomArbitrary(radius, window.innerHeight - radius)
        };
        if (i != 0) {
            for (var j = 0; j < balls.length; j++) {
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
        mouseBall.draw(ctx, 'fill');

        balls.forEach(function (ball, ballCurrent) {
            ballsColision(ballCurrent, ball);
            ball.phys(mouseBall, mouse);
            ball.speed();
            ball.sideColision(canvas);
            ball.frict();
            // ball.reduceVxy();
            ball.draw(ctx, 'fill');
            countSet.innerHTML = count;
            levelChecker();
        });
        window.requestAnimationFrame(Render);
    }

    Render();
});