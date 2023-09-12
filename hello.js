let canvas = document.getElementById("myCanvas"),
    ctx = canvas.getContext("2d"),
    w = canvas.width = window.innerWidth,
    h = canvas.height = window.innerHeight,
    dropdown = document.getElementById("dropdown"),
    dropdownSelected = dropdown.value,

    mouse = {
        x: 0,
        y: 0,
        onCanvas: false
    }

    opts= {
        pointColor: "lightgrey",
        pointSize: 10
    };

class StaticPoint{
    constructor() {
        this.x = mouse.x
        this.y = mouse.y
        this.size = opts.pointSize
        this.color = opts.pointColor
        this.order = 0
    }
    draw() {
        ctx.fillStyle = this.color
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI)
        ctx.fill()
    }
}
function wipeCanvas() {
    ctx.fillStyle = "#1c1f29"
    ctx.fillRect(0, 0, w, h)
}
function animate() {
    wipeCanvas()
    switch (dropdownSelected) {
        case "ch2d":
            handleConvexHull2D()
            break
        case "ch3d":
            ctx.fillStyle = "white"
            ctx.fillRect(mouse.x, mouse.y, 5, 5)
            break
    }
    requestAnimationFrame(animate)
}
animate()

function resetCanvas(){
    switch (dropdownSelected) {
        case "ch2d":
            resetConvexHull2D()
            break
        case "ch3d":
            break
    }
}

window.addEventListener( 'resize', function(){
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
    wipeCanvas()
})

addEventListener("mousemove", function (event) {
    let rect = canvas.getBoundingClientRect(),
        scaleX = w / rect.width,
        scaleY = h / rect.height;

    mouse.x = (event.x - rect.left) * scaleX
    mouse.y = (event.y - rect.top) * scaleY

    mouse.onCanvas = !(event.x < rect.left
        || event.x > rect.right
        || event.y < rect.top
        || event.y > rect.bottom)
})

dropdown.onchange = function () {
    dropdownSelected = dropdown.value
}





