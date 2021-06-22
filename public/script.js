const canvas = document.querySelector("#canvas");
const clearBtn = document.querySelector("#clearBtn");
const hiddenSign = document.querySelector("#hiddenSign");
const submitBtn = document.querySelector("#submitBtn");

let ctx = canvas.getContext("2d");

let drawing = false;

function clearDrawing() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function getPosition(event, element) {
    return {
        x: event.clientX - element.parentElement.offsetLeft,
        y: event.clientY - element.parentElement.offsetTop,
    };
}

clearBtn.addEventListener("click", function (event) {
    event.preventDefault();
    clearDrawing();
});

canvas.addEventListener("mousedown", function (event) {
    drawing = true;
    console.log("drawing");

    ctx.beginPath();
});

canvas.addEventListener("mousemove", function (event) {
    if (drawing) {
        // TODO: Since canvas now lives in a div with relative position, getPosition should get the parent div instead of this
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

submitBtn.addEventListener("click", function (event) {
    hiddenSign.value = canvas.toDataURL();
});
