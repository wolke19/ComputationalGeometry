let canvas = document.getElementById("myCanvas"),
    ctx = canvas.getContext("2d"),
    w = canvas.width = window.innerWidth*0.85,
    h = canvas.height = window.innerHeight*0.8,
    dropdown = document.getElementById("dropdown"),
    dropdownSelected = dropdown.value,

    mouse = {
        x: 0,
        y: 0,
        onCanvas: false
    }

    opts= {
        pointColor: "lightgrey",
        pointSize: 3
    };

class StaticPoint{
    constructor(x,y) {
        this.x = x
        this.y = y
        this.z = 0
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

class MovingPoint{
    constructor(x,y, initSpeed, initDir, color) {
        this.x = x
        this.y = y
        this.speed = initSpeed
        this.dir = initDir
        this.size = opts.pointSize
        this.color = color
    }

    update(){
        this.x += this.speed * -Math.sin(this.dir)
        this.y += this.speed * -Math.cos(this.dir)
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

function manageButtons(){
    for (const element of document.getElementsByClassName('lineIntersect-btn')) {
        element.hidden = (dropdownSelected !== 'intersect')
    }
}

function init(){
    manageButtons()
}
function animate() {
    wipeCanvas()
    switch (dropdownSelected) {
        case "ch2d":
            handleConvexHull2D()
            break
        case "intersect":
            handleIntersections()
            break
    }
    requestAnimationFrame(animate)
}




// INTERACTIONS
function resetCanvas(){
    switch (dropdownSelected) {
        case "ch2d":
            resetConvexHull2D()
            break
        case "intersect":
            resetLines()
            resetEvents()
            break
    }
}



dropdown.onchange = function () {
    dropdownSelected = dropdown.value
    manageButtons()
}

init()
animate()





