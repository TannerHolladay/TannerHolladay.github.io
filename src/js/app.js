document.addEventListener("DOMContentLoaded", () => {
    new SweetScroll({easing: 'easeOutQuad'});
    const BUBBLE_COUNT = (window.innerWidth + window.innerHeight) / 8,
        BUBBLE_SIZE = 5,
        BUBBLE_MIN_SCALE = 0.1

    const canvas = document.querySelector('canvas'),
        context = canvas.getContext('2d');

    let width,
        height;

    let app = [];

    let pointerX,
        pointerY;

    let velocity = {x: 0, y: -.35, tx: 0, ty: 0};

    let touchInput = false;

    generate();
    resize();
    step();

    window.onresize = resize;
    canvas.onmousemove = onMouseMove;
    canvas.ontouchmove = onTouchMove;
    canvas.ontouchend = onMouseLeave;
    document.onmouseleave = onMouseLeave;

    function generate() {

        for (let i = 0; i < BUBBLE_COUNT; i++) {
            app.push({
                x: 0,
                y: 0,
                z: BUBBLE_MIN_SCALE + Math.random() * (1 - BUBBLE_MIN_SCALE)
            });
        }

    }

    function placeBubble(bubble) {
        bubble.x = Math.random() * width;
        bubble.y = Math.random() * height;
    }

    function resize() {
        width = window.innerWidth + 5;
        height = window.innerHeight + 5;

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        app.forEach(placeBubble);
    }

    function step() {

        context.clearRect(0, 0, width, height);

        update();
        render();

        requestAnimationFrame(step);

    }

    function update() {
        velocity.tx *= 0.6;
        velocity.ty *= 0.6;

        velocity.x += (velocity.tx - velocity.x) * 0.01;
        velocity.y += (velocity.ty - velocity.y) * 0.01;


        app.forEach((bubble) => {
            bubble.y -= Math.pow(1 - bubble.z / BUBBLE_SIZE, 10) * .5;
            bubble.x = (((((bubble.x + velocity.x * bubble.z) + 5) % width) + width) % width) - 5;
            bubble.y = (((((bubble.y + velocity.y * bubble.z) + 5) % height) + height) % height) - 5;
        });

    }

    function render() {

        app.forEach((bubble) => {

            context.fillStyle = "#c1c1c1";
            context.beginPath();
            const size = BUBBLE_SIZE * bubble.z;
            context.fillRect(bubble.x, bubble.y, size, size)
            //context.arc(bubble.x, bubble.y, BUBBLE_SIZE * bubble.z, 0, 2 * Math.PI, true);
        });

    }

    function movePointer(x, y) {

        if (typeof pointerX === 'number' && typeof pointerY === 'number') {

            let ox = x - pointerX,
                oy = y - pointerY;

            velocity.tx = velocity.tx + (ox / 8) * (touchInput ? 1 : -1);
            velocity.ty = velocity.ty + (oy / 8) * (touchInput ? 1 : -1);

        }

        pointerX = x;
        pointerY = y;

    }

    function onMouseMove(event) {

        touchInput = false;

        movePointer(event.clientX, event.clientY);

    }

    function onTouchMove(event) {

        touchInput = true;

        movePointer(event.touches[0].clientX, event.touches[0].clientY, true);

        event.preventDefault();

    }

    function onMouseLeave() {

        pointerX = null;
        pointerY = null;

    }
}, false);