addEventListener("click", function (){
    if (mouse.onCanvas){
        switch (dropdownSelected){
            case "ch2d":
                mouseClickCh2d()
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
        resetInputColorandType()
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
    manageButtons()
}

document.getElementById("pointSize").oninput = function() {
    pointSize = this.value;
}

// document.getElementById("pointSizeSlider").oninput = function (){
//     opts.pointSize = this.value
// }