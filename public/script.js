if (document.querySelector("#canvas")) {
    const canvas = document.querySelector("#canvas");
    const clearBtn = document.querySelector("#clearBtn");
    const hiddenSign = document.querySelector("#hiddenSign");
    const submitBtn = document.querySelector("#submitBtn");

    let ctx = canvas.getContext("2d");
    ctx.strokeStyle = "#c20707";

    var gradient = ctx.createLinearGradient(
        0.5 * canvas.width,
        0,
        0.5 * canvas.width,
        canvas.height
    );
    gradient.addColorStop("0", "red");
    gradient.addColorStop("0.3", "#c10000");
    gradient.addColorStop(".5", "#630202");
    gradient.addColorStop(".7", "#c10000");
    gradient.addColorStop("1.0", "red");
    ctx.strokeStyle = gradient;
    ctx.lineWidth = 4;

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
        const signature = canvas.toDataURL();
        if (!signature) {
            event.preventDefault();
            console.log("Signature empty!", signature);
        }
        hiddenSign.value = signature;
        console.log(signature, "sign");
    });
}
