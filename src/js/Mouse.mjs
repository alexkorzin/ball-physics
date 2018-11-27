export default class Mouse {
    constructor(canvas) {
        this.x = 0;
        this.y = 0;
        let rect = canvas.getBoundingClientRect();

        canvas.addEventListener('mousemove', (evt) => {
            this.x = evt.clientX - rect.left,
            this.y = evt.clientY - rect.top
        })
    }
}