export default class Ball {

    constructor(obj) {
        this.radius = obj.radius || 10;

        // Get random position
        this.x = obj.x;
        this.y = obj.y;

        this.velocity = {
            x: obj.velocityX || 0,
            y: obj.velocityX || 0
        }

        this.color = obj.color || '#98ccd3';
        this.friction = 0.93;
        this.mass = this.radius;
    }

    draw(ctx) {
        ctx.save()
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.closePath();
        ctx.restore();
    }

    updatePos(x, y) {
        this.x = x;
        this.y = y;
    }

    getDistance(self, object) {
        let dx = self.x - object.x;
        let dy = self.y - object.y;
        return Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
    }

    rotate(obj, angle) {
        const rotatedVelocities = {
            x: obj.x * Math.cos(angle) - obj.y * Math.sin(angle),
            y: obj.x * Math.sin(angle) + obj.y * Math.cos(angle)
        };
        return rotatedVelocities;
    }

    phys(object, mouse) {
        let distance = this.getDistance(this, object);
        // Colision Moment
        if (distance < this.radius + object.radius) {

            const xVelocityDiff = object.velocity.x - this.velocity.x;
            const yVelocityDiff = object.velocity.y - this.velocity.y;

            const xDist = this.x - object.x;
            const yDist = this.y - object.y;

            const angle = -Math.atan2(this.y - object.y, this.x - object.x);

            if (object.x === mouse.x & object.y === mouse.y) {

                let ex = object.x + Math.cos(angle) * (object.radius + this.radius);
                let ey = object.y - Math.sin(angle) * (object.radius + this.radius);

                let inX = ex - this.x;
                let inY = ey - this.y;
                // console.log('x: ', inX, 'y:', inY)
                this.velocity.x += (ex - this.x) * 0.8;
                this.velocity.y += (ey - this.y) * 0.8;
            } else {
                // If objects are not overlaping
                if (xVelocityDiff * xDist + yVelocityDiff * yDist >= 0) {

                    const m2 = object.mass;
                    const m1 = this.mass;

                    // Velocity before
                    const u2 = this.rotate(object.velocity, angle);
                    const u1 = this.rotate(this.velocity, angle);

                    // Velocity after
                    const v2 = { x: - u1.x + 2 * ((u1.x * m1 + u2.x * m2) / (m2 + m1)), y: u1.y };
                    const v1 = { x: - u2.x + 2 * ((u1.x * m1 + u2.x * m2) / (m2 + m1)), y: u2.y };

                    // Final velocity
                    const vFinal2 = this.rotate(v1, -angle);
                    const vFinal1 = this.rotate(v2, -angle);

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

    sideColision(screen) {
        //Left side colision
        if (this.x - this.radius < 0) {
            let ex = (this.radius);
            this.velocity.x += (ex - this.x);
        }
        //Right side colision
        if (this.x + this.radius > screen.width) {
            let ex = (screen.width - this.radius);
            this.velocity.x += (ex - this.x);
        }
        //Top side colision
        if (this.y - this.radius < 0) {
            let ey = (this.radius);
            this.velocity.y += (ey - this.y);
        }
        //Bottom side colision
        if (this.y + this.radius > screen.height) {
            let ey = (screen.height - this.radius);
            this.velocity.y += (ey - this.y);
        }
    }

    reduceVxy() {
        if (Math.abs(this.velocity.y) < this.radius / 100 & Math.abs(this.velocity.x) < this.radius / 100) {
            this.velocity.y = 0;
            this.velocity.x = 0;
        }
    }

    frict() {
        this.velocity.y *= this.friction;
        this.velocity.x *= this.friction;
    }

    speed() {
        this.x += this.velocity.x;
        this.y += this.velocity.y + 0.0 * this.radius;
    }
}