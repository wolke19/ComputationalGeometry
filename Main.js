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

function manageButtons(){
    document.getElementById("rangeSearch").hidden = (dropdownSelected !== 'tree')
    document.getElementById("add100Points").hidden = (dropdownSelected !== 'tree')
    document.getElementById("pointSize").hidden = (dropdownSelected !== 'tree')

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
        case "tree":
            handleRangeSearch()
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
        case "tree":
            resetTree()
            break
    }
}



dropdown.onchange = function () {
    dropdownSelected = dropdown.value
    manageButtons()
}

init()
animate()





