let pointArr = [],
    hullArr = []
function handleConvexHull2D(){
    if (pointArr.length > 0){
        for (const anchorArrElement of pointArr) {
            anchorArrElement.draw()
        }
    }
    drawLineFromPointArr(hullArr, 3, true)
    // if (hullArr.length > 2){
    //     ctx.moveTo(hullArr[hullArr.length-1].x, hullArr[hullArr.length-1].y)
    //     for (const hullArrElement of hullArr) {
    //         ctx.lineTo(hullArrElement.x, hullArrElement.y)
    //         ctx.strokeStyle = opts.pointColor
    //         ctx.stroke()
    //     }
    // }
}

function getHull() {
    hullArr = []
    let p0 = 0

    // find p0
    for (let i = 1; i < pointArr.length; i++) {
        if (pointArr[i].y > pointArr[p0].y ||
                pointArr[i].y === pointArr[p0].y && pointArr[i].x > pointArr[p0].x) {
            p0 = i
        }
    }

    // compute and sort by slope from p0
    for (let i = 0; i < pointArr.length; i++) {
        pointArr[i].order = getSlope(pointArr[i], pointArr[p0])
    }
    pointArr.sort((a,b) => {
        return a.order - b.order
    })

    // find hull
    hullArr.push(pointArr[0], pointArr[1])
    for (let i = 2; i < pointArr.length; i++) {
        while (hullArr.length > 2 && isRightTurn(pointArr[i], hullArr[hullArr.length-1], hullArr[hullArr.length-2])){
            hullArr.pop()
        }
        hullArr.push(pointArr[i])
    }

    function isRightTurn(point, hullTop, hullSecond){
        return (getSlope(hullSecond, hullTop) > getSlope(hullSecond, point))
    }

    function getSlope(a, b){
        return Math.atan2(b.y - a.y, b.x - a.x)
    }
}


function resetConvexHull2D() {
    pointArr.length = 0
    hullArr.length = 0
}

function mouseClickCh2d(){
    checkForExistingPoint(pointArr)
    // let existingPoint = false
    // for (let i = 0; i < pointArr.length; i++) {
    //     if (mouse.x < pointArr[i].x + pointArr[i].size
    //         && mouse.x > pointArr[i].x - pointArr[i].size
    //         && mouse.y < pointArr[i].y + pointArr[i].size
    //         && mouse.y > pointArr[i].y - pointArr[i].size) {
    //         existingPoint = true
    //         pointArr.splice(i,1)
    //         break
    //     }
    // }
    // if (!existingPoint) pointArr.push(new StaticPoint(mouse.x, mouse.y))
    if (pointArr.length >= 2) getHull()
}





