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
    if (lineArr.length === 0) lineArr.push([])
    lineArr[lineArr.length - 1].push(new StaticPoint(mouse.x, mouse.y))
    console.log(lineArr)


}

function resetLineSegments(){
    lineArr.length = 0
}
