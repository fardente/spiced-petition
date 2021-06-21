const canvas = document.querySelector("#canvas");
const clearBtn = document.querySelector("#clearBtn");

let ctx = canvas.getContext("2d");

let drawing = false;

function clearDrawing() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function getPosition(event, element) {
    return {
        x: event.clientX - element.offsetLeft,
        y: event.clientY - element.offsetTop,
    };
}

clearBtn.addEventListener("click", function (event) {
    event.preventDefault();
    clearDrawing();
});

canvas.addEventListener("mousedown", function (event) {
    drawing = true;
    ctx.beginPath();
});

canvas.addEventListener("mousemove", function (event) {
    // console.log(getPosition(event, this));
    if (drawing) {
        let { x, y } = getPosition(event, this);
        ctx.lineTo(x, y);
        ctx.stroke();
    }
});

canvas.addEventListener("mouseup", function (event) {
    drawing = false;
});

canvas.addEventListener("mouseout", function (event) {
    drawing = false;
});
