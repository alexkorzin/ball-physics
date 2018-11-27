export default class Ball {
    constructor(obj) {
        this.x = obj.x || 0;
        this.y = obj.y || 0;
        this.vx = 0;
        this.vy = 0;
        // Get randomize size
        this.randomize = obj.randomize;
        this.radius = obj.radius || 10;
        if (this.randomize === true) {
            this.radius = Math.floor(Math.random() * (this.radius - 3)) + 3 || 10;
        } else this.radius = obj.radius || 10;

        this.color = obj.color || '#98ccd3';

        this.friction = 0.95;
        this.pulseX = 0;
        this.pulseY = 0;

    }

    draw(ctx) {
        ctx.save()
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
        ctx.restore();
    }

    updatePos(x, y) {
        this.x = x;
        this.y = y;
    }

    phys(object, mouse) {
        let dx = this.x - object.x;
        let dy = this.y - object.y;
        let distance = Math.sqrt(
            Math.pow(dx, 2) +
            Math.pow(dy, 2)
        );
        // Colision Moment
        if (distance < this.radius + object.radius) {
            let colisionAngle = Math.atan2(dy, dx);

            let innerX = object.x + Math.cos(colisionAngle) * (object.radius + this.radius);
            let innerY = object.y + Math.sin(colisionAngle) * (object.radius + this.radius);

            if (object.x == mouse.x & object.y == mouse.y) {
                this.vx += (innerX - this.x);
                this.vy += (innerY - this.y);
            }
            this.pulseX = this.vx * this.radius;
            this.pulseY = this.vy * this.radius;

            // console.log('X:', this.pulseX, 'Y:', this.pulseY)

            if (object.x != mouse.x & object.y != mouse.y) {
                this.vx += (((innerX - this.x)*object.radius)/(this.radius + object.radius))*this.friction;
                this.vy += (((innerY - this.y)*object.radius)/(this.radius + object.radius))*this.friction;
            }
        }
    }

    sideColision(screen) {
        //Left side colision
        if (this.x - this.radius < 0) {
            let innerX = (this.radius);
            this.vx += (innerX - this.x);
        }
        //Right side colision
        if (this.x + this.radius > screen.width) {
            let innerX = (screen.width - this.radius);
            this.vx += (innerX - this.x);
        }
        //Top side colision
        if (this.y - this.radius < 0) {
            let innerY = (this.radius);
            this.vy += (innerY - this.y);
        }
        //Bottom side colision
        if (this.y + this.radius > screen.height) {
            let innerY = (screen.height - this.radius);
            this.vy += (innerY - this.y);
        }
    }

    reduceVxy() {
        if (Math.abs(this.vy) < this.radius / 100 & Math.abs(this.vx) < this.radius / 100) {
            this.vy = 0;
            this.vx = 0;
        }
    }

    frict() {
        this.vy *= (this.friction - this.radius * 0.001);
        this.vx *= (this.friction - this.radius * 0.001);
    }

    speed() {
        this.x += this.vx;
        this.y += this.vy + 2;
    }
}