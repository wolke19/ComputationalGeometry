let lineArr = []


function handleLines(){
    for (let line of lineArr) {
        for (let point of line) {
            point.draw()
        }
        drawLineFromPointArr(line, 2, false)
    }

}

function newLine(){
    lineArr.push([])
}

function mouseClickIntersect() {
    // create first line before filling with segments
    if (lineArr.length === 0) lineArr.push([])
    insertPointWithCheck(lineArr[lineArr.length - 1])
}

function resetLineSegments(){
    lineArr.length = 0
}
