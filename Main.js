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
function wipeCanvas() {
    ctx.fillStyle = "#1c1f29"
    ctx.fillRect(0, 0, w, h)
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

// mouse and keyboard
addEventListener("click", function (){
    if (mouse.onCanvas){
        switch (dropdownSelected){
            case "ch2d":
                mouseClickConvexHull()
                break
            case "intersect":
                mouseClickIntersect()
                break
            case "tree":
                mouseClickRangeSearch()
                break
        }
    }
})
addEventListener("keydown", (e) => {
    if (e.code === "KeyR" && dropdownSelected === "tree") {
        if (!range.drawing) [range.x1, range.y1] =
            [Math.floor(mouse.x), Math.floor(mouse.y)]
        range.drawing = true
        range.x2 = Math.floor(mouse.x)
        range.y2 = Math.floor(mouse.y)
    }
})
addEventListener("keyup", (e) => {
    if (e.code === "KeyR" && dropdownSelected === "tree") {
        range.drawing = false
        resetInputColorAndType()
    }
    if (e.code === "KeyI" && dropdownSelected === "tree"){
        let allPoints = inputArr.length
        let counterinRange = 0
        let counterTouched = 0

        for (const point of inputArr) {
            if (point.output === "inRange") counterinRange++
            if (point.output === "touched") counterTouched++
        }
        console.log("Nr. of Points: " + allPoints)
        console.log("Nr. of touched points: " + counterTouched)
        console.log("Nr. of points in range: " + counterinRange)

    }
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

// buttons
function manageButtons(){
    document.getElementById("rangeSearch").hidden = (dropdownSelected !== 'tree')
    document.getElementById("add100Points").hidden = (dropdownSelected === 'intersect')
    document.getElementById("pointSize").hidden = (dropdownSelected !== 'tree')
}
dropdown.onchange = function () {
    dropdownSelected = dropdown.value
    manageButtons()
}
document.getElementById("pointSize").oninput = function() {
    pointSize = this.value;
}

// background
window.addEventListener( 'resize', function(){
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
    wipeCanvas()
})


// STAY ABOVE ---------------------------------------------------------------
init()
animate()





